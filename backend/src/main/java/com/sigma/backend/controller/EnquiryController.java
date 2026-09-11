package com.sigma.backend.controller;

import com.sigma.backend.entity.Enquiry;
import com.sigma.backend.repository.EnquiryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enquiries")
@CrossOrigin(origins = "http://localhost:5173")
public class EnquiryController {

    private final EnquiryRepository enquiryRepository;

    public EnquiryController(EnquiryRepository enquiryRepository) {
        this.enquiryRepository = enquiryRepository;
    }

    // Create enquiry
    @PostMapping
    public ResponseEntity<Enquiry> createEnquiry(
            @RequestBody Enquiry enquiry
    ) {
        Enquiry savedEnquiry =
                enquiryRepository.save(enquiry);

        return ResponseEntity.ok(savedEnquiry);
    }


    // Get all enquiries
    @GetMapping
    public ResponseEntity<List<Enquiry>> getAllEnquiries() {

        return ResponseEntity.ok(
                enquiryRepository.findAll()
        );
    }


    // Update enquiry status
    @PutMapping("/{id}/status")
    public ResponseEntity<Enquiry> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {

        Enquiry enquiry =
                enquiryRepository.findById(id).orElse(null);

        if (enquiry == null) {
            return ResponseEntity.notFound().build();
        }

        String status = request.get("status");

        if (status == null ||
                (!status.equals("NEW")
                && !status.equals("CONTACTED")
                && !status.equals("CONVERTED"))) {

            return ResponseEntity.badRequest().build();
        }

        enquiry.setStatus(status);

        Enquiry updatedEnquiry =
                enquiryRepository.save(enquiry);

        return ResponseEntity.ok(updatedEnquiry);
    }


    // Delete enquiry
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnquiry(
            @PathVariable Long id
    ) {

        if (!enquiryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        enquiryRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}