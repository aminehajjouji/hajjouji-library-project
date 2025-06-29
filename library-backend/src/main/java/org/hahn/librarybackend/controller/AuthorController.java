package org.hahn.librarybackend.controller;

import jakarta.validation.Valid;
import org.hahn.librarybackend.dto.AuthorDTO;
import org.hahn.librarybackend.service.AuthorService;
import org.hahn.librarybackend.service.AuthorServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {

    private AuthorService authorService;

    public AuthorController(AuthorServiceImpl authorService) {
        this.authorService = authorService;
    }

    @GetMapping
    public ResponseEntity<List<AuthorDTO>> getAllAuthors(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size,
                                                         @RequestParam(defaultValue = "lastName") String sortBy,
                                                         @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<AuthorDTO> authorPage = authorService.getAllAuthors(pageable);

        return ResponseEntity.ok(authorPage.getContent());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorDTO> getAuthorById(@PathVariable Long id) {
        AuthorDTO author = authorService.getAuthorById(id);
        return ResponseEntity.ok(author);
    }

    @PostMapping
    public ResponseEntity<AuthorDTO> createAuthor(@Valid @RequestBody AuthorDTO authorDTO) {
        AuthorDTO createdAuthor = authorService.createAuthor(authorDTO);
        return new ResponseEntity<>(createdAuthor, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuthorDTO> updateAuthor(@PathVariable Long id, @Valid @RequestBody AuthorDTO authorDTO) {
        AuthorDTO updatedAuthor = authorService.updateAuthor(id, authorDTO);
        return ResponseEntity.ok(updatedAuthor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuthor(@PathVariable Long id) {
        authorService.deleteAuthor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<AuthorDTO>> searchAuthors(@RequestParam String q,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size,
                                                         @RequestParam(defaultValue = "lastName") String sortBy,
                                                         @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<AuthorDTO> authorPage = authorService.searchAuthors(q, pageable);

        return ResponseEntity.ok(authorPage.getContent());
    }

}

