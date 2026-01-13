import { Connection, Client } from '@temporalio/client';


export async function getTemporalClient() {
  const connection = await Connection.connect({
    address: process.env.TEMPORAL_ADDRESS,
  });

  console.log('Connected to Temporal server at:', connection.options.address);

  return new Client({ connection });
}
