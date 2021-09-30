import LoginId from '@loginid/node-sdk';

export const lAdmin = new LoginId(
  process.env.NEXT_PUBLIC_CLIENT_ID || '',
  process.env.API_PRIVATE_KEY || '',
  process.env.NEXT_PUBLIC_BASE_URL || ''
);
