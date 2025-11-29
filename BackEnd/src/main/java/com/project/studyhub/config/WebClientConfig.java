package com.project.studyhub.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    /**
     * 공강정보오픈플랫폼 api
     */
    @Value("${api.url.vworld}")
    private String vworldApiBaseUrl;
    @Bean
    public WebClient vworldApiWebClient() {
        return WebClient.builder().baseUrl(vworldApiBaseUrl).build();
    }


}