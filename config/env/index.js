import roothPath from 'app-root-path';
import development from './development';
import 'dotenv/config';

const {
  KEEP_PORT: PORT,
  SECRET_KEY: SECRET,
  KEEP_NODE_ENV: NODE_ENV,
} = process.env;

const currentEnv = { development }[NODE_ENV || 'development'];

export default {
  ...process.env, //
  ...currentEnv,
  roothPath,
  PORT,
  SECRET,
  NODE_ENV,
};
