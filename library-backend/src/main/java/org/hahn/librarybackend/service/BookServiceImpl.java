package org.hahn.librarybackend.service;

import org.hahn.librarybackend.dao.AuthorRepository;
import org.hahn.librarybackend.dao.BookRepository;
import org.hahn.librarybackend.dto.BookDTO;
import org.hahn.librarybackend.entity.Author;
import org.hahn.librarybackend.entity.Book;
import org.hahn.librarybackend.exceptions.ResourceNotFoundException;
import org.hahn.librarybackend.mapper.BookMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookServiceImpl implements BookService {

    private BookRepository bookRepository;

    private AuthorRepository authorRepository;

    public BookServiceImpl(BookRepository bookRepository, AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
    }

    public Page<BookDTO> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable)
                .map(BookMapper::convertToDTO);
    }

    public BookDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return BookMapper.convertToDTO(book);
    }

    public BookDTO getBookByIsbn(String isbn) {
        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ISBN: " + isbn));
        return BookMapper.convertToDTO(book);
    }

    public BookDTO createBook(BookDTO bookDTO) {
        Author author = authorRepository.findById(bookDTO.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id: " + bookDTO.getAuthorId()));
        Book book = BookMapper.convertToEntity(bookDTO, author);
        Book savedBook = bookRepository.save(book);
        return BookMapper.convertToDTO(savedBook);
    }

    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        if (bookDTO.getAuthorId() != null && !bookDTO.getAuthorId().equals(book.getAuthor().getId())) {
            Author author = authorRepository.findById(bookDTO.getAuthorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Author not found with id: " + bookDTO.getAuthorId()));
            book.setAuthor(author);
        }
        book.setTitle(bookDTO.getTitle());
        book.setIsbn(bookDTO.getIsbn());
        book.setDescription(bookDTO.getDescription());
        book.setPublicationYear(bookDTO.getPublicationYear());
        book.setAvailableCopies(bookDTO.getAvailableCopies());
        book.setTotalCopies(bookDTO.getTotalCopies());

        Book updatedBook = bookRepository.save(book);
        return BookMapper.convertToDTO(updatedBook);
    }

    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        bookRepository.delete(book);
    }

    public Page<BookDTO> searchBooks(String searchTerm, Pageable pageable) {
        return bookRepository.findBySearchTerm(searchTerm, pageable)
                .map(BookMapper::convertToDTO);
    }

    public List<BookDTO> getAvailableBooks() {
        return bookRepository.findAvailableBooks().stream()
                .map(BookMapper::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BookDTO> getBooksByAuthor(Long authorId) {
        return bookRepository.findByAuthorId(authorId).stream()
                .map(BookMapper::convertToDTO)
                .collect(Collectors.toList());
    }


}

