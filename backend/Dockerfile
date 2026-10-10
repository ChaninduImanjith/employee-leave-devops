# ==========================================
# Build stage
# ==========================================
FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /workspace

COPY .mvn .mvn
COPY mvnw pom.xml ./

RUN chmod +x mvnw

# Download dependencies separately for better Docker layer caching
RUN ./mvnw \
    --batch-mode \
    dependency:go-offline

COPY src src

# Tests are handled by CI.
# The container build produces the deployable artifact.
RUN ./mvnw \
    --batch-mode \
    -DskipTests \
    clean package

RUN JAR_FILE="$(find target \
        -maxdepth 1 \
        -type f \
        -name '*.jar' \
        ! -name 'original-*' \
        ! -name '*-plain.jar' \
        | head -n 1)" \
    && test -n "$JAR_FILE" \
    && cp "$JAR_FILE" /workspace/app.jar


# ==========================================
# Runtime stage
# ==========================================
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

RUN groupadd \
        --system \
        appgroup \
    && useradd \
        --system \
        --gid appgroup \
        --home-dir /app \
        --shell /usr/sbin/nologin \
        appuser

COPY --from=build \
    --chown=appuser:appgroup \
    /workspace/app.jar \
    /app/app.jar

USER appuser

EXPOSE 8082

ENV SERVER_PORT=8082

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
