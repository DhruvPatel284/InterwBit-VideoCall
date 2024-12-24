'use client';

import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { VideoContainer } from './VideoContainer';

interface RemoteVideoProps {
  user: IAgoraRTCRemoteUser;
  userName: string;
}

export const RemoteVideo = ({ user, userName }: RemoteVideoProps) => {
  return (
    <VideoContainer
      playerId={`player-${user.uid}`}
      onVideoElementCreated={(element) => {
        user.videoTrack?.play(element);
      }}
      label={userName}
    />
  );
};