import { useEffect, useState, useCallback, useRef } from 'react';
import AgoraRTC, {
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
    ILocalVideoTrack,
  } from 'agora-rtc-sdk-ng';
import { AGORA_CONFIG } from '../config/agora';

export const useAgora = (channel: string) => {
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [screenTrack, setScreenTrack] = useState<ILocalVideoTrack | null>(null);  const [joinState, setJoinState] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  //@ts-ignore
  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    }
    return () => cleanup();
  }, []);

  const cleanup = useCallback(async () => {
    if (clientRef.current) {
      if (localAudioTrack) {
        await clientRef.current.unpublish(localAudioTrack);
        localAudioTrack.close();
        setLocalAudioTrack(null);
      }
      if (localVideoTrack) {
        await clientRef.current.unpublish(localVideoTrack);
        localVideoTrack.close();
        setLocalVideoTrack(null);
      }
      if (screenTrack) {
        await clientRef.current.unpublish(screenTrack);
        screenTrack.close();
        setScreenTrack(null);
      }
      if (joinState) {
        await clientRef.current.leave();
      }
      setJoinState(false);
      setRemoteUsers([]);
      setError(null);
    }
  }, [localAudioTrack, localVideoTrack, screenTrack, joinState]);

  const startScreenShare = async () => {
    if (!clientRef.current) return;
    
    try {
        //@ts-ignore
      const screenVideoTrack = await AgoraRTC.createScreenVideoTrack();
      if (localVideoTrack) {
        await clientRef.current.unpublish(localVideoTrack);
      }
      await clientRef.current.publish(screenVideoTrack);
      setScreenTrack(screenVideoTrack);
      setIsScreenSharing(true);
    } catch (err) {
      console.error('Error sharing screen:', err);
      setError('Failed to start screen sharing');
    }
  };

  const stopScreenShare = async () => {
    if (!clientRef.current || !screenTrack) return;
    
    try {
      await clientRef.current.unpublish(screenTrack);
      screenTrack.close();
      setScreenTrack(null);
      setIsScreenSharing(false);
      
      if (localVideoTrack) {
        await clientRef.current.publish(localVideoTrack);
      }
    } catch (err) {
      console.error('Error stopping screen share:', err);
    }
  };

  useEffect(() => {
    const client = clientRef.current;
    if (!client) return;

    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        setRemoteUsers(prev => [...prev.filter(u => u.uid !== user.uid), user]);
      }
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    };

    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    };

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
    };
  }, []);

  const join = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;
    
    try {
      await cleanup();

      if (!AGORA_CONFIG.appId) {
        throw new Error('Agora App ID is not configured.');
      }

      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (err) {
        throw new Error('Camera or microphone permission denied.');
      }

      await client.join(
        AGORA_CONFIG.appId,
        channel,
        AGORA_CONFIG.token
      );
      
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()
      ]);
      
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      
      await client.publish([audioTrack, videoTrack]);
      
      setError(null);
      setJoinState(true);
    } catch (err: any) {
      setError(err.message || 'Failed to join');
      console.error('Join error:', err);
      await cleanup();
    }
  }, [channel, cleanup]);

  return {
    localVideoTrack,
    localAudioTrack,
    screenTrack,
    joinState,
    remoteUsers,
    error,
    isScreenSharing,
    join,
    leave: cleanup,
    startScreenShare,
    stopScreenShare,
  };
};