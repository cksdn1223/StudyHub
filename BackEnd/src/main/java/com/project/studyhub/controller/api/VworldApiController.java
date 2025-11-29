package com.project.studyhub.controller.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.project.studyhub.service.api.VworldApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class VworldApiController {
    private final VworldApiService vworldApiService;

    @GetMapping("/vworld")
    public Mono<JsonNode> getVworldApi(@RequestParam String address) {
        return vworldApiService.fetchVworldApiData(address);
    }
}
