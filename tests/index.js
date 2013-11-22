var Qmod   = require('../index');
var should = require('should');

var qm = function(str) { return new Qmod(str); };
var samples = {
  users: 'user[]=tom&user[]=jerry',
  pages: 'page=5&series[]=1&series[]=2',
  dir: 'dir=asc&order=count',
  nested: 'stack[name]=admin&stack[permissions]=superuser'
};
describe('Qmod', function() {
  describe('#set', function() {
    it('should be able to set a query param to a string', function() {
      var qmod = qm(samples.dir);
      var newQ = qmod().set('dir', 'desc').toString();
      newQ.should.equal('dir=desc&order=count');
    });

    it('should be chainable', function() {
      var qmod = qm([ samples.users, samples.pages ].join('&'));
      var newQ = qmod().set('user', 'me').set('series', [3,4])
        .toString();
      newQ.should.equal('user=me&page=5&series[0]=3&series[1]=4');
    });

    it('should be able to set a query param to an array', function() {
      var qmod = qm(samples.users);
      var newQ = qmod().set('user', [ 'jekyll', 'hyde' ]).toString();
      newQ.should.equal('user[0]=jekyll&user[1]=hyde');
    });

    it('should be able to set and return object', function() {
      var qmod = qm(samples.users);
      var newQ = qmod().set('user', { name: 'tom', animal: 'cat' }).toObj();
      newQ.should.eql({ user: { name: 'tom', animal: 'cat' } });
    });

    it('should be able to set object and return string', function() {
      var qmod = qm(samples.users);
      var newQ = qmod().set('user', { name: 'tom', animal: 'cat' }).toString();
      newQ.should.eql('user[name]=tom&user[animal]=cat');
    });
  });

  describe('#get', function() {
    it('should be able to read nested objects', function() {
      var qmod = qm(samples.nested);
      var newQ = qmod().get('stack');
      newQ.should.eql({ name: 'admin', permissions: 'superuser' });
    });
  });

  describe('#inc', function() {
    it('should be able to increment a number', function() {
      var qmod = qm(samples.pages);
      var newQ = qmod().inc('page').get('page');
      newQ.should.eql(6);
    });

    it('should be able to decrement a number', function() {
      var qmod = qm(samples.pages);
      var newQ = qmod().dec('page').get('page');
      newQ.should.eql(4);
    });
  });
});
