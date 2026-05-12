import json
import os
from typing import List, Optional

import anthropic
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Social Decode API")

allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [o.strip() for o in allowed_origins_raw.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """Você é um assistente especializado em ajudar pessoas autistas a compreender dinâmicas sociais.

Suas diretrizes:
- Explique regras sociais implícitas de forma explícita e literal
- Use exemplos concretos e específicos
- Nunca julgue o usuário
- Nunca diga "é óbvio", "todo mundo sabe" ou expressões similares
- Valide sempre a dificuldade do usuário antes de oferecer soluções
- Quando sugerir ações, seja específico sobre O QUE dizer e COMO agir
- Ofereça scripts sociais (frases prontas) quando apropriado
- Faça APENAS UMA pergunta por vez — nunca faça múltiplas perguntas em uma resposta
- Responda sempre em português do Brasil
- Tom: acolhedor, direto, sem metáforas rebuscadas, sem linguagem infantilizante
- Máximo de 600 tokens por resposta no chat

Quando o usuário descrever uma situação social, primeiro valide que você entendeu e faça uma pergunta específica para entender melhor o contexto antes de explicar."""


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]


class PlanRequest(BaseModel):
    situation: str
    messages: List[Message]


@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=600,
            system=SYSTEM_PROMPT,
            messages=[{"role": m.role, "content": m.content} for m in request.messages],
        )
        return {"content": response.content[0].text}
    except anthropic.APIError as e:
        raise HTTPException(status_code=502, detail=f"Erro na API de IA: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate-plan")
async def generate_plan(request: PlanRequest):
    plan_prompt = f"""Com base na nossa conversa sobre a situação: "{request.situation}"

Gere um plano de ação personalizado em formato JSON com a seguinte estrutura EXATA (sem texto antes ou depois do JSON):

{{
  "title": "título descritivo e específico da situação",
  "summary": "resumo em 1-2 frases explicando a dinâmica social envolvida de forma clara e direta",
  "activities": [
    {{
      "id": 1,
      "title": "título curto da atividade",
      "description": "descrição clara e específica do que fazer nesta atividade",
      "context": "onde e quando praticar esta atividade (ex: no trabalho durante o almoço, numa loja, por mensagem)",
      "observe": "o que observar e notar durante ou após a prática",
      "script": "frase ou frases prontas que podem ser usadas literalmente, ou null se não aplicável",
      "level": "leve"
    }}
  ]
}}

Regras para o plano:
- Inclua exatamente de 3 a 5 atividades
- Ordene da mais simples (leve) à mais desafiadora (intenso)
- O campo "level" deve ser exatamente: "leve", "moderado" ou "intenso"
- Scripts devem ser frases reais que o usuário pode usar literalmente
- Seja muito específico — evite instruções vagas como "tente conversar"
- Retorne APENAS o JSON válido, sem markdown, sem explicações"""

    messages_for_plan = [{"role": m.role, "content": m.content} for m in request.messages]
    messages_for_plan.append({"role": "user", "content": plan_prompt})

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            system=SYSTEM_PROMPT,
            messages=messages_for_plan,
        )

        content = response.content[0].text.strip()

        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        plan = json.loads(content)
        return plan
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar plano: {str(e)}")
    except anthropic.APIError as e:
        raise HTTPException(status_code=502, detail=f"Erro na API de IA: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
