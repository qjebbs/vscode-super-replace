# Super Replace

Do translations and any text transformations with regex replace!

## Features

Super Replace is an advanced regex replace tool which allows you specify additional text processing function when replace.

The following is an example that translate matched texts to Chinese.

![gtrans](assets/images/gtrans-demo.gif)

## Quick Tutorial

### Replace Tutorial

> To open the Super Replace tool, find and exectue command `Super Replace: Open Replace Window...`.

We know that, with regexp replace, we can use `$<index>` like `$0`, `$1` in replace text, which means whole match (`$0`), or first sub match (`$1`).

Super Replace extends the capability by using `$$<index>` like `$$0`, `$$1`, which means processed whole match (`$$0`), or processed first sub match (`$$1`).

The foregoing processed matches are outputs of the function given here.
It recieve sub matches as input, and could be either 
"(texts: string[])=>strings[]" or "(text: string)=>string".

For example, find `\w+` replace `$$0` function `s=>s.toUpperCase()` will transform words in the document to upper case.

### Extract Tutorial

Super replace provides another action called `Extract`.

It's useful while extracting matched texts from mass texts. To simply understand it,
we can take it as an action that remove all unmatched texts after replace.

## Requirements

If you want to translate, you need a Google Cloud Translate API Key and configurate `superReplace.googleApiKey`. You can follow the [Atril Solutions step by step Guide](https://atrilsolutions.zendesk.com/hc/en-us/articles/205540421-How-to-obtain-a-Google-Translate-API-key) to create a key.

**Reference**: [Language Support by Google Translate](https://cloud.google.com/translate/docs/languages)

## Extension Settings

`superReplace.googleApiKey`: The Google API key needed by the `gtranslate` function.

## Known Issues

Please post and view issues on [GitHub][issues]

[issues]: https://github.com/qjebbs/vscode-super-replace/issues "Post issues"

------------------------------------------------------------------------------------------

**Enjoy!**
