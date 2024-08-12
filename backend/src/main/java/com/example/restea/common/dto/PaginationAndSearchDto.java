package com.example.restea.common.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PaginationAndSearchDto {

    @NotBlank
    private String sort = "latest"; // 기본값 설정

    @NotNull
    @Positive
    private Integer page = 1; // 페이지 번호

    @NotNull
    @Positive
    private Integer perPage = 12; // 페이지 당 항목 수

    private String searchBy; // 검색 기준 (제목: title, 작성자: writer, 내용: content)
    private String keyword;  // 검색 내용
}
