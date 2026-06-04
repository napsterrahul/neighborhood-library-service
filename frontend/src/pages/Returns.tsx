import { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

function Returns() {

    const [records, setRecords] = useState<any[]>([]);

    const loadRecords = async () => {

        const response = await api.get("/borrow-records");

        setRecords(response.data);

    };

    useEffect(() => {
        loadRecords();
    }, []);

    const returnBook = async (id: number) => {
        const result = await Swal.fire({
            title: "Return Book?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Return",
        });

        if (!result.isConfirmed) {
            return;
        }
        await api.post("/return", {
            borrow_record_id: id,
        });

        loadRecords();

    };

    return (
        <div className="page-container">

            <h2>Borrow History</h2>
            <div className="table-responsive">
                <table className="table table-bordered">

                    <thead>
                    <tr>
                        <th>Member</th>
                        <th>Book</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>

                    {records.map((record) => (

                        <tr key={record.borrow_record_id}>

                            <td>{record.member_name}</td>

                            <td>{record.book_title}</td>
                            <td>
                              <span
                                  className={
                                      record.status === "BORROWED"
                                          ? "badge bg-warning"
                                          : "badge bg-success"
                                  }
                              >
                                {record.status}
                              </span>
                            </td>
                            <td>{new Date(record.due_date).toLocaleString(
                                "en-IN",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            )}
                            </td>

                            <td>

                                {
                                    record.status === "BORROWED" && (
                                        <button
                                            className="btn btn-success"
                                            onClick={() =>
                                                returnBook(record.borrow_record_id)
                                            }
                                        >
                                            Return
                                        </button>
                                    )
                                }

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>
            </div>

        </div>
    );
}

export default Returns;