qmod
====

Qmod makes it easier to work with query strings by providing the ability to easily manipulate strings and to switch between strings and objects.

Serverside (as express middleware)
====

```
var Qmod = require('qmod');
var url  = require('url');
app.use(function(req, res, next) {
  res.locals.qmod = new Qmod(url.parse(req.originalUrl).search);
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
<script type='text/javascript'>
  var qmod = new Qmod(window.location.search);
  var href = qmod().set('key', 'value').toString();
</script>
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
qmod().inc('page');
// -> page=2
```


