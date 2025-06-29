package org.hahn.librarybackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AuthorDTO {
    private Long id;

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;

    @Size(max = 1000, message = "Biography must not exceed 1000 characters")
    private String biography;

    private Integer birthYear;

    private int bookCount;


    public String getFullName() {
        return firstName + " " + lastName;
    }
}

