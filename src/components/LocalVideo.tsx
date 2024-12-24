'use client';

import { useEffect, useRef } from 'react';
import { ICameraVideoTrack } from 'agora-rtc-sdk-ng';
import { VideoContainer } from './VideoContainer';

interface LocalVideoProps {
  videoTrack: ICameraVideoTrack | null;
  isConnected: boolean;
  userName: string;
}

export const LocalVideo = ({ videoTrack, isConnected, userName }: LocalVideoProps) => {
  const localVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoTrack && localVideoRef.current) {
      videoTrack.play(localVideoRef.current);
    }
  }, [videoTrack]);

  return (
    <VideoContainer
    //@ts-expect-error
      videoRef={localVideoRef}
      label={`${userName} ${isConnected ? '(Connected)' : '(Connecting...)'}`}
    />
  );
};