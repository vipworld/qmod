var Qmod   = require('../index');
var should = require('should');

var exPref = 'http://example.com/path?';
var exPath = '/path?';
var qm = function(str) { 
  return new Qmod(exPref + str); 
};
var samples = {
  users: 'user[]=tom&user[]=jerry',
  pages: 'page=5&series[]=1&series[]=2',
  dir: 'dir=asc&order=count',
  nested: 'stack[name]=admin&stack[permissions]=superuser'
};
describe('Qmod', function() {
  describe('#initialize', function() {
    it('should remove a leading ?', function() {
      return true;
      var qmod = qm('?' + samples.dir);
      var newQ = qmod().get('dir');
      newQ.should.equal('asc');
    });

    it('should return a function', function() {
      var qmod = qm(samples.dir);
      qmod.should.be.type('function');
      qmod().should.be.type('object');
    });
  });

  describe('#extractBrackets', function() {
    it('should expand nested brackets into array', function() {
      Qmod.extractBrackets("root[b1][b2]").should.eql([ "root", "[b1]", "[b2]" ]);
    });

    it('should handle unclosed bracket', function() {
      Qmod.extractBrackets("root[b1][b2").should.eql([ "root[b1][b2" ]);
    });
  });

  describe('#set', function() {
    it('should be able to set a query param to a string', function() {
      var qmod = qm(samples.dir);
      var newQ = qmod().set('dir', 'desc').toString();
      newQ.should.equal(exPath + 'dir=desc&order=count');
    });

    it('should be chainable', function() {
      var qmod = qm([ samples.users, samples.pages ].join('&'));
      var newQ = qmod().set('user', 'me').set('series', [3,4])
        .toString();
      newQ.should.equal(exPath + 'user=me&page=5&series[0]=3&series[1]=4');
    });

    it('should be able to set a query param to an array', function() {
      var qmod = qm(samples.users);
      var newQ = qmod().set('user', [ 'jekyll', 'hyde' ]).toString();
      newQ.should.equal(exPath + 'user[0]=jekyll&user[1]=hyde');
    });

    it('should be able to set and return object', function() {
      var qmod = qm(samples.users);
      var newQ = qmod().set('user', { name: 'tom', animal: 'cat' }).toObj();
      newQ.should.eql({ user: { name: 'tom', animal: 'cat' } });
    });

    it('should be able to set object and return string', function() {
      var qmod = qm(samples.users);
      var newQ = qmod().set('user', { name: 'tom', animal: 'cat' }).toString();
      newQ.should.eql(exPath + 'user[name]=tom&user[animal]=cat');
    });

    it('should be able to set multiple params using object', function() {
      var qmod = qm([ samples.users, samples.pages ].join('&'));
      var newQ = qmod().set({ user: [ 'jekyll', 'hyde' ], page: 7 }).toString();
      newQ.should.equal(exPath + "user[0]=jekyll&user[1]=hyde&page=7&series[0]=1&series[1]=2");
    });
  });

  describe('#get', function() {
    it('should be able to read nested objects', function() {
      var qmod = qm(samples.nested);
      var newQ = qmod().get('stack');
      newQ.should.eql({ name: 'admin', permissions: 'superuser' });
    });

    it('should be able to read arrays', function() {
      var qmod = qm(samples.pages);
      var newQ = qmod().get('series');
      newQ.should.eql(['1','2']);
    });
  });

  describe('#remove', function() {
    it('should be able to remove an item and return new string', function() {
      var qmod = qm(samples.dir);
      var newQ = qmod().remove('dir').toString();
      newQ.should.eql(exPath + 'order=count');
    });
    it('should be able to remove an item and return new string', function() {
      var qmod = qm(samples.dir);
      var newQ = qmod().remove('dir').toObj();
      newQ.should.eql({ order: 'count' });
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
