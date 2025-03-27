package com.arjuncodes.studentsystem.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "issues") // Corrected table name to match the database
public class Issue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String complaintType;
    private String issueDescription;

    @Column(name = "preferred_resolution_date")
    private LocalDate preferredResolutionDate;

    @Column(name = "preferred_resolution_time")
    private LocalTime preferredResolutionTime;

    private String department;

    @ManyToOne
    @JoinColumn(name = "field_person_id")
    private FieldPerson fieldPerson;

    private String imageProof;

    @Column(nullable = false)
    private String status = "Pending";

    @Column(name = "issue_id")
    private String issueId;

    public Issue() {
    }

    public Issue(User user, String complaintType, String issueDescription, LocalDate preferredResolutionDate, 
                 LocalTime preferredResolutionTime, String status, String issueId) {
        this.user = user;
        this.complaintType = complaintType;
        this.issueDescription = issueDescription;
        this.preferredResolutionDate = preferredResolutionDate;
        this.preferredResolutionTime = preferredResolutionTime;
        this.status = status;
        this.issueId = issueId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getComplaintType() {
        return complaintType;
    }

    public void setComplaintType(String complaintType) {
        this.complaintType = complaintType;
    }

    public String getIssueDescription() {
        return issueDescription;
    }

    public void setIssueDescription(String issueDescription) {
        this.issueDescription = issueDescription;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public LocalDate getPreferredResolutionDate() {
        return preferredResolutionDate;
    }

    public void setPreferredResolutionDate(LocalDate preferredResolutionDate) {
        this.preferredResolutionDate = preferredResolutionDate;
    }

    public LocalTime getPreferredResolutionTime() {
        return preferredResolutionTime;
    }

    public void setPreferredResolutionTime(LocalTime preferredResolutionTime) {
        this.preferredResolutionTime = preferredResolutionTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public FieldPerson getFieldPerson() {
        return fieldPerson;
    }

    public void setFieldPerson(FieldPerson fieldPerson) {
        this.fieldPerson = fieldPerson;
    }

    public String getImageProof() {
        return imageProof;
    }

    public void setImageProof(String imageProof) {
        this.imageProof = imageProof;
    }

    public String getIssueId() {
        return issueId;
    }

    public void setIssueId(String issueId) {
        this.issueId = issueId;
    }

    @Override
    public String toString() {
        return "Issue[id=" + id + ", user=" + user + ", complaintType=" + complaintType + 
               ", issueDescription=" + issueDescription + 
               ", preferredResolutionDate=" + preferredResolutionDate + 
               ", preferredResolutionTime=" + preferredResolutionTime + 
               ", department=" + department + ", fieldPerson=" + fieldPerson + 
               ", imageProof=" + imageProof + ", status=" + status + 
               ", issueId=" + issueId + "]";
    }
}