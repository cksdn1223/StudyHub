package com.project.studyhub.service.oauth2;

import org.springframework.http.*;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class Oauth2UserService extends DefaultOAuth2UserService {
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attrs = new HashMap<>(user.getAttributes());

        if ("github".equals(registrationId)) {
            Object emailObj = attrs.get("email");
            if (emailObj == null || String.valueOf(emailObj).isBlank()) {
                String tokenValue = userRequest.getAccessToken().getTokenValue();
                String email = fetchGithubPrimaryEmail(tokenValue);
                if (email != null) attrs.put("email", email);
            }
        }

        String nameAttrKey = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        return new DefaultOAuth2User(user.getAuthorities(), attrs, nameAttrKey);
    }

    private String fetchGithubPrimaryEmail(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<List> res = restTemplate.exchange(
                    "https://api.github.com/user/emails",
                    HttpMethod.GET,
                    entity,
                    List.class
            );

            if (!res.getStatusCode().is2xxSuccessful() || res.getBody() == null) return null;

            for (Object o : res.getBody()) {
                if (!(o instanceof Map<?, ?> m)) continue;
                Object primary = m.get("primary");
                Object verified = m.get("verified");
                Object email = m.get("email");
                if (Boolean.TRUE.equals(primary) && Boolean.TRUE.equals(verified) && email != null) {
                    return String.valueOf(email);
                }
            }

            for (Object o : res.getBody()) {
                if (!(o instanceof Map<?, ?> m)) continue;
                Object email = m.get("email");
                if (email != null) return String.valueOf(email);
            }

            return null;
        } catch (Exception e) {
            return null;
        }
    }
}
