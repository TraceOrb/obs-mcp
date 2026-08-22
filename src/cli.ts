import readMcpEnv from './env';

function main(): void {
  readMcpEnv();
}

try {
  main();
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    process.exit(1);
  }

  console.error('TRACEORB_READ_KEY is required');
  process.exit(1);
}
