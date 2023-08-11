# unCycle package example to use in browser 
## introduction 
 `unCycle` package provides functionality making `JSON` capable  
 to stringify and parse objects with circular references and  
 having RegExp objects as  properties.   
 (While having been loaded in a page by means of \<script\> tag  e.g.

 ```html
 <script type="text/javascript" src="uncycleInBro.js"></script>
 ```
)
see simple html page file `./testPage.html`

- `unCycle` module provides a handler making `JSON` capable  
 to stringify and parse objects 
   - with __circular references__ and  
   - having __`RegExp` objects__ as  properties.
- by product that means the capability to clone such objects   
 
 In actual package sample the handler could be invoked by :
```
      h = unCyle;
```
### variant of use 1:
```JavaScript
      o  = h.preStringify(o);     // or simply h.preStringify(o);
      oj = JSON.stringify(o);

      ojo = JSON.parse(oj);
      ojo = h.postParse(ojo);     // or simply  h.postParse(ojo);
 ```
 that's it.

### variant 2:
```JavaScript
      oj  = JSON.stringify( o, h.replacer );
      ojo = JSON.parse    ( oj, h.reviver );
```
#### Remark 1:
 Processing of original object `o` makes some changes in it.
 If stringifying is not your final goal and you need `o` for further use  
 we should remove fingerprints and leave everything _asItWas_ ( circularize
 object again).

 Method:  __`h.circularize(o, h)`__ is presumed for that purpose, i.e. :

 **v.1**
```JavaScript
      h.preStringify(o);
      oj=JSON.stringify(o);

      h.circularize(o ,h );

      ojo=JSON.parse(oj);
      h.postParse(ojo);
```
 **v.2**
```JavaScript
      oj=JSON.stringify(o,h.replacer);
      h.circularize(o,h);              // if any
      ojo=JSON.parse(oj,h.reviver);
```
#### Remark 2:
 __Variant 2__ paraphrases standard use of `JSON.stringify` and
 `JSON.parse` with two parameters, second of wich is a function permitting
 modify output in accordance with `JSON` manual.
 
 In our case such modification is related only with properties  
 being circular references. Nevertheless the initial standard ability  
 to modify handling object properties on each (key,value) bases of is  
 preserved as well. User defined replacer and reviver functions  
 in the context of `JSON.stringify` and `JSON.parse` documentation  
 should be assigned to handler methods:
```JavaScript
       h.  replacerUser=replacer;
       h.  reviverUser=reviver;
```
 where `replacer` and `reviver` are functions of two parameters
```javaScript
       reviver = function(key,value){...};
       replacer = function(key,value){...};
```
 determined by user.
 
## Cloning

Why not:
```JavaScript
   clone = h.postParse(JSON.parse(JSON.stringify(h.preStringify(o))));
   // or
   clone1 = JSON.parse(JSON.stringify(o, h.replacer), h.reviver);
```   

## tests 
To run some test open browser' dev tool and run the following test commands  
`testBr();` or `testUncycle();`.
 To varify this manually write yours or get test object and user functions  
 samples for test object as follows:
```JavaScript
  var o = h.getTestObj();
```
  where
```JavaScript
    h.getTestObj=function(){
    var o = {
             a:{},
             b:[0, {id: 'inarr', ob: {}},2],
             c:{o: {},o1: [0,[],2], o3: 'o3',im: 'obj'}
           };
      o.a = o;
      o.b[1].ob = o.b;
      o.c.o1[1].push(1,o.c);
      o.d = o.a;
      o.f = 'f';
      o.re = /standrdRegExp$/ig;
      o.prim = {a: 'a',ar: [12,13]};
      o.aa = {p1: 'p1', p2:2};

      return o;
    };


       var replacer = function(key,value){
                        return key==='f'?undefined:value;
                      };
       var reviver = require('./uncycle').reviver;
       h.  replacerUser = replacer;
       h.  reviverUser = reviver;
```
 and analyse
```JavaScript
 oj = JSON.stringify(o, h.replacer);
 h.circularize(o, h);
 ojo=JSON.parse(oj, h.reviver);
```
 Differences between these two objects are appropriate to modifications
 determined by user functions `<replacer>` and `<reviver>`.


 _Peculiar Feature_!:  
 Suppose we have ordinary object witout circular references.
 The Handler eats it without changing of codes, e.g.
