import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { showMessagePanel } from '../services/common/tools';


export class UI extends vscode.Disposable {
    _panel: vscode.WebviewPanel;
    _viewType: string;
    _staticBase: string;
    _htmlPath: string;
    _title: string;
    _content: string;
    _ctx: vscode.ExtensionContext;
    _disposables: vscode.Disposable[] = [];
    _listener: (e: any) => any = undefined;

    constructor(viewType: string, title: string, ctx:vscode.ExtensionContext, listener: (e: any) => any) {
        super(() => this.dispose());
        this._ctx = ctx;

        this._htmlPath = path.join(this._ctx.extensionPath, "assets/ui/main/index.htm");
        this._viewType = viewType;
        this._title = title;
        this._staticBase = path.dirname(this._htmlPath);
        this._listener = listener;

    }

    show(env?: any) {
        this.createPanel();
        this.loadFile(env || {});
        this._panel.webview.html = this._content;
        this._panel.reveal();
    }
    close() {
        this.dispose();
    }
    refresh(env?: any) {
        this.show(env);
    }
    postMessage(message: any) {
        this.createPanel();
        return this._panel.webview.postMessage(message);
    }
    private createPanel() {
        if (this._panel) return;
        this._panel = vscode.window.createWebviewPanel(
            this._viewType,
            this._title,
            vscode.ViewColumn.Two, <vscode.WebviewOptions>{
                enableScripts: true,
                enableCommandUris: true,
                localResourceRoots: [vscode.Uri.file(this._staticBase)],
            }
        );
        this.addMessageListener();
        this._panel.onDidDispose(() => {
            this.dispose();
            this._panel = undefined;
        }, null, this._disposables);
    }

    private addMessageListener() {
        if (this._panel && this._listener)
            this._panel.webview.onDidReceiveMessage(this.listenerCatch, this, this._disposables);
    }
    private listenerCatch(e: any): any {
        try {
            let pm = this._listener(e);
            if (pm instanceof Promise) {
                pm.catch(error => showMessagePanel(error))
            }
        } catch (error) {
            showMessagePanel(error);
        }
    }
    private loadFile(env: any) {
        this._content = this.replaceResourcePath(fs.readFileSync(this._htmlPath).toString(), env);
    }

    /**
     * When loading local JS/CSS files, webview only can accessing them with the prescribed URL format.
     * See https://code.visualstudio.com/api/extension-guides/webview#loading-local-content
     */
    private replaceResourcePath(html: string, envObj: any): string {
        let linkReg = /(src|href)\s*=\s*([`"'])(.+?)\2/ig;
        let base: string = this._staticBase;
        let env = JSON.stringify(envObj);

        // let result: string = eval('`' + html + '`');
        let result = html;

        return result.replace(linkReg, (match, ...subs) => {
            let uri = subs[2] as string;
            if (!path.isAbsolute(uri)) uri = path.join(base, uri);
            if (!fs.existsSync(uri)) return match;
            const onDiskPath = vscode.Uri.file(uri);
            const secureSrc = this._panel.webview.asWebviewUri(onDiskPath);
            const resourcePath = `${subs[0]}=${subs[1]}${secureSrc}${subs[1]}`;
            return resourcePath;
        });
    }
    dispose() {
        this._disposables.length && this._disposables.map(d => d && d.dispose());
        this._disposables = [];
    }
}