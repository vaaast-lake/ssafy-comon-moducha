package com.example.restea.user.service;

import static com.example.restea.user.enums.UserMessage.USER_ALREADY_WITHDRAWN;
import static com.example.restea.user.enums.UserMessage.USER_NOT_FOUND;

import com.example.restea.oauth2.repository.AuthTokenRepository;
import com.example.restea.oauth2.repository.RefreshTokenRepository;
import com.example.restea.record.repository.RecordRepository;
import com.example.restea.share.repository.ShareParticipantRepository;
import com.example.restea.teatime.repository.TeatimeParticipantRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ShareParticipantRepository shareParticipantRepository;
    private final TeatimeParticipantRepository teatimeParticipantRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthTokenRepository authTokenRepository;
    private final RecordRepository recordRepository;

    private final EntityManager em;

    @Transactional
    public void withdrawUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND.getMessage()));

        // 이미 탈퇴한 유저의 경우 다시 탈퇴 할 수 없음.
        if (!user.getActivated()) {
            throw new IllegalArgumentException(USER_ALREADY_WITHDRAWN.getMessage());
        }

        deleteRecords(user);
        deleteParticipants(user); // 참여기록 clear 및 삭제
        revokeRefreshToken(user); // RefreshToken를 지운 후 Revoke 처리
        deleteAuthToken(user); // AuthToken을 지운 후 삭제
        user.deactivate(); // 유저 비활성화
        userRepository.save(user);
    }

    /**
     * 기록 삭제 메소드
     *
     * @param user 유저 엔티티
     */
    private void deleteRecords(User user) {
        user.clearRecords();
        recordRepository.deleteByUserId(user.getId());
    }

    /**
     * 참여기록 삭제 메소드
     *
     * @param user 유저 엔티티
     */
    private void deleteParticipants(User user) {
        user.clearParticipants();
        shareParticipantRepository.deleteByUserId(user.getId());
        teatimeParticipantRepository.deleteByUserId(user.getId());
    }

    /**
     * 유저의 RefreshToken을 지운 후 Revoke 상태 활성화
     *
     * @param user 유저 엔티티
     */
    private void revokeRefreshToken(User user) {
        if (user.getRefreshToken() != null) {
            Integer refreshTokenId = user.getRefreshToken().getId();
            user.deleteRefreshToken();
            refreshTokenRepository.revokeById(refreshTokenId);
        }
    }

    /**
     * 유저의 AuthToken을 지운 후 삭제
     *
     * @param user 유저 엔티티
     */
    private void deleteAuthToken(User user) {
        if (user.getAuthToken() != null) {
            Integer authTokenId = user.getAuthToken().getId();
            user.deleteAuthToken();
            authTokenRepository.deleteById(authTokenId);
        }
    }

    /**
     * 올바른 유저인지 확인하는 메소드
     *
     * @param userId       userId
     * @param targetUserId 토큰에서 얻은 userId
     * @return User 객체
     */
    public User checkValidUser(Integer userId, Integer targetUserId) {
        if (!userId.equals(targetUserId)) { // 유저의 user_id가 일치하지 않으면
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, USER_INVALID.getMessage());
        }

        User user = userRepository.findById(userId) // 해당 userId를 가진 User가 없으면
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, USER_NOT_FOUND.getMessage()));

        if (!user.getActivated()) { // 탈퇴된 유저라면
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, USER_ALREADY_WITHDRAWN.getMessage());
        }

        return user;
    }
}
