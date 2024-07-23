package com.example.restea.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// 모든 응답에 대한 공통적인 부분을 정의하는 클래스
@NoArgsConstructor
@Getter
@Builder
public class ResponseDTO<T> {
  private T data;
  private PagenationDTO pagenation;

  @Builder
  public ResponseDTO(T data, PagenationDTO pagenation) {
    this.data = data;
    this.pagenation = pagenation;
  }

}
