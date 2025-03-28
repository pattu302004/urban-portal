package com.arjuncodes.studentsystem.repository;

import com.arjuncodes.studentsystem.model.FieldPerson;
import com.arjuncodes.studentsystem.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByStatus(String status);
    List<Issue> findByUser_Id(int userId);
    Optional<Issue> findByIssueId(String issueId);
    List<Issue> findByFieldPerson(FieldPerson fieldPerson); // Added for assignment by issueId
}