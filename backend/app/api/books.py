from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.book import Book

from app.schemas.book import BookCreate
from fastapi import HTTPException
from app.models.borrow_record import BorrowRecord

router = APIRouter(
    prefix="/books",
    tags=["Books"]
)


@router.get("/")
def get_books(
    db: Session = Depends(get_db)
):
    return db.query(Book).all()


@router.post("/")
def create_book(
    payload: BookCreate,
    db: Session = Depends(get_db)
):
    book = Book(
        title=payload.title,
        author=payload.author,
        isbn=payload.isbn,
        total_copies=payload.total_copies,
        available_copies=payload.total_copies
    )

    db.add(book)

    db.commit()

    db.refresh(book)

    return book

@router.put("/{book_id}")
def update_book(
    book_id: int,
    payload: BookCreate,
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == book_id).first()

    if not book:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    book.title = payload.title
    book.author = payload.author
    book.isbn = payload.isbn

    old_total = book.total_copies
    old_available = book.available_copies

    book.total_copies = payload.total_copies

    # Adjust available copies by the difference
    difference = payload.total_copies - old_total

    book.available_copies = max(
        0,
        old_available + difference
    )

    db.commit()
    db.refresh(book)

    return book


@router.delete("/{book_id}")
def delete_book(
    book_id: int,
    db: Session = Depends(get_db)
):

    book = (
        db.query(Book)
        .filter(Book.id == book_id)
        .first()
    )

    if not book:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    borrow_exists = (
        db.query(BorrowRecord)
        .filter(BorrowRecord.book_id == book_id,BorrowRecord.status == "BORROWED")
        .first()
    )

    if borrow_exists:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete a book that is currently borrowed"
        )

    db.delete(book)

    db.commit()

    return {
        "message": "Book deleted"
    }