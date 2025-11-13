# app/routes/chat.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app import model, database

router = APIRouter(prefix="/chat", tags=["Chat"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

active_connections = {}  # {"General": [ws1, ws2], ...}

@router.get("/rooms/{room_name}/messages")
def get_messages(room_name: str, db: Session = Depends(get_db)):
    room = db.query(model.Room).filter(model.Room.name == room_name).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    messages = (
        db.query(model.Message)
        .filter(model.Message.room_id == room.id)
        .order_by(model.Message.timestamp)
        .all()
    )
    return [
        {
            "user": m.user,
            "content": m.content,
            "type": m.type,
            "timestamp": m.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        }
        for m in messages
    ]

@router.websocket("/ws/{room_name}")
async def websocket_endpoint(websocket: WebSocket, room_name: str, db: Session = Depends(get_db)):
    await websocket.accept()

    if room_name not in active_connections:
        active_connections[room_name] = []
    active_connections[room_name].append(websocket)

    try:
        while True:
            data = await websocket.receive_json()
            username = data.get("user", "Anonymous")
            message_text = data.get("content", "")
            mtype = data.get("type", "text")  # "text" | "image" | "audio"

            # Validate room
            room = db.query(model.Room).filter(model.Room.name == room_name).first()
            if not room:
                raise HTTPException(status_code=404, detail="Room not found")

            # Save message with type
            new_message = model.Message(
                user=username,
                content=message_text,
                type=mtype,
                room_id=room.id,
                timestamp=datetime.utcnow()
            )
            db.add(new_message)
            db.commit()
            db.refresh(new_message)

            msg_data = {
                "user": username,
                "content": message_text,
                "type": mtype,
                "timestamp": new_message.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            }

            # Broadcast to everyone in room
            to_remove = []
            for conn in active_connections.get(room_name, []):
                try:
                    await conn.send_json(msg_data)
                except Exception:
                    # schedule removal, e.g., broken connection
                    to_remove.append(conn)

            for r in to_remove:
                if r in active_connections.get(room_name, []):
                    active_connections[room_name].remove(r)

    except WebSocketDisconnect:
        # remove connection on disconnect
        if websocket in active_connections.get(room_name, []):
            active_connections[room_name].remove(websocket)
    except Exception:
        # safe cleanup
        if websocket in active_connections.get(room_name, []):
            active_connections[room_name].remove(websocket)
