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
 * reconstructs property key oid from uid
 * @param {string} uid universal identifier
 * @param {string=} root level object variable. Default "o"
 * @return {Array<string>} oids
 */
let reuid = (uid, root = "o") => { uid.split("#").map((e, i) => { i == 0 ? root : "" + (i > 0 && !(/^\d/.test(e))) ? "." + e : "[" + e + "]" }) };
reuid = function (uid, root = "o") {

    if (!/^[#]/.test(uid)) {
        console.log("Bad uid [%s]. First character should be '#'", uid);
        return [uid];
    } else if (uid.length === 1) {
        return [root];
    } else if (!/^[#][#].+/.test(uid)) {
        console.log("Incorrect uid format in [%s]", uid);
        return [false];
    } else {
        return uid.slice(1).split("#").map((e, i) => {
            return i == 0 ? root : ((i > 0 && !(/^\d/.test(e))) ? "." + e : "[" + e + "]");
        }).join("");
    }     
};
