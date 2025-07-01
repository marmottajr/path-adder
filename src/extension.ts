import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Get the last directory name from a path
 */
function getLastDirectory(dirPath: string): string {
    return path.basename(path.resolve(dirPath));
}

/**
 * Recursively get all files with specified extensions
 */
function getAllFiles(dir: string, extensions: string[], fileList: string[] = []): string[] {
    try {
        const files = fs.readdirSync(dir);

        files.forEach((file: string) => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                // Skip node_modules and other common directories
                if (!file.startsWith('.') && file !== 'node_modules' && file !== 'out' && file !== 'dist') {
                    getAllFiles(filePath, extensions, fileList);
                }
            } else if (extensions.some(ext => filePath.endsWith(ext))) {
                fileList.push(filePath);
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
    }

    return fileList;
}

/**
 * Add file path comment to a file
 */
function addFilePathComment(filePath: string, rootDir: string): boolean {
    try {
        let relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        const lastDirectory = getLastDirectory(rootDir);
        relativePath = lastDirectory + '/' + relativePath;

        let modified = false;

        if (lines[0].startsWith('#!/')) {
            // Add the path comment as the second line if shebang exists
            if (lines.length < 2 || !lines[1].startsWith(`// ${relativePath}`)) {
                lines.splice(1, 0, `// ${relativePath}`);
                modified = true;
            }
        } else {
            // Add the path comment as the first line
            if (!lines[0].startsWith(`// ${relativePath}`)) {
                lines.unshift(`// ${relativePath}`);
                modified = true;
            }
        }

        if (modified) {
            const newContent = lines.join('\n');
            fs.writeFileSync(filePath, newContent, 'utf8');
            return true;
        }
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        vscode.window.showErrorMessage(`Error processing file ${filePath}: ${error}`);
    }
    
    return false;
}

/**
 * Add path comments to all JS/TS files in workspace
 */
async function addPathsToWorkspace() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder is open');
        return;
    }

    const extensions = ['.js', '.ts'];
    let totalProcessed = 0;
    let totalModified = 0;

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Adding path comments to files...",
        cancellable: false
    }, async (progress: vscode.Progress<{increment?: number; message?: string}>) => {
        for (const workspaceFolder of workspaceFolders) {
            const rootDir = workspaceFolder.uri.fsPath;
            const files = getAllFiles(rootDir, extensions);
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const wasModified = addFilePathComment(file, rootDir);
                
                if (wasModified) {
                    totalModified++;
                }
                totalProcessed++;
                
                progress.report({
                    increment: (100 / files.length),
                    message: `Processing ${path.basename(file)} (${i + 1}/${files.length})`
                });
            }
        }
    });

    vscode.window.showInformationMessage(
        `Path Adder: Processed ${totalProcessed} files, modified ${totalModified} files`
    );
}

/**
 * Add path comment to current file
 */
async function addPathToCurrentFile() {
    const activeEditor = vscode.window.activeTextEditor;
    
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }

    const document = activeEditor.document;
    const filePath = document.fileName;
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('File is not part of workspace');
        return;
    }

    // Check if file is JS or TS
    if (!filePath.endsWith('.js') && !filePath.endsWith('.ts')) {
        vscode.window.showErrorMessage('Current file is not a JavaScript or TypeScript file');
        return;
    }

    // Save the document first if it has unsaved changes
    if (document.isDirty) {
        await document.save();
    }

    const rootDir = workspaceFolder.uri.fsPath;
    const wasModified = addFilePathComment(filePath, rootDir);

    if (wasModified) {
        // Refresh the editor to show the changes
        await vscode.commands.executeCommand('workbench.action.files.revert');
        vscode.window.showInformationMessage(`Path comment added to ${path.basename(filePath)}`);
    } else {
        vscode.window.showInformationMessage(`Path comment already exists in ${path.basename(filePath)}`);
    }
}

export function activate(context: vscode.ExtensionContext) {
    // Register commands
    const addPathsToWorkspaceCommand = vscode.commands.registerCommand(
        'pathAdder.addPathsToWorkspace',
        addPathsToWorkspace
    );

    const addPathToCurrentFileCommand = vscode.commands.registerCommand(
        'pathAdder.addPathToCurrentFile',
        addPathToCurrentFile
    );

    context.subscriptions.push(addPathsToWorkspaceCommand, addPathToCurrentFileCommand);
}

export function deactivate() {}