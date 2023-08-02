/**
*  Package <regStr>
* @fileoverview
* V8 and ES6 adoption of browser-adjusted uncycle_0.4.7js library.
*/
/** @typdef {String|Number|Boolean|null|undefined} AnyPrim 
* @typdef {Object|Array<>} AnyO 
* @typdef {AnyO|AnyPrim} Any
*/
//exports.regStr =
// =================================================================
// ======================                 ==========================
let regStr =  (function () {
    return {      
      nMax: 18,
      nMin: 2,
      /**
       * check if parameter is ordinary object
       * @param {}par parameter
       * @return {Boolean} true in positive check, false otherwise
       */
      isOb(par) {
        return typeof par === 'object' && par !== null &&
          !(Array.isArray(par)) &&
          !(par instanceof Boolean) &&
          !(par instanceof Date) &&
          !(par instanceof Number) &&
          !(par instanceof RegExp) &&
          !(par instanceof String);
      },
      /**
       * check if parameter is an array
       * @param {} par parameter
       * @return {Boolean} true in positive check, false otherwise
       */
      isAr: par => Array.isArray(par),
      /**
       * Returns n-digital random string preceded by 'RE' prefix.
       * @param {number=} n number of  random integer digits in string
       *   obtained by means of MatH.rndm cutting current time in
       *   milliseconds. Optional.Default =2
       * @param {boolean=} t  if true permits to use current time cutting
       *   algorithm: last n digits are cut from actual time value
       *   expressed in milliseconds for obtaining random RE+digital string.
       *   Default===false
       * @return {string} random string precede by 'RE' followed by n
       *   random digits; for ex.: 'RE0123456789'
       */
      reN(n = this.nMin, t = false) {
        let v = '';
        if (t) {
          v = new Date().getTime().toString().slice(-n);
        }
        for (let i = 0; i < n; i++) {
          v += Math.floor(Math.random() * 10);
        }
        return 'RE' + v;
      },
      /**
       * converts RegExp into string.
       * @param {RegExp|Object|any} rE regular expression object
       * @param {string=} ky - key (possible property name if (ky,rE) pair
       *   is some (key,value) pair of some property and it's value of some object
       * @return {boolean|Object} - false if rE is not a RegExp object or
       * 	      {Object} - o with properties:
       *         {string}o.c - cipher
       *         {string}o.b body
       *         {string}o.mig - reg exp flags m,g,i
       *         {string}o.v -  reg exp ciphered  as string value
       *         {string}o.ky - key value modified
       *         {function(): Object<[o.ky]:o.v>} o method returning object ob with one property
       *                    obj[o.ky]=o.v
       */
      reStr(rE, ky = '') {
        if (rE instanceof RegExp) {
          let b = rE.source;
          let mig = (rE.global ? 'g' : '') + (rE.multiline ? 'm' : '') + (rE.ignoreCase ? 'i' : ''); // mig
          let ciph = this.reN();
          return {
            c: ciph,
            b: b,
            mig: mig,
            v: b + ciph + mig,
            ky: ky + ciph,
            /**
             * @return {Object} -two properties object
             *      {key:keyString,value:valueString}
             */
            o () {
              let ob = {};
              let key = this.ky;
              ob[key] = this.v;
              return ob;
            }
          };
        } else if (ky && rE[ky] && rE[ky] instanceof RegExp) {
          rE = rE[ky];
          return this.reStr(rE, ky);
        } else {
          return false;
        }
      },
      /**
       * for RegExp or RegExp properties of input object(first parameter) returns
       * or cipher object, or array of cipher objects(or conversion object) for
       * each RegExp property adding that ciphers objects obtained as new
       * properties with ciphered keys who could be used in JSON.stringify and
       * reverse parse for those RegExps if o is not RegExp or object containing
       * RegExp properties method returns null
       * @param {RegExp|Object|Array} o RegExp or compound object or array whose
       *     properties or elements could be RegExp
       * @param {string|number} opt_i Optional. Property's name or index of
       *     o array's element in consideration
       * @param {boolean} opt_cipherMode Selects output objects' format
       *     conversion object (while false) or cipher object(when is true)
       *     Default=true;
       * @return {Object|Array Object[]|null} returns Null if input object is not
       *     RegExp and does not contain any RegExp among properties values.
       *     Otherwise return conversion(or cipher) object (for single input
       *     RegExp) or array of objects appropriate to each RegExp property.
       *     The definition of conversion object see in reStr method description.
       */
      streger(o, i ='', opt_obAr = [], ciphMode = true) {
        let obAr = (opt_obAr !== undefined) ? opt_obAr : [];
        let ob;
        if (o instanceof RegExp) {
          ob = this.reStr(o, i);
          return (function (a, b) {
            let o = {};
            o[a] = b;
            return o;
          }(ob.ky, ob.v));
        } else if (i && o[i] instanceof RegExp) {
          return this.streger(o, '', '', ciphMode);
        } else if (this.isAr(o)) {
          // array of elements some of which could be RegExp
          for (let j = 0; j < o.length; j++) {
            if (this.isOb(o[j]) || this.isAr(o[j])) {

              this.streger(o[j], undefined, obAr, ciphMode);
              continue;
            } else if (o[j] instanceof RegExp) {
              ob = this.reStr(o[j], j);
              if (ciphMode) {
                o.splice(j, 1, ob.o());
              } else {
                o.push(ob.o());
              }
              obAr.push(ob);
            }
          }
          return ciphMode ? o : obAr;
        } else if (this.isOb(o)) {
          // compound js-object
          for (let ij in o) {
            if (this.isOb(o[ij]) || this.isAr(o[ij])) {
              this.streger(o[ij], undefined, obAr, ciphMode);
              continue;
            } else if (o[ij] instanceof RegExp) {
              ob = this.reStr(o[ij], ij);
              o[ob.ky] = ob.v;
              obAr.push(ob);
              if (ciphMode) {
                delete o[ij];
              }
            }
          }
          return (ciphMode) ? o : obAr;
        } else {
          return null;
        }
      },
      /**
       * reconverts 'stringified' regStr into RegExp object, presuming
       * that regStr has been got using reStr algorithm (see above)
       * Suppose some parent object pO has property keyRe=key+RE
       * pO[keyRe]=v1ReV2=v1+RE+v2; where RE determined by pattern
       * /RE\d{N}/   N - some integer, for ex. RE='RE3455' if N=4
       * then pO[key+'RE3455']=v1+'RE3455'+v2;
       * the following single property object will be returned with
       * property name key and value new RegExp(v1,v2) -
       * {'"'+key+'"':new RegExp(v1,v2) }
       * where v1 - correct literal of regular expression without external
       * slashes (wrappers). and v2 - correct regular expression flags ( containing
       * some combination of single 'm' or 'i' or 'g')
       * @param {string} keyRe - ciphered property name
       * @param {string} v1ReV2 - ciphered value string
       * @param {nubmer=} n - number of digit in RE string of random digits
       *     used for ciphering RE parameter RE='RE'+rndm(opt_n)
       *     if RE='RE12345' n = 5. Optional. Default value is 2;
       * return {Object} {key:..value:*}
       */
      regUpN(keyRe, v1ReV2, n = this.nMin) {
        let ptt1 = new RegExp('RE\\d{' + n + '}$');
        let notGMI = /[^gmi]+/g;
        let re, k1, vs;
        if (typeof v1ReV2 === 'string') {
          if (ptt1.test(keyRe)) {
            k1 = keyRe.replace(ptt1, '');
            re = keyRe.replace(keyRe.replace(ptt1, ''), '');
            if (v1ReV2.search(re) < 0) {
              return {
                key: keyRe,
                value: v1ReV2
              };
            }
            vs = v1ReV2.split(re);
            if (notGMI.test(vs[1])) {
              throw 'incorrect values of flags';
            } else if (!this.gim(vs[1])) {
              throw 'incorrect regExp flags';
            }
            return {
              key: k1,
              value: new RegExp(vs[0], vs[1])
            };
          } else {
            return {
              key: keyRe,
              value: v1ReV2
            };
          }
        } else {
          throw 'value should be a string';
        }
      },
      /** the same as regUpN but opt_n is determined automatically
       * possible values from 1 to 20, where 20 is set in
       * regstr.nMax property
       *
       * reconverts 'stringified' reStr into RegExp object, presuming
       * that reStr has been got using reStr(ing) algorithm (see above).
       * Suppose some parent object pO has property named keyRe=key+RE
       * pO[keyRe]=v1ReV2=v1+RE+v2; where RE determined by pattern
       * /RE\d{N}/   N - integer, for ex. RE='RE3455' if N=4
       * then pO[key+'RE3455']=v1+'RE3455'+v2;
       * The following single property object will be returned with
       * property name key and value new RegExp(v1,v2) -
       * {'"'+key+'"':new RegExp(v1,v2) }
       * where v1 - correct literal of regular expression without external slashes
       *   and v2 - correct regular expression flags ( containing
       * some combination of single 'm' or 'i' or 'g')
       * @param {string} keyRe - ciphered property name
       * @param {string} v1ReV2 - ciphered value string
       * @return {Object} {key:value}
       */
      regUp(keyRe, v1ReV2) {
        let notGMI = /[^gmi]+/g;
        let re, k1, vs, nrek;
        if (typeof v1ReV2 === 'string') {
          // auto detects n and return obj with two properties (k1:{string},re:{string}}
          // or 0 if detection failed
          nrek = this.nDigs(keyRe);
          if (nrek) {
            k1 = nrek.k1;
            re = nrek.re;
            if (v1ReV2.search(re) < 0) {
              // no ciphering took place
              return {
                key: keyRe,
                value: v1ReV2
              };
            }
            vs = v1ReV2.split(re);
            if (notGMI.test(vs[1])) {
              throw 'incorrect values of flags';
            } else if (!this.gim(vs[1])) {
              throw 'incorrect regExp flags';
            } else {
              return {
                key: k1,
                value: new RegExp(vs[0], vs[1])
              };
            }
          } else {
            return {
              key: keyRe,
              value: v1ReV2
            };
          }
        } else {
          throw 'value should be a string';
        }
      },
      /**
       * returns constant describing RegExp modifiers (flags)
       * @param {RegExp}reO - RegExp object
       * @return {string} depending of regexp modifyers' values
          possible values; 'mig','ig',mi','mg','m','i','g',''
       */
      migV(reO) {
        if (reO instanceof RegExp) {
          return (reO.multiline ? 'm' : '') +
            (reO.ignoreCase ? 'i' : '') +
            (reO.global ? 'g' : ''); // mig
        } else {
          return undefined;
        }
      },
      /** reger description
       * identifies ciphered 'regexpSting' properties of the object or 
       * array's elements if any and converts them into RegExp properties or
       * elements' values changing keys into deciphered state. 
       * 
       * for input object o (or array) identifies the properties 
       * (or elements in the case of array) with string values
       * ciphered to convert-reconvert RegExp, so called "regExpString"
       * properties of the object or elements of the array
       * (
       * - for compound object: that are pairs propertyName:propertyStringValue,
       * conforming ciphering algorithm: keyRE:v1ReV2, where
       * kyeRE - string,property name, v1ReV2 - string value. The details of cipher
       * see description of method regUp;
       * - for array's case the elements are identifed being simple single property
       * object like {kyeRE:bodyREmig} which is appropriate to regular expression
       * object new RegExp(body,mig) 
       * )
       * and reconverts them back after JSON.parse )
       * 
       * Identification of such properties or elements is carried out
       * automatically.
       *
       * converts them into RegExp propperties changing keys into deciphered state.
       * For array having among elements some object containg 'cypered' (key,value)
       * pairs among propreties determins deciphered index of the property
       * If deciphered state of key for object already
       * @param {Object|Array} o object in consideration
       * @param {Object|Array} pO parent object. Optional.
       * @param {number|string} ind index or property name of object inside
       *     parent object
       * @param {Object|Array} pPO preParent of object. Optional.
       *     used in the case when o is sub-object of pO object of
       *     who has preparent being an array
       * @return {Object} converted or original object clone
       *
       * RegExp is coded in another object - cipher
       * cipher carries info regarding RegExp value and location and the state - 
       * who is itself - presuming three states:
       * 1. separate single RegExp
       * 2. RegExp as an element of array with index k
       * 3. RegExp as a value of some object's property with key(property name)
       *
       * So, cipher is single property object independently of where it is
       * located 
       * - in object as a property
       * - or in array as an element
       * - or is separate variable  
       * cipher = {keyRE: bodyREmig}.
       *        
       * So, after decode
       * 1. key is  or '' - for the case of single RegExp. In this case
       *    - it's value is assigned to the variable carring cipher or
       *    - occupies the same index element of array if cipher was array's element or 
       *    - becomes the property  value of the property carring cipher
       * @example
       * var ciph={"REddd":body+"REddd"+mig} -> key='' -> after conversion
       * ciph=new RegExp(body,mig);
       * 2. key satisfies the equation
       * /^\d+$/g.test(key)===true all charachters of key are digits
       * in this case
       *   a) If the parent of cipher was an Array than the digital key
       *   is iqual to index of element who should contain this RegExp value
       *   If parent array already has the element with the same index and value
       *   no changes are done for parent and cipher is removed.
       *   b) If the parent of cipher was Object than property is created
       *   with digital name and property equal to RegExp value. If parent object
       *   already has property with the same name and value nothing is going on,
       *   but cipher is removed
       * 3. key does not consist only of digits (typical string).
          A) if the parent of cipher was Object than key should be the name
       *   of the property whose value will be RegExp, cipher is removed.
       *   If parent object already has property with the same name and values
       *   nothing is going on, but cipher is removed
       *   B) If parent of cipher was an array. The cipher is exchanged by onother
       *   object {key:new RegExp(body,mig)}
       *
       * @typedef {string|number|undefined|null} Primitive
       * @typedef {Array<Primitive|RegExp>} RegExpArray
       * @typedef {Object<{string:Primitive}|{string:RegExp}>} RegExpObject
       * @typedef {Array<Primitive|RegExpArray|RegExpObject|Object<Primitive>|Array<Primitive>>} ArrayMix
       * @typedef {Object<{string:Primitive}|{string:RegExpArray}|RegExpObject|RegExpArray| Object<{string:Primitive}>|Array<Primitive>>} ObjectMix
       * @typedef {ObjectMix|ArrayMix|RegExp} RegExpEntity
       * 
       * 
       * @example
       * @type {Array<RegExp,RegExp,Object<string:RegExp>,RegExp>>}
       * let cloneRegExp =
       *   r.reger( JSON.parse(
       *     JSON.stringify(
       *       r.streger([/aaa/mig, /ccc/mi, {re:/asdf/g}, /fff/gmi]))));
       * 
       *  or in general
       * 
       * @type {RegExpEntity}
       * let  clone = r.reger(JSON.parse(JSON.stringify( r.streger(original))))
       * 
       * where `original instanceof RegExpEntity === true`
       *
       * @typedef {string} KeyRE 
       *     - property's key or 
       *     - variable identifier or
       *     - array element's index cipher
       * @typedef {string} V1REV2 RegExp value ciphered
       * @typedef {{KeyRE:V1REV2}} StreggedSingle
       * @typedef {Object<!StreggedSingle|StreggedSingle>} StreggedObj
       * @typedef {Array<!StreggedSingle|StreggedSingle>} StreggedArr
       * @typedef {StreggedSingle|StreggedObj|StreggedArr|
       *                       !StreggedObj|!StreggedArr} StreggedMix - 
       *     in general the object with properties' keys and values
       *     being strings i.e. being serialized simply
       * 
       * @param {StreggedMix} o object in consideration
       * @param {Object|Array} pO parent object. Optional.
       * @param {number|string} ind index or property name of object inside
       *     parent object
       * @param {Object|Array} pPO preParent of object. Optional.
       *     used in the case when o is sub-object of pO object of
       *     who has preparent being an array
       * @return {RegExpEntity} converte or original object      
       */
      reger(o, pO, ind) {
        if (this.isAr(o)) {
          return this.regerAr(o, pO, ind);
        } else if (this.isOb(o)) {
          return this.regerOb(o, pO, ind);
        }
        return o;
      },
      /**
       * reger part for Array object handling
       */
      regerAr(o) {
        // array of elements some of which could be RegExp
        for (let j = 0; j < o.length; j++) {
          if (this.isOb(o[j]) || this.isAr(o[j])) {
            this.reger(o[j], o, j);
            continue;
          }
        }
        // trail handling
        let depo = [];
        this.fillDepo(o, depo);
        // depo array sorting and incerts it's elements into pO array
        if (depo.length > 0) {
          this.fromDepoToArr(o, depo);
        }
        return o;
      },
      /**
       * reger part for Object handling
       * @param {Object}o
       */
      regerOb (o, pO, ind) {
        // compound js-object
        let testO;
        for (let ij in o) {
          if (this.isOb(o[ij]) || this.isAr(o[ij])) {
            this.reger(o[ij], o, ij);
            continue;
          } else if (typeof o[ij] === 'string') {
            testO = this.decipher(o, ij, pO, ind);
            if (testO instanceof RegExp) {
              return testO;
            }
          }
        }
        return (pO) ? pO : o;
      },
      /**
       * @typedef {Array<Array<number,RegExp>>} Depo
       * @typedef {number} ElIndex
       * @typedef {string|number} MemberName
       * @typedef {{ElIndex: {dels:Array<MemberName>}}} Deletable
       * @typedef {Array<ElIndex>} Splicable
       * 
       * fills `depo` Array appropriate to input array `o`. by array-elements
       * with information about elements prescirbed to be removed.
       * For that purpose selects elements of `o` who are object containing 
       * member(s) with RegExp value and property name consisted of digits only.
       * Creates intermediary object `deletable` storing appropriate 
       * elements' indices and memebers' property names and
       * Array `splicable` keeping elements' indices 
       * The indices of removing elements and appropriate members' RegExp
       * values are written into`depo` Array
       * <spliceable> means the element removing by meanse of splice(ind,1)
       *  
       * @param {Array} o
       * @param {Depo} depo array of two elements arrays
       * @return {void} but `depo` elements created inside are accessable
       *  in external scope.
       */
      fillDepo(o, depo) {
        /** @type {Deletable} */
        let deletable = {}; 
        /** @type {Splicable} */
        let spliceable = [];
        let k;
        for (let j = 0; j < o.length; j++) {
          if (!this.isOb(o[j])) {
            continue;
          }
          // only of elements being objects
          for (let p in o[j]) {
            // searchs for members with digital keys and RegExp value
            // to store them in depo
            if (o[j][p] instanceof RegExp) {
              if (/^\d+$/.test(p)) {
                // key consists of digits only
                k = parseInt(p, 10);
                depo.push([k, o[j][p]]);
                if (Object.keys(o[j]).length === 1) {
                  spliceable.push(j);
                } else {
                  if (!deletable.hasOwnProperty(j)) {
                    deletable[j] = {};
                  }
                  if (!deletable[j].hasOwnProperty("dels")) {
                    deletable[j].dels = [p];
                  } else {
                    deletable[j].dels.push(p);
                  }
                  // delete o[j][p];
                }
              }
            }
            // if all properties of object being j-th element of paretn array
            // are prescribed to be deleted (indicating by deletable[j].dels property)
            // element as a whole is to be removed and deletable[j] object
            //  is not neccessary.
            if (deletable[j] &&
              Object.keys(o[j]).length === deletable[j].dels.length) {
              spliceable.push(j);
              delete deletable[j];
            }
          }
        }
        this.cleaner(o, deletable, spliceable);
      },
      /**
       * removes arrays elements determined by spliceable array
       * and delete elements' objects properties determined by deletable
       * @param {Array} o
       * @param {Deletable} deletable - this object property deletaba[j] is arrays of
       *   o[j] object properties to be deleted
       * @param {Spliceable}
       */
      cleaner(o, deletable, spliceable) {
        let jj;
        for (let j = o.length - 1; j >= 0; j--) {
          if (!this.isOb(o[j])) {
            continue;
          }
          // only of elements being objects
          jj = spliceable.indexOf(j);
          if (jj > -1) {
            o.splice(spliceable[jj], 1);
            // o.splice(jj,1);
            continue;
          }
          if (deletable[j]) {
            if (deletable[j].dels.length > 0) {
              for (let jd = 0; jd < deletable[j].dels.length; jd++) {
                delete o[j][deletable[j].dels[jd]];
              }
            }
          }
        }
      },      
      /**
       * transfers depo pairs into array inserting them into appropriate
       * places (indices). When index locations of regexp values coincide
       * RegExp-s are input in array as element of parent array with that index.
       * If some pair of (key,value) are repeated no new element is added to
       * parent array.
       * @param {Array} o array
       * @param {Depo} depo - depo 2d-array
       * @return {}
       */
      fromDepoToArr(o, depo) {
        this.sortDepo(depo);
        let iin;
        for (let id = 0; id < depo.length; id++) {
          iin = depo[id][0];
          if (iin < o.length) {

            if (!Array.isArray(o[iin])) {
              // element with index iin is not array
              if (o[iin] instanceof RegExp !== true) {
                // actual element with insertion index is not RegExp
                o.splice(iin, 0, depo[id][1]);
              } else if (o[iin].source !== depo[id][1].source ||
                this.migV(o[iin]) !== this.migV(depo[id][1])) {
                // inserting place(index) is occupied by array
                // RegExp populating location index is not equivalent to new one
                // creates new array with two rE elements
                let arrToInsert = [new RegExp(o[iin].source, this.migV(o[iin])), depo[id][1]];
                o.splice(iin, 1, arrToInsert);
              }
            } else if (this.allARE(o[iin])) {
              // parent array's element is array itself and has only regExp-s
              // as members
              o[iin].push(depo[id][1]);
            }
          } else {
            o.push(depo[id][1]);
          }
        }
      },
      /** Checks if all elements of array are RegExp?
       * @param {Array} arr - array being checked
       * @return {boolean} true if answer is yes.
       */
      allARE (arr) {
        for (let v of arr) {
          if (!(v instanceof RegExp)) {
            return false;
          }
        }
        return true;
      },
      /**
       * sorts elements of depo array 
       * returns modified array (but not instanciate it)
       * @param {Depo} depo - array of arrays. Each element is
       *   an array of two elements first of  which has integer value, ascending
       *   order of  which is the rule for sorting
       * @retrun {Depo} array sorted by value of first element of arrays-elements
       */
      sortDepo(depo) {
        return depo.sort(function (a, b) {
            return parseInt(a[0]) - parseInt(b[0]);
        });        
      },
      /**
       * clones array. Creates new instance of array
       * @param {Array}ar - array instanciating
       * @return {Array} new instance of array
       */
      cloneArr(ar) {return  ar.map(e=>e);},

      /** desciphers o
       * @param {Object} o - cipher object 
       * @param {number|string} j - cipher object keyRe property name,
       *   o[j] = cipher {string} value typeof o[j] ==='string'
       * @param {Object|Array|variable} pO - cipher parent object or variable
       * @param {?number|?string|null} ind  pO[ind]=o index or property name
       *     o having in parent object
       * @return {}
       * !important: pO[ind]=o={j:bREmig} || pO=o={j:bREmig}, pO - external variable
       */
      decipher(o, j, pO, ind ){
        if (!o[j] || typeof o[j] !== 'string') {
          // cipher value should be string
          throw 'Problem ! - value of cipher object is not a string' +
            ' (should be string in the form vReV2)';
        }
        let ob = this.regUp(j, o[j]);
        if (ob.value instanceof RegExp !== true) {
          return (pO) ? pO : o;
        }
        if (!pO) {
          let oTst = this.deciph(o, j, ob);
          return (oTst !== o) ? oTst : o;
        } else {
          let oTstPO = this.deciphPO(o, j, pO, ind, ob);
          return (oTstPO !== pO) ? oTstPO : pO;
        }
      },
      /**
       * part of decipher handling cases when parent object pO is not set
       * @param {Object} o - cipher object value typeof o[j] ==='string'
       * @param {number|string} j - cipher object keyRe property name,
       *   o[j] = cipher {string} value
       * @param {Object}ob {key:'somekey',value: RegExp} ob.value is RegExp object
       * @return {Object}
       */
      deciph(o, j, ob) {
        if (!ob.key) {
          // unnamed or unindexed decipher
          if (Object.keys(o).length > 1) {
            throw 'number of properties mast not exceed 1';
          }
          return ob.value;
        } else {
          if (!o[ob.key] ||
            o[ob.key] instanceof RegExp !== true ||
            o[ob.key].source !== ob.value.source ||
            this.migV(o[ob.key]) !== this.migV(ob.value)) {
            o[ob.key] = ob.value;
          }
          delete o[j];
        }
        return o;
      },
      /**
       * part of decipher handling cases whith determined parent object pO
       * and possible opt_ind
       * All parameters see in decipher method but ob
       * @param {Object} o - cipher object value typeof o[j] ==='string'
       * @param {number|string} j - cipher object keyRe property name,
       *   o[j] = cipher {string} value
       * @param {Object|Array|variable} pO - cipher parent object or variable
       * @param {number|string} ind  pO[ind]=o index or property name of 
       *     o in parent object
       * @param {Object} ob {key:'somekey',value: RegExp} ob.value is RegExp object
       */
      deciphPO(o, j, pO, ind = undefined, ob) {
        if (this.isOb(pO)) {
          // pO is object
          if (!ob.key) {
            // unnamed or unindexed decipher
            if (Object.keys(o).length > 1) {
              throw 'Logical error. ' +
                'o should be single property object of type ' +
                'pO={..,o:{RE:vREv2},..}';
            }
            o = ob.value;
          } else {
            // parent object is object
            o[ob.key] = ob.value;
            delete o[j];
          }
        } else if (Array.isArray(pO)) {
          // pO is Array
          if (!ob.key) {
            // unnamed or unindexed decipher
            if (ind !== undefined) {
              pO[ind] = ob.value;
            } else {
              throw 'impossible abcense of index of pO element';
              // pO=ob.value;
            }
          } else {
            // ob.key is tipical string consists not only of digits
            o[ob.key] = ob.value;
            delete o[j];
          }
        } else {
          throw 'strange type of parent object. Varification is neccessary.';
        }
        return pO;
      },
      /**
       * checks if or 'i' or 'g' or 'm' encounter
       * in checking str more than one time
       * @param {string}str string
       * @return {boolean} false if repeattance is too large
       *   true is repeatance does not exceed 1
       */
      gim(str) {
        let g = 0,
          i = 0,
          m = 0;
        for (let j = 0; j < str.length; j++) {
          g += (str[j] === 'g') ? 1 : 0;
          m += (str[j] === 'm') ? 1 : 0;
          i += (str[j] === 'i') ? 1 : 0;
        }
        if (g > 1 || i > 1 || m > 1) {
          return false;
        } else {
          return true;
        }
      },
      /**
       * tests key string on have RE pattern at the end
       * at success return n,k1,re property in context of
       * regUp method
       * @param {string}key - property name
       * @retrun {number|Object} or integer 0 if testing failed
       *    or {Object}obj
       * @property {number}obj.n - number of random digits in RE detected
       * @property {string}obj.k1 - refined key (with RE subtracted)
       *    key=k1+RE
       * @property {number}obj.re - RE string value RE='RE'+rndmN,
       *   were rndmN is a string of length n where each character is a digit
       */
      nDigs(key) {
        let ptt;
        for (let ig = 1; ig <= this.nMax; ig++) {
          ptt = new RegExp('RE\\d{' + ig + '}$');
          if (ptt.test(key)) {
            return {
              n: ig,
              k1: key.replace(ptt, ''),
              re: key.replace(key.replace(ptt, ''), '')
            };
          }
        }
        return 0;
      },
      /**
       * replacer to use as seconde parameter of
       * JSON.stringify(o,h.replacer) to stringify
       * objects with circular references
       * parameters key and value is set by definition of JSON.stringify(...)
       */
      replacer(key, value) {
        if (key === '' || key === undefined || !key && (key !== 0)) {
          this.streger(value);
        }
        return value;
      },
      /**
       * reviver function to use as second parameter of
       * JSON.parse(o1,h.reviver) to parse
       * json string o1 resulted from
       * JSON.stringify(o,h.replacer)
       * parameters key and value are set in accordance with definitions
       * of JSON.parse(...). Is used for RegExp as properties of object
       * or elements of an array
       * Attention!! See comment regarding h.re... in h.replacer method
       * description.
       */
      reviver(key, value) {
        if (!key) {
          this.reger(value);
        }
        return value;
      },
      /**
       * @typedef {Object|Array|?} T
       * creates and returns clone instance of input
       * @param {T} inp input parameter to be cloning
       * @return {T}
       */
      makeClone(inp){
        if (this.isAr(inp) || this.isOb(inp)){  
          return this.reger(JSON.parse(JSON.stringify(this.streger(inp))));
        } else{ return inp;}
      // reguarding the code bellow
      // it's not give unmodified clone objects really (just shallow cloning)
        if (this.isOb(inp)){
          return Object.assign({},inp);
        }else if(this.isAr(inp)) {
          let ar=inp.slice(0);
          let ar2=inp.map( e=>e );
          let ar3=[];
          for (let i=0; i<inp.length;i++){
            let el=inp[i];
            ar3.push(el);
          }
          return ar3;
        }else{
          return inp;
        }
      },
      /** some regString for Deciphering testing */
      testRE: [
        [
          'asdfRE1234',
          'asdfRE1234mi',
          'asdfRE1234gmi',
          'asdfRE1234m',
          "^.+[\d{4}]RE7456gm"
        ],
        [
          ['k1RE1234', 'asdfRE1234'],
          ['k2RE12345', 'asdfRE12345mi'],
          ['k3RE123456', 'asdfRE123456gmi'],
          ['k4RE1234567', 'asdfRE1234567m'],
          ['k5RE745', "^.+[\d{4}]RE745gm"]
        ],
        [
          ['1RE1234', 'asdfRE1234'],
          ['2RE12345', 'asdfRE12345mi'],
          ['8RE123456', 'asdfRE123456gmi'],
          ['4RE1234567', 'asdfRE1234567m'],
          ['5RE745', "^.+[\d{4}]RE745gm"],
          ['0RE745', "^.+[\d{4}]RE745gm"]
        ]
      ],
      decipheringScheme: '\n\n' +
      '   * ---- Reconversion - deciphering scheme: ---- *\n' +
      ' Procedure varifies objects or arrays looking for "ciphered"\n' +
      ' properties or elements\n' +
      ' The Mark of \'cipher\' presence:\n' +
      ' - for Object\'s property:\n' +
      ' property name has form keyRE=key+RE,\n' +
      ' property value is string of the model: v1ReV2=v1+RE+v2,\n' +
      ' where key - is the name of RegExp property ciphered  with\n' +
      ' vlaue=new RegExp(v1,v2)\n' +
      '\n' +
      ' - for element of array - the element value is cipher object with\n' +
      ' "digital keys"( when in keyRe=key+\'RE\', key consists of digitals only).\n' +
      ' "Ciphered" means that it is a "cipher-object" or "cipher"\n' +
      ' cipher={keyRE:vReV2} coded RegExp object property\n' +
      '     {...,key:new RegExp(v1,v2),...}\n' +
      ' or single property object={keyRE:vReV2}\n' +
      '\n' +
      ' A.Ciphered properties of object;\n' +
      ' B.Element(s) of array "ciphered" in the form of single property object\n' +
      '     {keyRE:v1ReV2} or {nRe:v1Rev2} (see <Digital key practice> paragraph\n' +
      '     regarding nRe form of key;\n' +
      ' C.Variable being RegExp ciphered by means of cipher object wihtout key, i.e.\n' +
      '     Cipher without key has format {RE:vReV2}, where RE=\'RE\'+rndmN,\n' +
      '     rndmN - string of N random digits. Deciphered RegExp will be:\n' +
      '     new RegExp(v1,v2)\n',
    };
  }());