```JavaScript 

      var oIn = {a: 'a', ob:{a: 'a', b: []}, arr: [1,2,3]};
```
 So, consecutive stringify and parse in one line gives:
```JavaScript
   var oOut = JSON.parse(JSON.stringify( outCirc, h.replacer), h.reviver);

 // check that oOut is
                {a :'a', ob: {a:'a', b: []}, arr: [1,2,3]} object but
      oIn === oOut ? true : false ; // returns false - another object
```
 the same result with circularize step:
```JavaScript
      oj = JSON.stringify( oIn, h.replacer);
      h.circularize( oIn , h );
      oOut = JSON.pars( oj, h.reviver );

```
### RegExp JSON - stringify - parse  option 

As you could already have noted the property `re` of testing object `o`
is regular expression object and instead of this handler has worked
it out successfully.
Dependent package __`regStr`__ is used for that purpose.  

Boolean property `h.regStrOn` is dedicated to switch
on/off dependent package `regStr` using to stringify and parse `RegExp`
properties of objects. The Default value of `h.regStrOn===true`;
To switch off set it to `false`, typical `JSON` behaviour regarding `RegExp` will take place after that.
`regStr` module(package) has analogus logic and structure like `uncycle`.


Best regards! Vladimir

## unCycle usage in browser 

[download or fork from here](https://github.com/vuGitH/UncycleInBrowser.git)  
See example of handler invocation in file `./testPage.html`
```html
        <script type="text/javascript" src="uncycleInBro.js"></script>
        <script type="text/javascript" src="uncycleInBroTest.js"></script>
        <script type="text/javascript" src="regstrInBrowser.js"></script>
        <script type="text/javascript" src="readmeUncycle.js"></script>
        <script type="text/javascript" src="manage_show.js"></script>
        <script type="text/javascript" src="testBr.js"></script>
```



## Algorithm and examples

 ** ---- unCycle module ---- **.

`unCycle` is a handler who supplies methods for:
1. ciphering and deciphering objects and arrays  with circular references and `RegExp`  
properties enabling `JSON` object to stringify and parse them back  
by means of `JSON.stringify()` and `JSON.parse()` methods and/or  

2. provides `replacer` and `reviver` functions
(second parameter of `JSON.stringify()` and `JSON.parse()` method)
to stringify and parse objects and arrays with circular references and `RegExp`
properties.


Let's take some test object o
```JavaScript
                        var o = {
                                a: {},
                                b: [0, {id: 'inarr', ob: {}}, 2],
                                c: {o: {}, o1: [0,[],2], o3: 'o3', im: 'obj'}
                                };
```
and add few internal circular referrences into it:
```JavaScript
                        o.a = o;

                        o.b[1].ob = o.b;

                        o.c.o1[1].push(1,o.c);
```

So the object is now presented in node console:

```JavaScript
{ a: [Circular],
  b: [ 0, { id: 'inarr', ob: [Circular] }, 2 ],
  c: { o: {}, o1: [ 0, [Array], 2 ], o3: 'o3', im: 'obj' } }
```

Pay attention to __'Circular'__ mark indicating presence of circular referrences


`unCycle` handler uses a concept of "universal identifiers" - `uids` -
which presumes that any hierarchycal structure - a set of objects,
sub-objects, sub-arrays, their sub-objects, and sub-arrays, as well
as their primitive properties and in general sense methods could be
represented as properties of some top  universal object `oU`
and appropriate uid - universal identifyer -
```JavaScript
             anyProp = oU[uidOfAnyProp]
```
where `uidOfAnyProp = uidOfParentOfAnyProp + anyPropId`

Concrete object is hierarchical structure as well.
Assigning `uid` to each property of object `o` presumes that
if some property has it's own `id` (for ex. property's name or a key),
it's  `uid = pUid + id`,
where `pUid` is `uid` of a parent object or array, an appropriate another
property of object o who itself is a parent object of the property in
consideration.

Now if some Entity (result of original object conformation) is object `oU`
value of any property of original object `o` could be obtained
by equation `propValue = oU[uid]`, the same on the local level `= o[id]`

