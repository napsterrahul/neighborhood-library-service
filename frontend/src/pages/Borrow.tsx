import { useEffect, useState } from "react";
import api from "../api/api";
import {toast} from "react-toastify";

function Borrow() {

    const [books, setBooks] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);

    const [memberId, setMemberId] = useState("");
    const [bookId, setBookId] = useState("");

    useEffect(() => {

        loadBooks();
        loadMembers();

    }, []);

    const loadBooks = async () => {

        const response = await api.get("/books/");

        setBooks(response.data);

    };

    const loadMembers = async () => {

        const response = await api.get("/members/");

        setMembers(response.data);

    };

    const borrowBook = async () => {
        if (!memberId) {
            toast.error("Please select a member");
            return;
        }

        if (!bookId) {
            toast.error("Please select a book");
            return;
        }

        try {

            await api.post("/borrow", {
                member_id: Number(memberId),
                book_id: Number(bookId),
            });

            toast.success("Book borrowed successfully");

            loadBooks();

        } catch (error: any) {

            toast.error(
                error?.response?.data?.detail ||
                "Unable to borrow book"
            );

        }

    };

    return (

        <div className="page-container">

            <h2>Borrow Book</h2>

            <div className="card-box">

                <div className="row">

                    <div className="col-md-5">

                        <label>Member</label>

                        <select
                            className="form-control"
                            value={memberId}
                            onChange={(e) =>
                                setMemberId(e.target.value)
                            }
                        >

                            <option value="">
                                Select Member
                            </option>

                            {members.map((member) => (

                                <option
                                    key={member.id}
                                    value={member.id}
                                >
                                    {member.full_name}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="col-md-5">

                        <label>Book</label>

                        <select
                            className="form-control"
                            value={bookId}
                            onChange={(e) =>
                                setBookId(e.target.value)
                            }
                        >

                            <option value="">
                                Select Book
                            </option>

                            {books.map((book) => (

                                <option
                                    key={book.id}
                                    value={book.id}
                                >
                                    {book.title}
                                    {" "}
                                    (
                                    {book.available_copies}
                                    )
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="col-md-2">

                        <label>&nbsp;</label>

                        <button
                            className="btn btn-primary w-100"
                            onClick={borrowBook}
                        >
                            Borrow
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Borrow;