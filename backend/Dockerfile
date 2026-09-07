# Build Stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# Production Runtime Stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create non-root application user for container security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /build/target/healthpoint-fitness-1.0.0.jar app.jar

USER appuser

EXPOSE 8085

ENV PORT=8085

ENTRYPOINT ["java", "-XX:+UseSerialGC", "-Xss512k", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]