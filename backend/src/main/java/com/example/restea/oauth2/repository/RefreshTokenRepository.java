package com.example.restea.oauth2.repository;

import com.example.restea.oauth2.entity.RefreshToken;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Boolean existsByValue(String value);

    @Transactional
    void deleteByValue(String value);
}
