var readMeUncycle = function () {
    let txt = 
        '\n' +
        '      <h2>* ----  unCycle package example to use in browser  ---- *</h2>\n' +
        ' unCycle package provides capabilities for JSON \n' +
        ' to stringify and parse objects with circular references and\n' +
        ' having RegExp objects as  properties. \n' +
        ' While having been loaded in a page by means of &lt;script&gt; tag:\n' +
        ' e.g.\n' +
        '&ltscript type="text/javascript" src="uncycleInBro.js"&gt;&lt;/script&gt;\n' +
        '(see simple html page in file testPage.html )\n\n' +

        '     <code> h = unCycle;</code>\n' +
        '\n' +
        ' <h3>variant of use 1:</h3>\n' +
        '\n' +
        '      <code>o  = h.preStringify(o);     // or simply h.preStringify(o);\n' +
        '      oj = JSON.stringify(o);\n' +
        '\n' +
        '      ojo = JSON.parse(oj);\n' +
        '      ojo = h.postParse(ojo);     // or simply  h.postParse(ojo);</code> \n' +
        ' that\'s it.\n' +
        '\n' +
        '<h3> variant 2:</h3>\n' +
        '\n' +
        '     <code> oj  = JSON.stringify( o, h.replacer.bind(h) );\n' +
        '      ojo = JSON.parse    ( oj, h.reviver.bind(h) );</code>\n' +
        '\n' +
        ' <h3>Remark 1:</h3>\n' +
        ' Processing of original object o makes some changes in it.\n' +
        ' If stringifying is not your final goal and you need o for further use\n' +
        ' we should remove fingerprints and leave everything asItWas ( circularize\n' +
        ' object again).\n\n' +
        ' Method:  <code>h.circularize(o)</code> is presumed for that purpose, i.e. :\n' +
        '\n' +
        ' v.1\n' +
        '\n' +
        '      <code>h.preStringify(o);\n' +
        '      oj = JSON.stringify(o);\n' +
        '\n' +
        '      h.circularize(o);\n' +
        '\n' +
        '      ojo = JSON.parse(oj);\n' +
        '      h.postParse(ojo);</code>\n' +
        '\n' +
        ' v.2\n' +
        '\n' +
        '      <code>oj = JSON.stringify(o,h.replacer.bind(h));\n' +
        '      h.circularize(o);              // if any\n' +
        '      ojo = JSON.parse(oj,h.reviver.bind(h));</code>\n' +
        '\n' +
        ' <h3>Remark 2:</h3>\n' +
        ' Variant 2 paraphrases standard use of <code>JSON.stringify</code> and\n' +
        ' <code>JSON.parse</code> with two parameters, second of wich is a function \n' +
        ' modifying output in accordance with JSON manual.\n' +
        ' In our case such modification is related only with properties\n' +
        ' being circular references. Nevertheless the initial standard ability\n' +
        ' to modify handling object properties on each (key,value) bases of is\n' +
        ' preserved as well. User defined replacer and reviver functions\n' +
        ' in the context of <code>JSON.stringify</code> and <code>JSON.parse</code> documentation\n' +
        ' should be assigned to handler properties:\n' +
        '\n' +
        '       <code>h.replacerUser = replacer;\n' +
        '       h.reviverUser = reviver;</code>\n' +
        '\n' +
        ' where replacer and reviver are functions of two parameters\n\n' +
        '       <code>reviver = function(key,value){...};\n' +
        '       replacer = function(key,value){...};</code>\n' +
        '\n' +
        ' determined by user.\n' +

        ' To varify this write yours or get test object and user functions samples\n' +
        ' for test object as follows:\n' +
        '\n' +
        '  <code>var o = h.getTestObj(); \n' +
        '  where\n\n' +
        '  h.getTestObj = function(){\n' +
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
        '       h.replacerUser = replacer;\n' +
        '       h.reviverUser = reviver;\n' +
        '\n' +
        ' //and analyse\n\n' +
        ' oj = JSON.stringify(o, h.replacer.bind(h));\n' +
        ' h.circularize(o); \n' +
        ' ojo = JSON.parse(oj, h.reviver.bind(h));</code>\n' +
        '\n' +
        ' Differences between these two objects are appropriate to modifications\n' +
        ' determined by user functions <replacer> and <reviver>.\n' +
        '\n' +
        '\n' +
        ' <i>Peculiar Feature!:</i>\n' +
        ' Suppose we have ordinary object without circular references.\n' +
        ' Handler eats it without changing of codes, e.g.\n' +
        '\n' +
        '      <code>var oIn = {a: \'a\', ob:{a: \'a\', b: []}, arr: [1,2,3]}</code>;\n' +
        '\n' +
        ' So, consecutive stringify and parse in one line gives:\n' +
        '\n' +
        '   <code>var oOut = JSON.parse(JSON.stringify( oIn, h.replacer.bind(h)), h.reviver.bind(h));</code>\n' +
        '\n' +
        ' // check that oOut is\n' +
        '                <code>{a :\'a\', ob: {a:\'a\', b: []}, arr: [1,2,3]} object but\n' +
        '      oIn === oOut ? true : false ; // returns false - another object</code>\n' +
        '\n' +
        ' the same result with circularize step:\n\n' +
        '      <code>oj = JSON.stringify( oIn, h.replacer.bind(h));\n' +
        '      h.circularize( oIn );\n' +
        '      oOut = JSON.pars( oj, h.reviver.bind(h) );</code>\n' +
        '\n' +
        '\n' +
        '  <h2>* -- Cloning objects with Circular references and RegExp properies\' values-- *</h2>\n\n' +
        'What could be seen from the explanations above the unCycle handler\n' +
        'could be used to get clones of an object having properties with\n' +
        'values being Circular references and Regular Expressions\n\n' +
        '      <code>clone = h.postParse( JSON.pars(JSON.stringify( h.preStringify(obj))));\n\n' +
        '// or\n\n' +
        '      clone1 = JSON.parse(JSON.stringify(obj, h.replacer.bind(h)), h.reviver.bind(h));</code>\n\n' +
        '     <h2>* --- RegExp JSON - stringify - parse  option --- *</h2>\n\n' +
        ' As you could already have noted the property re of testing object o\n' +
        ' is regular expression object and instead of this handler has worked\n' +
        ' it out successfully. Boolean property h.regStrOn is dedicated to switch\n' +
        ' on/off dependent package regStr using to stringify and parse RegExp\n' +
        ' properties of objects. Default value of h.regStrOn===true;\n' +
        ' To switch off set it to false,\n' +
        ' typical JSON behavior regarding RegExp will take place after that.\n' +
        ' regStr module(package) has analogus logic and structure like uncycle.\n' +
        'It should be preloaded appropriatly as &lt;script..&gt; library, e.g.\n' +
        '&ltscript type="text/javascript" src="regstrInBrowser.js"&gt;&lt;/script&gt;\n' +
        '(see sample html file testPage.html )\n\n' +
        ' For Details and algorithm of both packages see descriptions, comments\n' +
        'and codes.\n' +
        'click button "startTest" on test page or in browser developer console\n' +
        'type the command:\n\n' +
        '       <code>testUnCycle()</code>;\n\n' +
        'It\'s possible to play with data inside browser console and debugger\n' +
        'running the command:\n\n' +
        '       <code> testBr();</code>' +
        '\n\n' +
        
        ' <b><i>Best regards! Vladimir</i></b>\n' +
        '\n';
    console.log(txt);
    return txt;
};
