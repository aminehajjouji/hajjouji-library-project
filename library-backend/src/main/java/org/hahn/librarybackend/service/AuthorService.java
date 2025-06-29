package org.hahn.librarybackend.service;

import org.hahn.librarybackend.dto.AuthorDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AuthorService {
    List<AuthorDTO> getAllAuthors();

    Page<AuthorDTO> getAllAuthors(Pageable pageable);

    AuthorDTO getAuthorById(Long id);

    AuthorDTO createAuthor(AuthorDTO authorDTO);

    AuthorDTO updateAuthor(Long id, AuthorDTO authorDTO);

    void deleteAuthor(Long id);

    Page<AuthorDTO> searchAuthors(String searchTerm, Pageable pageable);

}