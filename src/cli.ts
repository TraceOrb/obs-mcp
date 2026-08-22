import readMcpEnv from './env';
import startMcpServer from './server';

async function main(): Promise<void> {
  readMcpEnv();
  await startMcpServer();
}

main().catch(function onError(error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
    process.exit(1);
  }

  console.error('TRACEORB_READ_KEY is required');
  process.exit(1);
});
