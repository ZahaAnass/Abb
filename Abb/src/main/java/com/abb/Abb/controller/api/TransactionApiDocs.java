package com.abb.Abb.controller.api;

import com.abb.Abb.dto.TransferRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Transactions et Virements", description = "Endpoints pour les virements, l'historique et l'exportation des relevés.")
@SecurityRequirement(name = "bearerAuth")
public interface TransactionApiDocs {

    @Operation(
            summary = "Effectuer un virement bancaire",
            description = "Transfère un montant du compte du client connecté vers le compte cible (via RIB)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Virement effectué avec succès", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "Erreur (Solde insuffisant, RIB introuvable, etc.)", content = @Content)
    })
    ResponseEntity<?> transferMoney(@RequestBody TransferRequest request, Authentication authentication);

    @Operation(
            summary = "Consulter l'historique des transactions",
            description = "Retourne la liste complète des transactions (émises et reçues) du client connecté."
    )
    @ApiResponse(responseCode = "200", description = "Historique récupéré avec succès")
    ResponseEntity<?> getTransactionHistory(Authentication authentication);

    @Operation(
            summary = "Télécharger le relevé en PDF",
            description = "Génère et télécharge le relevé bancaire du client au format PDF."
    )
    @ApiResponse(responseCode = "200", description = "Fichier PDF généré", content = @Content(mediaType = "application/pdf"))
    ResponseEntity<byte[]> exportHistoryToPdf(Authentication authentication);

    @Operation(
            summary = "Télécharger le relevé en Excel",
            description = "Génère et télécharge le relevé bancaire du client au format Excel (.xlsx)."
    )
    @ApiResponse(responseCode = "200", description = "Fichier Excel généré", content = @Content(mediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
    ResponseEntity<byte[]> exportHistoryToExcel(Authentication authentication);
}