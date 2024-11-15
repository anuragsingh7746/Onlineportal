import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import Dropdown from "./Dropdown";

const AvgTimeTab = () => {
    const [testId, setTestId] = useState(null);
    const [questionId, setQuestionId] = useState(null);
    const [questionOptions, setQuestionOptions] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    useEffect(() => {
        if (testId) {
            fetchQuestions(testId);
            setQuestionId(null); // Reset question selection
        } else {
            // Reset if no test is selected
            setQuestionOptions([]);
            setQuestionId(null);
            resetChart();
        }
    }, [testId]);

    useEffect(() => {
        if (questionId) {
            fetchAvgTimeData(testId, questionId);
        } else if (testId) {
            // If question is deselected, reset chart
            resetChart();
        }
    }, [questionId]);

    const fetchQuestions = async (testId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/questions?testId=${testId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch questions");
            }
            const data = await response.json();
            setQuestionOptions(data.questions);
        } catch (err) {
            setError(err.message);
            setQuestionOptions([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvgTimeData = async (testId, questionId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${API_URL}/api/avg-time?testId=${testId}&questionId=${questionId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch average time data");
            }
            const data = await response.json();
            renderChart(data.times);
        } catch (err) {
            setError(err.message);
            resetChart();
        } finally {
            setLoading(false);
        }
    };

    const renderChart = (data) => {
        // Destroy existing chart instance to prevent overlay
        if (window.myChart instanceof Chart) {
            window.myChart.destroy();
        }

        const ctx = document.getElementById("avgTimeChart").getContext("2d");
        window.myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: data.map((item) => item.center),
                datasets: [
                    {
                        label: `Average Time per Center`,
                        data: data.map((item) => item.time),
                        borderColor: "rgba(255, 99, 132, 1)",
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        });
    };

    const resetChart = () => {
        if (window.myChart instanceof Chart) {
            window.myChart.destroy();
        }
    };

    return (
        <div>
            <h2>Average Time Analysis</h2>
            {error && <div style={{ color: "red" }}>Error: {error}</div>}
            <Dropdown
                label="Select Test"
                options={["Test 1", "Test 2", "Test 3"]}
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
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div style={{ width: "100%", height: "500px" }}>
                    <canvas id="avgTimeChart"></canvas>
                </div>
            )}
        </div>
    );
};

export default AvgTimeTab;
