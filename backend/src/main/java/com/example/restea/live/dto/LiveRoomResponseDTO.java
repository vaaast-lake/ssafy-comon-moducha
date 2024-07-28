package com.example.restea.live.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 티타임 방송 생성, 참가 응답 정의하는 클래스
@NoArgsConstructor
@Getter
public class LiveRoomResponseDTO {
  private String token;

  @Builder
  public LiveRoomResponseDTO(String token) {
    this.token = token;
  }
}
