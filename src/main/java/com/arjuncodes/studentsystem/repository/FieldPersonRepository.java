// FieldPersonRepository.java
package com.arjuncodes.studentsystem.repository;

import com.arjuncodes.studentsystem.model.FieldPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FieldPersonRepository extends JpaRepository<FieldPerson, Long> {
    Optional<FieldPerson> findByNameAndPassword(String name, String password);
    Optional<FieldPerson> findByDepartment(String department);
}