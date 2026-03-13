package com.abb.Abb.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @Schema(description = "Le nom complet du client", example = "Ahmed Yassine")
    private String name;

    @Schema(description = "L'adresse email du client", example = "ahmed@example.com")
    private String email;

    @Schema(description = "Le mot de passe sécurisé", example = "password123")
    private String password;
}