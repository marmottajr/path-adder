```markdown
# Path Adder Script

Este é um script Node.js que adiciona um comentário com o caminho relativo do arquivo na primeira linha de todos os arquivos `.js` e `.ts` no diretório atual e seus subdiretórios. Se o arquivo já contiver um shebang (`#!/`), o comentário será adicionado na segunda linha.

## Instalação

Para instalar o script globalmente na sua máquina, siga os passos abaixo:

1. Clone este repositório:
    ```sh
    git clone https://github.com/seu-usuario/path-adder.git
    ```

2. Navegue até o diretório do projeto:
    ```sh
    cd path-adder
    ```

3. Instale as dependências:
    ```sh
    npm install
    ```

4. Compile o projeto:
    ```sh
    npm run build
    ```

5. Instale o script globalmente:
    ```sh
    npm install -g .
    ```

## Uso

Depois de instalar o script globalmente, você pode usá-lo para adicionar o comentário de caminho relativo aos arquivos `.js` e `.ts` em qualquer diretório. Para isso, navegue até o diretório desejado e execute o comando `path-adder`.

Por exemplo:
```sh
cd /home/user/project/src
path-adder
```

Este comando irá adicionar o caminho relativo na primeira linha de todos os arquivos `.js` e `.ts` no diretório `/home/user/project/src` e seus subdiretórios.

## Exemplo

Se você tiver um arquivo `src/main.ts` e executar o script no diretório `/home/user/project/src`, o arquivo será atualizado de:
```typescript
console.log('Hello, world!');
```
Para:
```typescript
// src/main.ts
console.log('Hello, world!');
```

Se o arquivo já contiver um shebang, por exemplo:
```typescript
#!/usr/bin/env node
console.log('Hello, world!');
```
Ele será atualizado para:
```typescript
#!/usr/bin/env node
// src/main.ts
console.log('Hello, world!');
```

## Contribuição

Se você encontrar algum problema ou tiver sugestões de melhorias, sinta-se à vontade para abrir uma issue ou um pull request neste repositório.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
```

Este `README.md` fornece todas as informações necessárias para instalação, uso e contribuição para o projeto. Certifique-se de ajustar os detalhes, como o URL do repositório GitHub, conforme necessário.