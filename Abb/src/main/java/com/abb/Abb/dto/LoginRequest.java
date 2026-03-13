package com.abb.Abb.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @Schema(description = "L'adresse email de l'utilisateur", example = "admin@bank.com")
    private String email;

    @Schema(description = "Le mot de passe de l'utilisateur", example = "admin123")
    private String password;
}