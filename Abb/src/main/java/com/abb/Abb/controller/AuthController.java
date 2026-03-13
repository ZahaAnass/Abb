package com.abb.Abb.controller;

import com.abb.Abb.dto.LoginRequest;
import com.abb.Abb.dto.RegisterRequest;
import com.abb.Abb.entity.Client;
import com.abb.Abb.repository.ClientRepository;
import com.abb.Abb.repository.UserRepository;
import com.abb.Abb.service.ClientService;
import com.abb.Abb.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private ClientRepository clientRepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientService clientService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authManager;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Un compte avec cet email existe déjà."));
        }

        Client newClient = new Client();
        newClient.setName(request.getName());
        newClient.setEmail(request.getEmail());
        newClient.setPassword(encoder.encode(request.getPassword()));
        newClient.setRib(clientService.generateUniqueRib());
        newClient.setSolde(BigDecimal.valueOf(0));

        newClient.setRole("CLIENT");
        newClient.setCreationDate(LocalDateTime.now());

        Client savedClient = clientRepo.save(newClient);

        return ResponseEntity.ok(savedClient);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        if (authentication.isAuthenticated()) {
            UserDetails userDetails =
                    (UserDetails) authentication.getPrincipal();

            String token = jwtService.generateToken(userDetails);

            return ResponseEntity.ok(Map.of("token", token));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication failed"));
    }
}