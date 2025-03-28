import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FieldPersonDashboard = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    // Memoize fieldPerson to prevent re-parsing on every render
    const fieldPerson = useMemo(() => {
        return JSON.parse(localStorage.getItem('fieldPerson'));
    }, []);

    const fetchAssignedIssues = useCallback(async () => {
        try {
            setLoading(true);
            console.log('Fetching issues for fieldPerson ID:', fieldPerson?.id);
            const response = await axios.get(`http://localhost:8080/field-person/${fieldPerson.id}/issues`);
            setIssues(response.data);
        } catch (err) {
            setError(`Error fetching assigned issues: ${err.message}`);
            console.error('Fetch error:', err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    }, [fieldPerson, setIssues, setLoading, setError]);

    useEffect(() => {
        if (!fieldPerson || !fieldPerson.id) {
            navigate('/field-person-login');
            return;
        }
        fetchAssignedIssues();
    }, [fieldPerson, navigate, fetchAssignedIssues]);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleCompleteIssue = async (issueId) => {
        if (!image) {
            alert('Please upload an image proof');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        try {
            await axios.post(`http://localhost:8080/field-person/${issueId}/complete`, formData);
            alert('Issue marked as completed');
            fetchAssignedIssues();
            setImage(null);
        } catch (err) {
            setError('Error completing issue');
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('fieldPerson');
        navigate('/field-person-login');
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Field Person Dashboard - Welcome, {fieldPerson?.name}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container style={{ marginTop: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Assigned Grievances
                </Typography>

                {loading && <p>Loading issues...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="issue-list">
                    {issues.map(issue => (
                        <div key={issue.id} className="issue-card">
                            <h3>Issue #{issue.issueId}</h3>
                            <p>Name: {issue.fullName}</p>
                            <p>Contact: {issue.contactNumber}</p>
                            <p>Email: {issue.email}</p>
                            <p>Address: {issue.address}</p>
                            <p>Type: {issue.complaintType}</p>
                            <p>Description: {issue.issueDescription}</p>
                            <p>Preferred Time: {issue.preferredResolutionTime ? new Date(issue.preferredResolutionTime).toLocaleDateString() : 'Not specified'}</p>
                            <p>Status: {issue.status}</p>
                            <p>Department: {issue.department}</p>
                            {issue.imageProof && (
                                <p>
                                    Image Proof: <a href={`/uploads/${issue.imageProof}`} target="_blank" rel="noreferrer">View Proof</a>
                                </p>
                            )}

                            {issue.status === 'Assigned' && (
                                <div className="action-buttons">
                                    <input type="file" accept="image/*" onChange={handleImageChange} />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleCompleteIssue(issue.issueId)}
                                        style={{ marginTop: '10px' }}
                                    >
                                        Mark as Completed
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Container>

            <style jsx>{`
                .issue-list {
                    display: grid;
                    gap: 20px;
                }
                .issue-card {
                    border: 1px solid #ddd;
                    padding: 15px;
                    border-radius: 5px;
                    background: #fff;
                }
                .issue-card h3 {
                    margin: 0 0 10px;
                    font-size: 18px;
                }
                .issue-card p {
                    margin: 5px 0;
                }
                .action-buttons {
                    margin-top: 10px;
                }
            `}</style>
        </div>
    );
};

export default FieldPersonDashboard;