import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../styles/Dashboard.css'; 
import TestDetailsForm from './TestDetailsForm'; 

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Dashboard = ({ onLogout }) => {
    const [tab, setTab] = useState("available");
    const [availableTests, setAvailableTests] = useState([]);
    const [registeredTests, setRegisteredTests] = useState(JSON.parse(localStorage.getItem('registered_tests')) || []);
    const [givenTests, setGivenTests] = useState(JSON.parse(localStorage.getItem('given_tests')) || []);
    const [isLoading, setIsLoading] = useState(true);
    const [showTestForm, setShowTestForm] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState(null);
    const navigate = useNavigate();
    const userid = localStorage.getItem('userid');

    const handleLogoutTotal = () => {
        onLogout();
        navigate('/');
    };

    // Fetch available tests for registration
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch(`${API_URL}/api/get_tests`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: userid }),
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
            const response = await fetch(`${API_URL}/api/enroll`, {
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
                
                // Use the registered_test returned in the response
                const { registered_test } = data;
    
                // Remove the test from availableTests
                setAvailableTests(availableTests.filter(test => test._id !== testId));
    
                // Add the registered_test from the response to registeredTests
                setRegisteredTests([...registeredTests, registered_test]);
    
                // Update registered tests in localStorage
                localStorage.setItem('registered_tests', JSON.stringify([...registeredTests, registered_test]));
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

    const handleSubmitTestDetails = () => {
        // Navigate to test-taking window
        navigate(`/TestWindow/${selectedTestId}`);
        handleCompleteTest(selectedTestId);  // Move test to givenTests after completion
    };

    const handleCompleteTest = (testId) => {
        // Move test from registeredTests to givenTests
        const completedTest = registeredTests.find(test => test.test_id === testId);
        setRegisteredTests(registeredTests.filter(test => test.test_id !== testId));
        setGivenTests([...givenTests, { ...completedTest, score: 0 }]); // Assume a default score of 0 or set as appropriate

        // Update registered and given tests in localStorage
        localStorage.setItem('registered_tests', JSON.stringify(registeredTests.filter(test => test.test_id !== testId)));
        localStorage.setItem('given_tests', JSON.stringify([...givenTests, { ...completedTest, score: 0 }]));
        
        setShowTestForm(false);  // Close test details form
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
                                    <td className="table-cell">{test.test_name}</td>
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
                            </tr>
                        </thead>
                        <tbody>
                            {givenTests.map((test, index) => (
                                <tr key={index}>
                                    <td className="table-cell">{test.test_id}</td>
                                    <td className="table-cell">{test.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Popup message for starting the test */}
            {showTestForm && (
                <Popup open={showTestForm} modal closeOnDocumentClick={false}>
                    <TestDetailsForm onSubmit={handleSubmitTestDetails} onCancel={handleCancelTest} />
                </Popup>
            )}
        </div>
    );
};

export default Dashboard;
