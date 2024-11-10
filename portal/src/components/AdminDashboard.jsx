import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../styles/Dashboard.css'; 
import TestDetailsForm from './TestDetailsForm'; 

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AdminDashboard = ({onLogout}) => {
    const [availableTests, setAvailableTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showTestForm, setShowTestForm] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState(null);
    const navigate = useNavigate();

    const handleLogoutTotal = () => {
        onLogout();
        navigate('/');
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch(`${API_URL}/api/dashboard`);
                const data = await response.json();
                setAvailableTests(data);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const handleTakeTest = (testId) => {
        setSelectedTestId(testId);  
        setShowTestForm(true); 
    };

    const handleSubmitTestDetails = (formData) => {
        navigate(`/TestWindow/${selectedTestId}`, { state: {formData} });
    };

    const handleCancelTest = () => {
        setShowTestForm(false); 
        setSelectedTestId(null); 
    };

    if (isLoading) {
        return <div>Loading your Dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-heading">Student Dashboard</h1>
            <button onClick={handleLogoutTotal} className="logout-button">Logout</button>
            <h2 className="sub-heading">Available Tests</h2>
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th className="table-header">Test Name</th>
                        <th className="table-header">Subject</th>
                        <th className="table-header">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {availableTests.map((test) => (
                        <tr key={test._id}>
                            <td className="table-cell">{test.name}</td>
                            <td className="table-cell">{test.subject}</td>
                            <td className="table-cell">
                                {test.status === 'Available' ? (
                                    <button className="take-test-button" onClick={() => handleTakeTest(test._id)}>Take Test</button>
                                ) : (
                                    <button className="completed-button" disabled>Completed</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showTestForm && (
                <Popup open={showTestForm} modal closeOnDocumentClick={false}>
                    <TestDetailsForm onSubmit={handleSubmitTestDetails} onCancel={handleCancelTest} />
                </Popup>
            )}
        </div>
    );
};

export default AdminDashboard;
