package com.example.restea.share.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
public class ShareViewResponse {

  private Integer shareBoardId;
  private String title;
  private String content;
  private LocalDateTime createdDate;
  private LocalDateTime lastUpdated;
  private LocalDateTime endDate;
  private Integer maxParticipants;
  private Integer participants;
  private Integer viewCount;
  private String nickname;

  @Builder
  public ShareViewResponse(Integer shareBoardId, String title, String content,
      LocalDateTime createdDate, LocalDateTime lastUpdated, LocalDateTime endDate,
      Integer maxParticipants, Integer participants, Integer viewCount, String nickname) {
    this.shareBoardId = shareBoardId;
    this.title = title;
    this.content = content;
    this.createdDate = createdDate;
    this.lastUpdated = lastUpdated;
    this.endDate = endDate;
    this.maxParticipants = maxParticipants;
    this.participants = participants;
    this.viewCount = viewCount;
    this.nickname = nickname;
  }

}