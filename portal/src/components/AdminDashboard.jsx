import React, { useState } from "react";
import AvgScoreTab from "./AvgScoreTab";
import AvgTimeTab from "./AvgTimeTab";
import StudentLogsTab from "./StudentLogsTab";
import { useNavigate } from 'react-router-dom';


const AdminDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState("avgScore");
    const navigate = useNavigate();

    const handleLogoutTotal = () => {
        onLogout();
        navigate('/');
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <button onClick={handleLogoutTotal} className="logout-button">Logout</button>
            <div className="tab-buttons">
                <button onClick={() => setActiveTab("avgScore")} className={activeTab === "avgScore" ? "active-tab" : ""}>Average Score</button>
                <button onClick={() => setActiveTab("avgTime")} className={activeTab === "avgTime" ? "active-tab" : ""}>Average Time</button>
                <button onClick={() => setActiveTab("studentLogs")} className={activeTab === "studentLogs" ? "active-tab" : ""}>Student Logs</button>
            </div>

            <div className="tab-content">
                {activeTab === "avgScore" && <AvgScoreTab />}
                {activeTab === "avgTime" && <AvgTimeTab />}
                {activeTab === "studentLogs" && <StudentLogsTab />}
            </div>
        </div>
    );
};

export default AdminDashboard;
