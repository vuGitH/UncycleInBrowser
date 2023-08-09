// uncycleInBro.js
/**
 * @fileoverview  a sample of library for use in a browser
 * to load through <script> tag
 * <script type="text/javascript" src="uncycleInBro.js"></script>
 * require('uncycle').handler is the same as object unCycle.
 * @athour <Vladimir Uralov>v.url.node@gmail.com
*/
/** 
* @typedef {Object|Array} SourceO with any kinds of members
* @typedef {Object|Array} SerializableO object with all memebers 
*     serializable.
* @typedef {Object|Array} Hampered non serializable member entity
* @typedef {SerializableO|Hampered} MemberO
* @typedef {string} Uid universal identifier
* @typedef {string} Oid object identifier
* @typedef {Uid[]} Uids universal identifier
* @typedef {Array<Oid>} Oids object identifier
* @typedef {Object} StdObject is not Array
  @typedef {StdObject} NotArray synonim of StdObject
* @typedef {StdObject|Array} Val member value object or array
* @typedef {Array<Val>} Vals members' values objects and arrays
* @typedef {{
*     vals: Vals,
*     uids: Uids,
*     oids: Oids,
*     showUids: boolean,
*     uidsUndefined: boolean,
*     noDelete: boolean,
*     resetData: function():void
* }} UidsDirectory uids Directory Object
*      uid - universal identifyer:
*     in common for any object( or array) in hierarchical structure
*     uid = pUid +'#'+ oId; o=pO[oId]. where
*     o - child member(object or array) of parent object pO
*     uid - unversal identifier of o child
*     oId - child identifier
*     pUid - univeral identifier of parent object
*     Suppose Us is the top root object of whole structure(object
*     of structure itself (Universe)
*     in this case his uid is '#' )
*     We can get any structure's element by means of o=Us[uid].
*     At the same time, for arbitrary object the role of Us plays
*     the object itself relative to subobjects and subarrays being it's
*     properties (if we consider the object and it's properies who are
*     objects and/or arrays)
* @typedef {Uid} ParentUid uid of parent Object
* @typedef {object|Boolean|Date|Number|RegExp|String} Any parameter
*/
/** 
    * @typedef {string} UidPart uid's part of appropriate level
    *    without prefix "#".
    *    effectively it's a property name or element index of a
    *    memer placed on appropriate levle of SourceObj hierarchy
    * @typedef {string} EvalStr string of probable eveluation of
    *    member value
    *
    * Constructs expression (EvalStr) used to form object
    * variable literal ( could be used in eval function if any)
    * and sets appropriate object(subobject) value which should be
    * used as insertion into object as value of circular reference
    * @example
    *    
    *    uid  -     '##c#z#4'    {string}
    *                |
    *    uid parts:  # .. #c .. #z .. 4
    *    uils= [     '' , 'c' , 'z' , 4 ]    {string[]}
    *  var oo={};    |     |     |     |
    *     evStr = 'oo  ["c"] ["z"] [4]'  ='oo["c"]["z"][4]';
    *  eval(evStr)->eval( var oo={c:{z:['','','','',oo["c"]["z"][4]]}};')
    *  if you use eval. Other option to create direct variable reference
    *  exists and provides the same results - refer (see below)
    */
