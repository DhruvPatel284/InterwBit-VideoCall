'use client';

import { useEffect, useMemo } from 'react';
import { IAgoraRTCRemoteUser, ICameraVideoTrack } from 'agora-rtc-sdk-ng';
import { LocalVideo } from './LocalVideo';
import { RemoteVideo } from './RemoteVideo';

interface VideoGridProps {
  localVideoTrack: ICameraVideoTrack | null;
  remoteUsers: IAgoraRTCRemoteUser[];
  isConnected: boolean;
  userName: string;
}

export const VideoGrid = ({
  localVideoTrack,
  remoteUsers,
  isConnected,
  userName,
}: VideoGridProps) => {
  const gridClassName = useMemo(() => {
    const userCount = remoteUsers.length + 1;
    if (userCount <= 2) return 'grid-cols-1 md:grid-cols-2';
    if (userCount <= 4) return 'grid-cols-2';
    return 'grid-cols-2 md:grid-cols-3';
  }, [remoteUsers.length]);

  return (
    <div className={`grid gap-4 w-full max-w-6xl ${gridClassName}`}>
      <LocalVideo 
        videoTrack={localVideoTrack} 
        isConnected={isConnected}
        userName={userName}
      />
      {remoteUsers.map((user) => (
        <RemoteVideo 
          key={user.uid} 
          user={user}
          userName={`User ${user.uid}`}
        />
      ))}
    </div>
  );
};