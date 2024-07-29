package com.example.restea.live.service;

import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIMEBOARD_BEFORE_BROADCAST_DATE;
import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIMEBOARD_NOT_ACTIVATED;
import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIMEBOARD_NOT_BROADCAST_DATE;
import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIMEBOARD_NOT_FOUND;
import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIMEBOARD_NOT_WRITER;
import static com.example.restea.teatime.enums.TeatimeParticipantMessage.TEATIME_PARTICIPANT_NOT_FOUND;

import com.example.restea.live.entity.Live;
import com.example.restea.live.repository.LiveRepository;
import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.repository.TeatimeBoardRepository;
import com.example.restea.teatime.repository.TeatimeParticipantRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class LiveService {

    private final UserRepository userRepository;
    private final LiveRepository liveRepository;
    private final TeatimeBoardRepository teatimeBoardRepository;
    private final TeatimeParticipantRepository teatimeParticipantRepository;

    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;


    public boolean isLiveOpen(Integer teatimeBoardId, Integer userId) {
        User user = userRepository.getReferenceById(userId);

        // 티타임 게시글 존재 여부 확인
        TeatimeBoard teatimeBoard = checkTeatimeBoard(teatimeBoardId);

        // 티타임 방송 참가자 여부 확인
        checkParticipant(teatimeBoard, user);

        // 티타임 방송 개설 여부 확인
        return liveRepository.existsByTeatimeBoard(teatimeBoard);
    }

    @Transactional
    public AccessToken createLive(Integer teatimeBoardId, Integer userId) {
        User user = userRepository.getReferenceById(userId);

        // 티타임 게시글 존재 여부 확인
        TeatimeBoard teatimeBoard = checkTeatimeBoard(teatimeBoardId);

        // 티타임 게시글 작성자인지 확인
        checkWriter(teatimeBoard, user);

        // 방송 예정일인지 확인
        checkBroadCastDate(teatimeBoard);

        // 방송 생성
        Live live = Live.builder()
                .teatimeBoard(teatimeBoard)
                .build();

        liveRepository.save(live);

        // AccessToken 발급 및 호스트 토큰 반환
        return createToken(live.getId(), user);
    }

    // 티타임 게시글 작성자인지 확인하는 메소드
    private void checkWriter(TeatimeBoard teatimeBoard, User user) {
        if (!teatimeBoard.getUser().equals(user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, TEATIMEBOARD_NOT_WRITER.getMessage());
        }
    }

    // 티타임 방송 참가자인지 확인하는 메소드
    private void checkParticipant(TeatimeBoard teatimeBoard, User user) {
        if (teatimeBoard.getUser().equals(user)) {
            return;
        }

        boolean isTeatimeParticipant = teatimeParticipantRepository.existsByTeatimeBoardAndUser(teatimeBoard, user);
        if (!isTeatimeParticipant) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, TEATIME_PARTICIPANT_NOT_FOUND.getMessage());
        }
    }

    // 방송 예정일인지 확인하는 메소드
    private void checkBroadCastDate(TeatimeBoard teatimeBoard) {
        LocalDateTime broadcastDate = teatimeBoard.getBroadcastDate();
        LocalDateTime now = LocalDateTime.now();

        if (broadcastDate.toLocalDate().isEqual(now.toLocalDate())) {
            // 방송 예정일보다 현재 시간이 전인 경우
            if (now.isBefore(broadcastDate)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        TEATIMEBOARD_BEFORE_BROADCAST_DATE.getMessage());
            }
        } else {
            // 방송 예정일이랑 다른 날인 경우
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, TEATIMEBOARD_NOT_BROADCAST_DATE.getMessage());
        }
    }

    // 티타임 게시글 존재하는지 확인하는 메소드
    private TeatimeBoard checkTeatimeBoard(Integer teatimeBoardId) {
        // 티타임 게시글 존재하는지 확인하는 메소드
        TeatimeBoard teatimeBoard = teatimeBoardRepository.findById(teatimeBoardId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, TEATIMEBOARD_NOT_FOUND.getMessage()));

        // 티타임 게시글 삭제 여부 확인
        if (!teatimeBoard.getActivated()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, TEATIMEBOARD_NOT_ACTIVATED.getMessage());
        }

        return teatimeBoard;
    }

    // AccessToken 발급하는 메소드
    private AccessToken createToken(String liveId, User user) {
        AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        token.setName(user.getNickname());
        token.setIdentity(user.getId().toString());
        token.addGrants(new RoomJoin(true), new RoomName(liveId));

        return token;
    }


}
