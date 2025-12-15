package com.project.studyhub.security;

import com.project.studyhub.entity.User;
import com.project.studyhub.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler{
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${oauth2.success.redirect-url}")
    private String redirectUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        if (!(authentication instanceof OAuth2AuthenticationToken oauthToken)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String provider = oauthToken.getAuthorizedClientRegistrationId();
        OAuth2User oauthUser = oauthToken.getPrincipal();
        Map<String, Object> attrs = oauthUser.getAttributes();

        String email = (String) attrs.get("email");
        if (email == null || email.isBlank()) {
            getRedirectStrategy().sendRedirect(request, response, redirectUrl + "?error=oauth_email_required");
            return;
        }

        String nickname = extractNickname(provider, attrs);
        String profileImageUrl = extractProfileImage(provider, attrs);

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    String randomPw = passwordEncoder.encode("SOCIAL_LOGIN_" + System.nanoTime());
                    return new User(email, randomPw, nickname, "", null);
                });
        if (nickname != null && !nickname.isBlank()) user.changeInfo(nickname, user.getDescription());
        if (profileImageUrl != null && !profileImageUrl.isBlank()) user.changeUrl(profileImageUrl);

        userRepository.save(user);

        String token = jwtService.getToken(user);

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUrl)
                .fragment("token=" + token)
                .build()
                .encode(StandardCharsets.UTF_8)
                .toUriString();

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private String extractNickname(String provider, Map<String, Object> attrs) {
        if ("google".equals(provider)) {
            return (String) attrs.getOrDefault("name", "google_user");
        }
        if ("github".equals(provider)) {
            String name = (String) attrs.get("name");
            if (name != null && !name.isBlank()) return name;
            return (String) attrs.getOrDefault("login", "github_user");
        }
        return "social_user";
    }

    private String extractProfileImage(String provider, Map<String, Object> attrs) {
        if ("google".equals(provider)) return (String) attrs.get("picture");
        if ("github".equals(provider)) return (String) attrs.get("avatar_url");
        return null;
    }
}
