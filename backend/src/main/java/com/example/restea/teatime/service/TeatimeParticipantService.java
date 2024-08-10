package com.example.restea.teatime.service;

import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIME_BOARD_USER_NOT_ACTIVATED;
import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIME_BOARD_WRITER;
import static com.example.restea.teatime.enums.TeatimeParticipantMessage.TEATIME_PARTICIPANT_ALREADY_EXISTS;
import static com.example.restea.teatime.enums.TeatimeParticipantMessage.TEATIME_PARTICIPANT_FULL;
import static com.example.restea.teatime.util.TeatimeUtil.getActivatedTeatimeBoard;
import static com.example.restea.teatime.util.TeatimeUtil.getActivatedUser;

import com.example.restea.teatime.dto.TeatimeJoinRequest;
import com.example.restea.teatime.dto.TeatimeJoinResponse;
import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.entity.TeatimeParticipant;
import com.example.restea.teatime.repository.TeatimeBoardRepository;
import com.example.restea.teatime.repository.TeatimeParticipantRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Service
public class TeatimeParticipantService {

    private final TeatimeParticipantRepository teatimeParticipantRepository;
    private final TeatimeBoardRepository teatimeBoardRepository;
    private final UserRepository userRepository;

    @Transactional
    public TeatimeJoinResponse addParticipant(Integer teatimeBoardId, TeatimeJoinRequest request, Integer userId) {
        User activatedUser = getActivatedUser(userRepository, userId);
        TeatimeBoard activatedTeatimeBoard = getActivatedTeatimeBoard(teatimeBoardRepository, teatimeBoardId);

        if (checkActivatedTeatimeBoardWriter(activatedTeatimeBoard, activatedUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, TEATIME_BOARD_WRITER.getMessage());
        }
        ;

        validateParticipantCount(activatedTeatimeBoard);
        validateParticipantAlreadyExists(activatedTeatimeBoard, activatedUser);

        TeatimeParticipant teatimeParticipant = TeatimeParticipant.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .teatimeBoard(activatedTeatimeBoard)
                .user(activatedUser)
                .build();

        teatimeParticipantRepository.save(teatimeParticipant);

        return TeatimeJoinResponse.of(teatimeParticipant);
    }

    private boolean checkActivatedTeatimeBoardWriter(TeatimeBoard activatedTeatimeBoard, User activatedUser) {
        if (!activatedTeatimeBoard.getUser().getActivated()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, TEATIME_BOARD_USER_NOT_ACTIVATED.getMessage());
        }

        if (Objects.equals(activatedTeatimeBoard.getUser().getId(), activatedUser.getId())) {
            return true;
        }

        return false;
    }

    private void validateParticipantCount(TeatimeBoard activatedTeatimeBoard) {
        if (activatedTeatimeBoard.getTeatimeParticipants().size() >= activatedTeatimeBoard.getMaxParticipants()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, TEATIME_PARTICIPANT_FULL.getMessage());
        }
    }

    private void validateParticipantAlreadyExists(TeatimeBoard activatedTeatimeBoard, User user) {
        if (teatimeParticipantRepository.existsByTeatimeBoardIdAndUser(activatedTeatimeBoard.getId(), user)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, TEATIME_PARTICIPANT_ALREADY_EXISTS.getMessage());
        }
    }
}
