'use client';

import {
  Call,
  CallingState,
  StreamCall,
  StreamTheme,
  StreamVideo,
  SpeakerLayout,
  CallControls,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';

import { StreamVideoClient } from '@stream-io/video-client'; // correct import
import { useMutation } from '@tanstack/react-query';
import { LoaderIcon } from 'lucide-react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import CallUI from './CallUI';
import { useTRPC } from '@/trpc/client';
import { MeetingGetOne } from '@/components/meetings/types';

interface Props {
  meeting: MeetingGetOne;
  userId: string;
  username: string;
  userImage: string | null | undefined;
}

export const CallConnect = ({
  meeting,
  userId,
  username,
  userImage,
}: Props) => {
  const trpc = useTRPC();
  const { mutateAsync: generateToken } =
  useMutation(trpc.meetings.generateToken.mutationOptions());
  const tokenProvider = useCallback(async () => {
  const res = await generateToken();
  return res.token; // return a string, not an object
}, [generateToken]);

  const [client, setClient] = useState<StreamVideoClient | undefined>();

  useEffect(() => {
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      user: {
        id: userId,
        name: username,
        image: userImage || undefined,
      },
      tokenProvider,
    });

    setClient(_client);

    return () => {
      _client.disconnectUser();
      setClient(undefined);
    };
  }, [userId, username, userImage, tokenProvider]);

  const [call, setCall] = useState<Call | undefined>();

  useEffect(() => {
    if (!client) return;

    const _call = client.call('default', meeting.id);
    // Disable devices by default (optional)
    _call.camera.disable?.();
    _call.microphone.disable?.();

    setCall(_call);

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        _call.leave();
      }
      setCall(undefined);
    };
  }, [client, meeting.id]);

  if (!client || !call) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meeting={meeting} />
      </StreamCall>
    </StreamVideo>
  );
};
