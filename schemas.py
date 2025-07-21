from pydantic import BaseModel, EmailStr
from datetime import date

class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    dob: date
    joining_date: date
    department: str
    position: str
    salary: float

class EmployeeCreate(EmployeeBase):
    pass 

class Employee(EmployeeBase):
    id: int

    class Config:
        from_attributes=True

class UserBase(BaseModel):
    email: EmailStr
    password: str

class UserCreate(UserBase):
    pass

class User(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes=True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: int