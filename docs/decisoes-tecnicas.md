# Decisões técnicas e pontos para discussão

## Escopo e seleção dos cenários

A suíte contém exatamente cinco cenários: login válido (CT01), senha inválida (CT02), compra completa (CT03), campo obrigatório e correção no checkout (CT04) e remoção parcial do carrinho com retorno às compras (CT05). O escopo cobre um fluxo positivo, um negativo e um alternativo, conforme a versão solicitada do desafio.

O SauceDemo oferece contas públicas, um catálogo conhecido e identificadores explícitos de teste. Não exige cadastros reais ou pagamentos para estes casos. O CT05 representa uma mudança de decisão do usuário: escolher dois produtos, remover apenas um e continuar navegando sem perder o outro.

## Organização e TypeScript

Os quatro Page Objects correspondem a login, catálogo, carrinho e checkout. Eles concentram locators e ações; os specs mantêm as assertions de negócio visíveis. A fixture verifica a pré-condição de autenticação antes de entregar o catálogo aos testes de carrinho e checkout.

Não há classe base, wrappers genéricos de click/fill ou dependências de relatórios adicionais. O TypeScript estrito verifica os contratos de dados e APIs; `tsc --noEmit` é executado separadamente porque a transpilação do Playwright não substitui a verificação de tipos.

## Seletores e assertions

Botões são localizados por role e nome acessível. Estruturas e campos usam o contrato `data-test`. Produtos são selecionados pela interseção entre `inventory-item-name` e o texto exato do nome, dentro da coleção da página. Isso evita usar uma descrição com o mesmo texto como identificador do produto. Não são usados XPath, seletores posicionais ou classes de apresentação.

O CT01 verifica conteúdo do catálogo, quantidade de produtos e carrinho inicialmente vazio. O CT02 exige a mensagem específica, a permanência no login e a ausência do catálogo. O CT03 verifica produto, quantidade, preço, subtotal, imposto, total e confirmação da compra, além do esvaziamento do carrinho. O CT04 verifica o bloqueio por nome obrigatório, preservação dos demais campos e avanço após correção. O CT05 verifica a remoção do produto escolhido, a preservação do outro, o contador do carrinho e o estado após voltar às compras e reabrir o carrinho.

A existência dos dois produtos é validada individualmente com contagem total, sem impor ordem ao carrinho. A navegação inicial usa `domcontentloaded` para não aguardar recursos externos desnecessários. As assertions de UI aguardam automaticamente a condição esperada. Não há esperas fixas, cliques forçados ou tratamento que esconda falhas.

## Isolamento e massa

Cada caso recebe um BrowserContext novo e não depende da execução dos demais. A fixture autenticada tem escopo de teste; não são compartilhados arquivos de sessão ou páginas globais. O carrinho do demo mantém estado no navegador, permitindo usar a conta pública neste recorte. Em uma aplicação com carrinho no backend, contas ou dados exclusivos por teste poderiam ser necessários.

Contas e produtos ficam centralizados e tipados. Não é necessária geração aleatória de dados. Também não foi adicionada uma API externa sem relação com os cenários apenas para cumprir um diferencial.

## Diagnóstico e execução

O projeto utiliza relatório HTML e JUnit nativos, além de capturas nomeadas após as assertions dos checkpoints de todos os cenários. Cada imagem é salva na pasta individual do teste e anexada ao relatório. Em falhas, o runner também preserva screenshot automático, vídeo e trace. A execução local permite dois workers; o CI utiliza um por estabilidade e economia de recursos. O retry no CI apoia o diagnóstico; `failOnFlakyTests` também reprova resultados que só passam na repetição.

O smoke executa login válido e compra completa. A suíte completa no Chromium contém cinco testes. Os projetos Firefox e WebKit permitem uma matriz opcional de quinze execuções, sem acrescentar cenários funcionais.

## Limitações e evolução

A aplicação pública pode mudar ou ficar indisponível. A compra é simulada, sem comprovar pagamento ou persistência de pedidos em um backend real. A suíte não cobre segurança, acessibilidade, performance ou todas as combinações de campos obrigatórios. A validação executada e as restrições do ambiente estão em `validacao.md`.

Em um projeto real, a evolução deve partir dos riscos de negócio: ampliar os fluxos críticos, distribuir cobertura entre unidade/API/E2E, preparar massas isoladas quando necessário e ampliar navegadores conforme o perfil de uso. Componentes compartilhados e sharding podem ser introduzidos quando o tamanho da suíte justificar.

## Roteiro para a conversa técnica

Apresente a matriz de cinco cenários, execute `npm run check` e abra o relatório. Mostre como o CT05 valida o item removido e o preservado, e como sua fixture autentica em um contexto novo sem depender do CT01. Explique a escolha entre role e data-test e apresente uma limitação real antes de propor uma evolução.
