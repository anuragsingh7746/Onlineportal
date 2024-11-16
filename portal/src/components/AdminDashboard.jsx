import React, { useState } from "react";
import AvgScoreTab from "./AvgScoreTab";
import AvgTimeTab from "./AvgTimeTab";
import StudentLogsTab from "./StudentLogsTab";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState("avgScore");
    const navigate = useNavigate();

    const handleLogoutTotal = () => {
        onLogout();
        localStorage.removeItem("tests");
        localStorage.removeItem("students");
        navigate("/");
    };

    return (
        <div className="admin-dashboard">
            {/* Logout Button */}
            

            {/* Page Heading */}
            <h1>Admin Dashboard</h1>

            <button onClick={handleLogoutTotal} className="logout-button">
                Logout
            </button>

            {/* Tabs */}
            <div className="tab-buttons">
                <button
                    onClick={() => setActiveTab("avgScore")}
                    className={activeTab === "avgScore" ? "active-tab" : ""}
                >
                    Average Score
                </button>
                <button
                    onClick={() => setActiveTab("avgTime")}
                    className={activeTab === "avgTime" ? "active-tab" : ""}
                >
                    Average Time
                </button>
                <button
                    onClick={() => setActiveTab("studentLogs")}
                    className={activeTab === "studentLogs" ? "active-tab" : ""}
                >
                    Student Logs
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "avgScore" && <AvgScoreTab />}
            {activeTab === "avgTime" && <AvgTimeTab />}
            {activeTab === "studentLogs" && <StudentLogsTab />}
        </div>
    );
};

export default AdminDashboard;
