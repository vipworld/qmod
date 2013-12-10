qmod
====

Qmod makes it easier to work with query strings by providing the ability to easily manipulate strings and to switch between strings and objects.

Serverside (as express middleware)
====

```
var Qmod = require('qmod');
var url  = require('url');
app.use(function(req, res, next) {
  res.locals.qmod = new Qmod(req.originalUrl);
});
```

In Jade:

```
a(href=qmod().inc('page').toString()) Next Page
```
Note: qmod takes the absolute url, but will return a relative path.

API
====
```
var qmod = new Qmod('/path?user=holmes&profession=detective');

qmod().set('user', 'sherlock').toString();
// -> /path?user=sherlock&profession=detective;

qmod().set('user', 'sherlock').toObj();
// -> { user: 'sherlock', profession: 'detective' };

qmod().set({ user: 'sherlock', profession: 'sleuth' }).toString();
// -> /path?user=sherlock&profession=sleuth;

qmod().get('profession');
// -> detective

qmod().remove('profession').toObj();
// -> { user: 'sherlock' };
```

Pagination
======
```
var qmod = new Qmod('page=1');
qmod().inc('page');
// -> page=2

var qmod = new Qmod('page=3');
qmod().dec('page');
// -> page=2
```


Browserside
- TODO: need to make this more lightweight

====
```
<script type='text/javascript' src='qmod.js'>
<script type='text/javascript'>
  var qmod = new Qmod(window.location.href);
  var href = qmod().set('key', 'value').toString();
</script>
```
