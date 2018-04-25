var templates = {
    "googleTranslate": `// gtranslate returns a function that translates the match text.
// change the "en" and "zh-cn" to whatever source and target language you want
// don't forget to configurate "superReplace.googleApiKey"
gtranslate("en","zh-cn")`,
    "uppercase": "s=>s.toUpperCase()"
}

window.addEventListener("load", () => {
    sendMsg = document.getElementById("sendMsg");
    textFind = document.getElementById("textFind");
    textReplace = document.getElementById("textReplace");
    textFunc = document.getElementById("textFunc");
    radRngSelection = document.getElementById("radRngSelection");
    btnDoReplace = document.getElementById("doReplace");
    btnDoReplace.addEventListener("click", doReplace);
});

function doReplace() {
    if (sendMsg) {
        let args = JSON.stringify({
            find: textFind.value,
            replace: textReplace.value,
            func: textFunc.value,
            range: radRngSelection.checked ? 0 : 1
        });
        let uri = encodeURI('command:superReplace.doReplace?' + args);
        sendMsg.attributes["href"].value = uri;
        // console.log(sendMsg.attributes["href"].value);
        sendMsg.click();
    }
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