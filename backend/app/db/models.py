from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    picture = Column(String)
    
    tasks = relationship("TaskModel", back_populates="user")

class TaskModel(Base):
    __tablename__ = "tasks"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    prompt = Column(String)
    status = Column(String)
    progress = Column(Integer, default=0)
    confidenceScore = Column(Integer, default=0)
    createdAt = Column(String)
    completedAt = Column(String, nullable=True)
    agents = Column(JSON, default=list)
    
    user = relationship("User", back_populates="tasks")
    result = relationship("TaskResultModel", back_populates="task", uselist=False)

class TaskResultModel(Base):
    __tablename__ = "task_results"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(String, ForeignKey("tasks.id"), unique=True)
    results = Column(JSON)
    
    task = relationship("TaskModel", back_populates="result")
