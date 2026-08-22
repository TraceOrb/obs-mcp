export default function readMcpEnv(): {
  readKey: string;
  apiUrl: string;
} {
  const readKey = process.env.TRACEORB_READ_KEY;
  if (readKey === undefined || readKey === '') {
    throw new Error('TRACEORB_READ_KEY is required');
  }

  let apiUrl = 'https://api.traceorb.com';
  const fromEnv = process.env.TRACEORB_API_URL;
  if (fromEnv !== undefined && fromEnv !== '') {
    apiUrl = fromEnv;
  }

  return { readKey, apiUrl };
}
