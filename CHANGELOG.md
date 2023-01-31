# Change Log

## 0.4.0

- Adopt google cloud translation v3
- Fix: Loading local resource failure under WSL2, **@csgka1**, [#10](https://github.com/qjebbs/vscode-super-replace/pull/10)

> Note: `superReplace.googleApiKeyFile` has replaced the old `superReplace.googleApiKey` setting, since google cloud translation v3 no longer accepts api keys.

## 0.3.1

- Fix: Duplicate an editor after operation in VSC 1.25.0
- Improvement: UI optimize.

## 0.3.0

- New Feature: add match action. Thanks to [tiansin](https://github.com/tiansin)

## 0.2.0

- Improvement: Dealing with multiple selections.
- Improvement: Improved extract reulst.
- Improvement: UI switch to webview.
- Improvement: Auto detect operation range
- Improvement: Some replace and extract logic optimizations.
- Many code optimizations

## 0.1.1

- Improvement: Improved extract reulst.
- Improvement: Defalt replace pattern `$0` for extract if not given.

## 0.1.0

- New Feature: add extract action.

## 0.0.5

- Improvement: Behaves similar to vscode for those invalid match indexes

## 0.0.4

- Many code optimizations

## 0.0.3

- Fix: Detect & avoid "prevented webview navigation"

## 0.0.2

- Fix: Detect empty find pattern.
- Code optimizations.

## 0.0.1

- Initial release.