package com.example.restea.live.exhandler;

import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.example.restea.live.controller")
public class LiveExceptionHandler {

//  @ExceptionHandler(BadRequest.class)
//  @ResponseStatus(HttpStatus.BAD_REQUEST)
//  protected ResponseEntity<?> badRequestExceptionHandler(BadRequest e){
////    return ResponseEntity.badRequest().body("message");
//    return ResponseEntity.badRequest().build();
//  }
//
//  @ExceptionHandler(Unauthorized.class)
//  @ResponseStatus(HttpStatus.UNAUTHORIZED)
//  protected ResponseEntity<?> unauthorizedExceptionHandler(Unauthorized e){
//    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//  }
//
//  @ExceptionHandler(ForbiddenException.class)
//  @ResponseStatus(HttpStatus.FORBIDDEN)
//  protected ResponseEntity<?> forbiddenExceptionHandler(ForbiddenException e){
//    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//  }
//
//  @ExceptionHandler(NotFonudException.class)
//  @ResponseStatus(HttpStatus.NOT_FOUND)
//  protected ResponseEntity<?> notFoundExceptionHandler(NotFonudException e){
//    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//  }

}
