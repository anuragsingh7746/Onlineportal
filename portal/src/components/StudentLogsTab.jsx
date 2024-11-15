import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";

const StudentLogsTab = () => {
    const [studentId, setStudentId] = useState(null);
    const [testId, setTestId] = useState(null);
    const [logs, setLogs] = useState([]);

    const [studentOptions, setStudentOptions] = useState([]);
    const [testOptions, setTestOptions] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = 'http://your-api-url.com'; // Replace with your actual API URL

    useEffect(() => {
        // Fetch students when the component mounts
        fetchStudents();
    }, []);

    useEffect(() => {
        if (studentId) {
            // When a student is selected, fetch tests for that student
            fetchTests(studentId);
            setTestId(null); // Reset test selection
        } else {
            // Reset if no student is selected
            setTestOptions([]);
            setTestId(null);
            setLogs([]);
        }
    }, [studentId]);

    useEffect(() => {
        if (studentId && testId) {
            // When both student and test are selected, fetch logs
            fetchLogs(studentId, testId);
        } else {
            // Reset logs if selections are incomplete
            setLogs([]);
        }
    }, [studentId, testId]);

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/students`);
            if (!response.ok) {
                throw new Error("Failed to fetch students");
            }
            const data = await response.json();
            setStudentOptions(data.students); // Assume data.students is an array of student objects
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
            const response = await fetch(`${API_URL}/api/tests?studentId=${encodeURIComponent(studentId)}`);
            if (!response.ok) {
                throw new Error("Failed to fetch tests");
            }
            const data = await response.json();
            setTestOptions(data.tests); // Assume data.tests is an array of test objects
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
            const response = await fetch(
                `${API_URL}/api/student-logs?studentId=${encodeURIComponent(studentId)}&testId=${encodeURIComponent(testId)}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch logs");
            }
            const data = await response.json();
            setLogs(data.logs);
        } catch (err) {
            setError(err.message);
            setLogs([]);
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
                options={studentOptions.map((student) => ({ label: student.name, value: student.id }))}
                value={studentId || ""}
                onChange={(value) => setStudentId(value || null)}
            />
            {studentId && (
                <Dropdown
                    label="Select Test"
                    options={testOptions.map((test) => ({ label: test.name, value: test.id }))}
                    value={testId || ""}
                    onChange={(value) => setTestId(value || null)}
                />
            )}
            {loading && <div>Loading...</div>}
            {logs.length > 0 && (
                <div>
                    <h3>Activity Logs</h3>
                    <ul>
                        {logs.map((log, index) => (
                            <li key={index}>
                                <strong>{new Date(log.timestamp).toLocaleString()}</strong>: {log.activity_text}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default StudentLogsTab;
