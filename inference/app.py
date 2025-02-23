from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ollama import chat, ChatResponse

class InferenceRequest(BaseModel):
    input_data: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/inference/{model_name}")
async def run_inference(model_name: str, request: InferenceRequest):
    try:
        if model_name not in ["llama3.2", "llama3.1:8b"]:
            raise HTTPException(status_code=400, detail="Model not supported")

        response: ChatResponse = chat(model=model_name, messages=[
            {
                'role': 'user',
                'content': request.input_data,
            },
        ])
        return {"output": response.message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
