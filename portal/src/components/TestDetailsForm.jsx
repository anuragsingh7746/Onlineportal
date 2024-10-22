import React, { useState } from 'react';
import '../styles/form.css';

const TestDetailsForm = ({ onSubmit, onCancel }) => {
  const [centerId, setCenterId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [testLocation, setTestLocation] = useState('');
  const [error, setError] = useState('');

  const isValidAlphanumeric = (value) => /^[a-zA-Z0-9]+$/.test(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setError('');

    if (!isValidAlphanumeric(centerId)) {
      setError('Center ID must be alphanumeric');
      return;
    }
    if (!isValidAlphanumeric(deviceId)) {
      setError('Device ID must be alphanumeric');
      return;
    }
    if (testLocation.trim() === '') {
      setError('Test location cannot be empty');
      return;
    }

    const formData = {
      centerId,
      deviceId,
      testLocation,
    };

    onSubmit(formData); 
  };

  return (
    <div className='modal'>
      <form onSubmit={handleSubmit}>
        <h3>Enter Test Details</h3>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          <label>Center ID:</label>
          <input
            type="text"
            value={centerId}
            onChange={(e) => setCenterId(e.target.value)}
            required
            placeholder="Alphanumeric ID"
          />
        </div>
        <div>
          <label>Device ID:</label>
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            required
            placeholder="Alphanumeric ID"
          />
        </div>
        <div>
          <label>Test Location:</label>
          <input
            type="text"
            value={testLocation}
            onChange={(e) => setTestLocation(e.target.value)}
            required
            placeholder="Enter location"
          />
        </div>
        <div>
          <button type="submit">Start Test</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default TestDetailsForm;
