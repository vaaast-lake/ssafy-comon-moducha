package com.example.restea.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// pagenation에 대한 정보를 담는 DTO
@NoArgsConstructor
@Builder
@Getter
@ToString
public class PagenationDTO {
  private int total;
  private int page;
  private int perPage;

  @Builder
  public PagenationDTO(int total, int page, int perPage) {
    this.total = total;
    this.page = page;
    this.perPage = perPage;
  }

}
