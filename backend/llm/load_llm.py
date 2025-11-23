from langchain_community.llms import LlamaCpp
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "Phi-3-mini-4k-instruct-q4.gguf")

def load_llm():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at: {MODEL_PATH}")
    
    try:
        llm = LlamaCpp(
            model_path=MODEL_PATH,
            temperature=0.2,
            n_ctx=4096,
            max_tokens=512,
            verbose=False
        )
        return llm
    except Exception as e:
        print(f"Failed to load model: {e}")
        raise