package org.hahn.librarybackend.service;

import org.hahn.librarybackend.dao.AuthorRepository;
import org.hahn.librarybackend.dto.AuthorDTO;
import org.hahn.librarybackend.entity.Author;
import org.hahn.librarybackend.mapper.AuthorMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthorServiceImpl implements AuthorService {

    @Autowired
    private AuthorRepository authorRepository;

    @Override
    public List<AuthorDTO> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(AuthorMapper::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<AuthorDTO> getAllAuthors(Pageable pageable) {
        return authorRepository.findAll(pageable)
                .map(AuthorMapper::convertToDTO);
    }

    @Override
    public AuthorDTO getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
        return AuthorMapper.convertToDTO(author);
    }

    @Override
    public AuthorDTO createAuthor(AuthorDTO authorDTO) {
        Author author = AuthorMapper.convertToEntity(authorDTO);
        Author savedAuthor = authorRepository.save(author);
        return AuthorMapper.convertToDTO(savedAuthor);
    }

    @Override
    public AuthorDTO updateAuthor(Long id, AuthorDTO authorDTO) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));

        author.setFirstName(authorDTO.getFirstName());
        author.setLastName(authorDTO.getLastName());
        author.setBiography(authorDTO.getBiography());
        author.setBirthYear(authorDTO.getBirthYear());

        Author updatedAuthor = authorRepository.save(author);
        return AuthorMapper.convertToDTO(updatedAuthor);
    }

    @Override
    public void deleteAuthor(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
        authorRepository.delete(author);
    }

    @Override
    public Page<AuthorDTO> searchAuthors(String searchTerm, Pageable pageable) {
        return authorRepository.findBySearchTerm(searchTerm, pageable)
                .map(AuthorMapper::convertToDTO);
    }
}

