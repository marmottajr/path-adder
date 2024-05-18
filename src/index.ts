#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

// Função para obter o último diretório de um caminho
function getLastDirectory(dirPath: string): string {
  return path.basename(path.resolve(dirPath));
}

function getAllFiles(dir: string, ext: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, ext, fileList);
    } else if (filePath.endsWith(ext)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function addFilePathComment(filePath: string, execDir: string) {
  let relativePath = path.relative(execDir, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const lastDirectory = getLastDirectory(process.cwd());
  relativePath = lastDirectory + '/' + relativePath;

  if (lines[0].startsWith('#!/')) {
    // Always add the path comment as the second line
    if (lines.length < 2 || !lines[1].startsWith(`// ${relativePath}`)) {
      lines.splice(1, 0, `// ${relativePath}`);
      const newContent = lines.join('\n');
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Added path to ${filePath}`);
    }
  } else {
    // Always add the path comment as the first line
    if (!lines[0].startsWith(`// ${relativePath}`)) {
      lines.unshift(`// ${relativePath}`);
      const newContent = lines.join('\n');
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Added path to ${filePath}`);
    }
  }
}

function main() {
  const execDir = process.cwd();
  const extensions = ['.js', '.ts'];
  extensions.forEach(ext => {
    const files = getAllFiles(execDir, ext);
    files.forEach(file => addFilePathComment(file, execDir));
  });
}

main();
