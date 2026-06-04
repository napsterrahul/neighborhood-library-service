from fastapi import FastAPI

from app.core.database import Base
from app.core.database import engine

from app.models.book import Book
from app.models.member import Member
from app.models.borrow_record import BorrowRecord

from app.api.books import router as books_router
from app.api.members import router as members_router
from app.api.borrow import router as borrow_router
from app.api.dashboard import router as dashboard_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Neighborhood Library Service API",
    version="1.0.0"
)

app.include_router(books_router)
app.include_router(members_router)
app.include_router(borrow_router)
app.include_router(dashboard_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
            "http://localhost:3000",
            "https://neighborhood-library-service.vercel.app"
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Library Management API Running"
    }

