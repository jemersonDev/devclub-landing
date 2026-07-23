# DevClub Evolution

Landing page institucional cinematográfica — Next.js 15 + TypeScript + Tailwind + GSAP + Framer Motion + React Three Fiber.

## Rodando localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build && npm start
```

## Estrutura da página (`src/app/page.tsx`)

1. **Hero cinematográfica** (`hero-intro.tsx`) — terminal com digitação realista char-a-char → 22 mil partículas em shader GLSL (`particle-symbol.tsx`) dissolvendo "código" e montando o símbolo `</>` (sampled de canvas 2D) → explosão suave → reveal com texto animado (`reveal-text.tsx`), aurora de fundo reativa ao mouse (`aurora-plane.tsx`), bloom via `@react-three/postprocessing`, cursor magnético global (`magnetic-cursor.tsx`) e CTA magnético (`magnetic-button.tsx`).
2. **Quem Somos** (`about-section.tsx`) — layout editorial assimétrico com coluna sticky e pilares em glass cards com stagger de entrada.
3. **Formações** (`courses-section.tsx`) — cards 3D com tilt real (`tilt-card.tsx`), glow por curso, animação de entrada com rotateX.
4. **Empresas** (`companies-section.tsx`) — dois anéis 3D contra-rotativos de logos (CSS puro, sem WebGL extra) com partículas ambiente 2D atrás (`ambient-particles.tsx`).
5. **Resultados** (`results-section.tsx`) — contadores cinematográficos (`count-up.tsx`) com números formados por partículas convergindo (`particle-number.tsx`, canvas 2D).
6. **Depoimentos** (`testimonials-section.tsx`) — carrossel de glass cards com vídeo (poster + play state); troque os arquivos em `/public/assets/videos/{id}.mp4`.
7. **Mentores** (`mentors-section.tsx`) — grid de perfis com avatar em anel gradiente e tilt sutil.
8. **CTA Final** (`final-cta.tsx`) — escurecimento e desaceleração via ScrollTrigger scrub, conforme o Capítulo 3 do briefing.
9. **Footer** (`footer.tsx`) — colunas de marca, mapa do site, newsletter e redes sociais (ícones magnéticos).

## Decisões técnicas relevantes

- **Um único contexto WebGL pesado** (Hero). As demais seções usam Canvas 2D ou CSS 3D para efeitos de profundidade/partículas — melhor para performance e para o Lighthouse, sem abrir múltiplos contextos GPU simultâneos.
- **GSAP + ScrollTrigger** centralizados em `src/lib/gsap.ts`, registrado uma única vez.
- **Lenis** sincronizado ao ticker do GSAP e ao `ScrollTrigger.update`.
- **ESLint 9 flat config** (`eslint.config.mjs`) já preparado para a remoção do `next lint` no Next 16.
- **Cursor customizado** desativa o cursor nativo apenas em `pointer: fine` (não afeta mobile/touch).
- **`prefers-reduced-motion`** respeitado no terminal, nas partículas ambiente, no particle-number e nos orbit rings.

## Troubleshooting

### `TypeError: Cannot read properties of undefined (reading 'ReactCurrentOwner')` — **RESOLVIDO (migração para React 19)**

Esse erro tinha uma causa raiz diferente do que uma primeira investigação sugeriu. Registro aqui o histórico completo porque é um caso instrutivo:

**Diagnóstico inicial (incorreto):** parecia ser duplicação de cópias do React na árvore de `node_modules`. Um `overrides` no `package.json` forçando uma única versão do React, mais `transpilePackages` no `next.config.ts`, pareciam a correção certa — mas o erro persistiu.

**Causa raiz real:** o Next.js 15.5.20 embute sua **própria cópia interna do React 19** dentro dos arquivos do pacote `next` (`next/dist/compiled/react`), usada pelo runtime do App Router — completamente independente da versão de `react` declarada no `package.json` do projeto. Como o projeto estava pinado em React 18.3.1 (exigido pelo `@react-three/fiber` v8, que só suporta React 18), existiam efetivamente **dois formatos de internals do React coexistindo**: o do `next` (React 19) e o da aplicação (React 18). O `@react-three/fiber` v8 tenta ler `ReactCurrentOwner` desses internals ao montar o sistema de eventos do `<Canvas>` — e como React 19 reformulou esse objeto interno, a leitura falha. Nenhum `overrides` de dependência resolve isso, porque a cópia do `next` não passa pela resolução normal do npm.

**Correção definitiva:** migração completa da stack de Three.js para as versões nativas de React 19 — `react`/`react-dom` 19.2.7, `@react-three/fiber` 9.6.1, `@react-three/drei` 10.7.7, `@react-three/postprocessing` 3.0.4. A v9 do `@react-three/fiber` foi reescrita para os internals do React 19 e **não depende mais de `react-reconciler`/`ReactCurrentOwner` em nenhum lugar** (confirmado por busca direta no código-fonte instalado). Com tudo em React 19 — inclusive a cópia interna do `next` —, não existe mais divergência de internals possível.

Breaking changes tratados nessa migração (todos já corrigidos no código):
- `useRef<T>()` sem argumento inicial não compila mais no React 19 — sempre passar um valor inicial explícito.
- `useRef<T>(null)` agora tipa como `RefObject<T | null>`, não `RefObject<T>` — hooks que devolvem refs foram ajustados.
- `<bufferAttribute>` no R3F v9 exige a prop `args={[array, itemSize]}` explicitamente.

Se ainda assim aparecer esse erro no seu ambiente, é 100% sinal de `node_modules`/cache antigos. Instalação limpa:

```bash
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

