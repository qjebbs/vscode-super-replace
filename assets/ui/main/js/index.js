(function () {
    let templates = {
        "googleTranslate": [
            '// gtranslate returns a function that translates the match text.',
            '// change the "en" and "zh-cn" to whatever languages you want.',
            '// don\'t forget to configurate "superReplace.googleApiKeyFile".',
            '// see also: https://cloud.google.com/translate/docs/setup',
            'gtranslate("en","zh-cn")',
        ],
        "uppercase": ["s=>s.toUpperCase()"]
    }

    let vscode;
    if (typeof acquireVsCodeApi !== "undefined") vscode = acquireVsCodeApi();
    let textFind;
    let textReplace;
    let textFunc;

    window.addEventListener("load", () => {
        $("html").css("font-size", "14px");
        textFind = $("#textFind");
        textReplace = $("#textReplace");
        textFunc = $("#textFunc");
        $("#doMatch").click(doMatch);
        $("#doReplace").click(doReplace);
        $("#doExtract").click(doExtract);
        $("#function-templates>a").each(
            (_, a) => {
                $(a).click(
                    () => onListClick(a)
                )
            }
        );
    });

    function doMatch() {
        vscode.postMessage({
            find: textFind.val(),
            replace: textReplace.val(),
            func: textFunc.val(),
            mode: 0,
        });
    }

    function doReplace() {
        vscode.postMessage({
            find: textFind.val(),
            replace: textReplace.val(),
            func: textFunc.val(),
            mode: 1,
        });
    }

    function doExtract() {
        let rep = textReplace.val();
        vscode.postMessage({
            find: textFind.val(),
            replace: rep ? rep : "$0",
            func: textFunc.val(),
            mode: 2,
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
            tmpl = templates[name].join('\n');
            if (!tmpl) tmpl = `// ERROR: Cannot find template '${name}'`;
        }
        if (tmpl) textFunc.val(tmpl);
    }
})()