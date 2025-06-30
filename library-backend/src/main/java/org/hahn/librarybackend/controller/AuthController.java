package org.hahn.librarybackend.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.hahn.librarybackend.dao.UserRepository;
import org.hahn.librarybackend.dto.JwtResponse;
import org.hahn.librarybackend.dto.LoginRequest;
import org.hahn.librarybackend.dto.MessageResponse;
import org.hahn.librarybackend.dto.SignupRequest;
import org.hahn.librarybackend.entity.JwtUtils;
import org.hahn.librarybackend.entity.User;
import org.hahn.librarybackend.security.AppUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private AuthenticationManager authenticationManager;

    private UserRepository userRepository;

    private PasswordEncoder encoder;


    private JwtUtils jwtUtils;
    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        AppUserDetails userDetails = (AppUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();


        return ResponseEntity.ok(JwtResponse.builder()
                .token(jwt)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .type("Bearer")
                .build());
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName());

        user.setRole(User.Role.USER);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }


}

