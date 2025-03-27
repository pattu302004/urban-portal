// FieldPersonServiceImpl.java
package com.arjuncodes.studentsystem.service;

import com.arjuncodes.studentsystem.model.FieldPerson;
import com.arjuncodes.studentsystem.repository.FieldPersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FieldPersonServiceImpl implements FieldPersonService {
    @Autowired
    private FieldPersonRepository fieldPersonRepository;

    @Override
    public void saveFieldPerson(FieldPerson fieldPerson) {
        fieldPersonRepository.save(fieldPerson);
    }

    @Override
    public Optional<FieldPerson> findByNameAndPassword(String name, String password) {
        System.out.println("Querying for name: " + name + ", password: " + password);
        return fieldPersonRepository.findByNameAndPassword(name.trim(), password);
    }

    @Override
    public Optional<FieldPerson> findByDepartment(String department) {
        return fieldPersonRepository.findByDepartment(department);
    }

    @Override
    public Optional<FieldPerson> findById(Long id) {
        return fieldPersonRepository.findById(id); // Delegate to repository
    }
}