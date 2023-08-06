let Reconnector = (function(){
    return {

    refDarnArr:function(subRef,uid,oRef,ojo,valRef,ip){
      // val is array
      for (ia = 0; ia < subRef.length; ia++) {
        let child = subRef[ia];
        if (!this.isAr(child) || !this.isOb(child)) {
          if (child === uid) {
            child = oRef;
          }
        } else {
          this.refDarner(uid, oRef, ojo, valRef, ip, ia);
        }
      }
    },
    refDarnObj:function(subRef,uid,oRef,ojo,valRef,ip){
      // val is object
      for (var ipp in subRef) {
        let child = subRef[ipp];
        if (!this.isAr(child) || !this.isOb(child)) {
          if (child === uid && ipp !== 'uid') {
            child = oRef;
          }
          if (ipp === 'uid' && !this.uiDirect.showUids) {
            // -- no uids
            if (this.uiDirect.uidsUndefined === true ||
              this.uiDirect.noDelete === true) {
              child = undefined;
            } else {
              delete child;
            }
          }
        } else {
          this.refDarner(uid, oRef, ojo, valRef, ip, ipp);
        }
      }
    },
    reconnector: function(subRef,uid,oRef,ojo,valRef,ip){
      if (this.isAr(subRef)) {
        this.refDarnArr(subRef,uid,oRef,ojo,valRef,ip);
      } else if (this.isOb(subRef)) {
        this.refDarnObj(subRef,uid,oRef,ojo,valRef,ip);
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
    refDarner_: function (uid, oRef, ojo, vals, iv, ip) {
      if (iv === undefined || iv === '') {
        throw 'iv should be set obligatorily';
      }
      var valRef, subRef;
      valRef = vals[iv];
      if (ip === undefined || ip === '') {
        this.reconnector(valRef,uid,oRef,ojo,vals,iv);
      } else {
        subRef = valRef[ip];
        this.reconnector(subRef,uid,oRef,ojo,valRef,ip);
      }
    },
    /**
     * searches for and darns (replaces) uid-like string patches
     * @param {SerializableO} ojo object possibly parsed after serialization
     * @param {UidsDirectory} ud unCycle.uiDirect object or uids Directory
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
     * 
     * @param {SerializableO} ojo 
     * @param {Uid} uid 
     * @param {UidsDirectory} ud
     * @return {void}
     */
    darnRefByUid: function (ojo, uid, ud) {
        var oRef = this.refer(uid, ojo);
        var iu = ud.uids.indexOf(uid);
        for (var iv = iu; iv < ud.vals.length; iv++) {
          this.refDarner(uid, oRef, ojo, ud.vals, iv);
        }
    },
  };
})();
let Darn = (function(){
    return {
   /** 
    * @typedef {string} UidPart uid's part of appropriate level
    *    withour prefix "#".
    *    effectively it's a property name or element index of a
    *    memer placed on appropriate levle of SourceObj hierarchy
    * @typedef {string} EvalString string of probable eveluation of
    *    member value
    *
    * Constructs expression (evalString) used to form object
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
    *     evalStr = 'oo  ["c"] ["z"] [4]'  ='oo["c"]["z"][4]';
    *  eval(evalStr)->eval( var oo={c:{z:['','','','',oo["c"]["z"][4]]}};')
    *  if you use eval. Other option to create direct variable reference
    *  exists and provides the same results - refer (see below)
    */
    /**
     * evString assembler - Forms evString using uid's part
     * @param {SerializableO} ojo object, probably got after sequential
     *   json transformation: o-> oj=JSON.stringify(o) -> ojo=JSON.parse(oj)
     *   in which appropriate circular reference would be inserted
     * @param {EvalString} evalStr incrementing string for eval (literal)
     * @param {UidPart} uil uid's part of level il
     * @param {number} il index of uils array of uid's parts of actual level
     * @return {EvalString} string for inserting object  evaluation
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
      } else if (/^\w+/.test(uil) && !/^[0-9]+$/.test(uil)) {
        return evalStr + '["' + uil + '"]';
      } else {
        throw 'something is going wrong in evStringer';
      }
    },
    /**
     * Reconstructs objects on the bases of uids values.
     * uil - part of uid of some level (see comment for evStringer method)
     * If first character of uil is a 'letter' - object.
     * letters content (member's value) is property's name of member object
     * if first chatacter of uil is a 'digit' - array,
     * the value of digit is index of element of parent array
     * @param {Uid} uid string of uid value
     * @param {SerializableO} ojo - object of modification. Could be the result of
     *   reverse json conversion o->oj->ojo o -> json.stringify -> json.parse
     * @param {string} opt_objVarLiteral string expressing object variable literals
     *   (for ex. if object variable is var obj={} literal string is 'obj'. Optional.
     *   Default is 'ojo'
     * @return {EvalString}
     */
    getEvString: function (uid, ojo, opt_objVarLiteral) {
      var objVarLiteral = opt_objVarLiteral || 'ojo';
      var uils = uid.split('#').slice(1); // uids for levels
      /** @type {EvalString} */
      var evStr = objVarLiteral;
      for (var il = 0; il < uils.length; il++) {
        var uil = uils[il];
        evStr = this.evStringer(ojo, evStr, uil, il);
      }
      return evStr;
    },
    /**
     * Browses through ojo object properties and subproperties
     * to replace `patches` - strings whose values are uids -
     * by references from array vals ( unCycle.uiDirect.vals) if any
     * @param {!Uid} uid uid value
     * @param {!EvalString} evStr string to eveluate the variable expression for
     *   substitution
     * @param {SerializableO} ojo - object of modification. Could be the result of
     *   reverse json conversion o->oj->ojo o -> json.stringify -> json.parse
     * @param {Vals} vals array of substitution objects.
     *   !Here the array as a whole is used as a parameter but not
     *   the element approptiate to uid in <uids> vs <vals> pairs.
     *   val appropriate to uid is val=vals[iv]
     *   Such form permits passing any changes of elements outside
     *   of method function. Change of vals provides of appropriate change
     *   of ojo object
     * @param {number|string} iv actual index of vals element
     * @param {string|number} ip sub-array element index or subprperty's name
     * @return {void}
     */
    darner: function (uid, evStr, ojo, vals, iv, ip) {
      if (!iv === undefined || iv === '') {
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
     * @param {SerializableO} ojo object possibly parsed after serialization
     * @param {UidsDirectory} ud unCycle.uiDirect object of unCyle object
     * @param {string} opt_objVarLiteral - see getEvString description
     * @return {SourceO|Hampered}
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
  };
})():