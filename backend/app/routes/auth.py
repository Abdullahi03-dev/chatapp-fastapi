# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from passlib.context import CryptContext
# from jose import jwt
# from datetime import datetime, timedelta
# from app import model, database
# from app.schema import RegisterSchema, LoginSchema  # import your schemas

# router = APIRouter(prefix="/auth", tags=["Auth"])
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# SECRET_KEY = "secret123"
# ALGORITHM = "HS256"

# def get_db():
#     db = database.SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @router.post("/register")
# def register(data: RegisterSchema, db: Session = Depends(get_db)):
#     existing_user = db.query(model.User).filter(model.User.email == data.email).first()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     hashed = pwd_context.hash(data.password)
#     user = model.User(name=data.name, email=data.email, password=hashed)
#     db.add(user)
#     db.commit()
#     return {"msg": "User created successfully"}

# @router.post("/login")
# def login(data: LoginSchema, db: Session = Depends(get_db)):
#     user = db.query(model.User).filter(model.User.email == data.email).first()
#     if not user or not pwd_context.verify(data.password, user.password):
#         raise HTTPException(status_code=400, detail="Invalid email or password")

#     token_data = {
#         "sub": user.email,
#         "name": user.name,
#         "exp": datetime.utcnow() + timedelta(hours=2)
#     }
#     token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
#     return {"access_token": token, "user": {"name": user.name, "email": user.email} ,'name':user.name}



# app/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from app import model, database
from app.schema import RegisterSchema, LoginSchema

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
SECRET_KEY = "supersecret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3600


# -------------------- REGISTER --------------------
@router.post("/register")
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    existing_user = db.query(model.User).filter(model.User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = pwd_context.hash(data.password)
    user = model.User(name=data.name, email=data.email, password=hashed)
    db.add(user)
    db.commit()
    return {"msg": "User created successfully"}


# -------------------- LOGIN --------------------
@router.post("/login")
def login(data: LoginSchema, response: Response, db: Session = Depends(get_db)):
    user = db.query(model.User).filter(model.User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token_data = {
        "sub": user.email,
        "name": user.name,
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    # Store token in cookie
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        samesite="none",
        secure=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        # expires=int(expire.timestamp()),
        path="/"
    )

    return {"msg": "Login successful", "user": {"name": user.name, "email": user.email}}


# -------------------- DECRYPT ENDPOINT --------------------
@router.get("/decrypt")
def decrypt(request: Request):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="No token found")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"user": {"name": payload.get("name"), "email": payload.get("sub")}}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# -------------------- LOGOUT --------------------
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("token")
    return {"msg": "Logged out successfully"}
