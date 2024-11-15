import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import '../styles/StudentLogTab.css'

const StudentLogsTab = () => {
    const [studentId, setStudentId] = useState(null);
    const [testId, setTestId] = useState(null);
    const [logs, setLogs] = useState([]);
    const [score, setScore] = useState(null);

    const [studentOptions, setStudentOptions] = useState([]);
    const [testOptions, setTestOptions] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (studentId) {
            fetchTests(studentId);
            setTestId(null);
            setLogs([]);
            setScore(null);
        } else {
            setTestOptions([]);
            setTestId(null);
            setLogs([]);
            setScore(null);
        }
    }, [studentId]);

    useEffect(() => {
        if (studentId && testId) {
            fetchLogs(studentId, testId);
        } else {
            setLogs([]);
            setScore(null);
        }
    }, [testId]);

    const fetchStudents = async () => {
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
                setStudentOptions(data.student_ids.map((id) => ({ label: id, value: id })));
            } else {
                throw new Error("Invalid response format for students");
            }
        } catch (err) {
            setError(err.message);
            setStudentOptions([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTests = async (studentId) => {
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
    };

    const fetchLogs = async (studentId, testId) => {
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
            setLogs(data.logs);
            setScore(data.score);
        } catch (err) {
            setError(err.message);
            setLogs([]);
            setScore(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Student Logs</h2>
            {error && <div style={{ color: "red" }}>Error: {error}</div>}
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
            {loading && <div>Loading...</div>}
            {!loading && logs.length === 0 && testId && <div>No logs available for this test.</div>}
            {!loading && logs.length > 0 && (
                <div>
                    <h3>Test Score</h3>
                    <p><strong>Score:</strong> {score}</p>
                    <h3>Activity Logs</h3>
                    <table border="1" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Activity</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs[0].logs.map((log, index) => (
                                <tr key={index}>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>{log.activity_text}</td>
                                    <td>{log.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3>Time Spent on Questions</h3>
                    <table border="1" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Question ID</th>
                                <th>Time Spent (seconds)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs[0].times.map((time, index) => (
                                <tr key={index}>
                                    <td>{time.question_id}</td>
                                    <td>{time.time_spent.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StudentLogsTab;
