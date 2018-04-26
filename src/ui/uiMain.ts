import { UI } from "./ui";
import * as vscode from 'vscode';

export var uiMain = new UI(vscode.Uri.parse("superReplace://main"), "ui/main/index.htm", "Super Replace");