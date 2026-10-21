# Validação da entrega revisada

Data: 21/10/2026.

## Escopo final

| ID | Tipo | Cenário |
| --- | --- | --- |
| CT01 | Positivo | Login com credenciais válidas |
| CT02 | Negativo | Rejeição de senha inválida |
| CT03 | Positivo | Compra completa e conferência dos valores |
| CT04 | Negativo e alternativo | Campo obrigatório e correção no checkout |
| CT05 | Alternativo | Remover um produto e preservar o outro ao continuar comprando |

A suíte possui cinco cenários em três arquivos e quatro Page Objects. As dependências, o README e o workflow correspondem a esse escopo.

## Verificações realizadas

| Verificação | Resultado |
| --- | --- |
| TypeScript estrito: `npm run typecheck` | Aprovado |
| Descoberta: `npm run test:list` | Cinco cenários no Chromium |
| Verificação de seletores em página local controlada | Aprovado |
| Captura PNG de página inteira e anexo usando a fixture entregue, em página local | Aprovado |
| Compatibilidade entre manifesto e lockfile | Aprovado |
| Revisão de imports, massa, configuração e conteúdo do ZIP | Aprovado |

A verificação local dos seletores usou os Page Objects entregues e uma página sem acesso à rede. Foram exercitados: renderização assíncrona de um produto, mesmo nome presente na descrição de outro produto, item homônimo fora da lista do catálogo, produtos em ordem invertida e remoção apenas do item escolhido. Nenhuma requisição de rede foi tentada nessa verificação. Esse diagnóstico é externo à suíte entregue e não acrescenta um sexto cenário ao desafio.

A verificação local comprova o comportamento dos locators e a espera automática nesse DOM controlado; **não equivale a executar os cinco cenários contra o SauceDemo**.

A fixture `captureEvidence` também foi exercitada em uma página local sem requisições de rede: foi validado que o arquivo é PNG, cobre a altura total da página e é anexado à execução com o tipo `image/png`. Os cinco cenários utilizam essa fixture após assertions de checkpoints, com 11 capturas nomeadas em uma execução completa aprovada no Chromium. Essa verificação local não produz evidências dos fluxos reais do SauceDemo.

## Execução real pendente

A execução E2E no site público permanece pendente nesta revisão. Uma tentativa anterior foi bloqueada pela revisão automática deste ambiente por telemetria a um serviço externo cujo conteúdo não foi verificado. O bloqueio não foi contornado.

Não há relatório antigo incluído nem afirmação de cinco cenários E2E aprovados nesta versão. O navegador padrão do Playwright e o workflow remoto ainda devem ser validados antes do envio aos avaliadores. Firefox e WebKit estão configurados para execução opcional, sem certificação nesta entrega.

## Como concluir a validação

Na pasta do projeto, usando Node.js 24:

```bash
npm ci
npx playwright install chromium
npm run check
npm run test:report
```

No Linux, use `npx playwright install --with-deps chromium` se faltarem bibliotecas do sistema.

Depois de publicar no GitHub, confirme a execução do workflow na aba Actions. Preserve o relatório da execução final para que ele corresponda ao mesmo código encaminhado à avaliação.

A configuração entregue mantém a verificação TLS padrão. Imagens dos checkpoints validados são salvas também nos cenários aprovados e anexadas ao relatório. Em falhas, o runner preserva adicionalmente screenshot automático, vídeo e trace quando o navegador puder iniciar. O relatório HTML e o JUnit são gerados na execução; não foram substituídos pelo diagnóstico local dos seletores.
