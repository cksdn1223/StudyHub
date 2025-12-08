# 가벼운 JRE 이미지 사용 (Java 17 기준)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
ARG JAR_FILE=build/libs/studyhub-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
# application.properties 파일을 알아서 찾아줌 ( 배포용 application-prod.properties )
ENV SPRING_PROFILES_ACTIVE=prod
# 타임존 맞추기
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
    && echo "Asia/Seoul" > /etc/timezone
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
