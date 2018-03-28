import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

type ConfigMap = {
    [key: string]: vscode.WorkspaceConfiguration;
}

export class ConfigReader extends vscode.Disposable {
    private _disposable: vscode.Disposable;
    private _conf: vscode.WorkspaceConfiguration;
    private _folderConfs: ConfigMap = {};

    read<T>(key: string, uri?: vscode.Uri) {
        if (!uri) return this._conf.get<T>(key);
        let folderConf = this._folderConfs[uri.fsPath];
        if (!folderConf) folderConf = vscode.workspace.getConfiguration('plantuml', uri);
        this._folderConfs[uri.fsPath] = folderConf;
        let results = folderConf.inspect<T>(key);
        if (results.workspaceFolderValue !== undefined) return results.workspaceFolderValue;
        if (results.workspaceValue !== undefined) return results.workspaceValue;
        if (results.globalValue !== undefined) return results.globalValue;
        return results.defaultValue;
    }
    private getConfObjects(configName: string) {
        this._conf = vscode.workspace.getConfiguration(configName);
        this._folderConfs = {};
        if (!vscode.workspace.workspaceFolders) return;
        vscode.workspace.workspaceFolders.map(
            f => this._folderConfs[f.uri.fsPath] = vscode.workspace.getConfiguration(configName, f.uri)
        );
    }

    constructor(configName: string) {
        super(() => this.dispose());
        this.getConfObjects(configName);
        this._disposable = vscode.workspace.onDidChangeConfiguration(() => this.getConfObjects(configName));
    }

}