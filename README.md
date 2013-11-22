qmod
====

Qmod makes it easier to work with query strings by providing the ability to easily manipulate strings and switching between strings and objects.

Serverside (as express middleware)
====

```
var Qmod = require('qmod');
app.use(function(req, res, next) {
  res.locals.qmod = function(res.querystring) {
    var url = req.originalUrl
      , idx = url.indexOf('?') > -1 ? url.indexOf('?') : false
      , qs
      , qmod = null;
    if(idx) {
      qs = url.substr(idx + 1);
      res.locals.qmod = new Qmod(qs);
    }
  };
});
```

In Jade:

```
a(href=qmod().inc('page').toString()) Next Page
```



Browserside
====
```
<script type='text/javascript' src='qmod.js'>
```

API
====
```
var qmod = new Qmod('user=holmes');
qmod().set('user', 'sherlock').toString();
// -> user=sherlock;
qmod().set('user', 'sherlock').toObj();
// -> { user: 'sherlock' };
```
pagination
======
```
var qmod = new Qmod('page=1');
qmod().inc(page)
// -> page=2
```


