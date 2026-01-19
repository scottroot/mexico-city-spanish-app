import { Connection, Client } from '@temporalio/client';


export async function getTemporalClient() {
  const address = process.env.TEMPORAL_ADDRESS;

  if (!address) {
    throw new Error('TEMPORAL_ADDRESS environment variable is not set');
  }

  console.log('Connecting to Temporal server at:', address);

  const connection = await Connection.connect({
    address,
    connectTimeout: 10000, // 10 seconds for Vercel cold starts
  });

  console.log('Connected to Temporal server');

  return new Client({ connection });
}
