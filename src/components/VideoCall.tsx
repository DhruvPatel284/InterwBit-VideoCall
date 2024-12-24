'use client';

import { useState } from 'react';
import { useAgora } from '../hooks/useAgora';
import { VideoGrid } from './VideoGrid';
import { JoinForm } from './JoinForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MediaControls } from './MediaControls';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const VideoCall = () => {
  const [channel, setChannel] = useState('main');
  const [userName, setUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(true);
  
  const {
    localVideoTrack,
    localAudioTrack,
    remoteUsers,
    join,
    leave,
    joinState,
    error,
    startScreenShare,
    stopScreenShare,
    isScreenSharing,
    screenTrack,
  } = useAgora(channel);

  const handleJoin = async (channelName: string) => {
    if (!userName) {
      setShowNameModal(true);
      return;
    }
    const channelId = `${channelName}-${Math.floor(Math.random() * 1000)}`;
    setChannel(channelId);
    await join();
  };

  const handleLeave = async () => {
    await leave();
    setShowNameModal(true);
  };

  const handleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenShare();
    } else {
      await startScreenShare();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Dialog open={showNameModal && !userName} onOpenChange={setShowNameModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your name to join</DialogTitle>
          </DialogHeader>
          <Input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your name"
            className="mb-4"
          />
          <Button 
            onClick={() => setShowNameModal(false)}
            disabled={!userName.trim()}
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>

      {error && (
        <Alert variant="destructive" className="mb-4 max-w-4xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <JoinForm 
        onJoin={handleJoin} 
        onLeave={handleLeave}
        isConnected={joinState} 
      />

      <VideoGrid
       //@ts-expect-error
        localVideoTrack={isScreenSharing ? screenTrack : localVideoTrack}
        remoteUsers={remoteUsers}
        isConnected={joinState}
        userName={userName}
      />

      <MediaControls
        onLeave={handleLeave}
        localAudioTrack={localAudioTrack}
        localVideoTrack={localVideoTrack}
        isConnected={joinState}
        onScreenShare={handleScreenShare}
        isScreenSharing={isScreenSharing}
      />
    </div>
  );
};