It is important to note that if `o[id]` is so called local reference,
implying that `o` is parent of child `id but itself is a child of own
preparent,  `oU[uid]` could reach any sub-level of object's hierarchy.

Similarly parent object `pO = oU[pUid]`.  
For any analising object `unCycle` creates `uidsDirectory` (shortly `uiDirect`)
the Structure or that Entity object, the image or conformation
of original `o` object containing accumulative arrays and individual
properties, presenting  properties' and subproperties' `uids` and
values:

 `uiDirect` for object `o` shown above looks like this (stirngs
beginning with "#" and containing "#"-signs inside are, as one would
 have guessed, that `<uids>`):

```
{ vals:
   [ { a: '#', b: [Array], c: [Object], uid: '#' },
     [ 0, [Object], 2 ],
     { id: 'inarr', ob: '##b', uid: '##b#1' },
     { o: [Object], o1: [Array], o3: 'o3', im: 'obj', uid: '##c' },
     { uid: '##c#o' },
     [ 0, [Array], 2 ],
     [ 1, '##c' ] ],
  uids: [ '#', '##b', '##b#1', '##c', '##c#o', '##c#o1', '##c#o1#1' ],
  oids: [ '', 'b', 1, 'c', 'o', 'o1', 1 ],
  showUids: false,
  resetData: [Function: resetData],
  '#':
   { a: '#',
     b: [ 0, [Object], 2 ],
     c: { o: [Object], o1: [Array], o3: 'o3', im: 'obj', uid: '##c' },
     uid: '#' },
  '##b': [ 0, { id: 'inarr', ob: '##b', uid: '##b#1' }, 2 ],
  '##b#1': { id: 'inarr', ob: '##b', uid: '##b#1' },
  '##c':
   { o: { uid: '##c#o' },
     o1: [ 0, [Array], 2 ],
     o3: 'o3',
     im: 'obj',
     uid: '##c' },
  '##c#o': { uid: '##c#o' },
  '##c#o1': [ 0, [ 1, '##c' ], 2 ],
  '##c#o1#1': [ 1, '##c' ] }

uid : '#'
value :
{ a: '#',
  b: [ 0, { id: 'inarr', ob: '##b', uid: '##b#1' }, 2 ],
  c:
   { o: { uid: '##c#o' },
     o1: [ 0, [Array], 2 ],
     o3: 'o3',
     im: 'obj',
     uid: '##c' },
  uid: '#' }

uid : '##b'
value :
[ 0, { id: 'inarr', ob: '##b', uid: '##b#1' }, 2 ]

uid : '##b#1'
value :
{ id: 'inarr', ob: '##b', uid: '##b#1' }

uid : '##c'
value :
{ o: { uid: '##c#o' },
  o1: [ 0, [ 1, '##c' ], 2 ],
  o3: 'o3',
  im: 'obj',
  uid: '##c' }

uid : '##c#o'
value :
{ uid: '##c#o' }

uid : '##c#o1'
value :
[ 0, [ 1, '##c' ], 2 ]

uid : '##c#o1#1'
value :
[ 1, '##c' ]
```


The handler has transformed original object into the form when values
of properties being circular references are exchanged by string values of
their `uid`-s.

Actually after such transformation the object
```JavaScript
o=

{ a: '#',
  b: [ 0, { id: 'inarr', ob: '##b', uid: '##b#1' }, 2 ],
  c:
   { o: { uid: '##c#o' },
     o1: [ 0, [Array], 2 ],
     o3: 'o3',
     im: 'obj',
     uid: '##c' },
  uid: '#' }
```

As you can see there are no any `Circulars` in it.

Nevertheless when it is necessary handler could circularize it back
using method `unCycle.circularize(o,unCycle);`

Look, this is our original object after back "circularization"
```
o=
{ a: [Circular],
  b: [ 0, { id: 'inarr', ob: [Circular] }, 2 ],
  c: { o: {}, o1: [ 0, [Array], 2 ], o3: 'o3', im: 'obj' } }
```

All Circular at their original sites.

Before continuing, let's dwell on the `uid` details and the formalism utilized.  

  in common for any object( or array) in hierarchical structure
```  
  uid = pUid +'#'+ id;
  pO = oU[pUid];
  o = pO[id]  and   o = oU[uid]
  o - child member(object or array) of parent object pO
  uid - unversal identifier of o child
  id - child identifier
  pUid - universal identifier of parent object
  oU - is the top root object of whole structure( uidsDirectory or uiDirect)
