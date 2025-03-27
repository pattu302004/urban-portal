package com.arjuncodes.studentsystem.service;

import com.arjuncodes.studentsystem.model.FieldPerson;
import com.arjuncodes.studentsystem.model.Issue;
import com.arjuncodes.studentsystem.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IssueServiceImpl implements IssueService {
    @Autowired
    private IssueRepository issueRepository;

    @Override
    public void saveIssue(Issue issue) {
        issueRepository.save(issue);
    }

    @Override
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    @Override
    public Optional<Issue> getIssueById(Long id) {
        return issueRepository.findById(id);
    }

    @Override
    public List<Issue> getIssuesByStatus(String status) {
        return issueRepository.findByStatus(status);
    }

    @Override
    public List<Issue> getIssuesByUserId(int userId) {
        return issueRepository.findByUser_Id(userId); // Note: This won't work unless userId is added to Issue entity
    }

    @Override
    public Optional<Issue> getIssueByIssueId(String issueId) {
        return issueRepository.findByIssueId(issueId); // Added to support assignment
    }
    @Override
    public List<Issue> getIssuesByFieldPerson(FieldPerson fieldPerson) {
        return issueRepository.findAll().stream()
                .filter(issue -> issue.getFieldPerson() != null && issue.getFieldPerson().getId().equals(fieldPerson.getId()))
                .toList();
    }
    public void updateIssueStatus(Long id, String status) {
        Optional<Issue> optionalIssue = issueRepository.findById(id);
        if (optionalIssue.isPresent()) {
            Issue issue = optionalIssue.get();
            issue.setStatus(status);
            issueRepository.save(issue);
        }
    }
}