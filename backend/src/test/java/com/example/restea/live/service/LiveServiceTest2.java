package com.example.restea.live.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.anyInt;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.restea.live.entity.Live;
import com.example.restea.live.repository.LiveRepository;
import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.repository.TeatimeBoardRepository;
import com.example.restea.user.entity.User;
import io.livekit.server.AccessToken;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
public class LiveServiceTest2 {

    @Mock
    private LiveRepository liveRepository;

    @Mock
    private TeatimeBoardRepository teatimeBoardRepository;

    @InjectMocks
    private LiveService liveService;

    private TeatimeBoard teatimeBoard;
    private User user;

    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    @BeforeEach
    public void setUp() {
        user = User.builder()
                .nickname("testUser")
                .authId("authid")
                .build();

        teatimeBoard = TeatimeBoard.builder()
                .title("testTeatimeBoard")
                .content("내용")
                .broadcastDate(LocalDateTime.now().minusMinutes(5))
                .maxParticipants(5)
                .endDate(LocalDateTime.now())
                .user(user) // 여기에 testUser 설정
                .build();
    }

    @Test
    public void testCreateLive_Success() {
        when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.of(teatimeBoard));
        when(liveRepository.save(any(Live.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AccessToken token = liveService.createLive(teatimeBoard.getId(), 1);

        assertNotNull(token);
        assertEquals(user.getId().toString(), token.getName());
        assertEquals(user.getNickname(), token.getIdentity());
        verify(liveRepository, times(1)).save(any(Live.class));
    }

    @Test
    public void testCreateLive_TeatimeBoardNotFound() {
        when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                liveService.createLive(teatimeBoard.getId(), 1));

        assertEquals("404 NOT_FOUND \"TeatimeBoard not found\"", exception.getMessage());
    }

    @Test
    public void testCreateLive_NotTeatimeBoardOwner() {
//    User anotherUser = new User();
//    anotherUser.setId(2);
//    teatimeBoard.setUser(anotherUser);
        User user2 = User.builder()
                .nickname("testUser2")
                .authId("authid")
                .build();
        when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.of(teatimeBoard));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                liveService.createLive(teatimeBoard.getId(), 2));

        assertEquals("403 FORBIDDEN \"작성자 아님\"", exception.getMessage());
    }

    @Test
    public void testCreateLive_InvalidBroadcastTime() {
//    teatimeBoard.setBroadcastDate(LocalDateTime.now().minusMinutes(5));
        when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.of(teatimeBoard));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                liveService.createLive(teatimeBoard.getId(), 1));

        assertEquals("403 FORBIDDEN \"방송 예정일이랑 다른 날임\"", exception.getMessage());
    }

    @Test
    public void testCreateToken_Success() {
//        Live live = Live.builder()
//                .teatimeBoard(teatimeBoard)
//                .build();
//        when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.of(teatimeBoard));
//        when(liveRepository.findByTeatimeBoard(any(TeatimeBoard.class))).thenReturn(Optional.of(live));
//
//        AccessToken token = liveService.createToken(teatimeBoard.getId(), user);
//
//        assertNotNull(token);
//        assertEquals(user.getId().toString(), token.getName());
//        assertEquals(user.getNickname(), token.getIdentity());
    }

    @Test
    public void testCreateToken_TeatimeBoardNotFound() {
//        when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.empty());
//
//        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
//                liveService.createToken(teatimeBoard.getId(), user));
//
//        assertEquals("404 NOT_FOUND \"TeatimeBoard not found\"", exception.getMessage());
    }

    @Test
    public void testCreateToken_LiveNotFound() {
//        when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.of(teatimeBoard));
//        when(liveRepository.findByTeatimeBoard(any(TeatimeBoard.class))).thenReturn(Optional.empty());
//
//        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
//                liveService.createToken(teatimeBoard.getId(), user));
//
//        assertEquals("404 NOT_FOUND \"Live not found\"", exception.getMessage());
    }
}
