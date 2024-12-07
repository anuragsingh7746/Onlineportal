import React, { useState, useEffect, useCallback } from "react";
import Dropdown from "./Dropdown";
import "../styles/StudentLogTab.css"; // Reuse CSS styles

const FlaggedResultsTab = () => {
    const [testId, setTestId] = useState(null);
    const [flaggedData, setFlaggedData] = useState(null);

    const [testOptions, setTestOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    // Fetch test IDs for the dropdown
    const fetchTestOptions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const userId = localStorage.getItem("userid"); // Get userId from localStorage
            if (!userId) {
                throw new Error("User ID not found in localStorage");
            }

            const response = await fetch(`${API_URL}/api/get_tests`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch test options");
            }

            const data = await response.json();

            // Update response handling to match new backend structure
            if (data && Array.isArray(data.tests)) {
                const formattedTests = data.tests.map((test) => ({
                    label: test.name, // Use the "name" field for display
                    value: test._id,  // Use the "_id" field for test selection
                }));
                setTestOptions(formattedTests);
            } else {
                throw new Error("Invalid response format for tests");
            }
        } catch (err) {
            setError(err.message);
            setTestOptions([]);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    // Fetch flagged results for a specific test
    const fetchFlaggedResults = useCallback(async (testId) => {
        setLoading(true);
        setError(null);
        try {
            const userId = localStorage.getItem("userid"); // Get userId from localStorage
            if (!userId) {
                throw new Error("User ID not found in localStorage");
            }

            const response = await fetch(`${API_URL}/api/evaluate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, testId }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch flagged results");
            }

            const data = await response.json();

            // Ensure proper data handling for flagged results
            setFlaggedData(data);
        } catch (err) {
            setError(err.message);
            setFlaggedData(null);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    // Fetch test options on component mount
    useEffect(() => {
        fetchTestOptions();
    }, [fetchTestOptions]);

    // Fetch flagged results when a test is selected
    useEffect(() => {
        if (testId) {
            fetchFlaggedResults(testId);
        } else {
            setFlaggedData(null);
        }
    }, [testId, fetchFlaggedResults]);

    return (
        <div className="student-logs-tab">
            <h2 className="header">Flagged Results</h2>
            {error && <div className="error-message">Error: {error}</div>}

            <div className="dropdowns">
                <Dropdown
                    label="Select Test"
                    options={testOptions}
                    value={testId || ""}
                    onChange={(value) => setTestId(value || null)}
                />
            </div>

            {loading && <div className="loading">Loading...</div>}

            {!loading && flaggedData && (
                <div className="logs-container">
                    <div className="score-section">
                        <h3 className="sub-header">Flagged Users</h3>
                        <ul className="activity-list">
                            {flaggedData.flagged_users?.length > 0 ? (
                                flaggedData.flagged_users.map((userId, index) => (
                                    <li key={index} className="activity-item">
                                        <div className="activity-text">
                                            User ID: <strong>{userId}</strong>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="activity-item">No flagged users</li>
                            )}
                        </ul>
                    </div>

                    <div className="activity-section">
                        <h3 className="sub-header">Flagged Centers</h3>
                        <ul className="activity-list">
                            {flaggedData.flagged_centers?.length > 0 ? (
                                flaggedData.flagged_centers.map((centerId, index) => (
                                    <li key={index} className="activity-item">
                                        <div className="activity-text">
                                            Center ID: <strong>{centerId}</strong>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="activity-item">No flagged centers</li>
                            )}
                        </ul>
                    </div>
                </div>
            )}

            {!loading && !flaggedData && testId && (
                <div className="no-logs">No flagged results available for this test.</div>
            )}
        </div>
    );
};

export default FlaggedResultsTab;
