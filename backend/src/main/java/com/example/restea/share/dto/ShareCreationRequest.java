package com.example.restea.share.dto;

import com.example.restea.share.entity.ShareBoard;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ShareCreationRequest {

    private String title;
    private String content;
    private LocalDateTime endDate;
    private Integer maxParticipants;

    public ShareBoard toEntity() {
      return ShareBoard.builder()
          .title(title)
          .content(content)
          .endDate(endDate)
          .maxParticipants(maxParticipants)
          .build();
    }

}
