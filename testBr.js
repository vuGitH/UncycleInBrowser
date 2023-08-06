let testBr = function(){
var AAA = "AAA";
var uc = unCycle;

let ojo = ojoTest;
let oj = JSON.stringify(ojo);
let ojoPP = uc.postParse(ojo);
//let reviver = rev;
let ojoR = JSON.parse(oj,uc.reviverWork);

console.log(
    'ojoR.b[2].aa = %j\nojoR.prim.aa=%j',ojoR.b[2].aa, ojoR.prim.aa);
    
uc.reviverUser = reviver;
let ojoRR = JSON.parse(oj,uc.reviver);
console.log(
    'ojoRR.b[2].aa = %j\nojoRR.prim.aa =%j',ojoRR.b[2].aa, ojoRR.prim.aa);
console.log ('Test is close to finish');
};
