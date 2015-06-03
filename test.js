var server = require('./server.js');
var request = require('supertest')(server);
var mocha = require('mocha');

describe('User API', function() {
  it('protect listing of users', function(done) {
    request
      .get('/api/users')
      .expect(401, done);
  });
});