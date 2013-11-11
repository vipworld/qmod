qmod
====

Serverside (as express middleware)
====

```
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

Browserside
====

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


