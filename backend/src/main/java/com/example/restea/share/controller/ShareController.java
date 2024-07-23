package com.example.restea.share.controller;

import com.example.restea.share.dto.ShareCreationRequest;
import com.example.restea.share.dto.ShareCreationResponse;
import com.example.restea.share.entity.ShareBoard;
import com.example.restea.share.service.ShareService;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/shares")
public class ShareController {

  private final ShareService shareService;

  @PostMapping
  public ResponseEntity<ResponseDTO> createShare(@RequestBody ShareCreationRequest request) {
    ShareBoard result = shareService.createShare(request);
    // fail to create share then throw DataAccessException
    // ExceptionHandler will handle this exception

    // success to create share
    ShareCreationResponse response = ShareCreationResponse.builder()
        .shareBoardId(result.getId())
        .title(result.getTitle())
        .content(result.getContent())
        .endDate(result.getEndDate())
        .maxParticipants(result.getMaxParticipants())
        .build();

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ResponseDTO<ShareCreationResponse>.builder()
            .data(response)
            .build());
  }

  // TODO : 별도의 ControllerAdvice 클래스로 분리할 것
  // TODO : 생성 요청 실패는 400? 500?
  @ExceptionHandler(DataAccessException.class)
  public ResponseEntity<String> handleDataAccessException(DataAccessException e) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
//    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }

}
