package org.hahn.librarybackend.service;

import org.hahn.librarybackend.dto.BookDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookService {

    Page<BookDTO> getAllBooks(Pageable pageable);

    BookDTO getBookById(Long id);

    BookDTO getBookByIsbn(String isbn);

    BookDTO createBook(BookDTO bookDTO);

    BookDTO updateBook(Long id, BookDTO bookDTO);

    void deleteBook(Long id);

    Page<BookDTO> searchBooks(String searchTerm, Pageable pageable);

    List<BookDTO> getAvailableBooks();

    List<BookDTO> getBooksByAuthor(Long authorId);

}