window.addEventListener("load", () => {
    sendMsg = document.getElementById("sendMsg");
    textFind = document.getElementById("textFind");
    textReplace = document.getElementById("textReplace");
    textFunc = document.getElementById("textFunc");


    btnDoReplace = document.getElementById("doReplace");
    btnDoReplace.addEventListener("click", doReplace);
});

function doReplace() {
    if (sendMsg) {
        let args = JSON.stringify({
            find: textFind.value,
            replace: textReplace.value,
            func: textFunc.value
        });
        sendMsg.attributes["href"].value = encodeURI('command:translatorAdvanced.doReplace?' + args);
        // console.log(sendMsg.attributes["href"].value);
        sendMsg.click();
    }
}