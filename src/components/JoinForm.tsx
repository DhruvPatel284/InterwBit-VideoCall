'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface JoinFormProps {
  onJoin: (channel: string) => void;
  onLeave: () => void;
  isConnected: boolean;
}

export function JoinForm({ onJoin, onLeave, isConnected }: JoinFormProps) {
  const [channel, setChannel] = useState('main');

  return (
    <Card className="p-4 mb-4">
      <div className="flex gap-2">
        <Input 
          placeholder="Enter channel name" 
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          disabled={isConnected}
        />
        {isConnected ? (
          <Button 
            onClick={onLeave}
            variant="destructive"
          >
            Leave
          </Button>
        ) : (
          <Button 
            onClick={() => onJoin(channel)}
            disabled={!channel}
          >
            Join
          </Button>
        )}
      </div>
    </Card>
  );
}
