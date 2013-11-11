/*
 * Modifies node's querystring library
 * to parse and stringify arrays
 * like ary[]=val0&ary[]=val1
 */
var QueryString = require('querystring');

function isString(arg) {
  return typeof arg === 'string';
}
function isNull(arg) {
  return arg === null;
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function isBoolean(arg) {
  return typeof arg === 'boolean';
}
function isNumber(arg) {
  return typeof arg === 'number';
}
function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
function isArray(ar) {
  return Array.isArray(ar);
}

function stringifyPrimitive(v) {
  if (isString(v))
    return v;
  if (isBoolean(v))
    return v ? 'true' : 'false';
  if (isNumber(v))
    return isFinite(v) ? v : '';
  return '';
}

var stringify = module.exports.stringify = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (isNull(obj)) {
    obj = undefined;
  }

  if (isObject(obj)) {
    return Object.keys(obj).map(function(k) {
      var ks;
      if (isArray(obj[k])) {
        ks = QueryString.escape(stringifyPrimitive(k)) + '[]' + eq;
        return obj[k].map(function(v) {
          return ks + QueryString.escape(stringifyPrimitive(v));
        }).join(sep);
      } else {
        ks = QueryString.escape(stringifyPrimitive(k)) + eq;
        return ks + QueryString.escape(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return QueryString.escape(stringifyPrimitive(name)) + eq +
         QueryString.escape(stringifyPrimitive(obj));
};

var parse = module.exports.parse = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (!isString(qs) || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && isNumber(options.maxKeys)) {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    try {
      k = decodeURIComponent(kstr);
      v = decodeURIComponent(vstr);
    } catch (e) {
      k = QueryString.unescape(kstr, true);
      v = QueryString.unescape(vstr, true);
    }

    var aryKey = k.match(/(.+)\[\]$/);
    if(aryKey) {
      k = aryKey[1];
    }

    if (!hasOwnProperty(obj, k)) {
      if (aryKey)
        v = [ v ];
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }
 
  return obj;
};
