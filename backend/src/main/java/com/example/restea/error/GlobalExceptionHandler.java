package com.example.restea.error;

import com.example.restea.error.exception.NoContent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException.BadRequest;
import org.springframework.web.client.HttpClientErrorException.Conflict;
import org.springframework.web.client.HttpClientErrorException.Forbidden;
import org.springframework.web.client.HttpClientErrorException.NotFound;
import org.springframework.web.client.HttpClientErrorException.Unauthorized;
import org.springframework.web.client.HttpServerErrorException.InternalServerError;
import org.springframework.web.client.HttpStatusCodeException;

/**
 * created by Uigeun Kim on 2024-07-24
 * 전역 예외 처리 클래스
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  // 204 No Content: (내용이 없습니다)
  // 400 Bad Request: (잘못된 요청입니다)
  // 401 Unauthorized: (인증 오류가 발생하였습니다)
  // 403 Forbidden: (권한이 없는 유저입니다)
  // 404 Not Found: (정보를 찾을 수 없습니다)
  // 409 Conflict: (중복된 정보입니다)
  // 500 Internal Server Error: (서버 에러 입니다)

  @ExceptionHandler({
      NoContent.class,
      BadRequest.class,
      Unauthorized.class,
      Forbidden.class,
      NotFound.class,
      Conflict.class,
      InternalServerError.class})
  public ResponseEntity<String> handleHttpStatusException(HttpStatusCodeException e) {
    log.error("HTTP Status Error : ", e);
    return ResponseEntity.status(e.getStatusCode()).build();
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<String> handleException(Exception e) {
    log.error("서버 에러 발생 : ", e);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }
}
