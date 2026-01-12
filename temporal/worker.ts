import { NativeConnection, Worker } from '@temporalio/worker';
import { config } from 'dotenv';
import * as activities from './activities';

config();

async function run() {
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS || '54.161.138.231:7233',
  });

  const worker = await Worker.create({
    connection,
    namespace: 'default',
    taskQueue: 'content-generation',
    workflowsPath: require.resolve('./workflows'),
    activities,
  });

  console.log('Worker started on task queue: content-generation');
  console.log('Connected to Temporal server at:', connection.options.address);

  await worker.run();
}

run().catch((err) => {
  console.error('Worker failed:', err);
  process.exit(1);
});
