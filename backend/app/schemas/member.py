from pydantic import BaseModel
from pydantic import EmailStr


class MemberCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str


class MemberResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str

    class Config:
        from_attributes = True