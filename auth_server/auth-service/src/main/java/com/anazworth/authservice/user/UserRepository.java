package com.anazworth.authservice.user;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
    
    List<User> findByUsername(String username);
    
    List<User> findAll();
    
    // remove all user
    void deleteAll();
}
