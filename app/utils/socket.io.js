/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import socketIO from 'socket.io';
import Notification from '../jobs/workers/notification';

class SocketIo {
  constructor(server) {
    this.io = socketIO(server);
    this.users = {}; // enhancement: use a redis database structure
  }

  static async UserConnection(users, socketId, userId) {
    users[socketId] = userId;
    console.log(this.users);
  }
  // storing the socket id of connected users as a key and the
  // static async saveConnectedUser(socketId, userId) {
  //   client.set(connected users, JSON.stringify(UserConnection), redis.print);
  // }

  static async usersTasks() {
    const dueTask = await Notification.saveNotification();
    return dueTask;
  }

  static async getConnectionId(userId, user) {
    const arr = Object.keys(user).filter(
      (socketData) => user[socketData] === userId
    );
    return arr;
  }

  static async deleteUser(userId, user) {
    delete user[userId];
  }

  init() {
    this.io.on('connection', async (socket) => {
      socket.on('send user id', async (userId) => {
        await SocketIo.UserConnection(this.users, socket.id, userId);
        try {
          const data = await SocketIo.usersTasks();

          data.forEach(async (task) => {
            const connectedUsers = await SocketIo.getConnectionId(
              task.user_id,
              this.users
            );
            // console.log(connectedUsers);

            if (connectedUsers.length > 0) {
              connectedUsers.forEach((socketId) => {
                console.log(socketId);

                this.io.to(socketId).emit('notify user', task);
              });
            }
          });
        } catch (error) {
          console.log(error);
        }
      });

      socket.on('subscribe', () => {});

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  }

  static initialize(io) {
    io.init();
  }
}
export default SocketIo;
