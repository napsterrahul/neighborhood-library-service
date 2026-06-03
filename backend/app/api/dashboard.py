from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.book import Book
from app.models.member import Member
from app.models.borrow_record import BorrowRecord

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def stats(
    db: Session = Depends(get_db)
):

    total_books = db.query(Book).count()

    total_members = db.query(Member).count()

    borrowed_books = (
        db.query(BorrowRecord)
        .filter(
            BorrowRecord.status == "BORROWED"
        )
        .count()
    )

    return {
        "total_books": total_books,
        "total_members": total_members,
        "borrowed_books": borrowed_books
    }