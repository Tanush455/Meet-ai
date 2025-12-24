'use client';

import {
  Call,
  CallingState,
  StreamCall,
  StreamVideoClient,
  StreamVideo,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';

import { useMutation } from '@tanstack/react-query';
import { LoaderIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import CallUI from './CallUI';
import { useTRPC } from '@/trpc/client';

interface Props {
  meetingId: string,
  meetingName: string,
  userId: string;
  username: string;
  userImage: string;
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  username,
  userImage,
}: Props) => {
  const trpc = useTRPC();
  const { mutateAsync: generateToken } = useMutation(
    trpc.meetings.generateToken.mutationOptions(),
  );

  const [client, setClient] = useState<StreamVideoClient>();

  useEffect(() => {
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      user: {
        id: userId,
        name: username,
        image: userImage
      },
      tokenProvider: async () => {
        const result = await generateToken();
        return result.token;
      }
    });

    setClient(_client);

    return () => {
      _client.disconnectUser();
      setClient(_client);
    }
  }, [userId, username, userImage, generateToken]);

  const [call, setCall] = useState<Call>();

  useEffect(() => {
    if (!client) return;
    const _call = client.call("default", meetingId);
    _call.camera.disable();
    _call.microphone.disable();
    setCall(_call);

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        _call.leave();
        _call.endCall();
        setCall(undefined)
      }
    }
  }, [client, meetingId]);

  if (!client || !call) {
    return (
      <div className='flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar'>
        <LoaderIcon className='size-6 animate-spin text-white' />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  )
};
