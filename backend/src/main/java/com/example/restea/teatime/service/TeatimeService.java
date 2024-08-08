package com.example.restea.teatime.service;

import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIMEBOARD_NOT_FOUND;
import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIME_BOARD_INVALID_SORT;
import static com.example.restea.user.enums.UserMessage.USER_NOT_FOUND;

import com.example.restea.common.dto.PaginationDTO;
import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.teatime.dto.TeatimeCreationRequest;
import com.example.restea.teatime.dto.TeatimeCreationResponse;
import com.example.restea.teatime.dto.TeatimeListResponse;
import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.repository.TeatimeBoardRepository;
import com.example.restea.teatime.repository.TeatimeParticipantRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
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
        Page<TeatimeBoard> teatimeBoards = getTeatimeBoards(sort, page, perPage); // 마감 기간이 지나지 않고 활성화된 게시글
        List<TeatimeListResponse> data = createResponseFormTeatimeBoards(teatimeBoards.getContent());
        Long count = calculateCount(sort);

        PaginationDTO pagination = PaginationDTO.of(count.intValue(), page, perPage);

        return ResponseDTO.of(data, pagination);
    }

    @Transactional
    public TeatimeCreationResponse createTeatimeBoard(TeatimeCreationRequest request, Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, USER_NOT_FOUND.getMessage()));
        TeatimeBoard result = teatimeBoardRepository.save(request.toEntity(user));
        return TeatimeCreationResponse.of(result);
    }

    private @NotNull Page<TeatimeBoard> getTeatimeBoards(String sort, Integer page, Integer perPage) {

        Page<TeatimeBoard> teatimeBoards = switch (sort) {
            case "latest" -> teatimeBoardRepository.findAllByActivated(true,
                    PageRequest.of(page - 1, perPage, Sort.by("createdDate").descending()));
            case "urgent" -> teatimeBoardRepository.findAllByActivatedAndEndDateAfter(true, LocalDateTime.now(),
                    PageRequest.of(page - 1, perPage, Sort.by("endDate").ascending()));
            default ->
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, TEATIME_BOARD_INVALID_SORT.getMessage());
        };
        if (teatimeBoards.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, TEATIMEBOARD_NOT_FOUND.getMessage());
        }
        return teatimeBoards;
    }

    private List<TeatimeListResponse> createResponseFormTeatimeBoards(List<TeatimeBoard> teatimeBoards) {
        List<TeatimeListResponse> data = new ArrayList<>();

        teatimeBoards.forEach(teatimeBoard -> {
            Integer participants = teatimeParticipantRepository.countByTeatimeBoard(teatimeBoard).intValue();
            data.add(TeatimeListResponse.of(teatimeBoard, participants));
        });
        return data;
    }

    private Long calculateCount(String sort) {
        return switch (sort) {
            case "latest" -> teatimeBoardRepository.countByActivated(true);
            case "urgent" -> teatimeBoardRepository.countByActivatedAndEndDateAfter(true, LocalDateTime.now());
            default ->
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, TEATIME_BOARD_INVALID_SORT.getMessage());
        };
    }
}
