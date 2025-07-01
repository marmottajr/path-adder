# Path Adder - VSCode Extension

Esta é uma extensão para VSCode/Cursor que adiciona comentários com o caminho relativo do arquivo na primeira linha de todos os arquivos `.js` e `.ts`. Se o arquivo já contiver um shebang (`#!/`), o comentário será adicionado na segunda linha.

## Funcionalidades

- **Adicionar comentários de caminho para todo o workspace**: Processa todos os arquivos `.js` e `.ts` no workspace atual
- **Adicionar comentário de caminho para arquivo atual**: Adiciona o comentário apenas ao arquivo atualmente aberto
- **Suporte a shebang**: Detecta automaticamente shebangs e adiciona o comentário na linha correta
- **Interface integrada**: Comandos disponíveis via Command Palette, menu de contexto do explorador e menu de contexto do editor

## Como usar

### Método 1: Command Palette
1. Abra o Command Palette (`Ctrl+Shift+P` ou `Cmd+Shift+P`)
2. Digite "Path Adder" para ver os comandos disponíveis:
   - **"Add Path Comments to All JS/TS Files"**: Processa todos os arquivos do workspace
   - **"Add Path Comment to Current File"**: Processa apenas o arquivo atual

### Método 2: Menu de contexto
- **No explorador de arquivos**: Clique com o botão direito em uma pasta e selecione "Add Path Comments to All JS/TS Files"
- **No editor**: Clique com o botão direito em um arquivo `.js` ou `.ts` e selecione "Add Path Comment to Current File"

## Exemplo

Se você tiver um arquivo `src/components/Button.ts` e executar a extensão, o arquivo será atualizado de:
```typescript
export const Button = () => {
  return <button>Click me</button>;
};
```

Para:
```typescript
// workspace/src/components/Button.ts
export const Button = () => {
  return <button>Click me</button>;
};
```

Se o arquivo já contiver um shebang:
```typescript
#!/usr/bin/env node
console.log('Hello, world!');
```

Será atualizado para:
```typescript
#!/usr/bin/env node
// workspace/src/script.ts
console.log('Hello, world!');
```

## Instalação

### Para desenvolvimento
1. Clone este repositório
2. Execute `npm install` para instalar as dependências
3. Abra o projeto no VSCode
4. Pressione `F5` para executar a extensão em uma nova janela do VSCode

### Para uso
1. Compile a extensão: `npm run compile`
2. Empacote a extensão: `vsce package` (requer `npm install -g vsce`)
3. Instale o arquivo `.vsix` gerado no VSCode

## Desenvolvimento

### Estrutura do projeto
- `src/extension.ts`: Código principal da extensão
- `package.json`: Configuração da extensão e comandos
- `tsconfig.json`: Configuração do TypeScript

### Scripts disponíveis
- `npm run compile`: Compila o TypeScript
- `npm run watch`: Compila e observa mudanças

## Contribuição

Se você encontrar algum problema ou tiver sugestões de melhorias, sinta-se à vontade para abrir uma issue ou um pull request neste repositório.

## Licença

Este projeto está licenciado sob a licença MIT.