package com.bank.service;

import com.bank.dto.SupportTicketRequest;
import com.bank.dto.SupportTicketResponse;
import com.bank.entity.SupportTicket;
import com.bank.entity.User;
import com.bank.enums.TicketStatus;
import com.bank.exception.ResourceNotFoundException;
import com.bank.repository.SupportTicketRepository;
import com.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportTicketServiceImpl implements SupportTicketService {

    private final SupportTicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public SupportTicketResponse createTicket(String email, SupportTicketRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        SupportTicket ticket = SupportTicket.builder()
                .user(user)
                .subject(request.getSubject())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(TicketStatus.OPEN)
                .build();

        SupportTicket savedTicket = ticketRepository.save(ticket);
        return mapToResponse(savedTicket);
    }

    @Override
    public List<SupportTicketResponse> getUserTickets(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        List<SupportTicket> tickets = ticketRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return tickets.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<SupportTicketResponse> getAllTickets() {
        List<SupportTicket> tickets = ticketRepository.findAll();
        return tickets.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SupportTicketResponse updateTicketStatus(Long ticketId, TicketStatus status) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("SupportTicket", "id", ticketId));

        ticket.setStatus(status);
        SupportTicket updatedTicket = ticketRepository.save(ticket);
        return mapToResponse(updatedTicket);
    }

    private SupportTicketResponse mapToResponse(SupportTicket ticket) {
        return SupportTicketResponse.builder()
                .id(ticket.getId())
                .userId(ticket.getUser().getId())
                .userName(ticket.getUser().getName())
                .userEmail(ticket.getUser().getEmail())
                .subject(ticket.getSubject())
                .description(ticket.getDescription())
                .status(ticket.getStatus())
                .priority(ticket.getPriority())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