```  
We can get any structure's element by means of `o=oU[uid]`  
`unCycle` instanciates such `oU` naming it `uidsDirectory` or `uiDirect`

###  Idea of uid format and parts:
      - each sub-level of structure is symbolized by "#"sign
        so   uid = parentUid + "#" + id;
      - id of some property is alfanumerical
      - id of array's element is it's index - digital

  the following draw explains uid-s format
```
   uid   -    '##c#z#4'    {string}
               |
   uid parts:  # .. #c .. #z ..#4
   uils= [     '' , 'c' , 'z' , 4 ]    {string[]}
 var oo={}     |     |     |    |
    evalStr = 'oo  ["c"] ["z"] [4]'  ='oo["c"]["z"][4]';
 eval(evalStr) -> eval( 'var oo={c:{z:["","","","",oo["c"]["z"][4]]}};')
 (eval never used inside unCycle it's mentioned imaginaryly)
```
__`unCycle.refer()`__ methods returns variable reference using uid value


 `uiDirect` object preserves original object properties values permitting
 to manipulate with object during convertions and reconversions

```
  o -> ojo  transformation:

  o -> preStringify(o) -> o // new state of o (the same object o===newStateOfO)
      ->  oj = json.stringify(o) ->
      ->  ojo = json.parse(oj)
      ->  ojo = postParse(ojo) // final "circularized" object
                               // equivalent to initial one
```
 `ojo` conforms `o` i.e. has identical properties and internal circular
 references


As we have seen above the handler method
```JavaScript
            unCycle.preStringify(o);
```
transformes original object into the form where values  
of properties being circular references are exchanged by string values of  
their `uid`-s, the form easyly serializable by `JSON.stringify()`.

Another method  -
```
           unCycle.postParse(ojo);
```
using as input parameter object `ojo` returned by
 `JSON.parse(oj)`, where `oj` is `json` string got from converted object `o` by
```
           oj=JSON.stringify(o);
```
transforms `ojo` object into the original "circularized" form.

Now let's consider another case of another test object
```
o=
{ a: [Circular],
  b: [ 0, { id: 'inarr', ob: [Circular] }, 2 ],
  c: { o: {}, o1: [ 0, [Array], 2 ], o3: 'o3', im: 'obj' } }
```
The property `unCycle.replacer` provides replacer function which  
could be used as second parameter of `JSON.stringify(o,replacer)` method  
to stringify the circular object directly by means of `JSON.stringify()`
```
           var oj=JSON.stringify(o,unCycle.replacer);
```
and returns json string
```JavaScript
oj='

{
 "a": "#",
 "b": [
  0,
  {
   "id": "inarr",
   "ob": "##b"
  },
  2
 ],
 "c": {
  "o": {},
  "o1": [
   0,
   [
    1,
    "##c"
   ],
   2
  ],
  "o3": "o3",
  "im": "obj"
 }
}
'
```
For some future reasons we could leave object `o` in "circularized"  
form, using code:  `unCycle.circularize(o,unCycle) =`

```
{ a: [Circular],
  b: [ 0, { id: 'inarr', ob: [Circular] }, 2 ],
  c: { o: {}, o1: [ 0, [Array], 2 ], o3: 'o3', im: 'obj' } }
```
With mediation of `unCycle` handler json string `oj`  
obtained after serialisation of object with circular references  
could be parsed into object equivalent to original one  
similarly in two optional ways:
 - using method `unCycle.postParse(o1)` after `o1=JSON.parse(oj)` or  
 - using reviver function provided by method `unCycle.reviver` permiting parse `oj`
directly using `JSON.parse` with second parameter reviver
```
          var o1 = JSON.parse(oj,reviver);
```
where riviver function is obtained from the property `unCycle.reviver`:
```
          reviver = unCycle.reviver;
```
So, after parsing we get new object `o1=`
```
{ a: [Circular],
  b: [ 0, { id: 'inarr', ob: [Circular] }, 2 ],
  c: { o: {}, o1: [ 0, [Array], 2 ], o3: 'o3', im: 'obj' } }
```
Or each property separately:

```
"a" :
{ a: [Circular],
  b: [ 0, { id: 'inarr', ob: [Circular] }, 2 ],
  c: { o: {}, o1: [ 0, [Array], 2 ], o3: 'o3', im: 'obj' } }

"b" :
[ 0, { id: 'inarr', ob: [Circular] }, 2 ]

"c" :
{ o: {}, o1: [ 0, [ 1, [Circular] ], 2 ], o3: 'o3', im: 'obj' }
```
fully equivalent to original circular object.


Files `readme.js` or `readme.txt` repeat main things __in compact form__:



## Addendum 
 criterion to identify __circular refference__

 by processing we would have got pair of arrays
 `<uids>` vs `<values>`  - which are set of pairs `<uid>` vs `<value>` obtained
 only for properties who are or `objects` or `arrays`. Some of them could refere
 to another one, so called interlinked(interreference) properties.
 
 Among them there are circular references - circular reference occures
 when subproperty referes to some porperty of upper level
 (e.g. `o.a = o`, or `o.f.d.c = o.f` or in the case of array  
 `o = {a: 'a', b: [1, 2, o.b, 4]})`

 `<uids>` contains :
 - or `uid` as value of property `uid` of an object
 - or `oUid` parameter determined for array (array can't contain `uid`
       property) of entity described by pair `<uid>` vs `<value>`

 `<values>` contains :
 - or object or array with primitive types' values
 (conditionally let's name them as array or object resolved)
 - or compound entity with properties' or elements's value as uid-like
 strings (something like `##c#4#...`)
 ( compound entity whose elements or properties are `uids-like string)

 `uid-like` string as value of some element or property is
 a mark of `<circular refference>`.

 The object having some property or subproperty( property of subobject
 ( subobject is a property  whose value `Type` is `Object`) with
 `uid-like` value which itself is equal to `uid`'s value of this particular
 entity (value of property named `'uid'` or
 value of `<uid>` in pair `<uid>` vs `<val>`)
 is `<circular refferenced>` object

 The situation is more complicated when the object is an array
 ( array has no `uid` property  
 but it has it in `<uid>` of `<uids> vs <vals>` pairs).
 
 In this case we need to analyse the `uid` of object contained
 this array and detect
 when `uid-like` value of this array's element coinsides with `uid` of
 containing array object
 or has last digit(s) in `uid-like` value of some element and  the digital
 number is equal to the index of
 this element in array.  
 If array containing an element with `uid-like` value is `<value>` itself
 in `<uids> vs <values>` pair. The comparisson of `uid-like` element's
 value should be provided with `<uid>` value of the pair

### algorithm simply:
 1. we get `uid` value
 2. and looking for this value among values of all properties(elements)
 and subrpoterties(subelements) (excluding ones with property
 name `'uid'` )
 of all `<vals>` including and following after `<val>` pairing that `<uid>`

### uid syntax

 `#` character at the beginnig of uid( `RegExp` pattern `/^#/`)
 is appropriate to object `{...}`
 `#c` at the beginning of `uid` is appropriate to object
 with property `id`( or `im` from I'm) value ='c' - `{id:'c',...} or { im:'c',...}`

 each next `#` in `uid` string is appropriate consequent property name
 for example
```
  #  means {} or [] or {...,uid:'#'}
  #c means {id:'c',..,uid:'#c'}  - instead of id property im (I'm)
      could be used as well
  #5 means [prim0,prim1,prim2,prim3,prim4,{},..] or
      [prim0,prim1,prim2,prim3,prim4,[],..]
  ##bb means - {bb:{..},...} or {bb:[...],} property bb of object
      without id property
  #c#b means - {id:'c',b: {...,uid: '#c#b'},...,uid:'#c'} or
             { id:'c',b:[...],uid:'#c'}
  #c#b#3 -
      {id:'c',.., b: [1, 'a', {...,uid:'#c#b#3'},..],
 ...uid:'#c'}
      or {id:'c',..,b:[1,'a',[...],..],...}

  <uids>      vs      <values>
   '#c'            {id: 'c', c: '#', uid:'#c'}
          '##d'           {d: 'some_d', uid: '##d'}

```
## You are welcome!  
Vladimir Uralov  
v.url.node@gmail.com
