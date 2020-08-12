import request from 'supertest';
import { expect } from 'chai';
import faker from 'faker';
import app from '..';

describe('user Signup and signin routes', () => {
  let user;
  before((done) => {
    user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(8),
    };

    request(app)
      .post('/api/v1/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err) => {
        if (err) {
          throw err;
        }
        done();
      });
  });

  describe('POST /api/v1/login', () => {
    console.log('here login');

    it('should successfully login in a user', (done) => {
      request(app)
        .post('/api/v1/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.all.keys('message', 'data', 'status');
        })
        .end(done);
    });
  });
});
