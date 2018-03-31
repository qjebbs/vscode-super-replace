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
        this.Load(file);
        this._disposable.push(
            vscode.workspace.registerTextDocumentContentProvider(uri.scheme, this)
        );
    }
    Load(file: string) {
        this._file = file;
        if (!context) return;
        if (!path.isAbsolute(this._file)) this._file = path.join(context.extensionPath, this._file);
        this._content = this.evalHtml(fs.readFileSync(this._file).toString());
    }
    private evalHtml(html): string {
        let extRoot: string = context.extensionPath;
        return eval('`' + html + '`');
    }
    show() {
        if (!this._content) this.Load(this._file);
        vscode.commands.executeCommand('vscode.previewHtml', this._uri, vscode.ViewColumn.Two, this._title)
            .then(
                success => undefined,
                reason => {
                    vscode.window.showErrorMessage(reason);
                }
            );
    }
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string {
        return this._content
    }
    dispose() {
        this._disposable.length && this._disposable.map(d => d.dispose());
    }
}