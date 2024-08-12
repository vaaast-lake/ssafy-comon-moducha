package com.example.restea.share.repository;

import static com.example.restea.share.enums.ShareBoardMessage.SHARE_BOARD_INVALID_SORT;

import com.example.restea.share.entity.QShareBoard;
import com.example.restea.share.entity.ShareBoard;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Repository
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShareBoardSearchRepository {

    private final JPAQueryFactory queryFactory;

    QShareBoard shareBoard = QShareBoard.shareBoard;

    public Page<ShareBoard> findAllBySortAndKeyword(
            String sort, Integer page, Integer perPage, String searchBy, String keyword) {
        List<ShareBoard> reultls = queryFactory
                .selectFrom(shareBoard)
                .where(createWhereCondition(sort, searchBy, keyword))
                .orderBy(getOrderSpecifier(sort))
                .offset((long) (page - 1) * perPage)
                .limit(perPage)
                .fetch();
        return new PageImpl<>(reultls, PageRequest.of(page - 1, perPage), reultls.size());
    }

    private Predicate createWhereCondition(String sort, String searchBy, String keyword) {

        BooleanExpression baseCondition = shareBoard.activated.isTrue();

        // sort가 urgent일 때는 마감일이 가까운 순으로 정렬
        if ("urgent".equals(sort)) {
            baseCondition.and(shareBoard.endDate.gt(LocalDateTime.now()));
        }
        // searchBy가 title일 때는 제목에 keyword가 포함된 게시글
        // searchBy가 content일 때는 내용에 keyword가 포함된 게시글
        // searchBy가 writer일 때는 작성자 이름에 keyword가 포함된 게시글
        switch (searchBy) {
            case "title":
                baseCondition.and(shareBoard.title.contains(keyword));
                break;
            case "content":
                baseCondition.and(shareBoard.content.contains(keyword));
                break;
            case "writer":
                baseCondition.and(shareBoard.user.nickname.contains(keyword));
                break;
        }
        return baseCondition;
    }

    private OrderSpecifier<?> getOrderSpecifier(String sort) {
        return switch (sort) {
            case "latest" -> shareBoard.createdDate.desc();
            case "urgent" -> shareBoard.endDate.asc();
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, SHARE_BOARD_INVALID_SORT.getMessage());
        };
    }

}
