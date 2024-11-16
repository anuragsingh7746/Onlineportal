import React, { useState, useEffect, useCallback } from "react";
import Dropdown from "./Dropdown";
import "../styles/StudentLogTab.css";

const StudentLogsTab = () => {
    const [studentId, setStudentId] = useState(null);
    const [testId, setTestId] = useState(null);
    const [logsData, setLogsData] = useState(null);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);

    const [studentOptions, setStudentOptions] = useState([]);
    const [testOptions, setTestOptions] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    // Fetch students
    const fetchStudents = useCallback(async () => {
        const cachedStudents = localStorage.getItem("students");
        if (cachedStudents) {
            setStudentOptions(JSON.parse(cachedStudents));
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/studentLog`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ studentId: null, testId: null }),
            });
            if (!response.ok) {
                throw new Error("Failed to fetch students");
            }
            const data = await response.json();
            if (Array.isArray(data.student_ids)) {
                const formattedStudents = data.student_ids.map((id) => ({
                    label: id,
                    value: id,
                }));
                setStudentOptions(formattedStudents);
                localStorage.setItem("students", JSON.stringify(formattedStudents)); // Cache the students
            } else {
                throw new Error("Invalid response format for students");
            }
        } catch (err) {
            setError(err.message);
            setStudentOptions([]);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    // Fetch tests for a specific student
    const fetchTests = useCallback(async (studentId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/studentLog`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ studentId, testId: null }),
            });
            if (!response.ok) {
                throw new Error("Failed to fetch tests");
            }
            const data = await response.json();
            if (Array.isArray(data.test_ids)) {
                setTestOptions(data.test_ids.map((id) => ({ label: id, value: id })));
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

    // Fetch logs for a specific student and test
    const fetchLogs = useCallback(async (studentId, testId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/studentLog`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ studentId, testId }),
            });
            if (!response.ok) {
                throw new Error("Failed to fetch logs");
            }
            const data = await response.json();

            const tabSwitchCount = data.logs[0]?.tab_switch || 0;
            setTabSwitchCount(tabSwitchCount);
            setLogsData(data);
        } catch (err) {
            setError(err.message);
            setLogsData(null);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    // Fetch students on component mount
    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // Fetch tests when a student is selected
    useEffect(() => {
        if (studentId) {
            fetchTests(studentId);
            setTestId(null);
            setLogsData(null);
            setTabSwitchCount(0);
        } else {
            setTestOptions([]);
            setTestId(null);
            setLogsData(null);
            setTabSwitchCount(0);
        }
    }, [studentId, fetchTests]);

    // Fetch logs when both student and test are selected
    useEffect(() => {
        if (studentId && testId) {
            fetchLogs(studentId, testId);
        } else {
            setLogsData(null);
            setTabSwitchCount(0);
        }
    }, [testId, fetchLogs, studentId]);

    const getActivityStyle = (activity) => {
        if (activity.includes("Tab Switched")) {
            return "activity-tab-switch";
        }
        if (activity.includes("Test Started")) {
            return "activity-test-start";
        }
        if (activity.includes("Submitted Test")) {
            return "activity-test-submit";
        }
        if (activity.includes("Returned to Test Tab")){
            return "activity-tab-switch";
        }
        return "activity-default";
    };

    return (
        <div className="student-logs-tab">
            <h2 className="header">Student Logs</h2>
            {error && <div className="error-message">Error: {error}</div>}
            <div className="dropdowns">
                <Dropdown
                    label="Select Student"
                    options={studentOptions}
                    value={studentId || ""}
                    onChange={(value) => setStudentId(value || null)}
                />
                {studentId && (
                    <Dropdown
                        label="Select Test"
                        options={testOptions}
                        value={testId || ""}
                        onChange={(value) => setTestId(value || null)}
                    />
                )}
            </div>
            {loading && <div className="loading">Loading...</div>}
            {!loading && logsData && (
                <div className="logs-container">
                    <div className="score-section">
                        <h3 className="sub-header">Test Score</h3>
                        <p className="score">
                            <strong>Score:</strong> {logsData.score}
                        </p>
                        {tabSwitchCount > 0 && (
                            <p className="tab-switch">
                                <strong>Tab Switches:</strong> {tabSwitchCount} seconds
                            </p>
                        )}
                    </div>
                    <div className="activity-section">
                        <h3 className="sub-header">Activity Logs</h3>
                        <ul className="activity-list">
                            {logsData.logs[0].logs.map((log, index) => (
                                <li
                                    key={index}
                                    className={`activity-item ${getActivityStyle(
                                        log.activity_text
                                    )}`}
                                >
                                    <div className="timestamp">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </div>
                                    <div className="activity-text">{log.activity_text}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="time-section">
                        <h3 className="sub-header">Time Spent on Questions</h3>
                        <ul className="time-list">
                            {logsData.logs[0].times.map((time, index) => (
                                <li key={index} className="time-item">
                                    <div className="question-id">
                                        Question ID: <strong>{time.question_id}</strong>
                                    </div>
                                    <div className="time-spent">
                                        Time Spent: <strong>{time.time_spent.toFixed(2)}</strong>{" "}
                                        seconds
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {!loading && !logsData && testId && (
                <div className="no-logs">No logs available for this test.</div>
            )}
        </div>
    );
};

export default StudentLogsTab;
