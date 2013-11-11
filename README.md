qmod
====

Serverside (as express middleware)
==

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
