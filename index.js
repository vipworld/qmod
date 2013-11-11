var qs  = require('qs');

function overwrite(orig, obj) {
  for(var n in obj) {
    orig[n] = obj[n];
  }
}

function extractBrackets(str) {
  var expansion = [];
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
  return expansion;
}

function Qmod(querystring) {
  var self = this;
  return function() {
    self.mod = qs.parse(querystring);
    return self;
  }
}

Qmod.prototype.set = function(key, val) {
  var arrayMatch = key.match(/\[.*\]$/);
  if (arrayMatch) {
    var obj = qs.parse([key, val].join('='));
    overwrite(this.mod, obj);
  } else {
    this.mod[key] = val;
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
  return qs.stringify(this.mod);
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

module.exports = Qmod;
