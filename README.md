# Portfólio — Giovanny Lino

Portfólio pessoal de **Giovanny Lino**, Analista de Service Provider na Logicalis e estudante de Ciência da Computação (USCS), com foco em DevOps, SRE e automação de infraestrutura.

🔗 **[giovannylino.vercel.app](https://giovannylino.vercel.app)**

## Destaques

- **Gio.AI**, um assistente de IA integrado ao site, com um mascote que reage à conversa (pensa, fala, aponta para a página). Ele:
  - responde sobre a trajetória, as skills e os projetos com base apenas no conteúdo do portfólio;
  - rola e destaca seções e projetos;
  - mostra cards e sugere próximas perguntas;
  - leva o visitante ao contato.
- **Tour guiado de 60 s** pelas seções do site, com roteiro fixo que funciona mesmo sem a IA.
- **Explorador de stack**: clicar em qualquer tecnologia abre o chat perguntando onde ela foi usada.
- **Base de conhecimento única** (`src/data/knowledge`): a página e o assistente leem do mesmo lugar.
- Português, inglês e espanhol, tema claro e escuro, layout responsivo e cores com contraste AA.

## Stack

| Camada | Tecnologias |
|---|---|
| Front-end | React 18, TypeScript, Vite 5, Tailwind CSS + shadcn/ui, CSS Modules (chat) |
| Assistente | Vercel Function (Node), Google Gemini (`@google/genai`) por trás de uma interface `LLMProvider`, Zod, Upstash Redis (rate limit) |
| Qualidade | Vitest + Testing Library, Playwright, ESLint, TypeScript em modo estrito no código novo |

## Como o Gio.AI funciona

```
Navegador (widget, carregado sob demanda)
   │  POST /api/chat  { messages, lang, section }
   ▼
api/chat.ts ── valida (Zod) · origem · rate limit por IP (hash) · timeout de 25 s
   │
   ▼
loop do agente ⇄ Gemini
   │  tools: searchPortfolio, getProjectDetails, navigateToSection,
   │         highlightProject, suggestNextSteps, openContact (webSearch opcional)
   ▼
Server-Sent Events → text · tool · ui · card · suggestions · done
```

- **Respostas fiéis:** o system prompt contém a base de conhecimento serializada. O modelo não deve inventar experiência, números ou links, e recusa pedidos fora do escopo e tentativas de prompt injection.
- **Ações na página:** as ferramentas de interface (rolar, destacar, contato) não fazem nada no servidor. Viram eventos que o navegador executa.
- **Resiliência:**
  - se a IA falhar ou o limite estourar, o chat responde com o FAQ local;
  - um 503 do Gemini é tentado de novo uma vez;
  - um modelo principal mais forte pode ter um modelo reserva (`GEMINI_FALLBACK_MODEL`).
- **Privacidade:** nenhum log guarda o conteúdo das conversas. Cada resposta gera uma linha anônima (`{"event":"chat_turn", …}`) com idioma, ferramentas usadas, resultado e duração.

## Estrutura

```
api/
  chat.ts                 POST /api/chat (Vercel Function)
  _lib/                   agente, tools, system prompt, provedor LLM, rate limit, validação
src/
  data/knowledge/         conteúdo do portfólio (perfil, experiência, projetos, skills, FAQ) + busca
  features/chat/          widget, mascote, tour, cliente SSE, protocolo compartilhado com a API
  components/             seções da página
  i18n/                   textos da interface (EN/PT/ES)
e2e/                      testes Playwright
```

## Rodando localmente

Requisitos: Node 20+ e npm.

```bash
npm install
cp .env.example .env.local   # preencha GEMINI_API_KEY
npm run dev                  # http://localhost:8080
```

O `npm run dev` também serve a API (`/api/chat`) pelo próprio Vite, sem precisar do Vercel CLI. Crie a chave do Gemini em [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Site + API em modo desenvolvimento |
| `npm run build` / `npm run preview` | Build de produção e pré-visualização |
| `npm test` | Testes unitários e de integração (Vitest) |
| `npm run typecheck` | TypeScript do app, do código estrito e da API |
| `npm run lint` | ESLint |
| `npm run e2e` | Testes de ponta a ponta (Playwright, usa o Google Chrome instalado; a API é simulada) |

## Variáveis de ambiente

Coloque-as no `.env.local` (local) ou em **Vercel → Project → Settings → Environment Variables**. Nenhuma vai para o navegador.

| Variável | Obrigatória | Padrão | Para quê |
|---|---|---|---|
| `GEMINI_API_KEY` | sim | — | Chave da API do Gemini |
| `GEMINI_MODEL` | não | `gemini-3.5-flash-lite` | Modelo principal |
| `GEMINI_FALLBACK_MODEL` | não | `gemini-3.5-flash-lite` | Modelo usado se o principal falhar ou demorar mais de 8 s (`none` desliga) |
| `GEMINI_THINKING_LEVEL` | não | padrão do modelo | `MINIMAL`, `LOW`, `MEDIUM` ou `HIGH` |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | recomendado | — | Rate limit compartilhado entre instâncias. A integração Upstash da Vercel cria `KV_REST_API_URL` / `KV_REST_API_TOKEN`, que também funcionam. Sem elas, o limite fica em memória, por instância |
| `RATE_LIMIT_REQUESTS` / `RATE_LIMIT_WINDOW_SECONDS` | não | `20` / `600` | Mensagens por visitante por janela |
| `CHAT_DAILY_LIMIT` | não | `0` (desligado) | Teto global de mensagens em 24 h, para proteger a cota gratuita |
| `IP_HASH_SALT` | recomendado | — | Texto aleatório usado no hash do IP antes de virar chave de rate limit |
| `ALLOWED_ORIGINS` | não | — | Origens extras autorizadas a chamar a API. O próprio domínio do deploy já é aceito |
| `WEB_SEARCH_ENABLED` | não | `false` | Ativa a tool `webSearch` (Wikipedia, sem chave) para explicar tecnologias |

## Deploy na Vercel

1. Importe o repositório na Vercel. O framework **Vite** é detectado sozinho.
2. Cadastre `GEMINI_API_KEY` e `IP_HASH_SALT`. Se quiser, adicione a integração **Upstash** do Marketplace (plano grátis).
3. Faça o deploy. O `vercel.json` já define a duração da função (30 s), os headers da API e o fallback da SPA.
4. Para acompanhar, abra **Logs** na Vercel e filtre por `chat_turn` (uso) ou `[chat]` (erros, como cota esgotada ou chave inválida).

## Atualizando o conteúdo

Tudo o que o site e o Gio.AI sabem está em `src/data/knowledge/`:
- `profile.ts`, `experience.ts`, `projects.ts`, `skills.ts` e `education.ts`;
- o FAQ (`faq.ts`), que monta as respostas a partir desses dados.

Cada texto tem versão em EN, PT e ES. Depois de editar, rode `npm test`. Os testes conferem:
- se todos os idiomas estão preenchidos;
- se os IDs referenciados existem;
- se nenhum telefone aparece no conteúdo.

Os currículos em PDF ficam em `public/`.

## Limitações conhecidas

- O plano gratuito do Gemini tem cota limitada e às vezes fica sobrecarregado. Quando isso acontece, o chat mostra a resposta do FAQ e oferece "Tentar de novo".
- No plano gratuito, o Google pode usar o conteúdo enviado para melhorar seus produtos.

## Contato

- 📧 [giovannylino9@gmail.com](mailto:giovannylino9@gmail.com)
- 💼 [linkedin.com/in/giovanny-lino](https://www.linkedin.com/in/giovanny-lino/)
- 🐙 [github.com/GiovannyLino](https://github.com/GiovannyLino)
