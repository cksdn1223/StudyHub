FROM gradle:8.10-jdk17-alpine AS builder
WORKDIR /workspace
COPY . .
RUN chmod +x ./gradlew && ./gradlew clean build -x test
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
ARG JAR_FILE=build/libs/studyhub-0.0.1-SNAPSHOT.jar
COPY --from=builder /workspace/${JAR_FILE} app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]