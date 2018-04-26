let templates = {
    "googleTranslate": `// gtranslate returns a function that translates the match text.
// change the "en" and "zh-cn" to whatever source and target language you want
// don't forget to configurate "superReplace.googleApiKey"
gtranslate("en","zh-cn")`,
    "uppercase": "s=>s.toUpperCase()"
}

let sendMsg;
let textFind;
let textReplace;
let textFunc;
let radRngSelection;
let state;

window.addEventListener("load", () => {
    sendMsg = document.getElementById("sendMsg");
    textFind = document.getElementById("textFind");
    textReplace = document.getElementById("textReplace");
    textFunc = document.getElementById("textFunc");
    radRngSelection = document.getElementById("radRngSelection");
    state = JSON.parse(document.getElementById("state").innerHTML);
    let btnDoReplace = document.getElementById("doReplace");
    btnDoReplace.addEventListener("click", doReplace);
    if (!state.reportingOK) reportingLoop(); // detect prevented excuting by vscode in a few cases
});

function reportingLoop(idx) {
    if (!idx) idx = 0;
    execute({
        reporting: idx
    });
    setTimeout(() => {
        reportingLoop(++idx);
    }, 100);
}

function execute(arg) {
    let args = JSON.stringify(arg);
    let uri = encodeURI('command:superReplace.doReplace?' + args);
    sendMsg.attributes["href"].value = uri;
    // console.log(uri);
    sendMsg.click();
}

function doReplace() {
    if (sendMsg) execute({
        find: textFind.value,
        replace: textReplace.value,
        func: textFunc.value,
        range: radRngSelection.checked ? 0 : 1
    });
}


function onListClick(e) {
    let tmpl = "";
    let name = "";
    let attr = e.attributes["data"]
    if (!attr || !attr.value) {
        tmpl = "// ERROR: Template list item data soruce not set.";
    } else {
        name = attr.value;
        tmpl = templates[name];
        if (!tmpl) tmpl = `// ERROR: Cannot find template '${name}'`;
    }
    if (tmpl) textFunc.value = tmpl;
}