/* eslint-disable no-undef */
import 'dotenv/config';
import faker from 'faker';
import request from 'supertest';
import chai from 'chai';
import app from '../src/index';
import { logger } from '../src/config';

const { expect } = chai;
describe('e-commerce', () => {
  let user; let token; let category; let new_name; let id; let
    order_id;
  const product_name = faker.commerce.productName();
  before((done) => {
    user = {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(8),
      phone_number: faker.random.number(110000000000),
    };
    request(app)
      .post('/api/v1/auth/register')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        token = res.body.data.token;
        if (err) {
          throw err;
        }
        expect(res.body.message).to.equal('user created sucessfully');
        request(app)
          .get(`/api/v1/auth/confirmation?token=${token}`)
          .send(user)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            expect(res.body.message).to.equal('Account activated');
            request(app)
              .post('/api/v1/auth/confirmation')
              .send({ email: user.email })
              .expect('Content-Type', /json/)
              .expect(400)
              .end((err, res) => {
                if (err) {
                  return done(err);
                }
                expect(res.body.message).to.equal('Account is verified');
                done();
              });
          });
      });
  });
  describe('login', () => {
    it('it should get the base url', (done) => {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal(undefined);
          done();
        });
    });
    it('first name is required', (done) => {
      request(app)
        .post('/api/v1/auth/register')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('first_name is required');
          done();
        });
    });
    it('should return login successful', (done) => {
      request(app)
        .post('/api/v1/auth/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('login successful');
          done();
        });
    });
  });
  describe('category', () => {
    it('should create category', (done) => {
      request(app)
        .post('/api/v1/category')
        .set({ token: process.env.ADMIN_TOKEN })
        .send({
          name: faker.random.word(),
        })
        .set('Accept', 'application')
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          category = res.body.data.name;
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('category created successfully');
          done();
        });
    });
    it('should return all category', (done) => {
      request(app)
        .get('/api/v1/category')
        .set('Accept', 'application')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          logger.info(res.body.message);
          done();
        });
    });
    it('should update category', (done) => {
      new_name = faker.random.word();
      request(app)
        .put('/api/v1/category')
        .set({ token: process.env.ADMIN_TOKEN })
        .set('Accept', 'application')
        .send({
          name: category,
          new_name,
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal(`${new_name} updated sucessfully`);
          done();
        });
    });
    // it('should delete category', (done) => {
    //     request(app)
    //         .delete('/api/v1/category')
    //         .set({ token: process.env.ADMIN_TOKEN })
    //         .set('Accept', 'application')
    //         .send({ name: faker.random.word() })
    //         .expect('Content-Type', /json/)
    //         .expect(200)
    //         .end((err, res) => {
    //             if (err) { throw err; }
    //             expect(res.body.message).to.equal(`${new_name} Deleted successfully`);
    //             done();
    //         });
    // });
  });
  describe('product', () => {
    it('should create product', (done) => {
      request(app)
        .post('/api/v1/product')
        .set({ token: process.env.ADMIN_TOKEN })
        // .attach('image', 'public/img.png')
        .field({
          product_name,
          category: new_name,
          quantity: 10,
          price: 200,
        })
        .set('Accept', 'application')
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          id = res.body.data.id;
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('product Added Sucessfully');
          done();
        });
    });
    it('should return all product', (done) => {
      request(app)
        .get('/api/v1/product')
        .set('Accept', 'application')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('successfully fetched all product');
          done();
        });
    });
    it('should return No Product found by sepcific category', (done) => {
      request(app)
        .post('/api/v1/select/product/category')
        .set('Accept', 'application')
        .send({ category })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('No Product found');
          done();
        });
    });
    it('should return Product found by sepcific category', (done) => {
      request(app)
        .post('/api/v1/select/product/category')
        .set('Accept', 'application')
        .send({ category: 'Pet Supplies' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('Product found');
          done();
        });
    });
    it('should return specific Product', (done) => {
      request(app)
        .post('/api/v1/search/product')
        .set('Accept', 'application')
        .send({ product_name: 'chain' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('Product found');
          done();
        });
    });
    it('should return all Product by category', (done) => {
      request(app)
        .get('/api/v1/product/category')
        .set('Accept', 'application')
        .send({ category: 'Pet Supplies' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          logger.info(res.body.message);
          done();
        });
    });
    it('should update product', (done) => {
      request(app)
        .put('/api/v1/product')
        .set({ token: process.env.ADMIN_TOKEN })
        .set('Accept', 'application')
        .send({
          id,
          category: new_name,
          quantity: '20',
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('product updated sucessfully');
          done();
        });
    });
    it('should delete product', (done) => {
      request(app)
        .delete('/api/v1/product')
        .set({ token: process.env.ADMIN_TOKEN })
        .set('Accept', 'application')
        .send({ product_name: 'chain' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('chain Deleted successfully');
          done();
        });
    });
  });
  describe('password', () => {
    it('Forget Password', (done) => {
      request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: user.email })
        .set('Accept', 'application')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('reset link sent');
          done();
        });
    });
    it('should Reset Password', (done) => {
      request(app)
        .post(`/api/v1/auth/reset-password?token=${token}`)
        .set('Accept', 'application')
        .expect('Content-Type', /json/)
        .send({ password: faker.random.alphaNumeric(8) })
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('password reset successfully');
          done();
        });
    });
  });
  describe('order', () => {
    it('create order', (done) => {
      request(app)
        .post('/api/v1/order')
        .set({ token })
        .send({
          quantity: '1',
          product_name,
        })
        .set('Accept', 'application')
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          order_id = res.body.data.id;
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('your order as been placed');
          done();
        });
    });
    it('cancel order', (done) => {
      request(app)
        .patch('/api/v1/cancelorder')
        .set({ token })
        .set('Accept', 'application')
        .expect('Content-Type', /json/)
        .send({ id: order_id })
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.message).to.equal('your order has been cancelled');
          done();
        });
    });
  });
});
