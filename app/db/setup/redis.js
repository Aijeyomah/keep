import redis from 'redis';
import { promisifyAll } from 'bluebird';

promisifyAll(redis);

const redisDB = redis.createClient();

export default redisDB;
