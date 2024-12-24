'use client';

import { Card } from '@/components/ui/card';

interface VideoContainerProps {
  videoRef?: React.RefObject<HTMLDivElement>;
  playerId?: string;
  onVideoElementCreated?: (element: HTMLDivElement) => void;
  label: string;
}

export const VideoContainer = ({
  videoRef,
  playerId,
  onVideoElementCreated,
  label,
}: VideoContainerProps) => {
  return (
    <Card className="relative aspect-video overflow-hidden bg-muted">
      <div
      //@ts-ignore
        ref={videoRef}
        id={playerId}
        className="w-full h-full"
        {...(onVideoElementCreated && {
          ref: (el) => el && onVideoElementCreated(el),
        })}
      />
      <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-sm">
        {label}
      </div>
    </Card>
  );
};