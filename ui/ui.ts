import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { context } from '../src/services/common/context';
export class UI extends vscode.Disposable implements vscode.TextDocumentContentProvider {
    Emittor: vscode.EventEmitter<vscode.Uri>;
    onDidChange: vscode.Event<vscode.Uri>;
    Uri: vscode.Uri;
    File: string;
    Content: string;

    private _disposable: vscode.Disposable[] = [];

    constructor(uri: vscode.Uri, file: string) {
        super(() => this.dispose());
        this.Emittor = new vscode.EventEmitter<vscode.Uri>();
        this.onDidChange = this.Emittor.event;
        this.Uri = uri;
        this.Load(file);
        this._disposable.push(
            vscode.workspace.registerTextDocumentContentProvider('translatorAdvanced', this)
        );
    }
    Load(file: string) {
        this.File = file;
        if (!context) return;
        if (!path.isAbsolute(this.File)) this.File = path.join(context.extensionPath, this.File);
        this.Content = this.evalHtml(fs.readFileSync(this.File).toString());
    }
    private evalHtml(html): string {
        let extRoot: string = context.extensionPath;
        return eval('`' + html + '`');
    }
    show() {
        if (!this.Content) this.Load(this.File);
        vscode.commands.executeCommand('vscode.previewHtml', this.Uri, vscode.ViewColumn.Two, "RegEx Replace Extended")
            .then(
                success => undefined,
                reason => {
                    vscode.window.showErrorMessage(reason);
                }
            );
    }
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string {
        return this.Content
    }
    dispose() {
        this._disposable.length && this._disposable.map(d => d.dispose());
    }
}