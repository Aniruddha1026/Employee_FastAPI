from fastapi import FastAPI,Depends,HTTPException,Query
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from db import get_db
import models
import schemas
from typing import List
from passlib.context import CryptContext
from jose import JWTError,jwt
from dotenv import load_dotenv
import os
from datetime import datetime,timedelta

app=FastAPI()
load_dotenv()

app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"],)
app.mount("/static",StaticFiles(directory="static"),name="static")


pwd_context=CryptContext(schemes=['bcrypt'],deprecated="auto")
SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60

oauth2_scheme=OAuth2PasswordBearer(tokenUrl='login')



def create_access_token(data: dict):
    to_encode=data.copy()
    expire=datetime.now()+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt=jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str, credentials_exception):
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        user_id=payload.get("user_id")
        if not user_id:
            raise credentials_exception
        token_data=schemas.TokenData(id=user_id)
    except JWTError:
        raise credentials_exception
    return token_data

def get_current_user(token: str=Depends(oauth2_scheme),db: Session=Depends(get_db)):
    credentials_exception=HTTPException(status_code=401,detail="Could not validate credentials",headers={"WWW-Authenticate":"Bearer"})
    token_data=verify_access_token(token,credentials_exception)
    user=db.query(models.User).filter(models.User.id==token_data.id).first()
    return user

@app.get('/')
def root():
    return RedirectResponse('/static/login.html')


@app.get('/register')
def register_page():
    return RedirectResponse('/static/register.html')

@app.get("/login")
def redirect_to_login():
    return RedirectResponse("/static/login.html")



@app.post('/register',response_model=schemas.User)
def register(employee: schemas.UserCreate,db: Session=Depends(get_db)):
    check_user=db.query(models.User).filter(models.User.email==employee.email).first()
    if check_user:
        raise HTTPException(status_code=409,detail="Employee with this email already exists")
    new_employee=models.User(**employee.model_dump())
    hash_password=pwd_context.hash(new_employee.password)
    new_employee.password=hash_password
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee

@app.post('/login',response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin,db: Session=Depends(get_db)):
    user_db=db.query(models.User).filter(models.User.email==user_credentials.email).first()
    if not user_db:
        raise HTTPException(status_code=403,detail="Invalid Credentials")
    if not pwd_context.verify(user_credentials.password,user_db.password):
        raise HTTPException(status_code=403,detail="Invalid Credentials")
    access_token=create_access_token(data={"user_id": user_db.id})
    return {"access_token": access_token,"token_type":"Bearer"}

@app.post('/employees',response_model=schemas.Employee)
def add_employee(employee: schemas.EmployeeCreate,db: Session=Depends(get_db),current_user: int=Depends(get_current_user)):
    new_employee=models.Employee(**employee.model_dump())
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee

@app.get('/employees/{employee_id}',response_model=schemas.Employee)
def get_employee_by_id(employee_id: int,db: Session=Depends(get_db),current_user: int=Depends(get_current_user)):
    employee=db.query(models.Employee).filter(models.Employee.id==employee_id).first()
    if not employee:
        raise HTTPException(status_code=404,detail="Employee not found")
    return employee

@app.get('/employees',response_model=List[schemas.Employee])
def get_employees(department: str=Query(default=None),position: str=Query(default=None),db: Session=Depends(get_db),current_user: int=Depends(get_current_user)):
    query=db.query(models.Employee)

    if department:
        query=query.filter(models.Employee.department==department)
    if position:
        query=query.filter(models.Employee.position==position)
    return query.all()

@app.put('/employees/{employee_id}',response_model=schemas.Employee)
def update_employee(employee_id: int,updates: schemas.EmployeeCreate,db: Session=Depends(get_db),current_user: int=Depends(get_current_user)):
    employee=db.query(models.Employee).filter(models.Employee.id==employee_id).first()
    if not employee:
        raise HTTPException(status_code=404,detail="Employee not found")
    for key,val in updates.model_dump().items():
        setattr(employee,key,val)
    db.commit()
    db.refresh(employee)
    return employee

@app.delete('/employees/{employee_id}')
def delete_employee(employee_id: int,db: Session=Depends(get_db),current_user: int=Depends(get_current_user)):
    employee=db.query(models.Employee).filter(models.Employee.id==employee_id).first()
    if not employee:
        raise HTTPException(status_code=404,detail="Employee not found")
    db.delete(employee)
    db.commit()
    return {"message":"Employee deleted successfully"}

