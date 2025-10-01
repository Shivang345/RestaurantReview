package com.shivangjaswal.RestaurantReview.Controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.UUID;


@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

    private final String uploadDir = "uploads";

    // Your existing upload methods...
    @PostMapping("/restaurant-photos")
    public ResponseEntity<Map<String, Object>> uploadRestaurantPhotos(
            @RequestParam("files") MultipartFile[] files) {

        System.out.println("Upload endpoint hit with " + files.length + " files");

        Map<String, Object> response = new HashMap<>();
        List<String> uploadedFileUrls = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        try {
            Path uploadPath = Paths.get(uploadDir, "restaurants");
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            System.err.println("Failed to create upload directory: " + e.getMessage());
            response.put("errors", Arrays.asList("Failed to create upload directory"));
            return ResponseEntity.internalServerError().body(response);
        }

        for (MultipartFile file : files) {
            try {
                System.out.println("Processing file: " + file.getOriginalFilename());

                if (file.isEmpty()) {
                    errors.add("File is empty: " + file.getOriginalFilename());
                    continue;
                }

                // FIX: Preserve the original file extension
                String originalFilename = file.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }

                String fileName = System.currentTimeMillis() + "_" + UUID.randomUUID().toString() + extension;
                Path filePath = Paths.get(uploadDir, "restaurants", fileName);

                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                String fileUrl = "/api/uploads/files/restaurants/" + fileName;
                uploadedFileUrls.add(fileUrl);

                System.out.println("File saved successfully: " + fileName + " with extension: " + extension);

            } catch (Exception e) {
                System.err.println("Error uploading file: " + file.getOriginalFilename() + " - " + e.getMessage());
                errors.add("Failed to upload: " + file.getOriginalFilename());
            }
        }

        response.put("uploadedFiles", uploadedFileUrls);
        if (!errors.isEmpty()) {
            response.put("errors", errors);
        }

        System.out.println("Upload response: " + response);
        return ResponseEntity.ok(response);
    }


    // THIS IS THE KEY METHOD - ADD THIS IF MISSING OR UPDATE IT
    @GetMapping("/files/restaurants/{fileName:.+}")
    public ResponseEntity<byte[]> serveRestaurantFile(@PathVariable String fileName) {
        try {
            System.out.println("🖼️ Serving file: " + fileName);
            Path filePath = Paths.get(uploadDir, "restaurants", fileName);

            if (!Files.exists(filePath)) {
                System.err.println("❌ File not found: " + filePath.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = Files.readAllBytes(filePath);

            // Determine content type based on file extension
            String contentType = getContentType(fileName);

            System.out.println("✅ Successfully serving file: " + fileName + " (" + fileContent.length + " bytes)");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=3600") // Cache for 1 hour
                    .body(fileContent);

        } catch (IOException e) {
            System.err.println("❌ Error serving file " + fileName + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/files/reviews/{fileName:.+}")
    public ResponseEntity<byte[]> serveReviewFile(@PathVariable String fileName) {
        try {
            System.out.println("🖼️ Serving review file: " + fileName);
            Path filePath = Paths.get(uploadDir, "reviews", fileName);

            if (!Files.exists(filePath)) {
                System.err.println("❌ File not found: " + filePath.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = Files.readAllBytes(filePath);
            String contentType = getContentType(fileName);

            System.out.println("✅ Successfully serving review file: " + fileName);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                    .body(fileContent);

        } catch (IOException e) {
            System.err.println("❌ Error serving review file " + fileName + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String getContentType(String fileName) {
        String lowerCase = fileName.toLowerCase();
        if (lowerCase.endsWith(".png")) return MediaType.IMAGE_PNG_VALUE;
        if (lowerCase.endsWith(".jpg") || lowerCase.endsWith(".jpeg")) return MediaType.IMAGE_JPEG_VALUE;
        if (lowerCase.endsWith(".gif")) return "image/gif";
        if (lowerCase.endsWith(".webp")) return "image/webp";
        return MediaType.APPLICATION_OCTET_STREAM_VALUE;
    }
}
