import { json, urlencoded } from 'express';
import http from 'http';
import config from './index';
import v1Routes from '../app/routes/v1';
import SocketIo from '../app/utils/socket.io';

const appConfig = (app) => {
  const server = http.createServer(app);
  const io = new SocketIo(server);
  SocketIo.initialize(io);
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use('/api/v1', v1Routes);
  const port = config.PORT;
   app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });

};

export default appConfig;
