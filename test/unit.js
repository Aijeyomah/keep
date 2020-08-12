const expect = require('expect');
const utils = require('../app/utils/socket.io');

it('should add two number', () => {
  const res = utils.add(2, 4);
  expect(typeof res).toBe('number');
});
it('should square a number', (done) => {
   utils.square(2, (num) => {
    expect(num).toBe(4);
    done();
  });
});
