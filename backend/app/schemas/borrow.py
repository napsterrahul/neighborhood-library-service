from pydantic import BaseModel


class BorrowBookRequest(BaseModel):
    member_id: int
    book_id: int


class ReturnBookRequest(BaseModel):
    borrow_record_id: int