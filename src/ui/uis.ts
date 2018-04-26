import { UI } from "./ui";
import * as vscode from 'vscode';
import { contextManager } from '../services/common/context';

export var uiMain: UI;

contextManager.addInitiatedListener(ctx => {
    uiMain = new UI(
        vscode.Uri.parse("superReplace://main"),
        ctx.asAbsolutePath("ui/main"),
        "index.htm",
        "Super Replace",
    );
}) 