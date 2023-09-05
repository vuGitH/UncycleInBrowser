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
    '1.  enabling JSON object to stringify and parse back the objects\n' + 
    'and arrays with circular references and RegExp properties  and/or\n\n' +
    '2. Provides replacer and reviver functions\n' +
    '(second parameter of JSON.stringify() and JSON.parse() method)\n' +
    'to stringify and parse objects and/or arrays with circular references and RegExp\n' +
    'properties.\n\n' +
	  '3. as a result it permits to make clones of objects or arrays mentioned above as well.\n' +
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
  it++; txt[3] =
    '\nThe handler method\n\n' +
    '            unCycle.preStringify(o);\n\n' +
    'transformes original object into the form where values\n' +
    'of properties being circular references are exchanged by string values of\n' +
    'their uid-s (universal identifyers, details are explained in description).\n\n' +
    'Actually, after such transformation the object o is look like this:\n\no =\n';
  out(txt[it]);
  //unCycle.uiDirect.resetData();
  //unCycle.fillDirectory(o);
  unCycle.preStringify(o);
  /* Further calculation will change the o object properties values.
   * what will change the console output( appropriate to this particular
   * moment of calculation) after test run termination.
   * To keep current values unchanged in console the independent clone
  * clone of actual o object state is created (using the functionality 
  * of unCycle handler) and print into
  * browser by console.log(oFreez) =  actual values of o object properties

  */
  var oFreez = JSON.parse(JSON.stringify(o));
  console.log(oFreez);

  it++; txt[4]='\n\nAs you can see there are no any Circulars in it\n' +
  'and therefore there are no obstacles to stringify it by' +
  'var oj = JSON.stringify(o);\n\n' +
  'where oj is json string:\n';
  console.log(txt[it]);
  var oj = JSON.stringify(o);  
  console.log(oj);

  it++; txt[5] =
    '\n\nWhenever necessary to get back circular form of original object\n' + 
    'immediately (e.g. for some further use) uncycle could circularize our\n' +
    'prestirngified object back using method\n\n' +    
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
    '     var oOj = JSON.stringify(oO,unCycle.replacer);\n\n' +
    'who gives json string \noOj=\n';
  out(txt[it]);
  console.log(oOj);

  it++; txt[it] = '\nFor some future reasons we could leave object oO in "circularized"\n' +
    'form again, using code: oOo = unCycle.circularize(oO)\n oOo =\n';
  out(txt[it]);
  var oOo = unCycle.circularize(oO);
  console.log(oOo);

  it++; txt[it] = '' +
    '\nWith mediation of unCycle handler json string oOj \n' +
    'obtained after serialisation of object with circular references\n' +
    'could be parsed into object equivalent to original one \n' +
    'similarly in two optional ways:\n' +
    ' - using method unCycle.postParse(o1) after o1 = JSON.parse(oOj) or\n' +
    ' - using reviver function provided by the property unCycle.reviver\n' +
    'permiting parse oOj directly using JSON.parse with second paramete\n' +
    'reviver \n\n' +
    '         var o1 = JSON.parse(oOj,reviver);\n' +
    '\nwhere `riviver` function is obtained from equation\n' +
    '         reviver = unCycle.reviver \n' +
    'So, after parsing we get new object o1 = \n';
  out(txt[it]);
  var o1 = JSON.parse(oOj, unCycle.reviver);
  console.log(o1);
  
  console.log('\nOr each property separately:\n');
  for (var ip in o1) {
    console.log('\n%s :', ip);
    console.log(o1[ip]);
  }
  console.log('\nfully equivalent to original circular object.\n\nTest is finished.\n\n');
  console.log('\n\nNow some explanations (Long Read):\n');
  console.log(t());

};