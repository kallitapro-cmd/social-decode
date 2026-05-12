# Social Decode

App que ajuda pessoas autistas a compreender e praticar dinâmicas sociais do dia a dia, através de conversas guiadas por IA e planos de ação com atividades práticas personalizadas.

## Estrutura

```
social-decode/
├── frontend/   # React + Vite + Tailwind CSS
└── backend/    # FastAPI + Python + Claude API
```

## Deploy

- **Frontend**: Hostinger (arquivos estáticos — pasta `dist/`)
- **Backend**: Render.com (plano free, Python)

---

## Frontend

### Configuração

```bash
cd frontend
cp .env.example .env
# Edite VITE_API_URL com a URL do seu backend no Render
npm install
npm run dev
```

### Build para produção

```bash
npm run build
# Upload da pasta dist/ + .htaccess para a Hostinger
```

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base do backend (ex: `https://social-decode.onrender.com`) |

---

## Backend

### Configuração local

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edite com sua ANTHROPIC_API_KEY e ALLOWED_ORIGINS
uvicorn main:app --reload
```

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `ANTHROPIC_API_KEY` | Chave da API da Anthropic |
| `ALLOWED_ORIGINS` | Origens CORS permitidas (ex: `https://seusite.com`) |

### Deploy no Render

1. Conecte o repositório no [Render.com](https://render.com)
2. Crie um novo Web Service com:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Adicione as variáveis de ambiente `ANTHROPIC_API_KEY` e `ALLOWED_ORIGINS`

### Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/api/chat` | Envia mensagem e recebe resposta da IA |
| `POST` | `/api/generate-plan` | Gera plano de ação em JSON |

---

## Tecnologias

- **Frontend**: React 18, Vite 6, Tailwind CSS 3, Lucide Icons
- **Backend**: FastAPI, Uvicorn, Anthropic SDK
- **IA**: Claude (claude-sonnet-4-20250514)

## Acessibilidade

- Navegação por teclado completa
- `aria-labels` descritivos em todos os elementos interativos
- Sem animações bruscas, sem autoplay de sons
- Contraste alto, fonte mínima 16px
- Tema escuro para reduzir sobrecarga sensorial
