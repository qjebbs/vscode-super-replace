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
        sendMsg.attributes["href"].value = encodeURI('command:superReplace.doReplace?' + args);
        // console.log(sendMsg.attributes["href"].value);
        sendMsg.click();
    }
}