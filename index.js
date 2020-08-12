import express from 'express';
import { Worker, isMainThread } from 'worker_threads';
import appConfig from './config/app';
//import Notification from './app/jobs/workers/notification'


// create express app
const app = express();


if (isMainThread) {
  appConfig(app);
  const worker = new Worker(__filename, {});
} else {
  // eslint-disable-next-line no-unused-expressions

}

export default app;
