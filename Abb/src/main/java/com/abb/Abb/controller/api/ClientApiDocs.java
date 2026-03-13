package com.abb.Abb.controller.api;

import com.abb.Abb.dto.ClientDashboardDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

@Tag(name = "Espace Client", description = "Endpoints réservés aux clients de la banque (Nécessite un Token JWT)")
public interface ClientApiDocs {

    @Operation(
            summary = "Récupérer les données du tableau de bord",
            description = "Retourne les informations du profil, le solde, le RIB et les 5 dernières transactions du client connecté.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Données récupérées avec succès",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ClientDashboardDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Erreur de requête (ex: Client introuvable)",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Accès refusé (Token manquant ou invalide)",
                    content = @Content
            )
    })
    ResponseEntity<?> getDashboardData(Authentication authentication);
}