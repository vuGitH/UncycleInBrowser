// exports.test = (function () {
var out = function(s){console.log(s);};	
var testUncycle = function () {
  /**
   * tests hanlder permiting to serialise objects containing internal
   * circular referrences
   */
  //var unCycle = require('./uncycle.js').handler;
  var t = readMeUncycle;
  var testDesclaimer = '' +
    '\n\n   * ---- Test of unCycle module ---- *\n' +
    ' unCycle is a handler who supplies methods\n\n' +
    '1.  enabling JSON object to stringify and parse back the objects and arrays with circular references and RegExp\n' +
    'properties  and/or\n' +
    '\n' +
    '2. Provides replacer and reviver functions\n' +
    '(second parameter of JSON.stringify() and JSON.parse() method)\n' +
    'to stringify and parse objects and/or arrays with circular references and RegExp\n' +
    'properties.\n\n' +
	  '3. what as a result permits to make clones of objects or arrays mentioned above.\n' +
    'Handler could be evoked locally by the global var unCycle \n\n'; 

  out(testDesclaimer);
  var txt = [], it = 0;
  var o = {
    a: {},
    b: [0, {
      id: 'inarr',
      ob: {}
    }, 2],
    c: {
      o: {},
      o1: [0, [], 2],
      o3: 'o3',
      im: 'obj'
    }
  };
  o.a = o;
  o.b[1].ob = o.b;
  o.c.o1[1].push(1, o.c);
  txt[0] = '' +
    "\n\nLet\'s take some test object o\n\n" +
    '			var o={\n' +
    '				a: {},\n' +
    '				b: [0, {id: \'inarr\', ob: {}}, 2],\n' +
    '				c: {o: {}, o1: [0,[],2], o3: \'o3\', im: \'obj\'}\n' +
    '			};\n' +
    '\n' +
    'and add few internal circular references into it:\n' +
    '\n' +
    '			o.a=o;\n' +
    '\n' +
    '			o.b[1].ob=o.b;\n' +
    '\n' +
    '			o.c.o1[1].push(1,o.c);\n' +
    '						\n';
  it++;
  txt[1] = '\nSo the object is now presented in node console:\n\n';
  out(txt[0] + txt[1]);
  console.log(o);
  
  it++; txt[2] = '' +
    '\n\nPay attention to \'Circular\' mark indicating presence of circular references\n';
  out(txt[it]);
  //unCycle.uiDirect.resetData();
  //unCycle.fillDirectory(o);
  unCycle.preStringify(o);
  it++; txt[3] =
    '\nThe handler method\n\n' +
    '            unCycle.preStringify(o);\n\n' +
    'transformes original object into the form where values\n' +
    'of properties being circular references are exchanged by string values of\n' +
    'their uid-s (universal identifyers, details are explained in description).\n\n' +
    'Actually, after such transformation the object o is look like this:\n\no =\n';
  out(txt[it]);
  console.log(o);
  it++; txt[4]='\n\nAs you can see there are no any Circulars in it\n' +
  'and therefore there are no obstacles to stringify it by' +
  'var oj = JSON.stringify(o);\n\n' +
  'where oj is json string:\n';
  console.log(txt[it]);
  var oj = JSON.stringify(o);  
  console.log(oj);

  it++; txt[5] =
    '\n\nWhenever necessary to get back circular form of original object immediately' + 
	' for further use uncycle could circularize our prestirngified object back\n' +
    'using method\n\n' +
    '           unCycle.circularize(o);\n' +
    'Look, this is our original object after back "circularization" \no = ';
  unCycle.circularize(o);
  out(txt[it]);
  console.log(o);
  console.log('\n\nTo evoke object from json string got in serialization\n'+
  'use the following commands:\n\n' +
  '    var ojo = JSON.parse(oj);\n' +
  '    ojo = unCycle.postParse(ojo);\n\n ' +
  'finally ojo =');
  var ojo = JSON.parse(oj);
  ojo = unCycle.postParse(ojo);
  console.log(ojo);
  it++; txt[6]='\n\nAll Circulars are at their original sites.\n\n' +
    '/nNow let\'s consider another case of another test object \noO = \n';
  out(txt[it]);

  var oO = {
    a: {},
    b: [0, {
      id: 'inarr',
      ob: {}
    }, 2],
    c: {
      o: {},
      o1: [0, [], 2],
      o3: 'o3',
      im: 'obj'
    }
  };
  oO.a = oO;
  oO.b[1].ob = oO.b;
  oO.c.o1[1].push(1, oO.c);

  console.log(oO);

  var oOj = JSON.stringify(oO, unCycle.replacer, 1);
  it++; txt[it] = '' +
    '\nThe method unCycle.replacer provides replacer function which\n' +
    'could be used as second parameter of JSON.stringify(oO,replacer) method\n' +
    'to serialize the circular object directly by means of JSON.stringify()\n\n' +
    '           var oj=JSON.stringify(oO,unCycle.replacer);\n\ngives json string \noOj=\n';
  out(txt[it]);
  console.log(oOj);
  it++; txt[it] = '\nFor some future reasons we could leave object oO in "circularized"\n' +
    'form, using code: oOo = unCycle.circularize(oO)\n oOo =\n';
  out(txt[it]);
  var oOo = unCycle.circularize(oO);
  console.log(oOo);
  it++; txt[it] = '' +
    '\nWith mediation of unCycle handler json string oj \n' +
    'obtained after serialisation of object with circular references\n' +
    'could be parsed into object equivalent to original one \n' +
    'similarly in two optional ways:\n' +
    ' - using method unCycle.postParse(o1) after o1=JSON.parse(oj) or\n' +
    ' - using reviver function provided by method unCycle.reviver permiting parse oj\n' +
    'directly using JSON.parse with second parameter reviver \n\n' +
    '          var o1 = JSON.parse(oOj,reviver);\n' +
    '\nwhere riviver function is obtained from equation reviver = unCycle.reviver .\n' +
    'So, after parsing we get new object o1 = \n';
  out(txt[it]);
  var o1 = JSON.parse(oOj, unCycle.reviver);
  console.log(o1);
  
  console.log('\nOr each property separately:\n');
  for (var ip in o1) {
    console.log('\n%s :', ip);
    console.log(o1[ip]);
	}
  console.log('\nfully equivalent to original circular object.\n\nTest is finished,');
  console.log('\n\nnow some explanations:\n');
  console.log(t());

};