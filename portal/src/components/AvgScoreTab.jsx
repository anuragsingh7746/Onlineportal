import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto"; // Import chart library
import Dropdown from "./Dropdown"; // Custom dropdown component

const AvgScoreTab = () => {
    const [testId, setTestId] = useState(null);
    const [stateName, setStateName] = useState(null);
    const [cityName, setCityName] = useState(null);

    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    useEffect(() => {
        if (testId) {
            setStateName(null);
            setCityName(null);
            fetchStates(testId);
        } else {
            // Reset if no test is selected
            setStateOptions([]);
            setStateName(null);
            setCityName(null);
            resetChart();
        }
    }, [testId]);

    useEffect(() => {
        if (stateName) {
            setCityName(null);
            fetchCities(testId, stateName);
        } else if (testId) {
            // If state is deselected, fetch states again
            fetchStates(testId);
        }
    }, [stateName]);

    useEffect(() => {
        if (cityName) {
            fetchCenters(testId, stateName, cityName);
        } else if (stateName) {
            // If city is deselected, fetch cities again
            fetchCities(testId, stateName);
        }
    }, [cityName]);

    const fetchStates = async (testId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/tests/${testId}/states`);
            if (!response.ok) {
                throw new Error("Failed to fetch states");
            }
            const data = await response.json();
            setStateOptions(data.map((item) => item.name));
            renderChart(data, "state");
        } catch (err) {
            setError(err.message);
            resetChart();
        } finally {
            setLoading(false);
        }
    };

    const fetchCities = async (testId, stateName) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${API_BASE_URL}/tests/${testId}/states/${encodeURIComponent(stateName)}/cities`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch cities");
            }
            const data = await response.json();
            setCityOptions(data.map((item) => item.name));
            renderChart(data, "city");
        } catch (err) {
            setError(err.message);
            resetChart();
        } finally {
            setLoading(false);
        }
    };

    const fetchCenters = async (testId, stateName, cityName) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${API_BASE_URL}/tests/${testId}/states/${encodeURIComponent(
                    stateName
                )}/cities/${encodeURIComponent(cityName)}/centers`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch centers");
            }
            const data = await response.json();
            renderChart(data, "center");
        } catch (err) {
            setError(err.message);
            resetChart();
        } finally {
            setLoading(false);
        }
    };

    const renderChart = (data, level) => {
        // Prepare data for the chart
        const chartData = {
            labels: data.map((item) => item.name),
            datasets: [
                {
                    label: `Average Score by ${capitalizeFirstLetter(level)}`,
                    data: data.map((item) => item.averageScore),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        };

        // Destroy existing chart instance to prevent overlay
        if (window.myChart instanceof Chart) {
            window.myChart.destroy();
        }

        const ctx = document.getElementById("avgScoreChart").getContext("2d");
        window.myChart = new Chart(ctx, {
            type: "bar",
            data: chartData,
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

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div>
            <h2>Average Score Analysis</h2>
            {error && <div style={{ color: "red" }}>Error: {error}</div>}
            <Dropdown
                label="Select Test"
                options={["Test 1", "Test 2", "Test 3"]}
                value={testId || ""}
                onChange={(value) => setTestId(value || null)}
            />
            {testId && (
                <Dropdown
                    label="Select State"
                    options={stateOptions}
                    value={stateName || ""}
                    onChange={(value) => setStateName(value || null)}
                />
            )}
            {stateName && (
                <Dropdown
                    label="Select City"
                    options={cityOptions}
                    value={cityName || ""}
                    onChange={(value) => setCityName(value || null)}
                />
            )}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div style={{ width: "100%", height: "500px" }}>
                    <canvas id="avgScoreChart"></canvas>
                </div>
            )}
        </div>
    );
};

export default AvgScoreTab;
