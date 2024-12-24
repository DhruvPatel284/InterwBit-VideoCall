// Agora configuration
export const AGORA_CONFIG = {
    appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || '',
    channel: 'main',
    token: process.env.NEXT_PUBLIC_AGORA_TEMP_TOKEN || null, // Using null for testing. In production, implement token-based authentication
  } as const;
  
  // Validation helper with more detailed error message
  export const validateAgoraConfig = () => {
    if (!AGORA_CONFIG.appId || AGORA_CONFIG.appId === 'your-agora-app-id') {
      throw new Error(
        'Agora App ID is not configured properly. Please:\n' +
        '1. Sign up at https://www.agora.io\n' +
        '2. Create a project and get your App ID\n' +
        '3. Replace "your-agora-app-id" in .env.local with your actual Agora App ID'
      );
    }
  };

