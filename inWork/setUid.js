f= ()=> {return ((o&&o.id)? o.id : ( (o&&o.im)?o.im : ""))};
f2 = (...a)=>{ [o,oid=f()]=a; return oid};

f3 = (...a)=>{
 let [o,oid=(()=> {return ((o&&o.id)? o.id : ( (o&&o.im)?o.im : ""))})()]=a;
 return oid};
 
f4 = (...a)=>{
 let [o, oid=(()=> {return ((o&&o.id)? o.id : ( (o&&o.im)?o.im : ""))})(), pUid='']=a;
 return [oid,pUid]};
 
 setUid = (...a)=>{
 let [pUid='',,o] = a;
 let [,oid=(()=> {return ((o&&o.id)? o.id : ( (o&&o.im)?o.im : ""))})(),] = a;
 let uid = pUid + "#" + oid;
 if (o) { o.uid = uid; }
 return uid};