import { Connection, Client } from '@temporalio/client';


export async function getTemporalClient() {
  const connection = await Connection.connect({
    address: process.env.TEMPORAL_ADDRESS,
  });
  
  return new Client({ connection });
}
