package org.hahn.librarybackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class BookDTO {
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "ISBN is required")
    @Size(max = 20, message = "ISBN must not exceed 20 characters")
    private String isbn;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotNull(message = "Publication year is required")
    private Integer publicationYear;

    @NotNull(message = "Available copies is required")
    private Integer availableCopies;

    @NotNull(message = "Total copies is required")
    private Integer totalCopies;

    @NotNull(message = "Author ID is required")
    private Long authorId;

    private String authorName;

}

