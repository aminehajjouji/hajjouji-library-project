package org.hahn.librarybackend.dao;

import org.hahn.librarybackend.entity.RefreshToken;
import org.hahn.librarybackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUser(User user);

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.user = ?1")
    void deleteByUser(User user);

    void deleteByExpiryDateBefore(Instant now);

    boolean existsByUser(User user);

    @Query("SELECT COUNT(rt) FROM RefreshToken rt WHERE rt.user = ?1")
    long countByUser(User user);
}

