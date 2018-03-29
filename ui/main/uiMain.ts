import { UI } from "../ui";
import * as vscode from 'vscode';

export var uiMain = new UI(vscode.Uri.parse("translatorAdvanced://main"), "ui/main/index.htm");