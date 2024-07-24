package com.example.restea.oauth2.dto;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

@RequiredArgsConstructor
public class CustomOAuth2User implements OAuth2User {
    private final OAuth2JwtMemberDTO OAuth2JwtMemberDTO;

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add((GrantedAuthority) OAuth2JwtMemberDTO::getRole);

        return authorities;
    }

    @Override
    public String getName() {
        return null;
    }

    public Integer getUserId() {
        return OAuth2JwtMemberDTO.getUserId();
    }

    public String getNickname() {
        return OAuth2JwtMemberDTO.getNickname();
    }

    public String getRole() {
        return OAuth2JwtMemberDTO.getRole();
    }
}