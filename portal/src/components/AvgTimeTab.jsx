import React, { useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import Dropdown from "./Dropdown";

// Import and register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import "../styles/AvgTime.css"; // Import the updated CSS

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AvgTimeTab = () => {
    const [testOptions, setTestOptions] = useState([]);
    const [testId, setTestId] = useState(null);
    const [questionId, setQuestionId] = useState(null);
    const [questionOptions, setQuestionOptions] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userid = localStorage.getItem("userid");

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    const prepareChartData = useCallback((data) => {
        const labels = data.map((item) => item.center_id);
        const avgTimes = data.map((item) => item.avg_time);

        setChartData({
            labels,
            datasets: [
                {
                    label: "Average Time (Seconds)",
                    data: avgTimes,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        });
    }, []);

    const fetchTests = useCallback(async () => {
        const cachedTests = localStorage.getItem("tests");
        if (cachedTests) {
            setTestOptions(JSON.parse(cachedTests));
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/get_tests`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userid }),
            });
            if (!response.ok) {
                throw new Error("Failed to fetch tests");
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                const formattedTests = data.map((test) => ({
                    label: test.name,
                    value: test._id,
                }));
                setTestOptions(formattedTests);
                localStorage.setItem("tests", JSON.stringify(formattedTests)); // Cache the tests
            } else {
                throw new Error("Invalid response format for tests");
            }
        } catch (err) {
            setError(err.message);
            setTestOptions([]);
        } finally {
            setLoading(false);
        }
    }, [API_URL, userid]);

    const fetchQuestions = useCallback(
        async (testId) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/api/take_test`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userid,
                        testId: testId,
                    }),
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch questions");
                }
                const data = await response.json();

                if (data.questions && Array.isArray(data.questions)) {
                    setQuestionOptions(
                        data.questions.map((q) => ({
                            label: q,
                            value: q,
                        }))
                    );
                } else {
                    throw new Error("Invalid response format for questions");
                }
            } catch (err) {
                setError(err.message);
                setQuestionOptions([]);
            } finally {
                setLoading(false);
            }
        },
        [API_URL, userid]
    );

    const fetchAvgTimeData = useCallback(
        async (testId, questionId) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/api/getAvgTime`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        test_id: testId,
                        question_id: questionId,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch average time data");
                }

                const data = await response.json();

                if (Array.isArray(data.data)) {
                    prepareChartData(data.data);
                } else {
                    throw new Error("Invalid response format for average time data");
                }
            } catch (err) {
                setError(err.message);
                setChartData(null);
            } finally {
                setLoading(false);
            }
        },
        [API_URL, prepareChartData]
    );

    const resetQuestionOptions = () => {
        setQuestionOptions([]);
        setQuestionId(null);
        setChartData(null);
    };

    useEffect(() => {
        fetchTests();
    }, [fetchTests]);

    useEffect(() => {
        if (testId) {
            fetchQuestions(testId);
            setQuestionId(null);
        } else {
            resetQuestionOptions();
        }
    }, [testId, fetchQuestions]);

    useEffect(() => {
        if (questionId) {
            fetchAvgTimeData(testId, questionId);
        } else if (testId) {
            setChartData(null);
        }
    }, [questionId, fetchAvgTimeData, testId]);

    return (
        <div className="avg-time-tab">
            <h2 className="header">Average Time Analysis</h2>
            {error && <div className="error-message">Error: {error}</div>}
            <div className="dropdowns">
                <Dropdown
                    label="Select Test"
                    options={testOptions}
                    value={testId || ""}
                    onChange={(value) => setTestId(value || null)}
                />
                {testId && (
                    <Dropdown
                        label="Select Question"
                        options={questionOptions}
                        value={questionId || ""}
                        onChange={(value) => setQuestionId(value || null)}
                    />
                )}
            </div>
            {loading ? (
                <div className="loading">Loading...</div>
            ) : chartData ? (
                <div className="chart-container">
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                        }}
                    />
                </div>
            ) : (
                <div className="no-data">No data available</div>
            )}
        </div>
    );
};

export default AvgTimeTab;
