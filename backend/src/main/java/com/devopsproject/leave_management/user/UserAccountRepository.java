package com.devopsproject.leave_management.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAccountRepository
        extends JpaRepository<UserAccount, Long> {

    Optional<UserAccount> findByEmail(String email);

    Optional<UserAccount> findByUsername(String username);

    Optional<UserAccount> findByEmployeeId(String employeeId);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmployeeId(String employeeId);

    List<UserAccount> findAllByRoleOrderByFullNameAsc(Role role);
}
