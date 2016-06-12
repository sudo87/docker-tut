var request = require('supertest');
var should = require('should');
var server = require('../server/server');

describe('Users API', () => {

    // our running app (rebuilt for each test) and our repo, which
    // we can mock for each test
    var app = null;
    var testUsers = [{
        email: 'home@oracle.com',
        phone_number: '+91 9663769216'
    }, {
        email: 'abc@oracle.com',
        phone_number: '+91 8447472574'
    }
    ];
    var testRepo = {
        getUsers: () => {
            return Promise.resolve(testUsers);
        },
        getUserByEmail: (email) => {
            return Promise.resolve(testUsers.find((user) => {
               return user.email === email;
            }));
        }
    };

   beforeEach(() => {
      return server.start({
          port: 1234,
          repository: testRepo
      }).then(function(svr) {
         app = svr;
      });
   });

  afterEach(() => {
     app.close();
     app = null;
  });

  it('can return all users', (done) => {

      request(app)
      .get('/users')
      .expect(function(res) {
          res.body.should.containEql({
              email: 'home@oracle.com',
              phoneNumber: '+91 9663769216'
          });
      })
  .expect(200, done);

  });

  it('returns a 404 for an unknown user', (done) => {

      request(app)
      .get('/search?email=def@oracle.com')
      .expect(404, done);
  });

  it('returns a 200 for known  user', (done) => {
      request(app)
      .get('/search?email=abc@oracle.com')
      .expect(200, done);
  });
});
