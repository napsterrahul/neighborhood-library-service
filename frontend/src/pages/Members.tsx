import { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

function Members() {

    const [members, setMembers] = useState<any[]>([]);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
    });

    const loadMembers = async () => {

        const response =
            await api.get("/members/");

        setMembers(response.data);

    };

    useEffect(() => {

        loadMembers();

    }, []);

    const saveMember = async () => {

        if (!form.full_name.trim()) {
            toast.error("Member name is required");
            return;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.email)) {
            toast.error("Please enter a valid email");
            return;
        }

        const phoneRegex =
            /^[0-9]{10}$/;

        if (!phoneRegex.test(form.phone)) {
            toast.error(
                "Phone number must be 10 digits"
            );
            return;
        }

        await api.post(
            "/members/",
            form
        );
        toast.success(
            "Member created successfully"
        );

        resetForm();

        loadMembers();

    };

    const updateMember = async () => {

        if (!form.full_name.trim()) {
            toast.error("Member name is required");
            return;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.email)) {
            toast.error("Please enter a valid email");
            return;
        }

        const phoneRegex =
            /^[0-9]{10}$/;

        if (!phoneRegex.test(form.phone)) {
            toast.error(
                "Phone number must be 10 digits"
            );
            return;
        }

        await api.put(
            `/members/${editingId}`,
            form
        );
        toast.success(
            "Member updated successfully"
        );

        resetForm();

        loadMembers();

    };

    const deleteMember = async (
        id: number
    ) => {

        const result = await Swal.fire({
            title: "Delete Member?",
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
                `/members/${id}`
            );

            toast.success(
                "Member deleted successfully"
            );

            loadMembers();

        } catch (error: any) {

            toast.error(
                error?.response?.data?.detail ||
                "Unable to delete member"
            );

        }

    };

    const editMember = (
        member: any
    ) => {

        setEditingId(member.id);

        setForm({
            full_name:
            member.full_name,
            email:
            member.email,
            phone:
            member.phone,
        });

    };

    const resetForm = () => {

        setEditingId(null);

        setForm({
            full_name: "",
            email: "",
            phone: "",
        });

    };

    return (

        <div className="page-container">

            <h2>Members</h2>

            <div className="card-box">

                <div className="row">

                    <div className="col-md-3">

                        <input
                            className="form-control"
                            placeholder="Name"
                            value={form.full_name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    full_name:
                                    e.target.value,
                                })
                            }
                        />

                    </div>

                    <div className="col-md-3">

                        <input
                            className="form-control"
                            placeholder="Email"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    email:
                                    e.target.value,
                                })
                            }
                        />

                    </div>

                    <div className="col-md-3">

                        <input
                            className="form-control"
                            placeholder="Phone"
                            maxLength={10}
                            value={form.phone}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    phone:
                                    e.target.value,
                                })
                            }
                        />

                    </div>

                    <div className="col-md-3">

                        <button
                            className="btn btn-success me-2"
                            onClick={
                                editingId
                                    ? updateMember
                                    : saveMember
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

                            <th>Name</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>Actions</th>

                        </tr>

                        </thead>
                    <tbody>
                    {
                        members.map(
                            (member) => (

                                <tr
                                    key={member.id}
                                >

                                    <td>
                                        {member.id}
                                    </td>

                                    <td>
                                        {member.full_name}
                                    </td>

                                    <td>
                                        {member.email}
                                    </td>

                                    <td>
                                        {member.phone}
                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() =>
                                                editMember(member)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                deleteMember(
                                                    member.id
                                                )
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

export default Members;