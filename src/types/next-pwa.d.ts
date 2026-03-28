declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  export default function withPWAInit(options: {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    [key: string]: any;
  }): (config: NextConfig) => NextConfig;
}
