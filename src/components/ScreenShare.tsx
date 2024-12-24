'use client';

import { useEffect, useRef } from 'react';
import { ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { VideoContainer } from '@/components/VideoContainer';

interface ScreenShareProps {
  screenTrack: ILocalVideoTrack;
}

export const ScreenShare = ({ screenTrack }: ScreenShareProps) => {
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (screenTrack && screenRef.current) {
      screenTrack.play(screenRef.current);
    }
  }, [screenTrack]);

  return (
    <VideoContainer
    //@ts-ignore
      videoRef={screenRef}
      label="Screen Share"
    />
  );
};

