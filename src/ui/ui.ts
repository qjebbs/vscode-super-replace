import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
export class UI extends vscode.Disposable implements vscode.TextDocumentContentProvider {
    Emittor: vscode.EventEmitter<vscode.Uri>;
    onDidChange: vscode.Event<vscode.Uri>;
    _uri: vscode.Uri;
    _base: string;
    _file: string;
    _title: string;
    _content: string;

    private _disposable: vscode.Disposable[] = [];

    constructor(uri: vscode.Uri, base: string, file: string, title: string) {
        super(() => this.dispose());
        this.Emittor = new vscode.EventEmitter<vscode.Uri>();
        this.onDidChange = this.Emittor.event;
        this._uri = uri;
        this._title = title;
        this._base = base;
        this._file = path.isAbsolute(file) ? file : path.join(base, file);
        this._disposable.push(
            vscode.workspace.registerTextDocumentContentProvider(uri.scheme, this)
        );
    }
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string {
        return this._content;
    }
    dispose() {
        this._disposable.length && this._disposable.map(d => d.dispose());
    }
    show(env?: any) {
        this.loadFile(env || {});
        return this.showOrActive();
    }
    close() {
        return this.showOrActive().then(
            success => vscode.commands.executeCommand('workbench.action.closeActiveEditor'),
            reason => Promise.reject(reason)
        );
    }
    refresh(env?: any) {
        this.loadFile(env || {});
        this.Emittor.fire(this._uri);
    }
    private loadFile(env: any) {
        this._content = this.evalHtml(fs.readFileSync(this._file).toString(), env);
    }
    private evalHtml(html: string, envObj: any): string {
        let linkReg = /(src|href)\s*=\s*([`"'])(.+?)\2/ig;
        let base: string = this._base;
        let env = JSON.stringify(envObj);
        let result: string = eval('`' + html + '`');
        // convert relative "src", "href" paths to absolute
        return result.replace(linkReg, (match, ...subs) => {
            let uri = subs[2];
            if (!path.isAbsolute(uri)) uri = path.join(base, uri);
            if (!fs.existsSync(uri)) return match;
            return `${subs[0]}=${subs[1]}${uri}${subs[1]}`;
        });
    }
    private showOrActive() {
        return vscode.commands.executeCommand('vscode.previewHtml', this._uri, vscode.ViewColumn.Two, this._title);
    }
}