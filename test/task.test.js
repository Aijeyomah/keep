import request from 'supertest';
import { expect } from 'chai';
import app from '..';
import { token, listId, task, taskTitle } from '../app/utils/text';

describe('create a bucket list', () => {
  describe('POST /auth/item/:listId', () => {
    it('it should create a user task successfully', (done) => {
      request(app)
        .post(`/auth/item/${listId}`)
        .set('Authorization', `${token}`)
        .set('Accept', 'application/json')
        .send(task)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body.message).to.equal('successfully created a task');
          done();
        });
    });
  });

  describe('POST /auth/item', () => {
    it('it should create a task title', (done) => {
      request(app)
        .post('/auth/task')
        .set('Authorization', `bearer ${token}`)
        .set('Accept', 'application/json')
        .send(taskTitle)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('successfully created a task title');
          done();
        });
    });
  });
});
