package com.example.restea.live.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 티타임 방송 개설 여부 응답 정의하는 클래스
@NoArgsConstructor
@Getter
public class LiveIsOpenResponseDTO {
  private boolean isOpen;

  @Builder
  public LiveIsOpenResponseDTO(boolean isOpen) {
    this.isOpen = isOpen;
  }
}
