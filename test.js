var server = require('./server.js');
var request = require('supertest')(server);
var mocha = require('mocha');


describe('Unauthenticated API', function() {
  it('should protect listing of users', function(done) {
    request
      .get('/api/users')
      .expect(401, done);
  });
});


// After populated, will be used for authenticated requests
var token;

describe('Authenticated API', function() {

  it('should allow authentication', function(done) {
    function hasLoggedIn(res) {
      if (!('token' in res.body)) return "missing token key";
      token = res.body.token; // remember token for authenticated requests
    }

    request
      .post('/api/authenticate')
      .set('Accept', 'application/json')
      .send({username: "admin", password: "123456"})
      .expect(hasLoggedIn)
      .end(done);
  });

  it('should allow listing of users for admins', function(done) {
    request
      .get('/api/users')
      .set('Authorization', 'Bearer '+ token)
      .expect(200, done);
  });

  // Update settings
  it('should allow updating journal settings', function(done) {
    request
      .put('/api/settings')
      .set('Authorization', 'Bearer '+ token)
      .set('Accept', 'application/json')
      .send({journal_name: 'A new journal name', journal_description: 'A new journal description'})
      .expect(200, done);
  });

  // Have new settings
  it('should have new setting', function(done) {
    function hasNewSettings(res) {
      var settings = res.body;
      if (settings.journal_name !== 'A new journal name') return "unexpected journal_name";
      if (settings.journal_description !== 'A new journal description') return "unexpected journal_description";
    }

    request
      .get('/api/settings')
      .set('Authorization', 'Bearer '+ token)
      .set('Accept', 'application/json')
      .expect(hasNewSettings)
      .expect(200, done);
  });

});

