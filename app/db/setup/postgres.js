import promise from 'bluebird';
import pg from 'pg-promise';
import config from '../../../config/env/development';

const { DATABASE_URL } = config;
const options = {
  promiseLib: promise
};

const pgp = pg(options);
const db = pgp(DATABASE_URL);

export default db;
