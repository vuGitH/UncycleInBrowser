let testBr = function(){
var uc = unCycle;
// get test object with Circular references
let ot = uc.getTestObj();
let ot_pre = uc.preStringify(ot);
let otj = JSON.stringify(ot_pre);
let otj_p = JSON.parse(otj);
let otj_post = uc.postParse(otj_p);
otj_post.afterTestStep1 = 'step 1 standard work flow has finished';
console.log(otj_post.afterTestStep1);

// test replacer block
let ot1 = uc.getTestObj();
//let ot1_pre = uc.preStringify(ot);
let otj1 = JSON.stringify(ot1, uc.replacer.bind(uc));
let otj1_post = JSON.parse(otj1, uc.reviver.bind(uc));
otj1_post.afterTestStep2 = 'step 2 standard work flow has finished'
//let otj1_post = uc.postParse(otj_p);
console.log(otj1_post.afterTestStep2);

// already parsed test patched object ojo
/** @type {SerializableO} */
let ojo = ojoTest();
let oj = JSON.stringify(ojo);
let ojoPP = uc.postParse(ojo);
// standard use of JSON.parse with second parameter
// reviver function. Here uc.reviverWork is used as 
// external function
let ojoR = JSON.parse(oj, uc.reviverWork.bind(uc));



console.log(
    'ojoR.b[2].aa = ',ojoR.b[2].aa,'\nojoR.prim.aa = ', ojoR.prim.aa);
// assign unCycle.reviverUser property value to external funcrion named reviver
// stored in uncycleInBro.js as separate variable     
uc.reviverUser = reviver;
// The Usage of unCycle.reviver property after assigning uc.reviverUser
let ojoRR = JSON.parse(oj, uc.reviver.bind(uc));
console.log(
    'ojoRR.b[2].aa = ',ojoRR.b[2].aa,'\nojoRR.prim.aa = ', ojoRR.prim.aa);
console.log ('Test is close to finish');
};
