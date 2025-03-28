import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MunicipalDashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/issue/all');
      setGrievances(response.data);
    } catch (err) {
      setError('Error fetching grievances');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const assignToAgent = async (issueId, department) => {
    try {
      await axios.put(`http://localhost:8080/issue/${issueId}/assign`, {
        department: department
      });
      alert('Grievance assigned successfully');
      fetchGrievances();
    } catch (err) {
      setError('Error assigning grievance');
      console.error(err);
    }
  };

  const grievanceTypes = [
    { value: 'all', label: 'All Grievances' },
    { value: 'Power Outage', label: 'Power Outage' },
    { value: 'Voltage Fluctuation', label: 'Voltage Fluctuation' },
    { value: 'Damaged Electric Pole', label: 'Damaged Electric Pole' },
    { value: 'Exposed Wires', label: 'Exposed Wires' },
    { value: 'Water Problem', label: 'Water Problem' },
    { value: 'Potholes', label: 'Potholes' },
    { value: 'Dog Problems', label: 'Dog Problems' },
    { value: 'Garbage Collection', label: 'Garbage Collection' },
    { value: 'Road Repair', label: 'Road Repair' }
  ];

  const filteredGrievances = grievances.filter(grievance => {
    if (filter === 'all') return true;
    return grievance.complaintType === filter;
  });

  return (
    <div className="municipal-dashboard">
      <h2>Municipal Officer Dashboard</h2>

      <div className="filters">
        {grievanceTypes.map(type => (
          <button
            key={type.value}
            onClick={() => setFilter(type.value)}
            className={filter === type.value ? 'active' : ''}
          >
            {type.label}
          </button>
        ))}
      </div>

      {loading && <p>Loading grievances...</p>}
      {error && <p className="error">{error}</p>}
      
      <div className="grievance-list">
        {filteredGrievances.map(grievance => (
          <div key={grievance.id} className="grievance-card">
            <h3>Issue #{grievance.issueId}</h3>
            <p>Name: {grievance.fullName}</p>
            <p>Contact: {grievance.contactNumber}</p>
            <p>Email: {grievance.email}</p>
            <p>Address: {grievance.address}</p>
            <p>Type: {grievance.complaintType}</p>
            <p>Description: {grievance.issueDescription}</p>
            <p>Preferred Time: {grievance.preferredResolutionTime ? new Date(grievance.preferredResolutionTime).toLocaleDateString() : 'Not specified'}</p>
            <p>Status: {grievance.status}</p>
            <p>Department: {grievance.department || 'Not assigned'}</p>

            {(grievance.status === 'Pending' || grievance.status === 'Submitted') && (
              <div className="assignment-buttons">
                <button
                  onClick={() => assignToAgent(grievance.issueId, 'WATER')}
                  disabled={grievance.complaintType !== 'Water Problem'}
                >
                  Assign to Water Dept
                </button>
                <button
                  onClick={() => assignToAgent(grievance.issueId, 'POWER')}
                  disabled={!['Power Outage', 'Voltage Fluctuation', 'Damaged Electric Pole', 'Exposed Wires'].includes(grievance.complaintType)}
                >
                  Assign to Power Dept
                </button>
                <button
                  onClick={() => assignToAgent(grievance.issueId, 'PUBLIC_WORKS')}
                  disabled={!['Potholes', 'Road Repair'].includes(grievance.complaintType)}
                >
                  Assign to Public Works
                </button>
                <button
                  onClick={() => assignToAgent(grievance.issueId, 'ANIMAL_CONTROL')}
                  disabled={grievance.complaintType !== 'Dog Problems'}
                >
                  Assign to Animal Control
                </button>
                <button
                  onClick={() => assignToAgent(grievance.issueId, 'SANITATION')}
                  disabled={grievance.complaintType !== 'Garbage Collection'}
                >
                  Assign to Sanitation
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .municipal-dashboard {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        h2 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .filters {
          margin: 20px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .filters button {
          padding: 8px 16px;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
          font-size: 14px;
          border-radius: 4px;
        }
        .filters button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }
        .grievance-list {
          display: grid;
          gap: 20px;
        }
        .grievance-card {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 5px;
          background: #fff;
        }
        .grievance-card h3 {
          margin: 0 0 10px;
          font-size: 18px;
        }
        .grievance-card p {
          margin: 5px 0;
        }
        .assignment-buttons {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .assignment-buttons button {
          padding: 5px 10px;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
          border-radius: 4px;
        }
        .assignment-buttons button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .error {
          color: red;
        }
      `}</style>
    </div>
  );
};

export default MunicipalDashboard;