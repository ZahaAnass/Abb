package com.abb.Abb.controller.api;

import com.abb.Abb.dto.LoginRequest;
import com.abb.Abb.dto.RegisterRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Authentification", description = "Endpoints pour l'inscription et la connexion des utilisateurs")
public interface AuthApiDocs {

    @Operation(
            summary = "Inscrire un nouveau client",
            description = "Crée un nouveau compte client avec un RIB généré automatiquement et un solde initial de 0."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Client inscrit avec succès"),
            @ApiResponse(responseCode = "409", description = "Un compte avec cet email existe déjà", content = @Content)
    })
    ResponseEntity<?> register(RegisterRequest request);


    @Operation(
            summary = "Se connecter (Login)",
            description = "Authentifie un utilisateur (Client ou Admin) avec son email et mot de passe, et retourne un token JWT."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Authentification réussie, JWT généré"),
            @ApiResponse(responseCode = "401", description = "Identifiants incorrects", content = @Content)
    })
    ResponseEntity<?> login(LoginRequest request);
}