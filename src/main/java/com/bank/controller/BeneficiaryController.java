package com.bank.controller;

import com.bank.dto.ApiResponse;
import com.bank.dto.BeneficiaryRequest;
import com.bank.dto.BeneficiaryResponse;
import com.bank.service.BeneficiaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
@RequiredArgsConstructor
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    @PostMapping
    public ResponseEntity<ApiResponse<BeneficiaryResponse>> addBeneficiary(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BeneficiaryRequest request) {
        BeneficiaryResponse beneficiary = beneficiaryService.addBeneficiary(userDetails.getUsername(), request);
        return new ResponseEntity<>(ApiResponse.success("Beneficiary added successfully", beneficiary), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BeneficiaryResponse>>> getBeneficiaries(@AuthenticationPrincipal UserDetails userDetails) {
        List<BeneficiaryResponse> beneficiaries = beneficiaryService.getUserBeneficiaries(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Beneficiaries retrieved successfully", beneficiaries));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BeneficiaryResponse>> updateBeneficiary(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody BeneficiaryRequest request) {
        BeneficiaryResponse beneficiary = beneficiaryService.updateBeneficiary(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Beneficiary updated successfully", beneficiary));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeBeneficiary(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        beneficiaryService.removeBeneficiary(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Beneficiary removed successfully"));
    }
}
