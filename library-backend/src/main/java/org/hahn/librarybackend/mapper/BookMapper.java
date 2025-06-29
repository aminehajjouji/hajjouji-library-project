package org.hahn.librarybackend.mapper;

import org.hahn.librarybackend.dto.BookDTO;
import org.hahn.librarybackend.entity.Author;
import org.hahn.librarybackend.entity.Book;

public class BookMapper {

    public static BookDTO convertToDTO(Book book) {
        return BookDTO.builder()
                .id(book.getId())
                .title(book.getTitle())
                .isbn(book.getIsbn())
                .description(book.getDescription())
                .publicationYear(book.getPublicationYear())
                .availableCopies(book.getAvailableCopies())
                .totalCopies(book.getTotalCopies())
                .authorId(book.getAuthor().getId())
                .authorName(book.getAuthor().getFullName())
                .build();
    }

    public static Book convertToEntity(BookDTO bookDTO, Author author) {
        return Book.builder()
                .title(bookDTO.getTitle())
                .isbn(bookDTO.getIsbn())
                .description(bookDTO.getDescription())
                .publicationYear(bookDTO.getPublicationYear())
                .availableCopies(bookDTO.getAvailableCopies())
                .totalCopies(bookDTO.getTotalCopies())
                .author(author)
                .build();
    }
}
