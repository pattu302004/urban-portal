package com.arjuncodes.studentsystem.controller;
import com.arjuncodes.studentsystem.model.User; 
import com.arjuncodes.studentsystem.model.FieldPerson;
import com.arjuncodes.studentsystem.model.Issue;
import com.arjuncodes.studentsystem.service.FieldPersonService;
import com.arjuncodes.studentsystem.service.IssueService;
import com.arjuncodes.studentsystem.service.UserService;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.fasterxml.jackson.annotation.JsonFormat;

@RestController
@RequestMapping("/issue")
@CrossOrigin
public class IssueController {
    @Autowired
    private IssueService issueService;
    @Autowired
    private UserService userService;
    @Autowired
    private FieldPersonService fieldPersonService;

    @PostMapping("/submit")
    public ResponseEntity<String> submitIssue(@RequestBody IssueRequest issueRequest) {
        try {
            // Log the incoming request
            System.out.println("Received IssueRequest: " + issueRequest);
            System.out.println("Preferred Resolution Date: " + issueRequest.getPreferredResolutionDate());
            System.out.println("Preferred Resolution Time: " + issueRequest.getPreferredResolutionTime());

            // Fetch the user by userId from localStorage
            User user = userService.findById(issueRequest.getUserId());
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Create a new Issue entity
            Issue issue = new Issue();
            issue.setUser(user);
            issue.setComplaintType(issueRequest.getComplaintType());
            issue.setIssueDescription(issueRequest.getIssueDescription());
            issue.setPreferredResolutionDate(issueRequest.getPreferredResolutionDate());
            issue.setPreferredResolutionTime(issueRequest.getPreferredResolutionTime());
            issue.setStatus("Pending"); // Default status
            issue.setIssueId("ISSUE-" + System.currentTimeMillis()); // Generate a unique issueId

            // Log the Issue object before saving
            System.out.println("Issue to save: " + issue);
            System.out.println("Issue Preferred Resolution Date: " + issue.getPreferredResolutionDate());
            System.out.println("Issue Preferred Resolution Time: " + issue.getPreferredResolutionTime());

            // Save the issue
            issueService.saveIssue(issue);
            return ResponseEntity.ok("Issue submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error submitting issue: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Issue>> getAllIssues() {
        return ResponseEntity.ok(issueService.getAllIssues());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Issue>> getIssuesByUserId(@PathVariable int userId) {
        return ResponseEntity.ok(issueService.getIssuesByUserId(userId));
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<String> updateIssueStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<Issue> optionalIssue = issueService.getIssueById(id);
        if (optionalIssue.isPresent()) {
            Issue issue = optionalIssue.get();
            issue.setStatus(status);
            issueService.saveIssue(issue);
            return ResponseEntity.ok("Issue status updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Issue>> getIssuesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(issueService.getIssuesByStatus(status));
    }

    @PutMapping("/{issueId}/assign")
    public ResponseEntity<String> assignIssue(
            @PathVariable String issueId,
            @RequestBody Map<String, String> assignment) {
        Optional<Issue> optionalIssue = issueService.getIssueByIssueId(issueId);
        if (!optionalIssue.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Issue issue = optionalIssue.get();
        String department = assignment.get("department");
        issue.setDepartment(department);
        issue.setStatus("Assigned");

        // Find a field person in the department
        Optional<FieldPerson> fieldPerson = fieldPersonService.findByDepartment(department);
        if (fieldPerson.isPresent()) {
            issue.setFieldPerson(fieldPerson.get());
        } else {
            return ResponseEntity.badRequest().body("No field person found in department: " + department);
        }

        issueService.saveIssue(issue);
        return ResponseEntity.ok("Issue assigned successfully to " + department);
    }
}

class IssueRequest {
    private int userId;
    private String complaintType;
    private String issueDescription;

    @JsonProperty("preferredResolutionDate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate preferredResolutionDate;

    @JsonProperty("preferredResolutionTime")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime preferredResolutionTime; // Fixed: Changed LocalDate to LocalTime

    // Getters, Setters, and toString
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
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

    public LocalDate getPreferredResolutionDate() {
        return preferredResolutionDate;
    }

    public void setPreferredResolutionDate(LocalDate preferredResolutionDate) {
        System.out.println("Setting preferredResolutionDate: " + preferredResolutionDate);
        this.preferredResolutionDate = preferredResolutionDate;
    }

    public LocalTime getPreferredResolutionTime() {
        return preferredResolutionTime;
    }

    public void setPreferredResolutionTime(LocalTime preferredResolutionTime) {
        System.out.println("Setting preferredResolutionTime: " + preferredResolutionTime);
        this.preferredResolutionTime = preferredResolutionTime;
    }

    @Override
    public String toString() {
        return "IssueRequest[userId=" + userId + ", complaintType=" + complaintType + 
               ", issueDescription=" + issueDescription + 
               ", preferredResolutionDate=" + preferredResolutionDate + 
               ", preferredResolutionTime=" + preferredResolutionTime + "]";
    }
}