package com.example.restea.share.service;

import com.example.restea.share.dto.ShareCreationRequest;
import com.example.restea.share.entity.ShareBoard;
import com.example.restea.share.repository.ShareBoardRepository;
import com.example.restea.user.entity.Users;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ShareService {

  private final ShareBoardRepository shareBoardRepository;
  private final UserResitory userRepository;

  @Transactional
  public ShareBoard createShare(ShareCreationRequest request, Integer userId) {
    checkCreateArgs(request);
    Users user = userRepository.findById(userId);
    ShareBoard shareBoard = request.toEntity().addUser(user);
    return shareBoardRepository.save(request.toEntity());
  }

  // 입력된 값이 유효한지 확인하는 메소드
  private void checkCreateArgs(ShareCreationRequest request) {
    boolean emptyTitle = request.getTitle().isEmpty();
    boolean emptyContent = request.getContent().isEmpty();
    boolean invalidMaxParticipants = request.getMaxParticipants() < 1;
    boolean invalidEndDate = request.getEndDate().isBefore(LocalDateTime.now());
    if (emptyContent || emptyTitle || invalidMaxParticipants || invalidEndDate) {
      throw new IllegalArgumentException();
    }
  }

}
