package com.example.restea.common.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 모든 응답에 대한 공통적인 부분을 정의하는 클래스
@NoArgsConstructor
@Getter
@Builder
public class ResponseDTO<T> {
    private T data;
    private PaginationDTO pagination;

    @Builder
    public ResponseDTO(T data, PaginationDTO pagination) {
        this.data = data;
        this.pagination = pagination;
    }

}
