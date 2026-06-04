import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function Books() {

    const [books, setBooks] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [form, setForm] = useState({
        title: "",
        author: "",
        isbn: "",
        total_copies: 1,
    });

    const loadBooks = async () => {

        const response = await api.get("/books/");

        setBooks(response.data);

    };

    useEffect(() => {

        loadBooks();

    }, []);

    const saveBook = async () => {

        if (!form.title.trim()) {
            toast.error("Book title is required");
            return;
        }

        if (!form.author.trim()) {
            toast.error("Author name is required");
            return;
        }

        if (!form.isbn.trim()) {
            toast.error("ISBN is required");
            return;
        }

        if (form.total_copies < 1) {
            toast.error("Total copies must be greater than 0");
            return;
        }

        await api.post("/books/", form);

        toast.success("Book created successfully");

        resetForm();

        loadBooks();

    };

    const updateBook = async () => {
        if (!form.title.trim()) {
            toast.error("Book title is required");
            return;
        }

        if (!form.author.trim()) {
            toast.error("Author name is required");
            return;
        }

        if (!form.isbn.trim()) {
            toast.error("ISBN is required");
            return;
        }

        if (form.total_copies < 1) {
            toast.error("Total copies must be greater than 0");
            return;
        }

        await api.put(
            `/books/${editingId}`,
            form
        );
        toast.success("Book updated successfully");

        resetForm();

        loadBooks();

    };

    const deleteBook = async (
        id: number
    ) => {

        const result = await Swal.fire({
            title: "Delete Book?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Delete",
        });

        if (!result.isConfirmed) {
            return;
        }

        try {

            await api.delete(
                `/books/${id}`
            );

            toast.success(
                "Book deleted successfully"
            );

            loadBooks();

        } catch (error: any) {

            toast.error(
                error?.response?.data?.detail ||
                "Unable to delete book"
            );

        }

    };

    const editBook = (
        book: any
    ) => {

        setEditingId(book.id);

        setForm({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            total_copies: book.total_copies,
        });

    };

    const resetForm = () => {

        setEditingId(null);

        setForm({
            title: "",
            author: "",
            isbn: "",
            total_copies: 1,
        });

    };

    return (

        <div className="page-container">

            <h2>Books</h2>

            <div className="card-box">

                <div className="row">

                    <div className="col-md-3">

                        <input
                            className="form-control"
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    title: e.target.value,
                                })
                            }
                        />

                    </div>

                    <div className="col-md-3">

                        <input
                            className="form-control"
                            placeholder="Author"
                            value={form.author}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    author: e.target.value,
                                })
                            }
                        />

                    </div>

                    <div className="col-md-2">

                        <input
                            className="form-control"
                            placeholder="ISBN"
                            value={form.isbn}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    isbn: e.target.value,
                                })
                            }
                        />

                    </div>

                    <div className="col-md-2">

                        <input
                            className="form-control"
                            type="number"
                            min="1"
                            value={form.total_copies}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    total_copies:
                                        Number(e.target.value),
                                })
                            }
                        />

                    </div>

                    <div className="col-md-2">

                        <button
                            className="btn btn-primary me-2"
                            onClick={
                                editingId
                                    ? updateBook
                                    : saveBook
                            }
                        >
                            {
                                editingId
                                    ? "Update"
                                    : "Save"
                            }
                        </button>

                        {
                            editingId &&
                            (
                                <button
                                    className="btn btn-secondary"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )
                        }

                    </div>

                </div>

                <div className="table-responsive">
                    <table className="table table-bordered mt-4">

                    <thead>

                    <tr>

                        <th>ID</th>

                        <th>Title</th>

                        <th>Author</th>

                        <th>ISBN</th>

                        <th>Total</th>
                        <th>Available</th>

                        <th>Actions</th>

                    </tr>

                    </thead>

                    <tbody>

                    {
                        books.map(
                            (book) => (

                                <tr
                                    key={book.id}
                                >

                                    <td>
                                        {book.id}
                                    </td>

                                    <td>
                                        {book.title}
                                    </td>

                                    <td>
                                        {book.author}
                                    </td>

                                    <td>
                                        {book.isbn}
                                    </td>

                                    <td>
                                        {book.total_copies}
                                    </td>
                                    <td>
                                        {book.available_copies}
                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() =>
                                                editBook(book)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                deleteBook(book.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            )
                        )
                    }

                    </tbody>

                </table>
                </div>

            </div>

        </div>

    );
}

export default Books;