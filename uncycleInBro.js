/**
 * @fileoverview the file is a sample of conversion node.js module to
 * single object librarty to use as <script> library
 * require('uncycle').handler is the same object as var uncycle=(function{return {...unCycle Object};})
 * @athour <Vladimir Uralov>v.url.node@gmail.com
*/
// uncycle.js
//exports.handler =
var unCycle=
  (function () {
    return {
      /**
       * check if parameter is ordinary object
       * @param {} par parameter
       * @return {Boolean} true in positive check, false otherwise
       */
      isOb: function (par) {
        if (
          typeof par === 'object' && par !== null &&
          !(Array.isArray(par)) &&
          !(par instanceof Boolean) &&
          !(par instanceof Date) &&
          !(par instanceof Number) &&
          !(par instanceof RegExp) &&
          !(par instanceof String)) {
          return true;
        }
        return false;
      },
      /**
       * check if parameter is an array
       * @param {}par parameter
       * @return {Boolean} true in positive check, false otherwise
       */
      isAr: function (par) {
        if (Array.isArray(par)) {
          return true;
        }
        return false;
      },
      /**
       * Sets uid
       * @param {string} opt_parentUid
       * @param {string|number} opt_oId - block id like property name or array's
       *     element's index
       * @param {Object} opt_o object of analysing object if it's not an array
       * @return {string} universal identifier
       */
      setUid: function (opt_parentUid, opt_oId, opt_o) {
        var pUid = (opt_parentUid || opt_parentUid === 0) ? opt_parentUid : '';
        var oId = (opt_oId || opt_oId === 0) ? opt_oId : (function () {
          if (opt_o && opt_o.id) {
            return opt_o.id;
          } else if (opt_o && opt_o.im) {
            return opt_o.im;
          } else {
            return '';
          }
        }());
        var uid = pUid + "#" + oId;
        if (opt_o) {
          opt_o.uid = uid;
        }
        return uid;
      },
      /**
       * uids Directory
       */
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
       * additional methodes used inside addTrio
       * Explanation and parameters' propperties see
       * in description of addPair method and below
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
       * adds pairs into uids Directory
       * @param{Object|Arry}o - analysing object
       * @param{string}pUid - parent uid
       * @param{string}oId - object identifyer (key) o=pO[oId]
       * @param{objtct|Array}pO - parent object o=pO[oId]
       *     this method is analog to addPair and is used
       * beginning with version 0.1.4 ;
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
       * Calculates and assigns universal identifiers (uids) to
       * objects and arrays being values of properties and subproperties
       * of analysing object( or elements of analysing arrays).
       * Forms the Directory of pairs <uids> vs <values>
       * so called <uiDirect> - uids directory
       * @param {Object|Array} o object or array being analysed
       * @param {string} pUid univeral identifyer of parent object. Optional
       * @param {string} opt_oId analysing object's identifyer.  Optional.
       *     uid - universal identifyer:
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
       * @param {Object} pO parent object of o object. Optional
       *     o=pO[oId]should be correct if pO and oId are set (usually oId is
       *     property name)
       *
       *  This method forms so called uids Directory object
       *   ( abbreviation - uiDirect):
       *   {Object} unCycle.uiDirect containes
       *   {Object string[]} unCycle.uiDirect.uids - array of all uids
       *   {Object *[]} unCycle.uiDirect.vals - array of vlaues appropriate to each uid
       *   from unCycle.uiDirect.uids.
       *   Any value associated with concrete i-th uid could be got by means of
       *   value=unCycle.uiDirect[uid],   where
       *     uid=unCycle.uiDirect.uids[i] and value=unCycle.uiDirect.vals[i]
       *     i is index of arrays   0=< i < unCycle.uiDirect.vals.length;
       *     unCycle.uiDirect.vals.length === unCycle.uiDirect.uids.length
       *     order of uids corresponds to order of vals
       */
      uidsVsVals: function (o, opt_pUid, opt_oId, pO) {
        var pUid = (opt_pUid || opt_pUid === 0) ? opt_pUid : (function () {
          if (pO && pO.im) {
            return pO.im;
          } else if (pO && pO.id) {
            return pO.id;
          } else if (o.rim) {
            return o.rim;
          } else {
            return '';
          }
        }());
        var oId = (opt_oId || opt_oId === 0) ? opt_oId : (function () {
          if (o.id) {
            return o.id;
          } else if (o.im) {
            return o.im;
          } else {
            return '';
          }
        }());
        var oUid, ip, ia;
        oUid = this.addTrio(o, pUid, oId, pO); // analog of this.addPair(o,pUid,oId,pO) in versions <0.1.4

        if (!pO || oId === undefined) {
          if (this.isOb(o)) {
            for (ip in o) {
              if (this.isOb(o[ip]) || this.isAr(o[ip])) {
                this.uidsVsVals(o[ip], o.uid, ip, o);
              }
            }
          } else if (this.isAr(o)) {
            for (ia = 0; ia < o.length; ia++) {
              if (this.isOb(o[ia]) || this.isAr(o[ia])) {
                this.uidsVsVals(o[ia], oUid, ia, o);
              }
            }
          }
        } else if (pO && (oId || oId === 0)) {
          if (this.isOb(pO[oId])) {
            for (ip in pO[oId]) {
              if (this.isOb(pO[oId][ip]) || this.isAr(pO[oId][ip])) {
                this.uidsVsVals(pO[oId][ip], pO[oId].uid, ip, pO[oId]);
              }
            }
          } else if (this.isAr(pO[oId])) {
            for (ia = 0; ia < pO[oId].length; ia++) {
              if (this.isOb(pO[oId][ia]) || this.isAr(pO[oId][ia])) {
                this.uidsVsVals(pO[oId][ia], oUid, ia, pO[oId]);
              }
            }
          }
        }
      },
      /**
       * constructs expression (evalString) used to form object
       * variable literal ( could be used in eval function if any)
       * and sets appropriate object(subobject) value which should be
       * used as insertion into object as value of circular reference
       * @param {Object|Array}
       * @param {string} evalString
       * @param {string} uil - uid's part of appropriating level
       * @example
       *
       *    uid  -     '##c#z#4'    {string}
       *                |
       *    uid parts:  # .. #c .. #z .. 4
       *    uils= [     '' , 'c' , 'z' , 4 ]    {string[]}
       *  var oo={};    |     |     |     |
       *     evalStr = 'oo  ["c"] ["z"] [4]'  ='oo["c"]["z"][4]';
       *  eval(evalStr)->eval( var oo={c:{z:['','','','',oo["c"]["z"][4]]}};')
       *  if you use eval. Other option to create direct variable reference
       *  exists and provides the same results - refer (see below)
       */

      /**
       * evString assembler - Forms evString using uid's part
       * @param {Object} ojo object, probably got after sequential
       *   json transformation: o-> oj=JSON.stringify(o) -> ojo=JSON.parse(oj)
       *   in which appropriate circular reference would be inserted
       * @param {string} evalStr incrementing string for eval (literal)
       * @param {string} uil uid's part of level il
       * @param {number} il index of uils array of uid's parts of actual level
       * @return {string} string for inserting object  evaluation
       */
      evStringer: function (ojo, evalStr, uil, il) {
        var prefx;
        if (ojo.id) {
          prefx = ojo.id;
        } else if (ojo.im) {
          prefx = ojo.im;
        } else {
          prefx = '';
        }
        if (uil === prefx && il === 0) {
          return evalStr;
        } else if (/^[0-9]+$/.test(uil)) {
          return evalStr + '[' + uil + ']';
        } else if (/^\w+/.test(uil)) {
          return evalStr + '["' + uil + '"]';
        } else {
          throw 'something is going wrong in evStringer';
        }
      },
      /**
       * Reconstructs objects on the bases of uids values.
       * uil - part of uid of some level (see comment for evStringer method)
       * If first character of uil is a 'letter' - object.
       * letters content is property's name of
       * if first chatacter of uil is a 'digit' - array,
       * the value of digit is index of element
       * @param {string} uid string of uid value
       * @param {Object} ojo - object of modification. Could be the result of
       *   reverse json confersion o->oj->ojo o -> json.stringify -> json.parse
       * @param {string} opt_objVarLiteral string expressing object vareable literals
       *   (for ex. if object variable is var obj={} literal string is 'obj'. Optional.
       *   Default is 'ojo'
       */
      getEvString: function (uid, ojo, opt_objVarLiteral) {
        var objVarLiteral = opt_objVarLiteral || 'ojo';
        var uils = uid.split('#').slice(1); // uids for levels
        var evStr = objVarLiteral;
        for (var il = 0; il < uils.length; il++) {
          var uil = uils[il];
          evStr = this.evStringer(ojo, evStr, uil, il);
        }
        return evStr;
      },
      /**
       * Browses through ojo object properties and subproperties
       * to replace patches - string whose values are uids -
       * by references from array vals ( unCycle.uiDirect.vals) if any
       * @param {!string)uid uid value
       * @param {!string]evStr string to eveluate the variable expression for
       *   substitution
       * @param {Object[]| Array[]| } vals array of substitution objects.
       *   !Here the array as a whole is used as a parameter but not
       *   the element approptiate to uid in <uids> vs <vals> pairs.
       *   val appropriate to uid is val=vals[iv]
       *   Such form permits passing any changes of elements outside
       *   of method function. Change of vals provides of appropriate change
       *   of ojo object
       * @param {numer|string} iv actual index(or name) of vals element or property
       * @param {string|number} ip subproperty index or subprperty's name
       * @return {void}
       */
      darner: function (uid, evStr, ojo, vals, iv, ip) {
        if (iv === undefined || iv === '') {
          throw 'iv should be set obligatorily';
        }
        var ia;
        if (ip === undefined || ip === '') {
          if (this.isAr(vals[iv])) {
            // val is array
            for (ia = 0; ia < vals[iv].length; ia++) {
              if (!this.isAr(vals[iv][ia]) || !this.isOb(vals[iv][ia])) {
                if (vals[iv][ia] === uid) {
                  vals[iv][ia] = eval(evStr);
                }
              } else {
                this.darner(uid, evStr, ojo, vals, iv, ia);
              }
            }
          } else if (this.isOb(vals[iv])) {
            // val is object
            for (var i in vals[iv]) {
              if (!this.isAr(vals[iv][i]) || !this.isOb(vals[iv][i])) {
                if (vals[iv][i] === uid && i !== 'uid') {
                  vals[iv][i] = eval(evStr);
                }
              } else {
                this.darner(uid, evStr, ojo, vals, iv, i);
              }
            }
          }
        } else {
          if (this.isAr(vals[iv][ip])) {
            // val is array
            for (ia = 0; ia < vals[iv][ip].length; ia++) {
              if (!this.isAr(vals[iv][ip][ia]) || !this.isOb(vals[iv][ip][ia])) {
                if (vals[iv][ip][ia] === uid) {
                  vals[iv][ip][ia] = eval(evStr);
                }
              } else {
                this.darner(uid, evStr, ojo, vals[iv], ip, ia);
              }
            }
          } else if (this.isOb(vals[iv][ip])) {
            // val is object
            for (var ipp in vals[iv][ip]) {
              if (!this.isAr(vals[iv][ip][ipp]) || !this.isOb(vals[iv][ip][ipp])) {
                if (vals[iv][ip][ipp] === uid && ia !== 'uid') {
                  vals[iv][ip][ipp] = eval(evStr);
                }
              } else {
                this.darner(uid, evStr, ojo, vals[iv], ip, ipp);
              }
            }
          }
        }
      },
      /**
       * sets and darns (replaces) patches (uid strings as values)
       * @param {Object} ojo object possibly parsed after serialization
       * @param {Object} ud unCycle.uiDirect object of unCyle object
       * @param {string} opt_objVarLiteral - see getEvString description
       * return {Object}
       */
      darn: function (ojo, ud, opt_objVarLiteral) {
        var oVL = opt_objVarLiteral || 'ojo';
        var uid, evStr;
        for (var iu = 0; iu < ud.uids.length; iu++) {
          uid = ud.uids[iu];
          evStr = this.getEvString(uid, ojo, oVL);
          for (var iv = iu; iv < ud.vals.length; iv++) {
            this.darner(uid, evStr, ojo, ud.vals, iv);
          }
        }
      },
      /**
       * Forms variable invoking property or element assosiating with uid specified.
       * Reconstructs object's ojo subobject on the bases of uids values
       * If first character of uil is a 'letter' - subproperty value is object and
       * letters content is property's name of this subproperty
       * If first character of uil is a 'digit' - array,
       * and the value of digit is index of element
       * @param {string} uid string of uid value
       * @param {Object} ojo - object of modification. Could be the result of
       *   reverse json confersion o->oj->ojo o -> json.stringify -> json.parse
       *
       *  !!important equation!!: uc.uiDirect[uid]===uc.refer(uid,ojo) if
       *  uc.uiDirect has been got after uc.uidsVsVals(ojo)
       *  This means that if uc.refer(uid,ojo)===undefined than nested property
       *  does not exist or connection between uiDirect and ojo has been destroied
       */
      refer: function (uid, ojo) {
        var uils = uid.split('#').slice(1); // uids for levels
        var oRef = ojo;
        for (var il = 0; il < uils.length; il++) {
          var uil = uils[il];
          oRef = this.oRefer(ojo, oRef, uil, il);
        }
        return oRef;
      },
      /**
       * recursive adder of index appropriate uil and il
       */
      oRefer: function (ojo, oRef, uil, il) {
        var prefx;
        if (ojo.id) {
          prefx = ojo.id;
        } else if (ojo.im) {
          prefx = ojo.im;
        } else {
          prefx = '';
        }
        if (uil === prefx && il === 0) {
          return oRef;
        } else if (/^[0-9]+$/.test(uil)) {
          return oRef[parseInt(uil, 10)];
        } else if (/^\w+/.test(uil)) {
          return oRef[uil];
        } else {
          throw 'something is going wrong';
        }
      },
      /**
       * browses through ojo object's properties and subproperties
       * to replace patches by reference from array vals
       * ( unCycle.uiDirect.vals) if any
       * @param {string)uid uid value
       * @param {string]oRef - cummulative property obtained recursively
       *     to get value for substitution of string patch
       * @param {Object} ojo object in proccessing
       * @param {Array.<Object>|Array.<Array>| } vals array of substitution
       *     objects. Here the whole array is used as a parameter but not the
       *     element approptiate to uid in
       *     <uids> vs <vals> pairs.  val appropriating to uid is val=vals[iv]
       *     Such form permits passing any changes of elements outside
       *     of method function. Change of vals provides of appropriate change
       *     of ojo object
       * @param {numer|string} iv actual index of vals element or property
       * @param {string|number} ip subproperty index or subproperty's name
       * @return{void}
       */
      refDarner: function (uid, oRef, ojo, vals, iv, ip) {
        if (iv === undefined || iv === '') {
          throw 'iv should be set obligatorily';
        }
        var ia;
        if (ip === undefined || ip === '') {
          if (this.isAr(vals[iv])) {
            // val is array
            for (ia = 0; ia < vals[iv].length; ia++) {
              if (!this.isAr(vals[iv][ia]) || !this.isOb(vals[iv][ia])) {
                if (vals[iv][ia] === uid) {
                  vals[iv][ia] = oRef;
                }
              } else {
                this.refDarner(uid, oRef, ojo, vals, iv, ia);
              }
            }
          } else if (this.isOb(vals[iv])) {
            // val is object
            for (var i in vals[iv]) {
              if (!this.isAr(vals[iv][i]) || !this.isOb(vals[iv][i])) {
                if (vals[iv][i] === uid && i !== 'uid') {
                  vals[iv][i] = oRef;
                }
                if (i === 'uid' && !this.uiDirect.showUids) {
                  // -- no uids
                  if (this.uiDirect.uidsUndefined === true ||
                    this.uiDirect.noDelete === true) {
                    vals[iv][i] = undefined;
                  } else {
                    delete vals[iv][i];
                  }
                }
              } else {
                this.refDarner(uid, oRef, ojo, vals, iv, i);
              }
            }
          }
        } else {
          if (this.isAr(vals[iv][ip])) {
            // val is array
            for (ia = 0; ia < vals[iv][ip].length; ia++) {
              if (!this.isAr(vals[iv][ip][ia]) || !this.isOb(vals[iv][ip][ia])) {
                if (vals[iv][ip][ia] === uid) {
                  vals[iv][ip][ia] = oRef;
                }
              } else {
                this.refDarner(uid, oRef, ojo, vals[iv], ip, ia);
              }
            }
          } else if (this.isOb(vals[iv][ip])) {
            // val is object
            for (var ipp in vals[iv][ip]) {
              if (!this.isAr(vals[iv][ip][ipp]) || !this.isOb(vals[iv][ip][ipp])) {
                if (vals[iv][ip][ipp] === uid && ipp !== 'uid') {
                  vals[iv][ip][ipp] = oRef;
                }
                if (ipp === 'uid' && !this.uiDirect.showUids) {
                  // -- no uids
                  if (this.uiDirect.uidsUndefined === true ||
                    this.uiDirect.noDelete === true) {
                    vals[iv][ip][ipp] = undefined;
                  } else {
                    delete vals[iv][ip][ipp];
                  }
                }
              } else {
                this.refDarner(uid, oRef, ojo, vals[iv], ip, ipp);
              }
            }
          }
        }
      },
      /**
       * searches for and darns (replaces) uid-like string patches
       * @param {Object} ojo object possibly parsed after serialization
       * @param {Object} ud unCycle.uiDirect object or uids Directory
       * return {Object}
       */
      darnRef: function (ojo, ud) {
        var uid, oRef;
        for (var iu = 0; iu < ud.uids.length; iu++) {
          uid = ud.uids[iu];
          oRef = this.refer(uid, ojo); // reference
          for (var iv = iu; iv < ud.vals.length; iv++) {
            this.refDarner(uid, oRef, ojo, ud.vals, iv); // replace str-patche by reference
          }
        }
      },
      /**
       * circularize
       * searches for and darns (replaces) uid-like string patches
       * @param {!Object} ojo object possibly parsed after serialization
       * @param {!Object} h unCycle object
       * return {Object}
       */
      circularize: function (ojo, h) {
        if (this.regStrOn) {
          // var r = require('regstr').regStr;
          var r = regStr;
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
      darnRefByUid: function (ojo, uid, ud) {
        var oRef = this.refer(uid, ojo);
        var iu = ud.uids.indexOf(uid);
        for (var iv = iu; iv < ud.vals.length; iv++) {
          this.refDarner(uid, oRef, ojo, ud.vals, iv);
        }
      },
      /**
       * prepares object to stringify
       * @param{Object}o - object containing circular reference
       *   needs to be stringified
       * @return{Object} object to stirngify
       */
      preStringify: function (o) {

        this.uiDirect.resetData();
        this.uidsVsVals(o);
        if (!this.uiDirect.showUids) {
          if (this.uiDirect.uidsUndefined) {
            this.undefineUids(this.uiDirect);
          } else {
            this.noUids(this.uiDirect);
          }
        }
        if (this.regStrOn) {
          //var r = require('regstr').regStr;
          var r = regStr;
          r.streger(o);
        }
        return o;
      },
      /**
       * replacer to use as second parameter of
       * JSON.stringify(o,unCycle.replacer) to stringify
       * objects with circular references
       * parameters key and value is set by definition of JSON.stringify(...)
       */
      replacerPre: function (key, value) {
        if (key === '' || key === undefined || !key && (key !== 0)) {
          // unCycle.preStringify(value);
          this.preStringify(value);

        }
        return value;
      },
      /**
       * @type{function(key,value)} user reviver and replacer functions */
      replacerUser: undefined,
      reviverUser: undefined,
      /**
       * extending variant of replacer function (inside JSON.stringify(o,replacer))
       * to include typical  modification of json output string determined by
       * user  replacer(key,value) function
       */
      replacer: function (key, value) {
        var uc = unCycle;
        var replacerSet;
        if (key === '' || key === undefined || !key && (key !== 0)) {
          uc.preStringify(value);
        } else {
          try {
            replacerSet = (
                uc.replacerUser !== undefined &&
                typeof uc.replacerUser === 'function') ?
              true : false;
          } catch (e) {
            if (/(\b\w+\b\s|\s)is not defined/.test(e)) {
              replacerSet = false;
            } else {
              throw (e);
            }
          }
          if (replacerSet) {
            return uc.replacerUser(key, value); // user replacer function;
          }
        }
        return value;
      },
      /**
       * extending variant of replacer function (inside JSON.stringify(o,replacer))
       * to include typical  modification of json output string determined by
       * user  replacer(key,value) function
       */
      replacerWork: function (key, value) {
        var replacerSet;
        if (key === '' || key === undefined || !key && (key !== 0)) {
          this.preStringify(value);
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
            return replacer(key, value); // user replacer function;
          }
        }
        return value;
      },
      /**
       * handle object after being parsed to restore circular references
       * This method does not take into account correction providing in
       * user defined reviver function described in JSON.parse method as
       * second paramter (for this purpose use postParse method below)
       * @param {Object} ojo object for post parse handling
       *   ojo means transformation:
       * o->preStringify(o) ->
       * -> oj=json.stringify(o)->ojo=json.parse(oj)->ojo=postParse(ojo)
       *     ojo conforms o i.e. has identical properties and internal
       *     circular references
       */
      afterParse: function (ojo) {
        this.uiDirect.resetData();
        this.uidsVsVals(ojo);
        this.circularize(ojo, this);
        return ojo;
      },
      /**
       * handle object after being parsed to restore circular references
       * and accounting other correction determined by user reviver function,
       *
       * @param {Object} ojo object for post-parse handling
       *   ojo means transformation:
       *       o-> preStringify(o) -> o // new state of o
       *        -> oj=json.stringify(o) -> ojo=json.parse(oj)-> ojo=postParse(ojo)
       * ojo conforms o i.e. has identical properties and internal
       *   circular references
       */
      postParse: function (ojo) {
        // -- console.log('postParse begins');
        this.uiDirect.resetData();
        this.uidsVsVals(ojo);
        this.changeOjoVals(ojo, this.kvn);
        this.circularize(ojo, this);
        return ojo;
      },
      /**
       * new format of handling reviver function - which is
       * second parameter of JSON.parse(ojo,unCycle.reviver)
       * Important remark: unCycle.riviver is a reviver function
       * using to restore circular refernces of output object,
       * if they do existed when object had been stringifying, and handles
       * parsed object as a whole. If there is neccessity to
       * correct separate property of object parsed so like it's
       * presumed in description of JSON.parse(o,reviver) method
       * user could write her own reviver function with the same context
       * as in description.That function in it's turn will be the parameter
       * of method unCycle.filter calling during the workflow( see
       * codes ).
       * Defifinitions and logic of handling user function <reviver>
       * is determined in general in JSON.parse() documentation.
       */
      reviverWork: function (key, value) {
        var uc = this;
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
              return this.filter(key, value, reviver);
            } else {
              return reviver(key, value);
            }
          }
        }
        return value;
      },
      reviver: function (key, value) {
        var uc = unCycle;
        var reviverSet;
        if (!key) {
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
            // -- console.log('reviverUser is set');
            if (uc.isOb(value) || uc.isAr(value)) {
              // return uc.filter(key,value,reviver);
              // -- console.log('going to filter from reviver');
              return uc.filter(key, value, uc.reviverUser);
            } else {
              // -- console.log('value is not objject or array and =');
              // -- console.log('key = %s, value =%s \nretruns uc.reviverUser= %s' ,key,value,uc.reviverUser(key,value));
              return uc.reviverUser(key, value);
            }
          }
        }
        return value;
      },
      /** reviver method preserving uids properties of
       * subobjects of object handling
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
              // return uc.filter(key,value,reviver);
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
       * regarding setting parameters: showUids, uidsUndefined, noDelete
       *
       * showUids - determines to show or not uid property of subobjects
       *    uid property is used in calculation and clarifies undestending
       *    of details. But it's inserted by program and is not initial
       *    outlay so user could not see it in output. default is false.
       *    to set true use code - uncycle.uiDirect.showUids = true;
       * uidsUndefined - this parameter is connected to showUids and 
       *    set possibility not to delete uids of subobject by delete o[uid]
       *    when showUid === false but set them undefined to save processing
       *    time
       * noDelete - this switch permits or not to delete some object's 
       *    properties or set them undefined to save processing time.
       *    noDelete works evrywhere excluding direct use of method noUids.*/
      /**
       * Deletes <uid> property from objects being members of ud.vals elements
       * ud.vals is array each element of who is a value of some key in
       * analysing object o for which object ud has been calculated
       * @param {Object} ud is unCycle.uiDirect object calclulated
       *     for analysing object omentioned above
       * Important: changes in ud.vals[iv] pass to o object properties values!
       */
      noUids: function (ud) {
        for (var iv = 0; iv < ud.vals.length; iv++) {
          if (ud.vals[iv].hasOwnProperty('uid')) {
            delete ud.vals[iv].uid;
          }
        }
      },
      /**
       * instead of delete uid property (like noUids does) it's set to undefined
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
       * creates kvn 2d-array keyValueNewValues [[keyi,value,newValuei]]
       * determinig changes to perform with parsed object's  properties
       * who are itself or object or arrays.
       * Filtring is applied inside JSON.parse call parsing json literal string
       * as first parameter and unCycle.reviver function as a second one
       * ( attention! unCycle.reviver and user reviver are different functions)
       * @param {string} key parameter of reviver function of
       *   JSON.parse(o,reviver)
       * @param {*} value parameter of reviver function of JSON.parse(o,reviver)
       * being property's value of name key of parsing object modifying after
       * having been parsed
       * @param {function(key,value)} reviver - user function returning object
       *   described in JSON object docs.
       *
       * @return {} always return value from input (key,value) paramters;
       */
      filter: function (key, value, reviver) {
        // -- console.log('inside filter. key= %s, value= %s',key,value);
        var filt;
        if (this.isOb(value) || this.isAr(value)) {
          filt = reviver(key, value);
          // -- console.log(filt);
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
       * @param {Object} ojo object parsed but demanding modification
       *   taking into account reviver function corrections
       * @param {Array.<Array>} kvn - keysValsNewVs 2d-array, each row of which
       *   is an array of [key,value,newValue]
       *   where key and value are input parameters of standard JSON.parse()
       *   reviver{function(key,value)} function parameter and
       *   newValue - is the value setting for appropriate key in reviver
       *   ojo is object already parsed
       *   Each property (key,value)  is parsed on the one by one basis.
       *
       * This means that before last step (last parse cycle iteration
       * over all properties and subproperties at which
       * key = '' and value === ojo containing properties already parsed)
       * all primitive type property presumed to be changed, set or deleted
       *
       * What is to be done before last iteration is to modify uiDirect object
       * in accordance with unCycle.kvn array  unCycle. uiDirect.
       * !!Important: kvn array should be reset by unCycle.kvnO.resetkvn()
       *
       * circularize replaces patches( patch is ojo[somePropName]=someUid ) by
       * values through assigning ojo[somePropName]=uc.uiDiredt[someUid].
       *
       * it's possible that ojo has few properties whose value are =someUid
       * Among them those who are prescripted to be deleted by kvn should be
       * deleted (or setting to undefined (?) if any)
       * ( condition for that:
       *   kvn[0]===somePropName
       *   kvn[1]===someUid
       *   kvn[2]===undefined
       * )
       * ,
       * another ones should have set their values to undefined
       * Further ud is uiDirect for shortness.
       * For that properties ud[somUid1]===someUid and should be set
       * to ud[someUid1]=undefined
       * Taking into account the feature that
       * ud[someUid1]===ojo[someKey1Parent][someKey1].value While ud[someUid1]
       * is changing it's changed ojo[someKey1Parent][someKey1];
       * Therefore the all we need to do is to change ud[someUid1] value
       *
       * if ojo[somePropName] should be deleted on the bases of ud.kvn values
       * it means that
       */
      changeOjoVals: function (ojo, kvn) {
        if (!kvn || !(kvn.length && kvn.length > 0)) {
          // -- console.log('there is nothing to change no kvn');
          return;
        }
        // -- console.log('kvn has elements length= '+kvn.length);
        // kvn has elements
        for (var i = 0; i < kvn.length; i++) {
          if (kvn[i][1] === kvn[i][2]) {
            continue; // keeps unchanged
          } else {
            // -- console.log('inside changeOjoVals before modifyObjs');
            this.modifyObjs(ojo, kvn, i);
          }
        }
        if (1) { // while debugging set 0 inside brackets
          kvn.splice(0); // kvn resetting
        }
      },
      /**
       * modifies object parsed before circularize it
       * incerts changes before last iteration over standard reviver
       * function JSON.parse(ojo,reviver) procedure
       * @param {Object} ojo object in parsing procedure which is
       *   modified by reviver function.
       * @param {Array} kvn - 2d-array [[key,value,newValue]] formed in
       *   unCycle.filter method
       * @param {number} ir index of kvn row should be taking to modify ojo
       // Замечание. Процедура учитывает не только возможность
       // уникального значение свойства, но и ситуацию, когда
       // несколько подобъектов имеют одинаковые значения.
       // Для этого организован цикл while
       * Procedure eleborates not only unique property whose value satisfies
       * selection criterion but multiple cases as well. e.g. when
       * there are few properties which value are equal to uid and therefore
       * they all should be exhanged to undefined or to newValue
       */
      modifyObjs: function (ojo, kvn, ir, opt_cutUiDirect) {
        var cutUiDirect = opt_cutUiDirect || false; //
        var start = 0;
        var jVal, uid;
        while (this.uiDirect.vals.indexOf(kvn[ir][1], start) >= 0) {
          // set index of value in unCycle.uiDirect.vals array,
          // the same indices have oid and uid in .oids .uids - arrays
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
            // this.uiDirect[uid]=kvn[ir][2]; // assigns new Value for appropriate property of ojo object
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
       * После того, как такое присвоение (либо undefined, либо newValue) будет
       * сделано, измененные таким образом подобъекты или элементы (под)массивов
       * не попадут под действие circularize.
       * !!! эти присвоения должны быть сделаны до физического удаления
       * свойств объекта( если их позволяют установки обработчика)
       * searches if some properties had been assigned to uidAsVal string value
       *  and reassigns them to newVal
       *
       * @param {Object} ojo Object parsed form json string (preliminary serialized)
       * @param {string} uidAsVal - uid name whose string value is searched as
       *     a value of some property or element
       * @param {}newVal New value or undefined
       * @param {Object} ud unCycle.uiDirect object of unCycle object
       */
      uidValRepl: function (ojo, uidAsVal, newVal, ud) {
        for (var iv = ud.vals.length - 1; iv >= 0; iv--) {
          this.refDarner(uidAsVal, newVal, ojo, ud.vals, iv);
        }
        //console.log(ojo);
      },
      /**
       * @type {Array.<[key,value,newValue]>} kvn  keyValueNewValues
       *   2d-array [[key,value,newValue]] formed in unCycle.filter method
       *   each row of wich is an array of [key,value,newValue]
       *   where key and value are input parameter of standar JSON.parse
       *   reviver( key,value ) function parameter and
       *   newValue is the value set for appropriate (key,value) pair in reviver
       *   function
       */
      kvn: [],
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
var reviver =
  function (key, value) {
    if (key === 'f' && typeof value === 'string') {
      return {
        ooo: 'ooo'
      };
    } else if (key === 'aa' && this.isOb(value)) {
      // }else	 if( key='aa' && unCycle.isOb(value) ){
      if (value && value !== null && value.p1 && value.p2) {
        return {
          prop1: 'myNewValue1',
          prop2: [7, 8, 9]
        };
      } else {
        return value;
      }
    } else if (this.isAr(value)) {
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
var ojoTest = (function () {
  return {
    a: '#',
    b: [0, {
      id: 'inarr',
      ob: '##b'
    }, '##prim'],
    c: {
      o: {},
      o1: [0, [Array], 2],
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