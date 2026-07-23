# Auditoria Técnica — DevClub Evolution

Auditoria completa conduzida como Tech Lead Sênior, em duas passadas: (1) varredura + correção imediata de tudo que foi encontrado, (2) segunda verificação para confirmar produção-readiness.

## 🐛 Bugs reais encontrados e corrigidos

1. **Cursor customizado preso no canto em mobile.** `MagneticCursor` renderizava a bolinha/anel sempre, mesmo em `pointer:coarse`, e como o efeito só era desativado via `useEffect` (sem desmontar o DOM), ficava um ponto ciano cravado no canto superior esquerdo em qualquer celular. Corrigido: o componente agora detecta o tipo de ponteiro via `matchMedia` e **não renderiza nada** em touch, e ainda faz fade-in só depois do primeiro movimento real do mouse (evitando o "flash" em 0,0 no load).
2. **Glare do `TiltCard` com transform quebrado.** O GSAP anima `x`/`y` (que sobrescrevem `transform` inteiro) ao mesmo tempo que classes Tailwind de `translate-x/y-1/2` tentavam centralizar o glare — uma bate por cima da outra. Corrigido para usar `left/top` + `xPercent/yPercent` fixos (padrão correto do GSAP para não conflitar com CSS).
3. **Botão "Assinar" do rodapé não enviava o formulário.** Era um `<Link href="#">` disfarçado de botão — clicar nele navegava em vez de submeter. Criado `MagneticSubmitButton` (um `<button type="submit">` de verdade) e o formulário agora tem feedback real de sucesso.
4. **Dois `<h1>` na Hero.** "A evolução do desenvolvedor" e "começa aqui" estavam em elementos `<h1>` separados — semanticamente dois títulos de página no lugar de um. Unificados em um único `<h1>` com dois `<span>` animados dentro.
5. **Orbit de Empresas quebrava em telas pequenas.** Raio fixo em pixels (260px/140px) — em uma tela de 360px isso é maior que o próprio container, causando overflow horizontal. Agora o raio é calculado dinamicamente a partir da largura real do container (`ResizeObserver`), com `overflow-hidden` de segurança.
6. **`AmbientParticles` reiniciava sozinho.** O array default de cores (`colors = ["#38BDF8", ...]`) era recriado a cada render (nova referência), o que invalidava a dependência do `useEffect` e reiniciava a animação inteira sem motivo. Cores default agora vivem fora do componente.
7. **Aurora da Hero podia deixar frestas nas bordas.** O plano de fundo usava `viewport.width * 1.4` (um chute) para se dimensionar, mas a câmera perspectiva faz o campo de visão crescer com a distância — em certos aspect ratios sobrava fundo sólido visível na borda. Trocado por `getCurrentViewport` calculado exatamente na profundidade do plano.
8. **`prefers-reduced-motion` não cobria as animações do GSAP.** A regra CSS global só neutraliza `transition`/`animation` do CSS — tweens do GSAP mexem em `style` via JS e são invisíveis pra essa regra. Central izado em `src/lib/gsap.ts`: a timeline global acelera 50x quando o usuário pede menos movimento, resolvendo instantaneamente as entradas com stagger, a sequência da Hero e os contadores, sem precisar tocar em cada componente individualmente. O único loop infinito (scroll cue) foi tratado à parte, porque acelerar um yoyo infinito faria ele piscar rápido pra sempre — pior, não melhor.
9. **Framer Motion não respeitava `prefers-reduced-motion`.** Diferente do GSAP, a lib não olha pra essa preferência sozinha. Adicionado um `MotionProvider` (`<MotionConfig reducedMotion="user">`) global.
10. **Orbit de Empresas expondo dezenas de nomes girando para leitor de tela.** Sem tratamento, um leitor de tela tentaria anunciar nomes de empresas girando em looping infinito — confuso e inútil. A animação decorativa agora é `aria-hidden`, e uma lista simples em texto (`sr-only`) comunica as empresas de forma direta.

## 🧹 Código duplicado / limpeza

- Removidos `journey-section.tsx`, `journey-sidebar.tsx`, `use-active-section.ts` e o tipo/constant `JourneyStep`/`JOURNEY_STEPS` — sobras do rascunho inicial (Capítulo 2) que não eram mais referenciadas em lugar nenhum depois que a página ganhou a estrutura de seções definitiva.
- `CoursesSection` e `MentorsSection` reimplementavam manualmente o visual "glass card" em vez de reaproveitar `<GlassCard>` — refatorado para usar o componente compartilhado (mesma lógica de glow por mouse-tracking, um único lugar pra manter).
- `Navbar` e `Footer` tinham cada um sua própria lista de links de navegação, com risco real de ficarem dessincronizadas (o footer, aliás, já apontava pra uma âncora errada). Unificado em `src/constants/navigation.ts`.

## 🏗️ Arquitetura

- Faltava uma **navbar** — item estrutural de qualquer landing page premium, e também resolve parte da navegabilidade/acessibilidade. Adicionada: fixa, com estado de scroll, menu mobile animado em Framer Motion, e link "pular para o conteúdo" antes dela no DOM.
- Novo hook `useContainerWidth` (ResizeObserver) para qualquer componente que precise se dimensionar com base no próprio container em vez de valores fixos.
- Documentada explicitamente a decisão de manter **um único contexto WebGL pesado** (a Hero) e usar Canvas 2D/CSS 3D nas demais seções — trade-off de performance que qualquer revisor deveria conseguir entender só lendo o código.

