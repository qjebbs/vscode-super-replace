let templates = {
    "googleTranslate": `// gtranslate returns a function that translates the match text.
// change the "en" and "zh-cn" to whatever source and target language you want
// don't forget to configurate "superReplace.googleApiKey"
gtranslate("en","zh-cn")`,
    "uppercase": "s=>s.toUpperCase()"
}

const vscode = acquireVsCodeApi();
let textFind;
let textReplace;
let textFunc;
// let radRngSelection;
let state;

window.addEventListener("load", () => {
    textFind = document.getElementById("textFind");
    textReplace = document.getElementById("textReplace");
    textFunc = document.getElementById("textFunc");
    // radRngSelection = document.getElementById("radRngSelection");
    document.getElementById("doMatch").addEventListener("click", doMatch);
    document.getElementById("doReplace").addEventListener("click", doReplace);
    document.getElementById("doExtract").addEventListener("click", doExtract);
});

function doMatch() {
    vscode.postMessage({
        find: textFind.value,
        replace: textReplace.value,
        func: textFunc.value,
        mode: 0,
        // selectionOnly: radRngSelection.checked,
    });
}

function doReplace() {
    vscode.postMessage({
        find: textFind.value,
        replace: textReplace.value,
        func: textFunc.value,
        mode: 1,
        // selectionOnly: radRngSelection.checked,
    });
}

function doExtract() {
    let rep = textReplace.value;
    vscode.postMessage({
        find: textFind.value,
        replace: rep ? rep : "$0",
        func: textFunc.value,
        mode: 2,
        // selectionOnly: radRngSelection.checked,
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