FROM eclipse-temurin:17
VOLUME /tmp
ARG JAR_FILE=build/libs/*.jar
LABEL authors="anazworth"

COPY ${JAR_FILE} app.jar

EXPOSE 8080


ENTRYPOINT ["java","-jar","/app.jar"]