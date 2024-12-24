'use client';

import dynamic from 'next/dynamic';

const VideoCall = dynamic(() => import('@/components/VideoCall'), {
  ssr: false
});

export default function VideoCallWrapper() {
  return <VideoCall />;
}