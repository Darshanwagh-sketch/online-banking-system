package com.bank.controller;

import com.bank.dto.ApiResponse;
import com.bank.dto.SupportTicketRequest;
import com.bank.dto.SupportTicketResponse;
import com.bank.enums.TicketStatus;
import com.bank.service.SupportTicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support/tickets")
@RequiredArgsConstructor
public class SupportTicketController {

    private final SupportTicketService ticketService;

    @PostMapping
    public ResponseEntity<ApiResponse<SupportTicketResponse>> createTicket(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SupportTicketRequest request) {
        SupportTicketResponse ticket = ticketService.createTicket(userDetails.getUsername(), request);
        return new ResponseEntity<>(ApiResponse.success("Support ticket created successfully", ticket), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupportTicketResponse>>> getMyTickets(@AuthenticationPrincipal UserDetails userDetails) {
        List<SupportTicketResponse> tickets = ticketService.getUserTickets(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User support tickets retrieved successfully", tickets));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<SupportTicketResponse>>> getAllTickets() {
        List<SupportTicketResponse> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(ApiResponse.success("All support tickets retrieved successfully", tickets));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER', 'ADMIN')")
    public ResponseEntity<ApiResponse<SupportTicketResponse>> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status) {
        SupportTicketResponse ticket = ticketService.updateTicketStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Support ticket status updated", ticket));
    }
}
