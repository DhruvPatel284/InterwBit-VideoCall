import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp } from 'lucide-react';

interface MediaControlsProps {
  onLeave: () => void;
  onScreenShare: () => void;
  localAudioTrack: any;
  localVideoTrack: any;
  isConnected: boolean;
  isScreenSharing: boolean;
}

export const MediaControls = ({
  onLeave,
  onScreenShare,
  localAudioTrack,
  localVideoTrack,
  isConnected,
  isScreenSharing,
}: MediaControlsProps) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const toggleAudio = () => {
    if (localAudioTrack) {
      if (isAudioEnabled) {
        localAudioTrack.setEnabled(false);
      } else {
        localAudioTrack.setEnabled(true);
      }
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localVideoTrack) {
      if (isVideoEnabled) {
        localVideoTrack.setEnabled(false);
      } else {
        localVideoTrack.setEnabled(true);
      }
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  return (
    <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 flex gap-2">
      <Button
        variant={isAudioEnabled ? "outline" : "destructive"}
        onClick={toggleAudio}
        disabled={!isConnected}
        className="w-12 h-12 p-2"
      >
        {isAudioEnabled ? <Mic /> : <MicOff />}
      </Button>
      <Button
        variant={isVideoEnabled ? "outline" : "destructive"}
        onClick={toggleVideo}
        disabled={!isConnected}
        className="w-12 h-12 p-2"
      >
        {isVideoEnabled ? <Video /> : <VideoOff />}
      </Button>
      <Button
        variant={isScreenSharing ? "destructive" : "outline"}
        onClick={onScreenShare}
        disabled={!isConnected}
        className="w-12 h-12 p-2"
      >
        <MonitorUp />
      </Button>
      <Button
        variant="destructive"
        onClick={onLeave}
        disabled={!isConnected}
        className="w-12 h-12 p-2"
      >
        <PhoneOff />
      </Button>
    </Card>
  );
};