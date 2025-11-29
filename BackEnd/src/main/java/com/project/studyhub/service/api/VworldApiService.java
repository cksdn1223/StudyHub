package com.project.studyhub.service.api;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class VworldApiService {
    private final WebClient vworldApiWebClient;
    @Value("${api.key.vworld}")
    private String vworldApiKey;

    public Mono<JsonNode> fetchVworldApiData(String address) {
        return vworldApiWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("service", "address")
                        .queryParam("request", "getcoord")
                        .queryParam("simple", "true")
                        .queryParam("format", "json")
                        .queryParam("type", "road")
                        .queryParam("key", vworldApiKey)
                        .queryParam("address", address)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class);
    }
}
