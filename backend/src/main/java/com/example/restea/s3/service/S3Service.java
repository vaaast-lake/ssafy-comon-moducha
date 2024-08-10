package com.example.restea.s3.service;

import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface S3Service {

    String uploadSingleFile(MultipartFile multipartFile) throws IOException;
}