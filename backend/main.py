from fastapi import FastAPI
from app import model, database
from app.routes import auth, chats,upload
import os

from fastapi.middleware.cors import CORSMiddleware

model.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS setup
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://chatapp-fastapi-6pg7.onrender.com",
]

# Add frontend URL from env if provided
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-seed 3 rooms
def seed_rooms():
    db = database.SessionLocal()
    if db.query(model.Room).count() == 0:
        db.add_all([
            model.Room(name="General"),
            model.Room(name="Frontend"),
            model.Room(name="Backend")
        ])
        db.commit()
    db.close()

seed_rooms()

app.include_router(auth.router)
app.include_router(chats.router)
app.include_router(upload.router)

@app.get("/")
def root():
    return {"message": "Chat API running..."}
