from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.book import Book
from app.models.member import Member
from app.models.borrow_record import BorrowRecord
from datetime import datetime

from app.schemas.borrow import (
    BorrowBookRequest,
    ReturnBookRequest
)

router = APIRouter(
    tags=["Borrow"]
)


@router.post("/borrow")
def borrow_book(
    payload: BorrowBookRequest,
    db: Session = Depends(get_db)
):

    member = db.query(Member).filter(
        Member.id == payload.member_id
    ).first()

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )

    book = db.query(Book).filter(
        Book.id == payload.book_id
    ).first()

    if not book:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    if book.available_copies <= 0:
        raise HTTPException(
            status_code=400,
            detail="No copies available"
        )

    borrow_record = BorrowRecord(
        member_id=payload.member_id,
        book_id=payload.book_id,
        borrowed_at=datetime.utcnow(),
        due_date=datetime.utcnow() + timedelta(days=14),
        status="BORROWED"
    )

    book.available_copies -= 1

    db.add(borrow_record)

    db.commit()

    return {
        "message": "Book borrowed successfully"
    }


@router.post("/return")
def return_book(
    payload: ReturnBookRequest,
    db: Session = Depends(get_db)
):

    borrow_record = db.query(
        BorrowRecord
    ).filter(
        BorrowRecord.id == payload.borrow_record_id
    ).first()

    if not borrow_record:
        raise HTTPException(
            status_code=404,
            detail="Borrow record not found"
        )

    if borrow_record.returned_at:
        raise HTTPException(
            status_code=400,
            detail="Book already returned"
        )

    book = db.query(Book).filter(
        Book.id == borrow_record.book_id
    ).first()

    book.available_copies += 1

    borrow_record.returned_at = datetime.utcnow()

    borrow_record.status = "RETURNED"

    db.commit()

    return {
        "message": "Book returned successfully"
    }

@router.get("/members/{member_id}/borrowed-books")
def get_borrowed_books(
    member_id: int,
    db: Session = Depends(get_db)
):

    records = (
        db.query(BorrowRecord)
        .filter(
            BorrowRecord.member_id == member_id,
            BorrowRecord.status == "BORROWED"
        )
        .all()
    )

    result = []

    for record in records:

        book = (
            db.query(Book)
            .filter(Book.id == record.book_id)
            .first()
        )

        result.append(
            {
                "borrow_record_id": record.id,
                "book_id": book.id,
                "title": book.title,
                "borrowed_at": record.borrowed_at,
                "due_date": record.due_date
            }
        )

    return result

@router.get("/overdue-books")
def overdue_books(
    db: Session = Depends(get_db)
):

    overdue = (
        db.query(BorrowRecord)
        .filter(
            BorrowRecord.status == "BORROWED",
            BorrowRecord.due_date < datetime.utcnow()
        )
        .all()
    )

    result = []

    for record in overdue:

        member = (
            db.query(Member)
            .filter(Member.id == record.member_id)
            .first()
        )

        book = (
            db.query(Book)
            .filter(Book.id == record.book_id)
            .first()
        )

        result.append(
            {
                "borrow_record_id": record.id,
                "member_name": member.full_name,
                "book_title": book.title,
                "due_date": record.due_date
            }
        )

    return result

@router.get("/borrow-records")
def get_borrow_records(
    db: Session = Depends(get_db)
):

    records = (
        db.query(BorrowRecord)
#         .filter(BorrowRecord.status == "BORROWED")
        .all()
    )

    result = []

    for record in records:

        member = db.query(Member).filter(
            Member.id == record.member_id
        ).first()

        book = db.query(Book).filter(
            Book.id == record.book_id
        ).first()

        result.append({
            "borrow_record_id": record.id,
            "member_name": member.full_name,
            "book_title": book.title,
            "due_date": record.due_date,
            "status": record.status,
            "returned_at": record.returned_at
        })

    return result