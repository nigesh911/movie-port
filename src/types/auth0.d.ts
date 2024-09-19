import { NextApiRequest, NextApiResponse } from 'next';

declare module '@auth0/nextjs-auth0' {
  export function handleAuth(): any;
  export function getSession(req: NextApiRequest, res: NextApiResponse): Promise<{
    user?: {
      sub: string;
      [key: string]: any;
    };
  } | null>;
}