## ⚡ Performance

- `next.config.ts`: `poweredByHeader: false`, `framer-motion` adicionado ao `optimizePackageImports`.
- Corrigido o resample desnecessário de partículas (ver bug do array de cores acima).
- Documentado por que a Hero **não** recalcula os 22 mil pontos do glifo em cada resize (custo alto, ganho cosmético baixo) — decisão consciente, não uma omissão.

## 🔍 SEO

- `viewport` export separado (`themeColor`), `alternates.canonical`, `keywords`.
- JSON-LD (`EducationalOrganization`) no `<head>`.
- `app/robots.ts` e `app/sitemap.ts` (antes inexistentes).
- Favicon dinâmico (`app/icon.tsx`) — sem isso, produção mostraria o ícone genérico do Next.

## ♿ Acessibilidade

- Corrigido o duplo `<h1>` da Hero.
- Orbit de Empresas: lista de empresas exposta de forma limpa via texto `sr-only`, animação decorativa marcada `aria-hidden`.
- Skip link "Pular para o conteúdo" (visível só no foco de teclado).
- Carrossel de Depoimentos agora é navegável por teclado (`tabIndex`, `focus-visible`) e tem botões de anterior/próximo — antes dependia só de arrastar/swipe.
- `<nav aria-label="Links do rodapé">` em volta do sitemap do footer.
- Cursor nativo restaurado em `input`/`textarea` (o cursor customizado unicode escondia o indicador de texto, prejudicando a usabilidade de formulários).
- `prefers-reduced-motion` agora cobre GSAP e Framer Motion, não só CSS puro (ver acima).

## 📱 Responsividade

- Orbit de Empresas corrigido (bug real, ver acima) — agora escala com o container em qualquer largura de tela.
- Navbar com menu mobile dedicado (antes não existia navbar nenhuma).

## 🎨 UX/UI e microinterações

- Formulário de newsletter agora funciona de verdade e dá feedback (`role="status"` com mensagem de sucesso).
- Carrossel de depoimentos ganhou setas de navegação visíveis (antes só swipe/scroll invisível).
- `data-cursor-hover` adicionado de forma consistente nos links do footer/sitemap (antes só nos ícones sociais tinham).

## Segunda auditoria (produção)

- `npx tsc --noEmit` → **0 erros**.
- `npx eslint src --max-warnings=0` → **0 problemas**.
- `npm run build` → build de produção completo, 7 rotas estáticas geradas (`/`, `/icon`, `/robots.txt`, `/sitemap.xml`, `/_not-found`), **First Load JS da home: 208 kB** (razoável para uma Hero com WebGL + GSAP + Framer Motion).
- `npm audit`: restam 2 vulnerabilidades moderadas de um `postcss` **vendorizado dentro do próprio Next.js 15.5.20** — não é dependência nossa, será resolvido em patch futuro do framework.
- Nenhum arquivo órfão: toda função/componente/hook criado é importado em algum lugar (verificado por varredura automática).

---

## 🏆 Nota como jurado Awwwards: **8.7 / 10**

**Site of the Day, não Site of the Year** — e é essa a categoria certa pra avaliar isso com honestidade.

| Critério | Nota | Justificativa |
|---|---|---|
| **Design** | 8.5/10 | Paleta consistente, hierarquia tipográfica clara, sistema de glass cards coeso. Perde meio ponto por não ter fotografia/ilustração real (avatares são iniciais, logos são texto) — funcional e elegante, mas ainda "esqueleto" visualmente em alguns pontos. |
| **Usabilidade** | 9/10 | Navbar, skip link, carrossel navegável, formulário funcional, cursor customizado que não atrapalha inputs. Ainda falta um teste real com usuários e leitores de tela (auditoria manual, não substitui). |
| **Criatividade** | 9/10 | O boot de terminal → partículas → símbolo é genuinamente memorável e conta a história certa. O orbit 3D de empresas com CSS puro é uma solução elegante (efeito grande, custo de performance pequeno). |
| **Conteúdo** | 8/10 | Copy em português consistente e específica do domínio (não genérica), mas ainda depende de assets reais (vídeos de depoimento, fotos de mentores, logos reais) para o polish final. |

### O que falta pros 10/10 (e não dá pra fingir que não falta)

1. **Assets reais.** Vídeos de depoimento, fotos de mentores, logos SVG reais das empresas parceiras. Isso é trabalho de conteúdo/design, não de engenharia — nenhuma quantidade de código resolve isso.
2. **Lighthouse real, em produção, com CDN e fontes carregando de verdade** — o que foi validado aqui foi a build e a arquitetura; o número exato de Performance/SEO/A11y só sai depois do primeiro deploy real (Netlify/Vercel), com internet de verdade servindo as fontes do Google.
3. **Testes com usuários reais de leitor de tela** (NVDA/VoiceOver) — a auditoria de código pega a maioria dos problemas estruturais, mas não substitui teste manual assistivo.
4. Um **teste de carga visual em dispositivos de entrada** (Android de baixo custo, principalmente pela Hero em WebGL) para confirmar que o fallback de performance do `PerformanceMonitor` do drei está de fato degradando bem.

Nenhum desses quatro pontos é uma falha do código entregue — são, honestamente, os últimos 10% que só existem depois que o site sai do ambiente de desenvolvimento e encontra o mundo real (conteúdo, deploy, usuários). Cheguei o mais perto possível de 10/10 dentro do que é responsabilidade de engenharia resolver sozinha.
