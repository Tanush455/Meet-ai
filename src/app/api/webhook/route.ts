import {
    CallEndedEvent,
    MessageNewEvent,
    CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    CallRecordingReadyEvent,
    CallSessionStartedEvent
} from "@stream-io/node-sdk";
import prisma from "@/utils/prismaClient";
import { streamVideo } from "@/lib/stream-video";
import { agents, meetings } from "@/generated/prisma";


// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
// Optional: confirm this route runs in the Node.js runtime (not Edge)
// export const runtime = "nodejs";

// Stream sends event.type plus payload fields (e.g., call_cid, urls).
// See Stream events docs for the canonical event names. 
// This handler maps a subset of events to meeting updates.

function verifySignature(body:string,signature:string) : boolean {
    return streamVideo.verifyWebhook(body,signature);
}

export async function POST(request: NextRequest) {
    const signature = request.headers.get("x-signature");
    const apiKey = request.headers.get("x-api-key");
    

    if(!signature || !apiKey){
        return NextResponse.json({
            error: "missing signature or API key",
        },{status: 400})
    }

    const body = await request.text();
    if(!verifySignature(body,signature)){
        return NextResponse.json({
            error: "invalid signature",
        },{status: 400})
    }

    let playload :unknown;
    try {
        playload = JSON.parse(body) as Record<string,unknown>
    } catch {
        return NextResponse.json({
            error: "invalid JSON",
        },{status: 400})        
    }

    const eventType = (playload as Record<string,unknown>)?.type;

    if(eventType === "call_session_started"){
        const event = playload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;

        if(!meetingId){
            return NextResponse.json({
                error: "missing meeting ID",
            },{status: 400
            });
        }

        const existingMeeting = await prisma.meetings.findFirst({
            where:{
                AND: [
                    {
                        id:meetingId
                    },
                    {
                        NOT: {
                            status: 'complete'
                        }
                    },
                    {
                        NOT: {
                            status: 'active'
                        }
                    
                    },
                    {
                        NOT: {
                            status: 'cancelled'
                        }
                    },
                    {
                        NOT: {
                            status: 'processing'
                        }
                    }
                ]
            }
        });

        if(!existingMeeting){
            return NextResponse.json({
                error: "meeting not found",
            },{status: 400
            });
        }

        await prisma.meetings.update({
            where:{
                id: meetingId
            },
            data:{
                status: 'active',
                StartedAt: new Date()
            }
        });

        const existingAgent = await prisma.agents.findFirst({
            where: {
                id: meetingId
            }
        })

        if(!existingAgent){
            return NextResponse.json({
                error: "agent not found",
            },{status: 400
            })
            
            ;
        }

        const openAiApiKey = process.env.OPENAI_API_KEY;
        if (!openAiApiKey) {
            throw new Error("OPENAI_API_KEY is not set");
        }

        const call = streamVideo.video.call("default",meetingId);
        const realTimeClient = await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey: openAiApiKey,
            agentUserId: existingAgent.id
        });

        realTimeClient.updateSession({
            instructions: existingAgent.instructions
        });
    }
    else if(eventType === "call_session_participant_left"){
        const event = playload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];
        if(!meetingId){
            return NextResponse.json({
                error: "missing meeting ID",
            },{status: 400
            });
        
        }

        const call = streamVideo.video.call("default",meetingId);
        await call.end();
        
    }
    else if(eventType === 'call.session_ended'){
        const event = playload as CallEndedEvent;
        const meetingId = event.call.custom?.meetingId;

        if(!meetingId){
            return NextResponse.json({
                error: "missing meeting ID",
            },{status: 400
            });
        }

        await prisma.meetings.update({
            where:{
                id:meetingId,
                status:'active'
            },
            data:{
                status: 'processing',
                EndedAt: new Date()
            }
        });

    }
    else if(eventType === 'call.transcription_ready'){
        const event = playload as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        const updateMeeting = await prisma.meetings.update({
            where:{
                id: meetingId,
            },
            data:{
                transcriptUrl: event.call_transcription.url,
            }
        });

        if(!updateMeeting){
            return NextResponse.json({
                error: "meeting not found",
            },{status: 400
            });
        }
    }
    else if(eventType === 'call.recording_ready'){
        const event = playload as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

            await prisma.meetings.update({
            where:{
                id: meetingId,
            },
            data:{
                transcriptUrl: event.call_recording.url,
            }
        });
    }

    return NextResponse.json({status: 'ok'});
}
