// /(dis|adv|\dd\d)+/
// const allowedString = /^[a-zA-Z0-9]+$/
var test = document.getElementById("message").value;
var hasS = new RegExp("^[s\s]+$").test(test);
console.log();
