from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.member import Member

from app.schemas.member import MemberCreate
from app.models.borrow_record import BorrowRecord

router = APIRouter(
    prefix="/members",
    tags=["Members"]
)


@router.get("/")
def get_members(
    db: Session = Depends(get_db)
):
    return db.query(Member).all()


@router.post("/")
def create_member(
    payload: MemberCreate,
    db: Session = Depends(get_db)
):
    member = Member(
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone
    )

    db.add(member)

    db.commit()

    db.refresh(member)

    return member


@router.put("/{member_id}")
def update_member(
    member_id: int,
    payload: MemberCreate,
    db: Session = Depends(get_db)
):

    member = (
        db.query(Member)
        .filter(Member.id == member_id)
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )

    member.full_name = payload.full_name
    member.email = payload.email
    member.phone = payload.phone

    db.commit()

    return member


@router.delete("/{member_id}")
def delete_member(
    member_id: int,
    db: Session = Depends(get_db)
):

    member = (
        db.query(Member)
        .filter(Member.id == member_id)
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )

    borrow_exists = (
        db.query(BorrowRecord)
        .filter(
            BorrowRecord.member_id == member_id,BorrowRecord.status == "BORROWED"
        )
        .first()
    )

    if borrow_exists:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete member that is currently borrowed"
        )

    db.delete(member)

    db.commit()

    return {
        "message": "Member deleted"
    }