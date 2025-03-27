import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Paper, 
  Grid 
} from '@mui/material';

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [error, setError] = useState('');
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  // Fetch issues when the component mounts
  useEffect(() => {
    if (!userId) {
      setError("User not logged in. Please log in to view your dashboard.");
      return;
    }

    const fetchIssues = async () => {
      try {
        const response = await fetch(`http://localhost:8080/issue/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setIssues(data);
          setFilteredIssues(data); // Initially show all issues
        } else {
          setError("Failed to fetch issues.");
        }
      } catch (err) {
        setError("Server error. Please try again later.");
      }
    };

    fetchIssues();
  }, [userId]);

  // Filter issues based on status
  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(issues.filter(issue => issue.status === statusFilter));
    }
    setSelectedIssue(null); // Reset selected issue when filter changes
  }, [statusFilter, issues]);

  // Handle issue click to display details
  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

  // Handle status updates (Close, Withdraw, Reopen)
  const handleUpdateStatus = async (issueId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/issue/update-status/${issueId}?status=${newStatus}`, {
        method: 'PUT',
      });
      if (response.ok) {
        // Update the issues state with the new status
        const updatedIssues = issues.map(issue =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        );
        setIssues(updatedIssues);
        setFilteredIssues(updatedIssues.filter(issue =>
          statusFilter === 'All' || issue.status === statusFilter
        ));
        if (selectedIssue && selectedIssue.id === issueId) {
          setSelectedIssue({ ...selectedIssue, status: newStatus });
        }
      } else {
        setError("Failed to update issue status.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  const handleClose = (issueId) => {
    handleUpdateStatus(issueId, 'Closed');
  };

  const handleWithdraw = (issueId) => {
    handleUpdateStatus(issueId, 'Withdrawn');
  };

  const handleReopen = (issueId) => {
    handleUpdateStatus(issueId, 'Reopened');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard, {userName}!
        </Typography>
        <Typography variant="h6" gutterBottom>
          View and manage your grievances below.
        </Typography>

        {/* Status Filter */}
        <FormControl sx={{ mb: 2, minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Filter by Status"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
            <MenuItem value="Withdrawn">Withdrawn</MenuItem>
            <MenuItem value="Reopened">Reopened</MenuItem>
          </Select>
        </FormControl>

        {/* Error Message */}
        {error ? (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : filteredIssues.length === 0 ? (
          <Typography sx={{ mt: 2 }}>
            No issues found for the selected status.
          </Typography>
        ) : (
          <>
            {/* Issues Table */}
            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Complaint Type</TableCell>
                  <TableCell>Issue Description</TableCell>
                  <TableCell>Preferred Resolution Date</TableCell>
                  <TableCell>Preferred Resolution Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow 
                    key={issue.id} 
                    onClick={() => handleIssueClick(issue)} 
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <TableCell>{issue.complaintType}</TableCell>
                    <TableCell>{issue.issueDescription}</TableCell>
                    <TableCell>{issue.preferredResolutionDate || '-'}</TableCell>
                    <TableCell>{issue.preferredResolutionTime || '-'}</TableCell>
                    <TableCell>{issue.status}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={(e) => { e.stopPropagation(); handleClose(issue.id); }}
                        sx={{ mr: 1 }}
                      >
                        Close
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={(e) => { e.stopPropagation(); handleWithdraw(issue.id); }}
                        sx={{ mr: 1 }}
                      >
                        Withdraw
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={(e) => { e.stopPropagation(); handleReopen(issue.id); }}
                      >
                        Reopen
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Issue Details */}
            {selectedIssue && (
              <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Issue Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Complaint Type:</strong> {selectedIssue.complaintType}</Typography>
                    <Typography><strong>Issue Description:</strong> {selectedIssue.issueDescription}</Typography>
                    <Typography><strong>Preferred Resolution Date:</strong> {selectedIssue.preferredResolutionDate || '-'}</Typography>
                    <Typography><strong>Preferred Resolution Time:</strong> {selectedIssue.preferredResolutionTime || '-'}</Typography>
                    <Typography><strong>Status:</strong> {selectedIssue.status}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Full Name:</strong> {selectedIssue.user.name}</Typography>
                    <Typography><strong>Contact Number:</strong> {selectedIssue.user.contactNumber || '-'}</Typography>
                    <Typography><strong>Email:</strong> {selectedIssue.user.email || '-'}</Typography>
                    <Typography><strong>Address:</strong> {selectedIssue.user.address || '-'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}