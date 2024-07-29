package com.example.restea.share.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
public class ShareCreationResponse {

//  "shareBoardId": 1,
//  "title": "New Post Title",
//  "content": "This is the content of the new post.",
//  "createdDate": "2023-07-15T10:00:00Z",
//  "endDate": "2023-08-01T12:00:00Z",
//  "broadcastDate": "2023-07-20T15:00:00Z",
//  "maxParticipants": 10,

  private Integer boardId;
  private String title;
  private String content;
  private LocalDateTime createdDate;
  private LocalDateTime endDate;
  private LocalDateTime broadcastDate;
  private Integer maxParticipants;

  @Builder
  public ShareCreationResponse(Integer boardId, String title, String content,
      LocalDateTime createdDate, LocalDateTime endDate, LocalDateTime broadcastDate,
      Integer maxParticipants) {
    this.boardId = boardId;
    this.title = title;
    this.content = content;
    this.createdDate = createdDate;
    this.endDate = endDate;
    this.broadcastDate = broadcastDate;
    this.maxParticipants = maxParticipants;
  }

}
