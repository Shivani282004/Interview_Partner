Backend Setup (FastAPI + Local Phi Mini)
1️⃣ Navigate to backend
cd backend

2️⃣ Create virtual environment
python -m venv venv

3️⃣ Activate environment
Windows
venv\Scripts\activate

macOS/Linux
source venv/bin/activate

4️⃣ Install dependencies
pip install -r requirements.txt

5️⃣ Place your model
Make sure the model exists:
backend/models/Phi-3-mini-4k-instruct-q4.gguf

6️⃣ Run backend
uvicorn main:app --reload

Backend runs on:
👉 http://localhost:8000

 Frontend Setup (React + Vite)
1️⃣ Navigate to frontend
cd frontend

2️⃣ Install packages
npm install

3️⃣ Run frontend
npm run dev

Frontend runs on:
👉 http://localhost:5173
