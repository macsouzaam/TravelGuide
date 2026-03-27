# TravelGuide

Aplicativo de geração de roteiros de viagem com IA. O usuário informa destino, duração, estilo de viagem, orçamento e interesses; o sistema monta um prompt customizado e envia para o modelo escolhido (Gemini, OpenAI ou Claude).

Interface bilíngue: **Português (pt-BR)** e **English**.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilo | CSS puro com variáveis |
| API | Route Handler (`/api/itinerary`) |
| LLMs | Gemini, OpenAI, Anthropic Claude |

---

## Rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Abra .env.local e preencha ao menos uma chave de API

# 3. Iniciar servidor de dev
npm run dev
```

Acesse `http://localhost:3000`.

> **Sem chave configurada** a API retorna um roteiro de demonstração (mock), o que permite testar toda a UI sem custos.

---

## Provedores de IA

| Variável | Provider | Modelo padrão |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI | `gpt-4o-mini` |
| `GEMINI_API_KEY` | Google Gemini | `gemini-1.5-flash` |
| `CLOUD_API_KEY` + `CLOUD_API_URL` | Claude / qualquer API OpenAI-compatible | `claude-3-5-haiku-latest` |

---

## Estrutura de diretórios

```
src/
├── app/
│   ├── api/itinerary/route.ts   # API que chama os providers
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # UI principal (bilíngue, client component)
└── lib/
	├── copy.ts                  # Todos os textos pt-BR / en
	├── mockItinerary.ts         # Roteiro de demo (sem chave)
	├── promptBuilder.ts         # Monta prompt customizado por parâmetros
	├── types.ts                 # Tipos compartilhados
	└── providers/
		├── openai.ts
		├── gemini.ts
		└── cloud.ts             # Anthropic Claude ou endpoint compatível
```

---

## Próximos passos (AWS)

1. **Armazenar histórico**: DynamoDB ou RDS para salvar roteiros por usuário.
2. **Autenticação**: Amazon Cognito + NextAuth.
3. **Deploy**: AWS Amplify (Next.js SSR nativo) ou ECS + ALB.
4. **Secrets**: AWS Secrets Manager → variáveis de ambiente injetadas no container.
5. **Cache de prompts**: ElastiCache Redis para evitar chamadas repetidas à API de LLM.
