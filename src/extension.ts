// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ext-md" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('md-ext.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from test 203!');
	});

	let b = vscode.workspace.onWillSaveTextDocument(
		(event) => {
			if (!event.document.fileName.endsWith('md')) {
				return;
			}
			let origin = event.document.getText();

			let lineSeparator = '\n';
			if (origin.indexOf('\r\n') !== -1) {
				lineSeparator = '\r\n';
			}

			let last = origin.indexOf('#');
			let header;
			let content = "";
			if (last === -1) {
				header = origin;
			} else {
				header = origin.substring(0, last);
				content = origin.substring(last, origin.length+1);
			}
			let newHeader: string;
			let headerSize: number;
			let date = new Date();
			let timestamp = date.getTime();
			let time = date.toLocaleString();
			console.log("start "+header.startsWith('---' + lineSeparator));
			if (header.startsWith('---' + lineSeparator) && header.lastIndexOf('---' + lineSeparator) !== -1) {
				console.log('have header');
				let headers = header.split(lineSeparator);
				let arrHeader: string[] = [];

				headers.forEach(s => {
					if (s.indexOf('updateTime: ') !== -1) {
						s = 'updateTime: ' + time;
					}
					if (s.indexOf('timestamp: ') !== -1) {
						s = 'timestamp: ' + timestamp;
					}	
					arrHeader.push(s);
				});
				headerSize = headers.length;
				newHeader = arrHeader.join(lineSeparator);
				console.log('new header: '+ newHeader);
			} else {
				console.log('not have header: '+ header);
				let headers: string[] = [];
				headers.push('---');

				headers.push('createTime: '+ time);
				headers.push('updateTime: '+ time);
				headers.push('timestamp: '+ timestamp);

				headers.push('---' + lineSeparator);

				headerSize = header.split(lineSeparator).length === 0? 1 : header.split(lineSeparator).length;
				newHeader = headers.join(lineSeparator);
			}
			
			event.waitUntil(vscode.window.showTextDocument(event.document).then(editor=>{
				editor.edit(editorbuilder => {
					let start = new vscode.Position(0, 0);
					let lastt = new vscode.Position(editor.document.lineCount, 99999);
					editorbuilder.replace(new vscode.Range(start, lastt), newHeader+content);
				});
			}));
	
		}
	);

	context.subscriptions.push(disposable);
	context.subscriptions.push(b);

}

// this method is called when your extension is deactivated
export function deactivate() {

console.log("你的扩展已经释放");
}
