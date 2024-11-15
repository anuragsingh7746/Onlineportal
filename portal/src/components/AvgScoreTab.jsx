import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2"; // Import the Bar chart component from react-chartjs-2
import Dropdown from "./Dropdown"; // Custom dropdown component

const AvgScoreTab = () => {
    const [testOptions, setTestOptions] = useState([]);
    const [testId, setTestId] = useState(null);
    const [stateName, setStateName] = useState(null);
    const [cityName, setCityName] = useState(null);

    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [chartData, setChartData] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userid = localStorage.getItem("userid");
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    useEffect(() => {
        fetchTests();
    }, []);

    useEffect(() => {
        if (testId) {
            setStateName(null);
            setCityName(null);
            fetchStates(testId);
        } else {
            setStateOptions([]);
            setStateName(null);
            setCityName(null);
            setChartData(null);
        }
    }, [testId]);

    useEffect(() => {
        if (stateName) {
            setCityName(null);
            fetchCities(testId, stateName);
        } else if (testId) {
            fetchStates(testId);
        }
    }, [stateName]);

    useEffect(() => {
        if (cityName) {
            fetchCenters(testId, stateName, cityName);
        } else if (stateName) {
            fetchCities(testId, stateName);
        }
    }, [cityName]);

    const fetchTests = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/get_tests`, {
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
                setTestOptions(data.map((test) => ({ label: test.name, value: test._id })));
            } else {
                throw new Error("Invalid response format");
            }
        } catch (err) {
            setError(err.message);
            setTestOptions([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStates = async (testId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/avgScore`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ testId: testId, state: null, city: null }),
            });
            if (!response.ok) {
                throw new Error("Failed to fetch states");
            }
            const data = await response.json();

            if (Array.isArray(data.data)) {
                setStateOptions(data.data.map((state) => ({
                    label: state.state,
                    value: state.state,
                })));
                prepareChartData(data.data, "state");
            } else {
                throw new Error("Invalid response format for states");
            }
        } catch (err) {
            setError(err.message);
            setStateOptions([]);
            setChartData(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchCities = async (testId, stateName) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/avgScore`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ testId: testId, state: stateName, city: null }),
            });
            if (!response.ok) {
                throw new Error("Failed to fetch cities");
            }
            const data = await response.json();

            if (Array.isArray(data.data)) {
                setCityOptions(data.data.map((city) => ({
                    label: city.city,
                    value: city.city,
                })));
                prepareChartData(data.data, "city");
            } else {
                throw new Error("Invalid response format for cities");
            }
        } catch (err) {
            setError(err.message);
            setCityOptions([]);
            setChartData(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchCenters = async (testId, stateName, cityName) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/avgScore`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ testId: testId, state: stateName, city: cityName }),
            });
            if (!response.ok) {
                throw new Error("Failed to fetch centers");
            }
            const data = await response.json();

            if (Array.isArray(data.data)) {
                prepareChartData(data.data, "center");
            } else {
                throw new Error("Invalid response format for centers");
            }
        } catch (err) {
            setError(err.message);
            setChartData(null);
        } finally {
            setLoading(false);
        }
    };

    const prepareChartData = (data, level) => {
        const labelKey = level === "state" ? "state" : level === "city" ? "city" : "center_id";

        setChartData({
            labels: data.map((item) => item[labelKey]),
            datasets: [
                {
                    label: `Average Score by ${capitalizeFirstLetter(level)}`,
                    data: data.map((item) => item.avg_score),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        });
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
                options={testOptions}
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
            ) : chartData ? (
                <div style={{ width: "100%", height: "500px" }}>
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: "Location",
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: "Average Score",
                                    },
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </div>
            ) : (
                <div>No data available</div>
            )}
        </div>
    );
};

export default AvgScoreTab;