/** @typedef {Object} UnCycle */
/** @type {UnCycle} */
var unCycle= 
  (function (){
    return {
      /**
       * check if parameter is ordinary object and not an Array
       * @param {Any} par parameter
       * @return {Boolean} true in positive check, false otherwise
       */
      isOb: function (par) {
        return typeof par === 'object' && par !== null &&
          !(Array.isArray(par)) &&
          !(par instanceof Boolean) &&
          !(par instanceof Date) &&
          !(par instanceof Number) &&
          !(par instanceof RegExp) &&
          !(par instanceof String);
      },
      /**
       * check if parameter is an Array
       * @param {Any}par parameter
       * @return {Boolean} true in positive check, false otherwise
       */
      isAr: function (par) {
        return Array.isArray(par);},
      /**
       * Sets uid
       * @param {ParentUid=} pUid parent Uid
       * @param {Oid=} opt_oId - block id like property name or array's
       *     element's index
       * @param {Object?} o object of analysing object if it's not an array
       * @return {Uid} universal identifier
       */
      setUid: function (pUid = '', opt_oId, o) {
        var oId = (opt_oId || opt_oId === 0) ? opt_oId : 
        (()=> {return ((o&&o.id)? o.id : ( (o&&o.im)?o.im : ""))})();
        var uid = pUid + "#" + oId;
        if (o) { o.uid = uid; }
        return uid;
      },
      /**
       * uids Directory
       */
      /** @type {UidsDirectory} */
      uiDirect: {
        vals: [],
        uids: [],
        oids: [],
        showUids: false,
        uidsUndefined: false, // if true and showUids false uids are set undefined
        noDelete: false, //if true prevents delete object[prop] (=undefined instead)
        resetData: function () {
          this.vals = [];
          this.uids = [];
          this.oids = [];
          var myKeys = Object.keys(this);
          for (var ia = 0; ia < myKeys.length; ia++) {
            if (['vals', 'uids', 'oids', 'showUids', 'uidsUndefined', 'noDelete', 'resetData'].indexOf(myKeys[ia]) < 0) {
              if (this.noDelete === true) {
                this[myKeys[ia]] = undefined;
              } else {
                delete this[myKeys[ia]];
              }
            }
          }
        }
      },
      /**
       * additional method used inside addTrio ( trio - vals,uids,oids )
       * @param {Val} o - analysing object
       * @param {Uid} pUid - parent uid
       * @param {Oid} oId - object identifyer (key) o=pO[oId]
       * @param {Val} pO - parent object o=pO[oId]
       * @return {Uid} universal identifier for o
       * Explanation and parameters' propperties see
       * in addTrio and uidsVsVal
       */
      triO: function (o, pUid, oId, pO) {
        var oUid;
        var strThrow = 'strange entity. Should be or object or array';
        if (pO !== undefined && oId !== undefined) {
          if (this.isOb(pO[oId])) {
            oUid = this.setUid(pUid, oId, pO[oId]);
          } else if (this.isAr(pO[oId])) {
            oUid = this.setUid(pUid, oId);
          } else {
            throw strThrow;
          }
        } else if (pO === undefined && (oId !== undefined && oId !== '')) {
          if (this.isOb(o)) {
            oUid = this.setUid(pUid, oId, o);
          } else if (this.isAr(o)) {
            oUid = this.setUid(pUid, oId);
          } else {
            throw strThrow;
          }
        } else if (pO === undefined && (oId === undefined || oId === '')) {
          if (this.isOb(o)) {
            oUid = this.setUid(pUid, '', o);
          } else if (this.isAr(o)) {
            oUid = this.setUid(pUid, '');
          } else {
            throw strThrow;
          }
        } else {
          throw 'In triO: oId is undefined while pO is set. Bad case.';
        }

        this.uiDirect[oUid] = (pO !== undefined) ? pO[oId] : o;
        this.uiDirect.vals.push((pO !== undefined) ? pO[oId] : o);
        this.uiDirect.uids.push(oUid);
        this.uiDirect.oids.push((oId === undefined || oId === '') ? '' : oId);
        return oUid;
      },
      /**
       * adds  members' data into uids Directory ( trio - vals,uids,oids or
       * another trio - pUid, oid, oUid )
       * @param {MemberO} o - analysing object
       * @param {Uid} pUid - parent uid
       * @param {Oid} oId - object identifyer (key) o=pO[oId]
       * @param {SerializableO|Hampered} pO - parent object o=pO[oId]
       * @return {Uid} universal identifier for o
       */
      addTrio: function (o, pUid, oId, pO) {
        var oUid, ind;
        if ((this.isOb(o) || this.isAr(o)) && (o !== null)) {
          ind = (pO !== undefined) ? this.uiDirect.vals.indexOf(pO[oId]) :
            this.uiDirect.vals.indexOf(o);
          if ((pO !== undefined) && (oId !== undefined)) {
            if (ind < 0) {
              oUid = this.triO(o, pUid, oId, pO);
            } else {
              pO[oId] = this.uiDirect.uids[ind]; // reassignment to uid
            }
          } else {
            if (ind < 0) {
              oUid = this.triO(o, pUid, oId, pO);
            }
          }
        }
        return oUid;
      },
      /**
       * (previouse method name: uidsVsVals)
       * Calculates and assigns universal identifiers (uids) to
       * objects and arrays' elements being values of properties and 
       * subproperties of analysing object( or elements of analysing arrays).
       * Forms the Directory of pairs <uids> vs <values>
       * so called <uiDirect> - uids directory
       *   This method forms so called UidsDirectory object
       *   ( abbreviation - uiDirect):
       *   {UidsDirectory} unCycle.uiDirect containes
       *   {Uids} unCycle.uiDirect.uids - array of all uids
       *   {Vals} unCycle.uiDirect.vals - array of vlaues appropriate to each uid
       *   from unCycle.uiDirect.uids.
       *   Any value associated with concrete i-th uid could be got by means of
       *   value=unCycle.uiDirect[uid],   where
       *     uid=unCycle.uiDirect.uids[i] and value=unCycle.uiDirect.vals[i]
       *     i is index of arrays   0=< i < unCycle.uiDirect.vals.length;
       *     unCycle.uiDirect.vals.length === unCycle.uiDirect.uids.length
       *     order of uids corresponds to order of vals
       * @param {MemberO} o object or array being analysed
       * @param {Uid} opt_pUid universal identifyer of parent object. Optional
       * @param {Oid} opt_oId analysing object's identifyer.  Optional.
       *    
       * @param {SerializableO|Hampered} pO parent object of o object. Optional
       *     o=pO[oId] should be correct if pO and oId are set (usually oId is
       *     property name)
       * @return {void} using addTrio method
       */
      fillDirectory: function (o, opt_pUid, opt_oId, pO) {
        var pUid, oId, oUid, ip, ia;
        
        pUid = (opt_pUid || opt_pUid === 0) ? opt_pUid : 
            ((pO && pO.im)? pO.im :
             ((pO && pO.id)? pO.id :
              ((o.rim)? o.rim : '')));

        oId = (opt_oId || opt_oId === 0) ? opt_oId : 
            ((o.id)? o.id : ((o.im)? o.im : ''));

        oUid = this.addTrio(o, pUid, oId, pO);

        var oT = (!pO || oId === undefined)? o : pO[oId];

        this.fDO(oT);
        this.fDA(oT,oUid);          
      },
      /**
       * sub-method of fillDirectory to handle objects
       * @param {MemberO} o
       * @return {void}
       */
      fDO: function(o){
        if (this.isOb(o)) {
          for (ip in o) {
            if (this.isOb(o[ip]) || this.isAr(o[ip])) {
              this.fillDirectory(o[ip], o.uid, ip, o);
            }
          }
        }
      },
      /**
       * sub-method of fillDirectory to handle arrays
       * @param {MemberO} o 
       * @param {Uid} oUid
       * @return {void} 
       */
      fDA: function(o,oUid){
        if (this.isAr(o)) {
          for (ia = 0; ia < o.length; ia++) {
            if (this.isOb(o[ia]) || this.isAr(o[ia])) {
              this.fillDirectory(o[ia], oUid, ia, o);
            }
          }
        }
      },
      /**
       * Returns the references (value's address)
       * of the subproperty or the element at appropriate "depth" level 
       * assosiating with uid specified.
       * Reconstructs deep structure of input object's subobject on the bases
       * of uid and uils values.
       * If first character of uil is a 'letter'(/^([a-z]|[A-Z])/) - 
       * subproperty value is object and uil is property name of this subproperty
       * If first character of uil is a 'digit' - the subproperty is an array,
       * and the uil value is index of the element
       *  !!important equation!!:
       *  unCycle.uiDirect[uid]===unCycle.refer(uid,ojo) if
       *  unCycle.uiDirect has been got after unCycle.fillDirectory(ojo)
       *  This means that if uncycle.refer(uid,ojo)===undefined then nested
       *  property does not exist or connection between uiDirect and input
       *  object has been destroied
       * @param {Uid} uid string of uid value
       * @param {SerializableO} ojo - object of modification. Could be the
       *   result of reverse json conversion
       *   o->oj->ojo o -> json.stringify -> json.parse
       * @return {Val} uid's entity value reference(address)
       *   link , reference addres of uid entity object (i.e. value address)
       */
      refer: function (uid, ojo) {
        var uils = uid.split('#').slice(1); // uids for levels
        var oRef = ojo,
            uil,
            prefx = (ojo.id)? ojo.id : ((ojo.im)? ojo.im : '');
        if (uils[0] === prefx) { return oRef; }
        for (var il = 0; il < uils.length; il++) {
          uil = uils[il];
          oRef = this.oRefer(oRef, uil); // oRef is overassigned each step          
          // so deep penetration into ojo is carried out
        }
        return oRef;
      },
      /**
       * recursive adder of index appropriate uil and il
       * oRef at input  is top level entity reference,
       * output is next level deep top reference entity
       * @param {SerializableO} ojo
       * @param {SerializableO|Hampered} oRef 
       * @param {UidPart} uil part of uid appropriate to level il literally
       *     the name of a property
       * @param {number} il level index. Level describes the subproperty
       *     inclosure order
       * @return {SerializableO|Val} element or property serializable reference
       *     (address) to value 
       */
      oRefer: function ( oRef, uil) {
       if (/^[0-9]+$/.test(uil)) {
          return oRef[parseInt(uil, 10)];
        } else if (/^\w+/.test(uil)) {
          return oRef[uil];
        } else {
          throw 'something is going wrong';
        }
      },
      /**
       * refDAO sub-method to handle Arrays (see refDarner)
       * @param {Uid} uid uid value
       * @param {Reference| Val} oRef - structural reference 
       *     value substituting  "patch"
       * @param {Array} ojo Array
       * @param {number} iv actual index of vals element 
       *   val = uiDirect.vals[iv] uid=uiDirect.uids[iv]
       * @param {number} ip subproperty index 
       * @return{void}
       */
      rDA: function(uid, oRef, ojo, vals, ...opt){
        let [iv,ip] = opt;
        let [valRef,vls,ix] = (opt.length === 1) ?
        [vals[iv], vals, iv] : [vals[iv][ip], vals[iv], ip];      
        if (this.isAr(valRef)) {
          // val is array
          for (i = 0; i < valRef.length; i++) {
            if (!this.isAr(valRef[i]) || !this.isOb(valRef[i])) {
              if (valRef[i] === uid) {
                vls[ix][i] = oRef; 
              }
            } else {
              this.rDAO(uid, oRef, ojo, vls, ix, i);
            }
          }
        }
      },
      /**
      * refDAO sub-method to handle Objects (see refDarner)
      * @param {Uid} uid uid value
      * @param {Reference| Val} oRef - structural reference 
      *     value substituting  "patch"
      * @param {Array} ojo Array
      * @param {number} iv actual index of vals element 
      *   val = uiDirect.vals[iv] uid=uiDirect.uids[iv]
      * @param {number} ip subproperty index 
      * @return{void}
      */      
      rDO: function(uid,oRef,ojo,vals,...opt){
        let [iv,ip] = opt;
        let [valRef, vls, ix] = (opt.length === 1) ?
        [vals[iv], vals, iv] : [vals[iv][ip], vals[iv], ip];
        if (this.isOb(valRef)) {
        // val is object
        for (var i in valRef) {
          if (!this.isAr(valRef[i]) || !this.isOb(valRef[i])) {
            if (valRef[i] === uid && i !== 'uid') {
              vls[ix][i] = oRef;
            }
            if (i === 'uid' && !this.uiDirect.showUids) {
              // -- no uids
              if (this.uiDirect.uidsUndefined === true ||
                this.uiDirect.noDelete === true) {
                  valRef[i] = undefined;
                } else {
                  delete valRef[i];
                }
              }
            } else {
              this.rDAO(uid, oRef, ojo, vls, ix, i);
            }
          }
        }
      },
      /**
      * refDarner sub-method to handle Objects (see refDarner)
      * @param {Uid} uid uid value
      * @param {Reference| Val} oRef - structural reference 
      *     value substituting  "patch"
      * @param {Array} ojo Array
      * @param {number} iv actual index of vals element 
      *   val = uiDirect.vals[iv] uid=uiDirect.uids[iv]
      * @param {number} ip subproperty index 
      * @return{void}
      */ 
      rDAO: function(uid,oRef,ojo,vals,...opt){
        if( opt.length === 1){
          this.rDA(uid,oRef,ojo,vals,opt[0]);
          this.rDO(uid,oRef,ojo,vals,opt[0]);
        } else {
          this.rDA(uid,oRef,ojo,vals,opt[0],opt[1]);
          this.rDO(uid,oRef,ojo,vals,opt[0],opt[1]);
        }
      },
      /**
       * browses through ojo object's properties and subproperties
       * to replace patches by reference from array vals
       * ( unCycle.uiDirect.vals) if any
       * @param {Uid} uid uid value
       * @param {Reference| Val} oRef - structural reference to the memory
       *     location of entity specified by uid. Obtained recursively
       *     reproducting internal hierarchical structure of object 
       *     indicated in object property literal link. That reference 
       *     is used to assign or to get value for substitution of string
       *     "patch"
       * @param {SerializableO} ojo object in proccessing
       * @param {Vals } vals array of substitution
       *     objects. Here the whole array is used as a parameter but not the
       *     element approptiate to uid in
       *     <uids> vs <vals> pairs.  val appropriating to uid is val=vals[iv]
       *     Such form permits passing any changes of elements outside
       *     of method function. Change of vals provides of appropriate change
       *     of ojo object
       * @param {number} iv actual index of vals element 
       *   val = uiDirect.vals[iv] uid=uiDirect.uids[iv]
       * @param {number} ip subproperty index 
       * @return{void}
       */
      refDarner: function (uid, oRef, ojo, vals, ...opt) { 
        let [iv,ip] = opt;
        if (iv === undefined) { throw 'iv should be set obligatorily';}        
        if (ip === undefined) {
          this.rDAO(uid,oRef,ojo,vals,opt[0]);
        } else {
          this.rDAO(uid,oRef,ojo,vals,opt[0],opt[1])
        }
      },
      /**
       * circularize
       * searches for and darns (replaces) uid-like string patches
       * @param {!SerializableO} ojo object possibly parsed after serialization
       * @param {!Object} h unCycle object
       * @return {SourceO|Hampered}
       */
      circularize: function (ojo, h) {
        if (this.regStrOn) {
          // var r = require('regstr').regStr;
          var r = regStr; // regStr is global
          r.reger(ojo);
        }
        var uid, oRef;
        for (var iu = 0; iu < h.uiDirect.uids.length; iu++) {
          uid = h.uiDirect.uids[iu];
          oRef = this.refer(uid, ojo);
          for (var iv = 0; iv < h.uiDirect.vals.length; iv++) {
            this.refDarner(uid, oRef, ojo, h.uiDirect.vals, iv);
          }
        }
        return ojo;
      },
      /**
       * prepares object to stringify
       * @param {Hampered|SourceO} o - object containing circular reference
       *   needs to be stringified
       * @return {SerializableO} object to stirngify
       */
      preStringify: function (o) {

        this.uiDirect.resetData();
        this.fillDirectory(o);
        if (!this.uiDirect.showUids) {
          if (this.uiDirect.uidsUndefined) {
            this.undefineUids(this.uiDirect);
          } else {
            this.noUids(this.uiDirect);
          }
        }
        if (this.regStrOn) {
          //var r = require('regstr').regStr;
          var r = regStr;  //regStr instance
          r.streger(o);
        }
        return o;
      },
      /**
       * `replacer` to use as second parameter of
       * JSON.stringify(o,unCycle.replacer) to stringify
       * objects with circular references
       * parameters key and value is set by definition of JSON.stringify(...)
       * @param {string} key 
       * @param {SerializableO} value 
       * @returns {*}
       */
      replacerPre: function (key, value) {
        if (key === '' || key === undefined || !key && (key !== 0)) {
          // unCycle.preStringify(value);
          var uc = unCycle;
          uc.preStringify(value);         
        }
        return value;
      },
      /**
       * @type {function(string,Val):SerializableO} user reviver and replacer functions */
      replacerUser: undefined,
      reviverUser: undefined,
      /**
       * 
       * @param {string} caller 
       * @param {UnCycle} uc
       * @returns {string} 'revUser'|'revLocal'|'repUser'|repLocal'|noth'
       */
      jsonArg2: function(caller,uc) {
        let c = caller.slice(0,3);       
        if( c === "rep") {          
          try {
            rep = (uc.replacerUser && typeof uc.replacerUser === 'function') ?
              'user' : 'not';
          } catch (e) {
            if (/(\b\w+\b\s|\s)is not defined/.test(e)) {
              rep =  'not';
            } 
          }
          if (rep === 'user'){return 'user';}
          try {
            return (replacer && typeof replacer === 'function') ?
              'local' : 'not';
          } catch (e) {
            if (/(\b\w+\b\s|\s)is not defined/.test(e)) {
              return 'not';
            } 
          }
        } else if (c === 'rev') {
          try {
            rev = (uc.reviverUser && typeof uc.reviverUser === 'function') ?
              'user' : 'not';
          } catch (e) {
            if (/(\b\w+\b\s|\s)is not defined/.test(e)) {
              rev = 'not';
            }
          }
          if (rev === 'local') return 'user';
          try {
            return (reviver && typeof reviver === 'function') ?
              'local' : 'not';
          } catch (e) {
            if (/(\b\w+\b\s|\s)is not defined/.test(e)) {
              return  'not';
            }
          }

        } 
        return "not";        
      },
      /**
       * extending variant of replacer function (inside JSON.stringify(o,replacer))
       * to include typical  modification of json output string determined by
       * user  replacer(key,value) function
       * @param {string} key 
       * @param {SerializableO} value 
       * @returns {string}
       */
      replacer: function (key, value) {
        var uc = unCycle;        
        var replacerSet;
        if (key === '' || key === undefined || !key && (key !== 0)) {
          uc.preStringify(value);
        } else {
          if( uc.jsonArg2("replacer",uc) === 'user'){
            return uc.replacerUser(key, value);
          }else if(uc.jsonArg2('replacer',uc) === 'local'){
            return replacer(key, value);
          }
        }
        return value;
      },
      /**
       * extending variant of replacer function (inside JSON.stringify(o,replacer))
       * to include typical  modification of json output string determined by
       * user  replacer(key,value) function which has global scope here
       * @param {string} key 
       * @param {SerializableO} value 
       * @returns {*}
       */
      replacerWork: function (key, value) {
        var replacerSet;
        var uc = unCycle;
        if (key === '' || key === undefined || !key && (key !== 0)) {
          uc.preStringify(value);
        } else {
          try {
            replacerSet = (replacer && typeof replacer === 'function') ?
              true : false;
          } catch (e) {
            if (/(\b\w+\b\s|\s)is not defined/.test(e)) {
              replacerSet = false;
            } else {
              throw (e);
            }
          }
          if (replacerSet) {
            return replacer(key, value); // user replacer function; replacer is global here
          }
        }
        return value;
      },
      /**
       * handle object after being parsed to restore circular references
       * This method does not take into account correction providing in
       * user defined `reviver` function described in `JSON.parse` method as
       * second paramter (for this purpose use `postParse` method below)
       * @param {SerializableO} ojo object for post parse handling
       *   ojo means transformation:
       * o->preStringify(o) ->
       * -> oj=json.stringify(o)->ojo=json.parse(oj)->ojo=postParse(ojo)
       *     ojo conforms o i.e. has identical properties and internal
       *     circular references
       * @return {Hampered}
      */
      afterParse: function (ojo) {
        this.uiDirect.resetData();
        this.fillDirectory(ojo);
        this.circularize(ojo, this);
        return ojo;
      },
      /**
       * handle object after being parsed to restore circular references
       * and accounting other correction determined by user reviver function,
       *
       * @param {SerializableO} ojo object for post-parse handling
       *   ojo means transformation:
       *       o-> preStringify(o) -> o // new state of o
       *        -> oj=json.stringify(o) -> ojo=json.parse(oj)-> ojo=postParse(ojo)
       * ojo conforms o i.e. has identical properties and internal
       *   circular references
       * @return {Hampered}
       */
      postParse: function (ojo) {
        // -- console.log('postParse begins');
        this.uiDirect.resetData();
        this.fillDirectory(ojo);
        this.changeOjoVals(ojo, this.kvn);
        this.circularize(ojo, this);
        return ojo;
      },
      /**
       * new format of handling `reviver` function - which is
       * second parameter of JSON.parse(ojo,unCycle.reviver)
       * Important remark: unCycle.riviver is a `reviver` function
       * being used to restore circular refernces of output object,
       * if they do existed when object had been stringifying, and handles
       * parsed object as a whole. If there is neccessity to additioanlly
       * correct by some way separate properties of object parsed so like it's
       * presumed in description of JSON.parse(o,reviver) method
       * user could write her own `reviver` function with the same context
       * as in description.That function in it's turn will be the parameter
       * of method unCycle.filter calling during the workflow( see
       * codes ).
       * Defifinitions and logic of handling user function `reviver`
       * is determined in general in JSON.parse() documentation.
       */
      reviverWork: function (key, value) {
        var uc = unCycle; // unCycle instance
        var reviverSet;
        if (!key) {
          uc.postParse(value);
        } else {
          try {
            reviverSet = (reviver && typeof reviver === 'function') ?
              true : false;
          } catch (e) {
            if (/(\b\w+\b\s|\s)is not defined/.test(e)) {
              reviverSet = false;
            }
          }
          if (reviverSet) {
            if (uc.isOb(value) || uc.isAr(value)) {
              // return uc.filter(key,value,reviver);
              return uc.filter(key, value, reviver);
            } else {
              return reviver(key, value);
            }
          }
        }
        return value;
      },
      reviver: function (key, value) {
        var uc = unCycle;
        if (key === '' || key === undefined || !key && (key !== 0)) {
          uc.postParse(value);
        } else {
          if( uc.jsonArg2("reviver",uc) === 'user'){
            if (uc.isOb(value) || uc.isAr(value)) {
              return uc.filter(key, value, uc.reviverUser);
            } else {
              return uc.reviverUser(key, value);
            }
          }else if(uc.jsonArg2('reviver',uc) === 'local'){
            if (uc.isOb(value) || uc.isAr(value)) {
              return uc.filter(key, value, reviver);
            } else {
              return reviver(key, value);
            }
          }
        }
        return value;       
      },
      /** reviver method preserving `uid` properties of
       * subobjects of the top object handling
       * it is not used in the actual code
       */
      reviverShowUids: function (key, value) {
        var uc = unCycle;
        var reviverSet;
        if (!key) {
          uc.uiDirect.showUids = true;
          uc.postParse(value);
        } else {
          try {
            reviverSet = (uc.reviverUser !== undefined &&
                typeof uc.reviverUser === 'function') ?
              true : false;
          } catch (e) {
            if (/(\b\w+\b\s|\s)is not defined/.test(e)) {
              reviverSet = false;
            }
          }
          if (reviverSet) {
            if (uc.isOb(value) || uc.isAr(value)) {
              return uc.filter(key, value, uc.reviverUser);
            } else {
              return uc.reviverUser(key, value);
            }
          }
        }
        return value;
      },
      /** @return{Object} test object */
      getTestObj: function () {
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
        o.d = o.a;
        o.f = 'f';
        o.re = /standrdRegExp$/ig;
        o.prim = {
          a: 'a',
          ar: [12, 13]
        };
        o.aa = {
          p1: 'p1',
          p2: 2
        };

        return o;
      },
      /**
       * regarding setting parameters: 
       *       showUids, uidsUndefined, noDelete
       * - showUids - determines to show or not `uid` property of subobjects.
       *    `uid` property is used in calculation and clarifies understanding
       *    of details. But it's inserted by program and is not initial
       *    outlay so user could not see it in output. default is false.
       *    to set true use code - uncycle.uiDirect.showUids = true;
       * - uidsUndefined - this parameter is connected to showUids and 
       *    set the option not to delete uids of subobject by delete o[uid]
       *    when showUid === false but set them undefined to save processing
       *    time
       * - noDelete - this switch permits or not to delete some object's 
       *    properties or set them undefined to save processing time.
       *    noDelete works evrywhere excluding direct use of method noUids.*/
      /**
       * Deletes property named 'uid' from objects being elements of ud.vals 
       * array each element of who is a value of some property in
       * analysing object `o` for which the object `ud` has been calculated
       * @param {UidsDirectory} ud is unCycle.uiDirect object calclulated
       *     for analysing object o mentioned above
       * Important: changes in ud.vals[iv] pass to `o` object properties
       *  values by reference.
       */
      noUids: function (ud) {
        for (var iv = 0; iv < ud.vals.length; iv++) {
          if (ud.vals[iv].hasOwnProperty('uid')) {
            delete ud.vals[iv].uid;
          }
        }
      },
      /**
       * Resets uiDirect.uids array
       * instead of deleting uid property (like noUids does) it's set to undefined
       * @param {UidsDirectory} ud
       */
      undefineUids: function (ud) {
        for (var iv = 0; iv < ud.vals.length; iv++) {
          if (ud.vals[iv].uid) {
            ud.vals[iv].uid = undefined;
          }
        }
      },
      /**
       * @property @type{string}
       * link to get description and help:
       * @example
       *     unCycle=this;
       *     require(unCycle.description).t();
       *     // prints descripion into stdOut (console.log)
       */
      description: "./readme",
      /**
       * @typedef {Array<Array<Oid,Uid,Val>>} KeyValueNewValues
       *   kvn  -
       *   2d-array [[key,value,newValue]] formed in unCycle.filter method
       *   each row of wich is an array of [key,value,newValue]
       *   where key and value are input parameter of standar JSON.parse
       *   reviver( key,value ) function parameter and
       *   newValue is the value set for appropriate (key,value) pair in reviver
       *   function
       *   ojo is object already parsed
       *   Each property (key,value)  is parsed on the one by one basis.
       *
       * This means that all primitive type properties
       * presumed to be changed, set or deleted before the Last Step. 
       * Last Step - last parse cycle iteration over all properties and
       * subproperties at which `key = '' and value === ojo`,
       * where ojo - object containing properties already parsed.
       * 
       * What is to be done before the last iteration is to modify uiDirect
       * object in accordance with unCycle.kvn array  unCycle.uiDirect.
       * !!Important: kvn array should be reset by unCycle.kvnO.resetkvn()
       * or unCycle.kvn.splice(0)
       * `circularize` methos replaces patches (a patch is 
       * `ojo[somePropName]=someUid` ) by
       * values through assigning `ojo[somePropName]=uc.uiDiredt[someUid]`.
       *
       * it's possible that `ojo` has few properties whose value are =someUid
       * Among them those who are prescripted to be deleted by kvn should be
       * deleted (or setting to undefined (?) if any)
       * ( condition for that:
       * ```
       *   kvn[0]===somePropName
       *   kvn[1]===someUid
       *   kvn[2]===undefined
       * ```
       * ),
       * another ones should have their values to be set to undefined
       * Further `ud` is `uiDirect` for shortness.
       * For that properties `ud[somUid1] === someUid` and should be set
       * to `ud[someUid1] = undefined`
       * Taking into account the feature that
       * ```
       * ud[someUid1]===ojo[someKey1Parent][someKey1].value 
       * ```
       * While `ud[someUid1]` is changing it's changed 
       * `ojo[someKey1Parent][someKey1];` as well.
       * Therefore the all we need to do is to change ud[someUid1] value
       * @type {KeyValueNewValues} */
      kvn: [],
      /**
       * creates `kvn` 2d-array keyValueNewValues [[keyi,value,newValuei]]
       * determinig changes to perform with parsed object's  properties
       * each of whom is itself or an object or an array.
       * Filtering is applied inside `JSON.parse` call parsing json literal
       * string as first parameter and unCycle.reviver function as a second one
       * ( attention! unCycle.reviver and user `reviver` are different functions)
       * @param {string} key 1st parameter of `reviver` function of
       *     JSON.parse(o,reviver)
       * @param {*} value 2nd parameter of `reviver` function of 
       *     JSON.parse(o,reviver) being property's value of name key of
       * parsing object being modified after having been parsed
       * @param {function(key,value)} reviverF - user function returning object
       *     described in JSON object docs.
       *     ( unCycle.reviver and user's `reviver` are different functions)
       * @return {} always return value from input (key,value) paramters;
       */
      filter: function (key, value, reviverF) {
        var filt;
        if (this.isOb(value) || this.isAr(value)) {
          filt = reviverF(key, value);
          if (value !== filt) {
            this.kvn.push([key, value, filt]);
          } else if (value === undefined && filt === undefined) {
            this.kvn.push([key, value, undefined]);
          }
        }
        return value;
      },
      /**
       * modifies final values of parsed object properties accumulating by
       * <filter> method on the basis of user <reviver> function
       * @param {SerializableO} ojo object parsed but demanding modification
       *   taking into account `reviver` function corrections
       * @param {KeyValueNewValues} kvn - keysValsNewVs 2d-array, 
       */
      changeOjoVals: function (ojo, kvn) {
        if (!kvn || !(kvn.length && kvn.length > 0)) {
          // -- console.log('there is nothing to change no kvn');
          return;
        }
        // kvn has elements
        for (var i = 0; i < kvn.length; i++) {
          if (kvn[i][1] === kvn[i][2]) {
            continue; // keeps unchanged
          } else {
            this.modifyObjs(ojo, kvn, i);
          }
        }
        if (1) { // while debugging set 0 inside brackets
          kvn.splice(0); // kvn resetting
        }
      },
      /**
       * modifies object parsed before circularize it
       * incerts changes before last iteration over standard `reviver`
       * function `JSON.parse(ojo,reviver)` procedure
       * @param {Object} ojo object in parsing procedure which is
       *   modified by reviver function.
       * @param {Array} kvn - 2d-array [[key,value,newValue]] formed in
       *   `unCycle.filter` method
       * @param {number} ir index of kvn row should be taken to modify ojo
       * @param {boolean=} cutUiDirect
       // Замечание. Процедура учитывает не только возможность
       // уникального значения свойства, но и ситуацию, когда
       // несколько подобъектов имеют одинаковые значения.
       // Для этого организован цикл while
       * Procedure eleborates not only unique property whose value satisfies
       * selection criterion but multiple cases as well. e.g. when
       * there are few properties which value are equal to uid and therefore
       * they all should be exhanged to undefined or to newValue
       */
      modifyObjs: function (ojo, kvn, ir, cutUiDirect=false) {
        var start = 0;
        var jVal, uid;
        while (this.uiDirect.vals.indexOf(kvn[ir][1], start) >= 0) {
          // set index of value in unCycle.uiDirect.vals array,
          // the same indices have `oid` and `uid` in `.oids .uids` - arrays
          jVal = this.uiDirect.vals.indexOf(kvn[ir][1], start);
          start = jVal + 1;
          uid = this.uiDirect.uids[jVal];
          // changes subobject whose values have been assinged to uid value{string}
          this.uidValRepl(ojo, uid, kvn[ir][2], this.uiDirect);

          if (kvn[ir][2] === undefined) {
            // excludes property from parsed object and
            // console.log('we are going to delete: '+this.getEvString(uid,ojo));
            // console.log(this.refer(uid,ojo));
            // console.log('Place before deleting!!! ir=='+ir);
            var uils = uid.split('#');
            var propNm = uils[uils.length - 1]; // prop name
            var pUid = uid.replace(/#(\w|\d)+$/, ''); // parent's uid
            if (this.uiDirect.noDelete === true) {
              this.refer(pUid, ojo)[propNm] = undefined;
            } else {
              delete this.refer(pUid, ojo)[propNm];
              // delete this.refer(uid,ojo);
            }
            /*try{
              // -- console.log(this.refer(uid,ojo));
            }catch(e){
              // -- console.log('Error inside try:'+e );
            }*/
            if (cutUiDirect) {
              // !!?? надо ли удалять соответствующие свойства и массивы в uiDirect??!!
              this.uiDirect.vals.splice(jVal, 1);
              this.uiDirect.uids.splice(jVal, 1);
              this.uiDirect.oids.splice(jVal, 1);
              if (this.uiDirect.noDelete === true) {
                this.uiDirect[uid] = undefined;
              } else {
                delete this.uiDirect[uid];
              }
            }
          } else {
            // this.uiDirect[uid]=kvn[ir][2];
            // assigns new Value for appropriate property of ojo object
            // assign newValue
            if (this.isOb(this.uiDirect[uid]) && this.isOb(kvn[ir][2])) {
              // bouth are object
              for (var io in this.uiDirect[uid]) {
                if (this.uiDirect.noDelete === true) {
                  this.uiDirect[uid][io] = undefined;
                } else {
                  delete this.uiDirect[uid][io];
                }
              }
              for (var ion in kvn[ir][2]) {
                this.uiDirect[uid][ion] = kvn[ir][2][ion];
              }
            } else if (this.isAr(this.uiDirect[uid]) && this.isAr(kvn[ir][2])) {
              // bouth are arrays
              this.uiDirect[uid].splice(0, this.uiDirect[uid].length);
              for (var i = 0; i < kvn[ir][2].length; i++) {
                this.uiDirect[uid].push(kvn[ir][2][i]);
              }
            } else {
              this.uiDirect[uid] = kvn[ir][2];
              this.refer(uid, ojo) = kvn[ir][2];
              this.uiDirect.vals[this.uiDirect.uids.indexOf(uid)] = kvn[ir][2];
            }
          }
        }
      },
      /**
       * процедурa uidValRepl( ojo,uidAsVal,newVal,ud)
       * проверяет, не осталось ли  в ojo среди свойств типа object
       * и  array каких-либо свойств или элементов массивов, чьим значениям
       * присвоены строковое значение  uidAsVal (способ кодировки ссылки
       * на элемент с данным uid), равное uid-у, либо удаляемого, либо изменяемого
       *  свойства. (алгоритм поиска: в ojo ищем свойства и подсвойства === uid )
       * 1.gets uid specified - uidAsVal
       * 2. going from the end to the beginning(from the last to the first)
       * by array unCycle.uiDirect.vals which is the array of values of
       * objects and arrays properties, selects property which value===uidAsVal.
       * All nested elements of properties and their subproperties are passed
       * and checked
       *
       * if varification succeeds the uid string being the value of property
       * is exchanged by newValue or undefined depending of action( filterO.act)
       * or 'newValue' or 'delete'. Such exchange is not doing when the
       * property name  is 'uid'.
       *   newValue===kvn[2]
       * 
       * После того, как такое присвоение (либо undefined, либо newValue) будет
       * сделано, измененные таким образом подобъекты или элементы (под)массивов
       * не попадут под действие circularize.
       * !!! эти присвоения должны быть сделаны до физического удаления
       * свойств объекта( если их позволяют установки обработчика)
       * 
       * searches if some properties had been assigned to uidAsVal string value
       *  and reassigns them to newVal
       *
       * @param {Object} ojo Object parsed form json string (preliminary serialized)
       * @param {Uid} uidAsVal - uid name whose string value is searched as
       *     a value of some property or element
       * @param {Val}newVal New value or undefined
       * @param {UidsDirectory} ud unCycle.uiDirect object of unCycle object
       * @return {void}
       */
      uidValRepl: function (ojo, uidAsVal, newVal, ud) {
        for (var iv = ud.vals.length - 1; iv >= 0; iv--) {
          this.refDarner(uidAsVal, newVal, ojo, ud.vals, iv);
        }
        //console.log(ojo);
      },
      /**
       * @type {!boolean=true} regStrOn
       *   Switches on/off regstr - module inclusion.
       *   Optional. Default is true;
       *   RegExp handling algorithm (could be included in preStringify methods
       *   to handle RegExp objects being properties' values. At initial step of
       *   preStringify procedure appropriate object properties are ciphered by
       *   regStr to cipher RegExp object values into cipher pair.
       *   regStrOn  property should be set true for this.
       */
      regStrOn: true,
        
    };
  }());
/**
 * criterion to identify <circular refference>
 *
 * by processing we would have got pair of arrays
 * <uids> vs <values>  - which are set of pairs <uid> vs <value> obtained only
 * for properties who are objects or arrays. Some of them could refere to
 * another one, so called interlinked(interreference) properties.
 * Among them there are circular references- circular reference occures
 * when subproperty referes to some porperty of upper level
 * (e.g. o.a = o, or o.f.d.c = o.f or in the case of array
 * o = {a: 'a', b: [1, 2, o.b, 4]})
 *
 * <uids> contains :
 * - or uid as value of property uid of an object
 * - or oUid parameter determined for array (array can't contain uid property)
 * of entity described by pair <uid> vs <value>
 * <values> contains :
 * - or object or array with primitive types' values
 * (conditionally let's name them as array or object resolved)
 * - or compound entity with properties' or elements's value as uid-like
 * strings (something like ##c#4#...)
 * ( compound entity whose elements or properties are uids-like string)
 *
 * uid-like string as value of some element or property is
 * a mark of <circular refference>.
 *
 * The object having some propperty or subproperty( property of subobject
 * ( subobject is a property  whose value type is object) with uid-like value
 * which itself is equal to uid's value of this particular entity
 * (value of property
 * named 'uid' or value of <uid> in pair <uid> vs <val>)
 * is <circular refferenced> object
 *
 * The situation is more complicated when the object is an array
 * ( array has no uid property
 * but it has it in <uid> of <uids> vs <vals> pairs)
 * In this case we need to analyse the uid of object contained
 * this array and detect
 * when uid-like value of this array's element coinsides with uid of
 * containing array object
 * or has last digit(s) in uid-like value of some element and  the digital
 * number is equal to the index of
 * this element in array.
 * If array containing an element with uid-like value is <value> itself
 * in <uids> vs <values> pair. The comparisson of uid-like element's
 * value should be provided with <uid> value of the pair
 *
 * algorithm simply:
 * 1.we get <uid> value
 * 2 and looking for this value among values of all properties(elements)
 * and subrpoterties(subelements) (excluding ones with property name 'uid' )
 * of all <vals> including and following after <val> pairing that <uid>
 *
 * uid syntax
 *
 * # character at the beginnig of uid(RegExp pattern /^\#/)
 * is appropriate to object {...}
 * #c at the beginning of uid is appropriate to object
 * with property id( or im from I'm) value ='c' - {id:'c',...} or { im:'c',...}
 *
 * each next # in uid string is appropriate consequent property name
 * @example
 *
 *  #  means {} or [] or {...,uid:'#'}
 *  #c means {id:'c',..,uid:'#c'}  - instead of id property im (I'm)
 * could be used as well
 *  #5 means [prim0,prim1,prim2,prim3,prim4,{},..] or
 *    [prim0,prim1,prim2,prim3,prim4,[],..]
 *  ##bb means - {bb:{..},...} or {bb:[...],} property bb of object
 *     without id property
 *  #c#b means - {id:'c',b:{...,uid:#c#b},...,uid:'#c'} or
 *	{ id:'c',b:[...],uid:'#c'}
 *  #c#b#3 - {id:'c',..,b:[1,'a',{...,uid:'#c#b#3'},..],...uid:'#c'}
 *      or {id:'c',..,b:[1,'a',[...],..],...}
 *
 *  @example
 *  <uids>    vs      <values>
 *   #c            {id:'c',c:#,uid='#c' }
 *	##d           {d:'some_d',uid:##d}
 */


/**
 * reviver for primitive types properties of object parsed
 * return {undefined|value|newValue=} [value]

!!! Важное замечание !!! при преобразовании из json литерала --> JSON.pars(json)
лучше использовать вариант json с сохраненными значениями свойств uid
это дает дополнительные возможности при работе с функцией reviver, так как
значение uid  уникально и доступно внутри функции reviver(key,value) как
свойство value.uid, т.е. позволяет однозначно идентифицировать элемент при
переборе цикла parse индивидуальных элементов.
 */
/**
 * A sample of user reviver function is used for testing object handling !!
 * objTest is taken from exports.ojoTest, see below
 * common reviver function supplying by user is called from inside of
 * unCycle.reviver function which itself is used as the second parameter
 * in JSON.parse(oj,unCycle.reviver) when parcing json string oj
 */
//exports.reviver =
/** @type {function(string,*):*} */
var reviver =
  function (key, value) {
    var uc = unCycle;
    if (key === 'f' && typeof value === 'string') {
      return {
        ooo: 'ooo'
      };
    } else if (key === 'aa' && uc.isOb(value)) {
      // }else	 if( key='aa' && unCycle.isOb(value) ){
      if (value && value !== null && value.p1 && value.p2) {
        return {
          prop1: 'myNewValue1',
          prop2: [7, 8, 9]
        };
      } else {
        return value;
      }
    } else if (uc.isAr(value)) {
      if (value[0] === 12) {
        return undefined;
      }
      return value;
    } else {
      return value;
    }
  };
/** returns test object */
// exports.ojoTest = (function () {
/** @type {SerializableO} */  
var ojoTest = (function () {
  return {
    a: '#',
    b: [0, {
      id: 'inarr',
      ob: '##b'
    }, '##prim'],
    c: {
      o: {},
      o1: [0, [1,"##c"], 2],
      o3: 'o3',
      im: 'obj'
    },
    d: '#',
    f: 'f',
    re: /standrdRegExp$/gi,
    prim: {
      a: 'a',
      ar: [12, 13],
      aa: '##aa',
      b: '##b'
    },
    aa: {
      p1: 'p1',
      p2: 2
    }
  };
}());