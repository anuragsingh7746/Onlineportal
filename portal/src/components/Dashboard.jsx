import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; 

const Dashboard = ({onLogout}) =>{
    const [availableTests, setavailableTests] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const navigate = useNavigate();

    const handlelogouttotal = () => {
        onLogout();
        navigate('/');
    };

    useEffect(() =>{
        const fetchdashboard = async () =>{
            try{
                const response = await fetch(`${API_URL}/api/dashboard`);
                const data = await response.json();
                setavailableTests(data);
                setisLoading(false);
            } catch (error){
                console.log(error);
                setisLoading(false);
            }
        };
        fetchdashboard();
    }, []);

    if(isLoading){
        return <div>Loading your DashBoard</div>
    }

    const handletaketest = (testId) => {
        navigate(`/TestWindow/${testId}`);
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Student Dashboard</h1>
            <button onClick={handlelogouttotal}>Logout</button>
            <h2>Available Tests</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Test Name</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Subject</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
                </tr>
                </thead>
                <tbody>
                {availableTests.map((test) => (
                    <tr key={test._id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{test.name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{test.subject}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        {test.status === 'Available' ? (
                        <Popup trigger={<button> Take Test</button>} modal nested>{
                            close =>(
                                <div className='modal'>
                                    <div className='content'>
                                        Solve questions in the given time frame.
                                    </div>
                                    <div>
                                        <button onClick={ () => {handletaketest(test._id)}}>Start</button>
                                    </div>
                                </div>
                            )
                        }
                        </Popup>
                        ) : (
                        <button disabled>Completed</button>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>    
    );
};

export default Dashboard;