from sqlalchemy import Column, String,Integer,Float, DATE
from db import Base


class Employee(Base):
    __tablename__="employee"

    id=Column(Integer,primary_key=True,index=True)
    first_name=Column(String,nullable=False)
    last_name=Column(String)
    email=Column(String,unique=True,index=True,nullable=False)
    phone=Column(String,unique=True,index=True,nullable=False)
    dob=Column(DATE,nullable=False)
    joining_date=Column(DATE,index=True,nullable=False)
    department=Column(String,index=True,nullable=False)
    position=Column(String,index=True,nullable=False)
    salary=Column(Float,nullable=False)

class User(Base):
    __tablename__="user"

    id=Column(Integer,primary_key=True,index=True)
    email=Column(String,unique=True,nullable=False,index=True)
    password=Column(String,nullable=False)