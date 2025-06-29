package org.hahn.librarybackend.mapper;

import org.hahn.librarybackend.dto.AuthorDTO;
import org.hahn.librarybackend.entity.Author;

public class AuthorMapper {

    public static AuthorDTO convertToDTO(Author author) {
        return AuthorDTO.builder()
                .id(author.getId())
                .firstName(author.getFirstName())
                .lastName(author.getLastName())
                .biography(author.getBiography())
                .birthYear(author.getBirthYear())
                .bookCount(author.getBooks() != null ? author.getBooks().size() : 0)
                .build();
    }

    public static Author convertToEntity(AuthorDTO authorDTO) {
        return Author.builder()
                .firstName(authorDTO.getFirstName())
                .lastName(authorDTO.getLastName())
                .biography(authorDTO.getBiography())
                .birthYear(authorDTO.getBirthYear())
                .build();

    }
}
