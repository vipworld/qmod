var Qmod = require('./index');

var qmod = new Qmod('user[]=tom&user=jerry&game=monopoly');
var qmodNums = new Qmod('page=5&series[]=1&series[]=2');

var t1 = qmod().set('user', [ 'jekyll', 'hyde' ]).toString();
var t2 = qmod().set('game', 'risk').toString();
var t3 = qmod().remove('user').set('drinks', [ 'mojito', 'old fashioned' ]).toString();
var t4 = qmod().set('game[name]', 'monopoly').toObj();
var deep = new Qmod('stack[name]=admin&stack[permissions]=superuser');
var t5 = deep().get('stack[permissions]');
var t6 = qmodNums().inc('page').dec('series[1]').toString();
var t7 = qmodNums().dec('page').dec('series[1]').toString();

console.log(t1);
console.log(t2);
console.log(t3);
console.log(t4);
console.log(t5);
console.log(t6);
console.log(t7);
