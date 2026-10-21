# QA Sênior · Playwright + TypeScript

Suíte de cinco cenários E2E sobre o [SauceDemo](https://www.saucedemo.com/), uma aplicação pública de demonstração da Sauce Labs. O objetivo é demonstrar cobertura orientada a risco, testes independentes e código simples de manter, dentro do escopo de um desafio de 2–3 horas.

## Cobertura

| ID | Tipo | Cenário | Principais resultados verificados |
| --- | --- | --- | --- |
| CT01 | Positivo | Login válido | Catálogo acessível, seis produtos e carrinho inicialmente vazio |
| CT02 | Negativo | Senha incorreta | Mensagem específica, permanência no login e ausência do catálogo |
| CT03 | Positivo | Compra completa | Produto, quantidade, preço, subtotal, imposto, total, confirmação e carrinho vazio |
| CT04 | Negativo e alternativo | Checkout sem nome e correção | Bloqueio do envio, dados preservados e avanço após corrigir o nome |
| CT05 | Alternativo | Remoção parcial e retorno às compras | Apenas o item escolhido é removido; o restante persiste ao navegar |

Os fluxos positivos cobrem acesso ao catálogo e compra completa. Os negativos verificam senha inválida e campo obrigatório vazio. Os alternativos exercitam a correção do formulário e a mudança de decisão do usuário no carrinho.

## Pré-requisitos

- Node.js **24.x** e npm. A versão principal está em `.nvmrc`.
- Acesso à internet, ao SauceDemo, ao registro npm e aos servidores de download de navegadores do Playwright.
- Windows, macOS ou Linux com suporte ao Playwright.

## Instalação e primeira execução

Extraia o projeto, abra o terminal na pasta que contém `package.json` e execute:

```bash
npm ci
npx playwright install chromium
npm run typecheck
npm test
```

No Linux, se faltarem bibliotecas do sistema:

```bash
npx playwright install --with-deps chromium
```

`npm ci` usa as versões exatas registradas em `package-lock.json`. Não é necessário instalar Playwright globalmente. A configuração padrão já funciona sem criar `.env`.

## Comandos

| Comando | Finalidade |
| --- | --- |
| `npm test` | Executar os cinco cenários no Chromium, em modo headless |
| `npm run check` | Verificar tipos e executar a suíte no Chromium |
| `npm run test:headed` | Acompanhar a execução com navegador visível |
| `npm run test:ui` | Abrir o modo interativo do Playwright |
| `npm run test:debug` | Depurar com Playwright Inspector |
| `npm run test:smoke` | Executar login válido e compra completa |
| `npm run test:list` | Listar os cinco testes sem abrir o navegador |
| `npm run test:report` | Servir o último relatório HTML |
| `npm run typecheck` | Verificar TypeScript sem executar testes |
| `npm run test:all` | Executar os mesmos cinco cenários nos três motores: 15 execuções |

Para os três motores, instale primeiro os navegadores:

```bash
npx playwright install
npm run test:all
```

Para executar um único caso ou outra categoria:

```bash
npm test -- --grep CT03
npm test -- --grep @negative
npm test -- --workers=1
```

## Ambiente e massa de dados

As configurações opcionais estão em `.env.example`. No PowerShell:

```powershell
Copy-Item .env.example .env
```

No Bash/zsh:

```bash
cp .env.example .env
```

O Node carrega `.env` na configuração. Variáveis já definidas no processo têm precedência. `BASE_URL` permite apontar para outro deploy da **mesma aplicação e contrato funcional**, não para qualquer site. `E2E_USERNAME` e `E2E_PASSWORD` permitem substituir a conta padrão.

As credenciais `standard_user` / `secret_sauce` são públicas no próprio demo. Produtos, preços e dados fictícios do cliente ficam centralizados em `tests/data/test-data.ts`. O checkout usa o imposto de 8% do demo como contrato conhecido; essa expectativa deve ser revisada se a regra mudar. Não há necessidade de Faker ou cadastro de contas para estes casos. As expectativas usam os nomes e a quantidade de produtos conhecidos no catálogo do demo; se o catálogo mudar, os critérios deverão ser revisados.

Cada teste recebe um novo BrowserContext do Playwright. Não compartilha cookies, localStorage ou sessão com outros testes. A autenticação dos testes de carrinho e checkout é preparada por uma fixture com escopo de teste, pela interface. Os casos de autenticação exercitam o login diretamente. Nenhum teste depende da execução prévia de outro.

## Organização

| Caminho | Responsabilidade |
| --- | --- |
| `tests/specs/` | Cenários e assertions de negócio |
| `tests/pages/` | Quatro Page Objects com locators e ações reutilizáveis |
| `tests/fixtures/test.fixture.ts` | Injeção dos Page Objects, autenticação e captura de evidências |
| `tests/data/test-data.ts` | Tipos e massas de teste |
| `playwright.config.ts` | Ambientes, navegadores, concorrência, timeouts e evidências |
| `.github/workflows/playwright.yml` | Pipeline no GitHub Actions |
| `docs/decisoes-tecnicas.md` | Justificativas, limitações e evolução da estrutura |
| `docs/validacao.md` | Resultado e limites da verificação desta entrega |

## Seletores e sincronização

Botões são localizados por role e nome acessível. Campos e estruturas usam o contrato `data-test` da aplicação, configurado em `testIdAttribute`. Produtos são encontrados pela combinação do identificador `inventory-item-name` com o texto exato, dentro da coleção de itens da página. As ações ficam restritas ao produto correspondente. A verificação do carrinho não depende da ordem em que os produtos aparecem. Não há XPath, classes de apresentação, `nth()` para escolher produtos, cliques forçados ou esperas fixas.

As verificações de UI usam `await expect(locator)` e de navegação usam `toHaveURL`, aproveitando as tentativas automáticas do Playwright. Os Page Objects concentram interação; os testes mantêm visíveis as expectativas de negócio. A fixture verifica sua própria pré-condição antes de entregar a página autenticada. A navegação inicial usa `domcontentloaded`; a prontidão para interação é verificada pelo auto-waiting de `fill`/`click` e pelas assertions de comportamento, sem depender da conclusão de recursos externos de apresentação.

## Evidências e relatório

Após qualquer execução:

- `playwright-report/`: relatório HTML com status, duração e etapas dos testes.
- `test-results/junit.xml`: resultado em formato JUnit.
- `test-results/`: imagens PNG dos checkpoints validados de cada teste, incluindo casos aprovados; screenshot automático, vídeo e trace em caso de falha, quando o navegador puder iniciar.

Cada cenário utiliza a fixture `captureEvidence` após suas assertions para salvar imagens de página inteira e anexá-las ao relatório HTML com nomes descritivos. Elas ficam na pasta individual do teste em `test-results/`, isoladas por teste, navegador e tentativa. Cenários negativos aprovados também geram imagens da mensagem esperada.

| Caso | Imagens dos checkpoints validados |
| --- | --- |
| CT01 | Catálogo após login válido |
| CT02 | Mensagem de rejeição da senha inválida |
| CT03 | Carrinho, resumo com valores, confirmação e carrinho vazio |
| CT04 | Erro de nome obrigatório e resumo após correção |
| CT05 | Dois produtos, remoção parcial e produto preservado ao navegar |

Uma execução completa aprovada no Chromium gera 11 capturas nomeadas, além dos relatórios. Checkpoints não alcançados por causa de uma falha não geram sua imagem de aprovação. O runner também mantém `screenshot: only-on-failure` para capturar o estado da falha automaticamente; vídeo e trace usam `retain-on-failure`. As imagens dos checkpoints são mantidas nos testes aprovados, enquanto vídeo e trace dos casos aprovados são descartados. Falhas anteriores à abertura do navegador podem não gerar imagem/vídeo, mas aparecem no relatório.

Para visualizar as imagens, execute `npm run test:report` e abra os anexos do teste. Os arquivos PNG também podem ser abertos diretamente na subpasta correspondente em `test-results/`. No GitHub Actions, baixe o artefato `playwright-results`, que já inclui relatório e imagens.

```bash
npm run test:report
npx playwright show-trace test-results/PASTA-DO-TESTE/trace.zip
```

O segundo caminho é um exemplo: use o caminho real informado no terminal ou abra o trace pelo relatório. Cada nova execução substitui os diretórios de saída; preserve o relatório antes de executar novamente se precisar compará-lo.

O relatório é gerado ao executar a suíte localmente. Consulte `docs/validacao.md` para saber o que foi verificado nesta revisão e o que ainda deve ser executado no ambiente de entrega.

## Paralelismo e CI

`fullyParallel: true` permite paralelismo inclusive no mesmo arquivo. Localmente são dois workers; no CI, um worker preserva recursos e reduz concorrência sobre o demo público. A CLI pode substituir esse limite.

O CI executa em push para `main`/`master`, pull request e disparo manual. Instala dependências e Chromium, valida tipos, executa os cinco casos e publica o relatório e as evidências por sete dias, inclusive em falhas. A política é zero retries localmente e uma repetição no CI. `failOnFlakyTests` faz o CI falhar também se um teste só passar na repetição: retry apoia o diagnóstico e não esconde instabilidade.

Firefox e WebKit estão configurados para execução opcional; o CI padrão usa Chromium para manter o desafio pequeno e rápido. A matriz multibrowser configurada não implica que todos os motores tenham sido validados nesta entrega; consulte `docs/validacao.md`.

## Publicar em um repositório

Crie um repositório vazio no GitHub, sem README inicial, e execute na raiz deste projeto, substituindo a URL pelo seu repositório:

```bash
git init -b main
git add .
git commit -m "test: adiciona cinco cenários E2E com Playwright"
git remote add origin https://github.com/SEU-USUARIO/qa-playwright-saucedemo.git
git push -u origin main
```

O `.gitignore` evita versionar dependências, `.env` e saídas de execução. Se o repositório for privado, conceda acesso aos avaliadores. Verifique a primeira execução em **Actions** e compartilhe a URL do repositório.

## Referências

Seções oficiais consultadas para as decisões aplicáveis ao desafio:

- [Best practices](https://playwright.dev/docs/best-practices)
- [Locators](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)
- [Page Objects](https://playwright.dev/docs/pom)
- [Fixtures](https://playwright.dev/docs/test-fixtures)
- [Configuration](https://playwright.dev/docs/test-configuration)
- [Recording options](https://playwright.dev/docs/test-use-options)
- [Parallelism](https://playwright.dev/docs/test-parallel)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)
- [Reporters](https://playwright.dev/docs/test-reporters)
- [CI](https://playwright.dev/docs/ci) e [GitHub Actions](https://playwright.dev/docs/ci-intro)
- [Código oficial da aplicação SauceDemo](https://github.com/saucelabs/sample-app-web)
