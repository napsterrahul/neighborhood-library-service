from pydantic import BaseModel, EmailStr, Field

class BookCreate(BaseModel):
    title: str = Field(..., min_length=1)
    author: str = Field(..., min_length=1)
    isbn: str = Field(..., min_length=10)
    total_copies: int = Field(..., gt=0)


class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    isbn: str
    total_copies: int
    available_copies: int

    class Config:
        from_attributes = True