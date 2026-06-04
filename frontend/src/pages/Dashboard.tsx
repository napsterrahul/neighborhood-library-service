import { useEffect, useState } from "react";
import api from "../api/api";

function Dashboard() {

    const [stats, setStats] = useState<any>({
        total_books: 0,
        total_members: 0,
        borrowed_books: 0,
    });

    useEffect(() => {
        api.get("/dashboard/stats")
            .then((res) => setStats(res.data))
            .catch(console.error);
    }, []);

    return (
        <div className="page-container">

            <h1 className="page-title">
                Library Dashboard
            </h1>

            <div className="dashboard-grid">

                <div className="stat-card books">
                    <div className="stat-number">
                        {stats.total_books}
                    </div>
                    <div className="stat-title">
                        📚 Total Books
                    </div>
                </div>

                <div className="stat-card members">
                    <div className="stat-number">
                        {stats.total_members}
                    </div>
                    <div className="stat-title">
                        👥 Total Members
                    </div>
                </div>

                <div className="stat-card borrowed">
                    <div className="stat-number">
                        {stats.borrowed_books}
                    </div>
                    <div className="stat-title">
                        🔄 Borrowed Books
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;