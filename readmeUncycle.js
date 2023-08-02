var readMeUncycle = function () {
    let txt = 
        '\n' +
        '      * ----  unCycle module  ---- *\n' +
        ' unCycle module provides a handler making JSON capable \n' +
        ' to stringify and parse objects with circular references and\n' +
        ' having RegExp objects as  properties. How does it look like?\n' +
        ' While having been installed locally handler is loaded by :\n\n' +

        '      h=require(\'./uncycle\').handler;\n' +
        '\n' +
        ' variant of use 1:\n' +
        '\n' +
        '      o  = h.preStringify(o);     // or simply h.preStringify(o);\n' +
        '      oj = JSON.stringify(o);\n' +
        '\n' +
        '      ojo = JSON.parse(oj);\n' +
        '      ojo = h.postParse(ojo);     // or simply  h.postParse(ojo); \n' +
        ' that\'s it.\n' +
        '\n' +
        ' variant 2:\n' +
        '\n' +
        '      oj  = JSON.stringify( o, h.replacer );\n' +
        '      ojo = JSON.parse    ( oj, h.reviver );\n' +
        '\n' +
        ' Remark 1:\n' +
        ' Processing of original object o makes some changes in it.\n' +
        ' If stringifying is not your final goal and you need o for further use\n' +
        ' we should remove fingerprints and leave everything asItWas ( circularize\n' +
        ' object again).\n\n' +
        ' Method:  h.circularize(o, h) is presumed for that purpose, i.e. :\n' +
        '\n' +
        ' v.1\n' +
        '\n' +
        '      h.preStringify(o);\n' +
        '      oj=JSON.stringify(o);\n' +
        '\n' +
        '      h.circularize(o ,h );\n' +
        '\n' +
        '      ojo=JSON.parse(oj);\n' +
        '      h.postParse(ojo);\n' +
        '\n' +
        ' v.2\n' +
        '\n' +
        '      oj=JSON.stringify(o,h.replacer);\n' +
        '      h.circularize(o,h);              // if any\n' +
        '      ojo=JSON.parse(oj,h.reviver);\n' +
        '\n' +
        ' Remark 2:\n' +
        ' Variant 2 paraphrases standard use of JSON.stringify and\n' +
        ' JSON.parse with two parameters, second of wich is a function permitting\n' +
        ' modify output in accordance with JSON manual.\n' +
        ' In our case such modification is related only with properties\n' +
        ' being circular references. Nevertheless the initial standard ability\n' +
        ' to modify handling object properties on each (key,value) bases of is\n' +
        ' preserved as well. User defined replacer and reviver functions\n' +
        ' in the context of JSON.stringify and JSON.parse documentation\n' +
        ' should be assigned to handler methods:\n' +
        '\n' +
        '       h.replacerU=replacer;\n' +
        '       h.reviverU=reviver;\n' +
        '\n' +
        ' where replacer and reviver are functions of two parameters\n\n' +
        '       reviver = function(key,value){...};\n' +
        '       replacer = function(key,value){...};\n' +
        '\n' +
        ' determined by user.\n' +

        ' To varify this write yours or get test object and user functions samples\n' +
        ' for test object as follows:\n' +
        '\n' +
        '  var o = h.getTestObj(); \n' +
        '  where\n' +
        '    h.getTestObj=function(){\n' +
        '    var o = {\n' +
        '             a:{},\n' +
        '             b:[0, {id: \'inarr\', ob: {}},2],\n' +
        '             c:{o: {},o1: [0,[],2], o3: \'o3\',im: \'obj\'}\n' +
        '           };\n' +
        '      o.a = o;\n' +
        '      o.b[1].ob = o.b;\n' +
        '      o.c.o1[1].push(1,o.c);\n' +
        '      o.d = o.a;\n' +
        '      o.f = \'f\';\n' +
        '      o.re = /standrdRegExp$/ig;\n' +
        '      o.prim = {a: \'a\',ar: [12,13]};\n' +
        '      o.aa = {p1: \'p1\', p2:2};\n' +
        '\n' +
        '      return o;\n' +
        '    };\n' +
        '\n' +
        '\n' +
        '       var replacer = function(key,value){\n' +
        '                        return key===\'f\'?undefined:value;\n' +
        '                      };\n' +
        '       var reviver = require(\'./uncycle\').reviver; \n' +
        '       h.replacerU = replacer;\n' +
        '       h.reviverU = reviver;\n' +
        '\n' +
        ' and analyse\n\n' +
        ' oj = JSON.stringify(o, h.replacer);\n' +
        ' h.circularize(o, h); \n' +
        ' ojo=JSON.parse(oj, h.reviver);\n' +
        '\n' +
        ' Differences between these two objects are appropriate to modifications\n' +
        ' determined by user functions <replacer> and <reviver>.\n' +
        '\n' +
        '\n' +
        ' Peculiar Feature!:\n' +
        ' Suppose we have ordinary object without circular references.\n' +
        ' Handler eats it without changing of codes, e.g.\n' +
        '\n' +
        '      var oIn = {a: \'a\', ob:{a: \'a\', b: []}, arr: [1,2,3]};\n' +
        '\n' +
        ' So, consecutive stringify and parse in one line gives:\n' +
        '\n' +
        '   var oOut = JSON.parse(JSON.stringify( oIn, h.replacer), h.reviver);\n' +
        '\n' +
        ' // check that oOut is\n' +
        '                {a :\'a\', ob: {a:\'a\', b: []}, arr: [1,2,3]} object but\n' +
        '      oIn === oOut ? true : false ; // returns false - another object\n' +
        '\n' +
        ' the same result with circularize step:\n\n' +
        '      oj = JSON.stringify( oIn, h.replacer);\n' +
        '      h.circularize( oIn , h );\n' +
        '      oOut = JSON.pars( oj, h.reviver );\n' +
        '\n' +
        '\n' +
        '     * --- RegExp JSON - stringify - parse  option --- *\n\n' +
        ' As you could already have noted the property re of testing object o\n' +
        ' is regular expression object and instead of this handler has worked\n' +
        ' it out successfully. Boolean property h.regStrOn is dedicated to switch\n' +
        ' on/off dependent package regStr using to stringify and parse RegExp\n' +
        ' properties of objects. Default value of h.regStrOn===true;\n' +
        ' To switch off set it to false,\n' +
        ' typical JSON behavior regarding RegExp will take place after that.\n' +
        ' regStr module(package) has analogus logic and structure like uncycle.\n' +
        '\n' +
        ' For Details and algorithm of both packages see descriptions, comments\n' +
        ' and codes. type npm run explain or require(\'./explain_uncycle\') \n' +
        ' Best regards! Vladimir\n' +
        '\n';
    console.log(txt);
    return txt;
};  