E um hard-refresh no navegador (Ctrl+Shift+R / Cmd+Shift+R) — o overlay de erro do Next às vezes mantém o stack trace antigo em tela até um reload completo.

## Pendências conhecidas (ambiente sandbox, não são bugs do código)

- O build aqui não busca as fontes do Google (`fonts.googleapis.com`) porque a rede deste ambiente de geração só libera domínios de pacotes (npm/pip). Rodando localmente ou no Netlify/Vercel com internet normal, `next/font/google` funciona sem alteração nenhuma.
- `npm audit` reporta 2 vulnerabilidades moderadas de um `postcss` **vendorizado dentro do próprio Next.js 15.5.20** (não é uma dependência nossa) — só será resolvido em um patch futuro do Next.

## Próximos passos sugeridos

- Substituir os avatares/iniciais dos mentores e os vídeos de depoimento por assets reais.
- Trocar os wordmarks de texto das empresas parceiras por logos reais em SVG (mantendo o mesmo sistema de anéis 3D).
- Rodar auditoria Lighthouse completa após o primeiro deploy (Performance/SEO/A11y/Best Practices ≥ 95).
- Adicionar testes de acessibilidade (contraste, navegação por teclado no carrossel de depoimentos e no orbit de empresas).

## Deploy na Netlify

O projeto já vem com `netlify.toml` configurado com o plugin oficial `@netlify/plugin-nextjs` (suporte a App Router, SSR e otimização de imagem do Next). Para publicar:

1. Suba o projeto para um repositório Git (GitHub/GitLab/Bitbucket).
2. Na Netlify: **Add new site → Import an existing project** e selecione o repositório.
3. A Netlify detecta o `netlify.toml` automaticamente — build command (`npm run build`) e publish (`.next`) já estão no arquivo.
4. Deploy.

O `netlify.toml` também inclui cache imutável de 1 ano para `/_next/static/*` e `/assets/*`, e headers de segurança (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).

## Auditoria final (Lighthouse, medido em navegador real)

- **Acessibilidade: 100**
- **Best Practices: 100**
- **SEO: 100**
- **Performance: ~73–76** no ambiente de teste

> Nota honesta sobre o Performance: medido com **WebGL por software (SwiftShader), sem GPU**, num container. A Hero usa Three.js + shaders + bloom + 22 mil partículas — pesada por design ("visual máximo"). Nesse pior-caso sem GPU, o custo de JS no thread principal durante o load derruba a métrica. Em navegador real com GPU o número sobe bastante. Otimizações aplicadas: o render loop do WebGL pausa quando a Hero sai da viewport (`frameloop` via IntersectionObserver), e o chunk do Three.js só baixa após o primeiro paint (via `requestIdleCallback`).

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS · GSAP + ScrollTrigger · Framer Motion · React Three Fiber v9 · Three.js · Drei · @react-three/postprocessing · Lenis · Zustand
