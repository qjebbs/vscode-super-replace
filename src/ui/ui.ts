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
    Load(env: any) {
        this._content = this.evalHtml(fs.readFileSync(this._file).toString(), env);
    }
    private evalHtml(html: string, envObj: any): string {
        let base: string = this._base;
        let env = JSON.stringify(envObj);
        return eval('`' + html + '`');
    }
    reOpen(env: any) {
        return new Promise((resolve, reject) => {
            this.showOrActive().then(
                success => {
                    vscode.commands.executeCommand('workbench.action.closeActiveEditor').then(
                        success => this.show(env),
                        reason => reject(reason)
                    )
                },
                reason => reason => reject(reason)
            );
        });
    }
    show(env: any) {
        this.Load(env || {});
        return this.showOrActive();
    }
    private showOrActive() {
        return vscode.commands.executeCommand('vscode.previewHtml', this._uri, vscode.ViewColumn.Two, this._title);
    }
    refresh(env: any) {
        this.Load(env || {});
        this.Emittor.fire(this._uri);
    }
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string {
        return this._content;
    }
    dispose() {
        this._disposable.length && this._disposable.map(d => d.dispose());
    }
}