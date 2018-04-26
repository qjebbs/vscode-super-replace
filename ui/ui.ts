import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { context } from '../src/services/common/context';
export class UI extends vscode.Disposable implements vscode.TextDocumentContentProvider {
    Emittor: vscode.EventEmitter<vscode.Uri>;
    onDidChange: vscode.Event<vscode.Uri>;
    _uri: vscode.Uri;
    _file: string;
    _title: string;
    _content: string;

    private _disposable: vscode.Disposable[] = [];

    constructor(uri: vscode.Uri, file: string, title: string) {
        super(() => this.dispose());
        this.Emittor = new vscode.EventEmitter<vscode.Uri>();
        this.onDidChange = this.Emittor.event;
        this._uri = uri;
        this._title = title;
        this._disposable.push(
            vscode.workspace.registerTextDocumentContentProvider(uri.scheme, this)
        );
    }
    Load(file: string, env: any) {
        this._file = file;
        if (!context) return;
        if (!path.isAbsolute(this._file)) this._file = path.join(context.extensionPath, this._file);
        this._content = this.evalHtml(fs.readFileSync(this._file).toString(), env);
    }
    private evalHtml(html: string, envObj: any): string {
        let extRoot: string = context.extensionPath;
        let env = JSON.stringify(envObj);
        return eval('`' + html + '`');
    }
    show(env: any) {
        this.Load(this._file, env || {});
        vscode.commands.executeCommand('vscode.previewHtml', this._uri, vscode.ViewColumn.Two, this._title)
            .then(
                success => undefined,
                reason => {
                    vscode.window.showErrorMessage(reason);
                }
            );
    }
    refresh(env: any) {
        this.Load(this._file, env || {});
        this.Emittor.fire(this._uri);
    }
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string {
        return this._content;
    }
    dispose() {
        this._disposable.length && this._disposable.map(d => d.dispose());
    }
}