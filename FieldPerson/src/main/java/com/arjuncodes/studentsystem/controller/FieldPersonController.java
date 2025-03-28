package com.arjuncodes.studentsystem.controller;

import com.arjuncodes.studentsystem.model.FieldPerson;
import com.arjuncodes.studentsystem.model.Issue;
import com.arjuncodes.studentsystem.service.FieldPersonService;
import com.arjuncodes.studentsystem.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/field-person")
@CrossOrigin
public class FieldPersonController {
    @Autowired
    private FieldPersonService fieldPersonService;

    @Autowired
    private IssueService issueService;

    @PostMapping("/register")
    public ResponseEntity<String> registerFieldPerson(@RequestBody FieldPerson fieldPerson) {
        System.out.println("Registering field person: " + fieldPerson.getName() + ", password: " + fieldPerson.getPassword());
        fieldPersonService.saveFieldPerson(fieldPerson);
        return ResponseEntity.ok("Field person registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<FieldPerson> loginFieldPerson(@RequestBody FieldPerson loginData) {
        try {
            System.out.println("Login attempt with name: " + loginData.getName() + ", password: " + loginData.getPassword());
            Optional<FieldPerson> fieldPerson = fieldPersonService.findByNameAndPassword(
                    loginData.getName(), loginData.getPassword());
            if (fieldPerson.isPresent()) {
                System.out.println("Login successful for: " + fieldPerson.get().getName());
                return ResponseEntity.ok(fieldPerson.get());
            }
            System.out.println("Login failed: No matching field person found");
            return ResponseEntity.status(401).body(null);
        } catch (Exception e) {
            System.err.println("Error during login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}/issues")
    public ResponseEntity<List<Issue>> getAssignedIssues(@PathVariable Long id) {
        Optional<FieldPerson> fieldPerson = fieldPersonService.findById(id);
        if (fieldPerson.isPresent()) {
            List<Issue> issues = issueService.getIssuesByFieldPerson(fieldPerson.get());
            return ResponseEntity.ok(issues);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{issueId}/complete")
    public ResponseEntity<String> completeIssue(
            @PathVariable String issueId,
            @RequestParam("image") MultipartFile image) throws IOException {
        Optional<Issue> optionalIssue = issueService.getIssueByIssueId(issueId);
        if (!optionalIssue.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Issue issue = optionalIssue.get();
        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        File file = new File("uploads/" + fileName);
        image.transferTo(file);
        issue.setImageProof(fileName);
        issue.setStatus("Completed");
        issueService.saveIssue(issue);

        // System.out.println("Notifying user at " + issue.getUserEmail() + ": Issue " + issueId + " has been completed.");
        return ResponseEntity.ok("Issue marked as completed and proof uploaded");
    }
}