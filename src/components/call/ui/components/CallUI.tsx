import { MeetingGetOne } from '@/components/meetings/types';
import { StreamTheme, useCall, useCallStateHooks, CallingState } from '@stream-io/video-react-sdk'
import { useState } from 'react'
import { CallLobby } from './callLobby';
import { CallActive } from './call-active';
import { CallEnded } from './CallEnded';
import { MeetingGetOne } from '@/components/meetings/types';

interface Props {
    meeting: MeetingGetOne
}


export default function CallUI({ meeting }: Props) {
    const call = useCall();
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

    const [isJoining, setIsJoining] = useState(false);

    const handleJoin = async () => {
        if (isJoining || !call || callingState !== CallingState.IDLE) return;
        setIsJoining(true);
        try {
            await call.join({ create: true }); // create if missing, or join if exists
            setShow("call");

            // Call the API to add the agent to the call
            await fetch('/api/live-agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ meetingId: meeting.id, agentId: meeting.agentId }),
            });

        } catch (e) {
            console.error("Failed to join call", e);
            setIsJoining(false);
        }
    };

    const handleLeave = () => {
        if (!call) {
            return;
        }

        call.endCall();
        setShow("ended");
    }
    return (
        <StreamTheme className='h-full'>
            {show === "lobby" && (<CallLobby onJoin={handleJoin} isJoining={isJoining} />)}
            {show === "call" && (<CallActive onLeave={handleLeave} meetingName={meeting.name} />)}
            {show === "ended" && (<CallEnded/>)}
        </StreamTheme>
    )
}
