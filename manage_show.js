// JavaScript source code
/**
 * 'click' event listener
 * fills readme text to demo element
 * and starts testUncycle procedure
 * @return {void}
 */
let startTest = () => {
    let demo = document.getElementById('demo');
    let t = readMeUncycle;
    let text = t();
    let html = text.replace(/\n/g,"<br>");
    demo.innerHTML = html;
    testUncycle();
}
/**
 * reconstructs subproperty's literal using all levels properties names 
 * of object hierarchy levels using appropriate uid (partly similar to 
 * unCycle.evStringer method)
 * @param {string} uid universal identifier
 * @param {string=} root upper level object variable. Default "ojo"
 * @return {string} appropriate property literal beginning with
 *     parent object variable name 
 *     (e.g. if var obj = {a:.., b:.., c:[,,,{o:..}],..} 
 *     the literal of the element of index 3 of the property c is  `obj.c[3]`
 *     this property is an object with property name `o` so appropriate 
 *     literal for that property is `obj.c[3].o`)
 */
let reuid = (uid, root = "o") => { uid.split("#").map((e, i) => { i == 0 ? root : "" + (i > 0 && !(/^\d/.test(e))) ? "." + e : "[" + e + "]" }) };
reuid = function (uid, root = "o") {

    if (uid === "#") {
        return [root];
    } else if (!/^[#][#].+/.test(uid)) {
        console.log("Incorrect uid format in [%s]", uid);
        return [false];
    } else {
        return uid.slice(1).split("#").map((e, i) => {
            return i == 0 ? root : ((i > 0 && !(/^\d+$/.test(e))) ? "." + e : "[" + e + "]");
        }).join("");
    }     
};
