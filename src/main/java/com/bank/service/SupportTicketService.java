package com.bank.service;

import com.bank.dto.SupportTicketRequest;
import com.bank.dto.SupportTicketResponse;
import com.bank.enums.TicketStatus;

import java.util.List;

public interface SupportTicketService {
    SupportTicketResponse createTicket(String email, SupportTicketRequest request);
    List<SupportTicketResponse> getUserTickets(String email);
    List<SupportTicketResponse> getAllTickets();
    SupportTicketResponse updateTicketStatus(Long ticketId, TicketStatus status);
}
