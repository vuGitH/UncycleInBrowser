let Reconnector = (function(){
  return {
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
          this.refDarner(uid, oRef, ojo, ud.vals, iv); // replace string patches by reference
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
    /**
     * evString assembler - Forms evString using uid's part
     * @param {UidPart} uil uid's part of level il
     * @param {number} il index of uils array of uid's parts of actual level
     * @param {EvalStr} evStr start part for eval literal string
     * @return {EvalStr} string for property evaluation
     */
    evString: function ( uil, il=1, evStr='ojo', prefx = '') {
      return (uil === prefx && il === 0)? evStr :
          ((/^[0-9]+$/.test(uil))? evStr + '[' + uil + ']' :
            ((/^\w+/.test(uil) && !/^[0-9]+$/.test(uil))?  
            evStr + '["' + uil + '"]' :
            'something is going wrong in evString'));
    },
    /**
     * Reconstructs object property literal on the bases of uids values.
     * uil - part of uid of some level (see comment for evStringer method)
     * literally it is property's name of member object
     * If first character of uil is a 'letter' - it's devoted to object member.
     * if first chatacter of uil is a 'digit' - an array,
     * the value of digit is index of element of parent array
     * @param {Uid} uid string of uid value
     * @param {EvalStr=} oVL root obj variable as literal
     *   (e.g. if object variable is var obj={...prop} literal string is 'obj'.
     *   Optional.Default is 'ojo'
     * @return {EvalStr}
     */
    getEvStr: function(uid, oVL ='ojo'){
      var evStr = oVL;
      uid.split('#').slice(1).
      forEach(function(uil,il){evStr = this.evString( uil, il, evStr);}, this);
      return evStr;
    },
    /**
     * sets and darns (replaces) patches (uid strings as values)
     * @param {SerializableO} ojo object possibly parsed after serialization
     * @param {UidsDirectory} ud unCycle.uiDirect object of unCyle object
     * @param {string} oVL - see getEvString description
     * @return {SourceO|Hampered}
     */
    darn: function (ojo, ud, oVL ='ojo') {
      var oVL = oVL || 'ojo';
      var uid, evStr;
      for (var iu = 0; iu < ud.uids.length; iu++) {
        uid = ud.uids[iu];
        evStr = this.getEvStr(uid, oVL);
        let oRf = eval(evStr);
        for (var iv = iu; iv < ud.vals.length; iv++) {
          this.refDarner(uid, oRf, ojo, ud.vals, iv);
        }
      }
    },
  };
})();

