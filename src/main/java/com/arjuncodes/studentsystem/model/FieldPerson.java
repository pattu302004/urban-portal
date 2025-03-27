// FieldPerson.java
package com.arjuncodes.studentsystem.model;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "field_person")
public class FieldPerson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String password; // In production, hash this password
    private String department;
    private String email;
    private String phone;
    private String address;

    @OneToMany(mappedBy = "fieldPerson")
    @JsonIgnore 
    private List<Issue> assignedIssues;
   // Ensure this annotation is present to prevent serialization
   
    public FieldPerson() {
    }

    public FieldPerson(String name, String password, String department, String email, String phone, String address) {
        this.name = name;
        this.password = password;
        this.department = department;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<Issue> getAssignedIssues() {
        return assignedIssues;
    }

    public void setAssignedIssues(List<Issue> assignedIssues) {
        this.assignedIssues = assignedIssues;
    }
}