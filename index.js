var qs  = require('qs');
var url = require('url');

function overwrite(orig, obj) {
  for(var n in obj) {
    orig[n] = obj[n];
  }
}

function extractBrackets(str) {
  var expansion = [];
  try {
    var bracketRe = /\[[^\[\]]*\]/g;
    var baseExtRe = /^([^\[\]]+)(\[.*\])?$/;
    var baseExt   = str.match(baseExtRe);
    var base = baseExt[1];
    expansion.push(base);
    var ext  = baseExt[2];
    if (!ext) return expansion;
    var result = bracketRe.exec(ext);
    while(result) {
      expansion.push(result[0]);
      result = bracketRe.exec(ext);
    }
  } catch (e) {
    expansion.push(str);
  }
  return expansion;
}

function Qmod(fullUrl, options) {
  fullUrl = decodeURI(fullUrl);
  var parsed = url.parse(fullUrl);
  var self = this;

  return function() {
    self.mod  = qs.parse(parsed.query);
    self.path = parsed.pathname;
    return self;
  }
}

function _set(key, val) {
  var arrayMatch = key.match(/\[.*\]$/);
  if (arrayMatch) {
    var obj = qs.parse([key, val].join('='));
    overwrite(this.mod, obj);
  } else {
    this.mod[key] = val;
  }
}

Qmod.prototype.set = function(key, val) {
  if ('object' === typeof key) {
    for(var k in key) {
      _set.call(this, k, key[k]);
    }
  } else {
    _set.call(this, key, val);
  }
  return this;
};

Qmod.prototype.remove = function(key) {
  if (this.mod[key])
    delete this.mod[key];
  return this;
};

function escapeBrackets(str) {
  var re = /^\[(.*)\]$/;
  var m = str.match(re);
  if (m && m[1]) 
    return m[1];
  else 
    return str;
}

Qmod.prototype.get = function(key) {
  var traverser = extractBrackets(key);
  var branch = this.mod;
  traverser.forEach(function(k) {
    k = escapeBrackets(k);
    branch = branch[k];
  });
  return branch;
};

Qmod.prototype.toObj = function() {
  return this.mod;
};

Qmod.prototype.toString = function() {
  return [this.path, qs.stringify(this.mod)].join('?');
};

Qmod.prototype.getInt = function(key) {
  var str = this.get(key)
    , num = parseInt(str);
  if(isNaN(num)) return false;
  else return num;
};

Qmod.prototype.inc = function(key) {
  var num = this.getInt(key);
  if(num)
    this.set(key, ++num);
  return this;
};

Qmod.prototype.dec = function(key) {
  var num = this.getInt(key);
  if(num)
    this.set(key, --num);
  return this;
};

// expose helper functions
Qmod.extractBrackets = extractBrackets;
Qmod.overwrite       = overwrite;

module.exports = Qmod;
