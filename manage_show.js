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
    demo.innerHTML = t();
    testUncycle();
}