package com.abb.Abb.controller.api;

import com.abb.Abb.dto.AdminDashboardDTO;
import com.abb.Abb.dto.EmployeeRequest;
import com.abb.Abb.entity.Client;
import com.abb.Abb.entity.Employee;
import com.abb.Abb.entity.Transaction;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Tag(name = "Portail Administrateur", description = "Endpoints réservés à la gestion globale de la banque.")
@SecurityRequirement(name = "bearerAuth")
public interface AdminApiDocs {

    @Operation(
            summary = "Statistiques du tableau de bord",
            description = "Retourne les compteurs globaux (total employés, clients, et transactions) pour les cartes du dashboard."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Statistiques récupérées avec succès",
            content = @Content(schema = @Schema(implementation = AdminDashboardDTO.class))
    )
    ResponseEntity<AdminDashboardDTO> getDashboardStats();

    @Operation(
            summary = "Lister tous les employés",
            description = "Retourne la liste complète des membres du personnel (Admin, Manager, Guichetier, etc.)."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Liste des employés récupérée",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Employee.class)))
    )
    ResponseEntity<List<Employee>> getAllEmployees();

    @Operation(
            summary = "Créer un nouveau compte employé",
            description = "Permet à un administrateur d'ajouter un nouveau membre du staff avec un rôle spécifique."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Employé créé avec succès"),
            @ApiResponse(responseCode = "400", description = "Requête invalide (Email manquant ou déjà utilisé)", content = @Content)
    })
    ResponseEntity<?> createEmployee(@RequestBody EmployeeRequest request);

    @Operation(
            summary = "Lister tous les clients",
            description = "Retourne la liste complète de tous les clients inscrits à la banque, incluant leurs soldes et RIB."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Liste des clients récupérée",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Client.class)))
    )
    ResponseEntity<List<Client>> getAllClients();

    @Operation(
            summary = "Historique global des transactions",
            description = "Retourne l'audit complet de tous les mouvements bancaires effectués sur la plateforme."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Liste des transactions récupérée",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Transaction.class)))
    )
    ResponseEntity<List<Transaction>> getAllTransactions();
}