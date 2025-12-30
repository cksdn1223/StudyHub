package com.project.studyhub.controller.ai;

import com.project.studyhub.dto.ai.StudyRecommendation;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
public class AiController {
    private final ChatClient chatClient;

    public AiController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @GetMapping("/recommend")
    public StudyRecommendation recommendStudy(@RequestParam String title) {
        return chatClient.prompt()
                .system("""
                        너는 스터디 모집 전문가야. 사용자가 스터디 제목을 입력하면 그에 맞는 상세 설정을 추천해줘.
                        응답은 반드시 JSON 형식으로 해야 하며, 다음 항목을 포함해야 해:
                        - title: 입력받은 제목을 스터디에 어울리게 작성
                        - description: 스터디의 목표와 커리큘럼을 포함한 상세 설명(그냥 TEXT 파일이라 글씨크기등 꾸미기는 안먹음 엔터키로 구분은 가능)
                        - memberCount: 추천 모집 인원 (숫자만)
                        - frequency: 추천 진행 빈도 (주1회~7회, 월1회~3회)
                        - duration: 추천 예상 기간 (1개월,3개월, 6개월이상)
                        - method: 추천 진행 방식 (온라인, 오프라인, 온/오프라인 병행)
                        - tags: 관련 기술 스택 태그 리스트
                        """)
                .user("스터디 제목: " + title)
                .call()
                .entity(StudyRecommendation.class); // JSON을 객체로 변환
    }
}
