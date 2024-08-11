package com.example.restea.teatime.service;

import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIME_BOARD_INVALID_SORT;
import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIME_BOARD_LESS_THAN_CURRENT_PARTICIPANTS;
import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIME_BOARD_NOT_WRITER;
import static com.example.restea.teatime.util.TeatimeUtil.getActivatedTeatimeBoard;
import static com.example.restea.teatime.util.TeatimeUtil.getActivatedUser;

import com.example.restea.common.dto.PaginationDTO;
import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.teatime.dto.TeatimeCreationRequest;
import com.example.restea.teatime.dto.TeatimeCreationResponse;
import com.example.restea.teatime.dto.TeatimeDeleteResponse;
import com.example.restea.teatime.dto.TeatimeListResponse;
import com.example.restea.teatime.dto.TeatimeUpdateRequest;
import com.example.restea.teatime.dto.TeatimeUpdateResponse;
import com.example.restea.teatime.dto.TeatimeViewResponse;
import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.entity.TeatimeComment;
import com.example.restea.teatime.entity.TeatimeReply;
import com.example.restea.teatime.repository.TeatimeBoardRepository;
import com.example.restea.teatime.repository.TeatimeParticipantRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Service
public class TeatimeService {

    private final TeatimeBoardRepository teatimeBoardRepository;
    private final UserRepository userRepository;
    private final TeatimeParticipantRepository teatimeParticipantRepository;

    @Transactional
    public ResponseDTO<List<TeatimeListResponse>> getTeatimeBoardList(String sort, Integer page, Integer perPage) {

        Page<TeatimeBoard> teatimeBoards = getActivatedTeatimeBoards(sort, page, perPage);
        List<TeatimeListResponse> data = createResponseFormTeatimeBoards(teatimeBoards.getContent());

        PaginationDTO pagination = PaginationDTO.of(teatimeBoards.getTotalPages(), page, perPage);

        return ResponseDTO.of(data, pagination);
    }

    @Transactional
    public TeatimeCreationResponse createTeatimeBoard(TeatimeCreationRequest request, Integer userId) {

        User activatedUser = getActivatedUser(userRepository, userId);
        TeatimeBoard result = teatimeBoardRepository.save(request.toEntity(activatedUser));

        return TeatimeCreationResponse.of(result);
    }

    @Transactional
    public TeatimeViewResponse getTeatimeBoard(Integer teatimeBoardId) {

        TeatimeBoard teatimeBoard = getOnlyTeatimeBoard(teatimeBoardId);
        Integer participants = teatimeParticipantRepository.countByTeatimeBoard(teatimeBoard).intValue();

        teatimeBoard.addViewCount();

        return TeatimeViewResponse.of(teatimeBoard, participants);
    }

    public TeatimeBoard getOnlyTeatimeBoard(Integer teatimeBoardId) {
        return getActivatedTeatimeBoard(teatimeBoardRepository, teatimeBoardId);
    }

    @Transactional
    public TeatimeUpdateResponse updateTeatimeBoard(Integer teatimeBoardId, TeatimeUpdateRequest request,
                                                    Integer userId) {

        User activatedUser = getActivatedUser(userRepository, userId);
        TeatimeBoard activatedTeatimeBoard = getOnlyTeatimeBoard(teatimeBoardId);

        checkWriter(activatedTeatimeBoard, userId);

        Integer participants = teatimeParticipantRepository.countByTeatimeBoard(activatedTeatimeBoard).intValue();
        checkLessThanCurrentParticipants(request, participants);

        activatedTeatimeBoard.update(request.getTitle(), request.getContent(), request.getMaxParticipants(),
                request.getEndDate(), request.getBroadcastDate());

        return TeatimeUpdateResponse.of(activatedTeatimeBoard, participants);
    }

    @Transactional
    public TeatimeDeleteResponse deactivateTeatimeBoard(Integer teatimeBoardId, Integer userId) {

        User user = getActivatedUser(userRepository, userId);
        TeatimeBoard activatedTeatimeBoard = getOnlyTeatimeBoard(teatimeBoardId);

        checkWriter(activatedTeatimeBoard, userId);

        deactivateCommentsAndReplies(activatedTeatimeBoard);
        activatedTeatimeBoard.deactivate();

        teatimeParticipantRepository.deleteAll(activatedTeatimeBoard.getTeatimeParticipants());

        return TeatimeDeleteResponse.from(teatimeBoardId);
    }

    private Page<TeatimeBoard> getActivatedTeatimeBoards(String sort, Integer page, Integer perPage) {
        Sort sortBy = determineSort(sort);
        PageRequest pageRequest = PageRequest.of(page - 1, perPage, sortBy);

        if (isUrgentSort(sort)) {
            return teatimeBoardRepository.findAllByActivatedAndEndDateAfter(true, LocalDateTime.now(), pageRequest);
        }

        return teatimeBoardRepository.findAllByActivated(true, pageRequest);
    }

    private Sort determineSort(String sort) {
        return switch (sort) {
            case "latest" -> Sort.by("createdDate").descending();
            case "urgent" -> Sort.by("endDate").ascending();
            default ->
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, TEATIME_BOARD_INVALID_SORT.getMessage());
        };
    }

    private boolean isUrgentSort(String sort) {
        return "urgent".equals(sort);
    }

    private List<TeatimeListResponse> createResponseFormTeatimeBoards(List<TeatimeBoard> teatimeBoards) {
        List<TeatimeListResponse> data = new ArrayList<>();
        for (TeatimeBoard teatimeBoard : teatimeBoards) {
            Integer participants = teatimeParticipantRepository.countByTeatimeBoard(teatimeBoard).intValue();
            data.add(TeatimeListResponse.of(teatimeBoard, participants));
        }
        return data;
    }

    private void checkWriter(TeatimeBoard teatimeBoard, Integer userId) {
        if (!Objects.equals(teatimeBoard.getUser().getId(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, TEATIME_BOARD_NOT_WRITER.getMessage());
        }
    }

    private void checkLessThanCurrentParticipants(TeatimeUpdateRequest request, Integer participants) {
        boolean isLessThanCurrentParticipants =
                request.getMaxParticipants() < participants;
        if (isLessThanCurrentParticipants) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    TEATIME_BOARD_LESS_THAN_CURRENT_PARTICIPANTS.getMessage());
        }
    }

    private void deactivateCommentsAndReplies(TeatimeBoard teatimeBoard) {
        teatimeBoard.getTeatimeComments().forEach(this::deactivateCommentAndReplies);
    }

    private void deactivateCommentAndReplies(TeatimeComment comment) {
        comment.deactivate();
        comment.getTeatimeReplies().forEach(TeatimeReply::deactivate);
    }
}
