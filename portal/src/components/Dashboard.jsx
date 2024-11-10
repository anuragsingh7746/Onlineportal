import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../styles/Dashboard.css'; 
import TestDetailsForm from './TestDetailsForm'; 

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Dashboard = ({ onLogout }) => {
    const [tab, setTab] = useState("available"); // Tab state for 'available', 'registered', 'given'
    const [availableTests, setAvailableTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showTestForm, setShowTestForm] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState(null);
    const navigate = useNavigate();

    // Retrieve registered and given tests from localStorage
    const registeredTests = JSON.parse(localStorage.getItem('registered_tests')) || [];
    const givenTests = JSON.parse(localStorage.getItem('given_tests')) || [];
    const userid = localStorage.getItem('userid');

    const handleLogoutTotal = () => {
        onLogout();
        navigate('/');
    };

    // Fetch available tests for registration
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch(`${API_URL}/api/tests/unregistered/upcoming`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userid,
                    }),
                });
                const data = await response.json();
                setAvailableTests(data);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };
        if (tab === "available") {
            fetchDashboard();
        }
    }, [tab, userid]);

    const handleEnroll = async (testId) => {
        try {
            const response = await fetch(`${API_URL}/api/tests/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userid,
                    testId: testId,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message || 'Enrolled successfully!');
                // Optionally update the available tests by refetching or filtering the enrolled test
                setAvailableTests(availableTests.filter(test => test._id !== testId));
            } else {
                alert(data.message || 'Failed to enroll.');
            }
        } catch (error) {
            console.error('Error enrolling in test:', error);
        }
    };

    const handleTakeTest = (testId) => {
        setSelectedTestId(testId);  
        setShowTestForm(true); 
    };

    const handleSubmitTestDetails = (formData) => {
        navigate(`/TestWindow/${selectedTestId}`, { state: { formData } });
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

            {/* Tabs for different test views */}
            <div className="tab-buttons">
                <button onClick={() => setTab("available")} className={tab === "available" ? "active-tab" : ""}>
                    Available Tests
                </button>
                <button onClick={() => setTab("registered")} className={tab === "registered" ? "active-tab" : ""}>
                    Registered Tests
                </button>
                <button onClick={() => setTab("given")} className={tab === "given" ? "active-tab" : ""}>
                    Given Tests
                </button>
            </div>

            {/* Display content based on the selected tab */}
            {tab === "available" && (
                <div>
                    <h2 className="sub-heading">Available Tests</h2>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th className="table-header">Test Name</th>
                                <th className="table-header">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {availableTests.map((test) => (
                                <tr key={test._id}>
                                    <td className="table-cell">{test.name}</td>
                                    <td className="table-cell">
                                        <button className="enroll-button" onClick={() => handleEnroll(test._id)}>Enroll</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === "registered" && (
                <div>
                    <h2 className="sub-heading">Registered Tests</h2>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th className="table-header">Test Name</th>
                                <th className="table-header">City</th>
                                <th className="table-header">State</th>
                                <th className="table-header">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registeredTests.map((test, index) => (
                                <tr key={index}>
                                    <td className="table-cell">{test.test_id}</td>
                                    <td className="table-cell">{test.city}</td>
                                    <td className="table-cell">{test.state}</td>
                                    <td className="table-cell">
                                        <button className="take-test-button" onClick={() => handleTakeTest(test.test_id)}>Take Test</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === "given" && (
                <div>
                    <h2 className="sub-heading">Given Tests</h2>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th className="table-header">Test ID</th>
                                <th className="table-header">Score</th>
                                <th className="table-header">City</th>
                                <th className="table-header">State</th>
                            </tr>
                        </thead>
                        <tbody>
                            {givenTests.map((test, index) => (
                                <tr key={index}>
                                    <td className="table-cell">{test.test_id}</td>
                                    <td className="table-cell">{test.score}</td>
                                    <td className="table-cell">{test.city}</td>
                                    <td className="table-cell">{test.state}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Test details form popup for registering a test */}
            {showTestForm && (
                <Popup open={showTestForm} modal closeOnDocumentClick={false}>
                    <TestDetailsForm onSubmit={handleSubmitTestDetails} onCancel={handleCancelTest} />
                </Popup>
            )}
        </div>
    );
};

export default Dashboard;
