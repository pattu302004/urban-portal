// FieldPersonService.java
package com.arjuncodes.studentsystem.service;

import com.arjuncodes.studentsystem.model.FieldPerson;

import java.util.Optional;

public interface FieldPersonService {
    void saveFieldPerson(FieldPerson fieldPerson);
    Optional<FieldPerson> findByNameAndPassword(String name, String password);
    Optional<FieldPerson> findByDepartment(String department);
    Optional<FieldPerson> findById(Long id); // Added
}