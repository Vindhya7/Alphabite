package com.example.alphabite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.alphabite.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{

}
