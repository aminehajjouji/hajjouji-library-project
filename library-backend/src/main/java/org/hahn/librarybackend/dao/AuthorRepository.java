package org.hahn.librarybackend.dao;

import org.hahn.librarybackend.entity.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

    @Query("SELECT a FROM Author a WHERE LOWER(a.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(a.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Author> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);

}

