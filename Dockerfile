FROM maven@sha256:b37da91062d450f3c11c619187f0207bbb497fc89d265a46bbc6dc5f17c02a2b AS build
# The above is a temporary fix
# See:
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=911925
# https://github.com/carlossg/docker-maven/issues/92
# FROM maven:3-jdk-8-slim AS build

COPY pom.xml /build/pom.xml
WORKDIR /build

#download all maven dependencies (this will only re-run if the pom has changed)
RUN mvn -B dependency:go-offline

COPY src /build/src
ARG BUILD_COMMAND="mvn -B clean package"
RUN ${BUILD_COMMAND}

FROM tomcat:8.0-jre8

ENV probe_version=3.0.0.M3

RUN wget -O /usr/local/tomcat/webapps/probe.war "https://github.com/psi-probe/psi-probe/releases/download/${probe_version}/probe.war"

RUN mkdir -p /usr/local/tomcat/ssl

ADD docker/entrypoint.sh entrypoint.sh
RUN ["chmod", "+x", "entrypoint.sh"]

ADD docker/setenv.sh /usr/local/tomcat/bin/setenv.sh
RUN ["chmod", "+x", "/usr/local/tomcat/bin/setenv.sh"]

COPY docker/tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
COPY docker/server.xml /usr/local/tomcat/conf/server.xml
COPY docker/context.xml /usr/local/tomcat/conf/context.xml

COPY --chown=1000:1000 --from=build /build/target/*.war /usr/local/tomcat/webapps/timeseries.war

ENV TOMCAT_CERT_PATH=/tomcat-wildcard-ssl.crt
ENV TOMCAT_KEY_PATH=/tomcat-wildcard-ssl.key
ENV JAVA_KEYSTORE=/etc/ssl/certs/java/cacerts
ENV JAVA_STOREPASS=changeit
ENV keystoreLocation=/usr/local/tomcat/ssl/localkeystore.p12
ENV keystorePassword=changeme
ENV keystoreSSLKey=tomcat
ENV serverHttpPort=80
ENV serverHttpsPort=443
ENV aqcuWebserviceUrl=https://example.gov/timeseries-ws
ENV nwisRaInterfaceUrl=https://reporting.example.gov/
ENV nwisHelpEmail=changeme@test.gov
ENV oauthClientId=client-id
ENV oauthClientAccessTokenUri=https://example.gov/oauth/token
ENV oauthClientAuthorizationUri=https://example.gov/oauth/authorize
ENV oauthResourceTokenKeyUri=https://example.gov/oauth/token_key
ENV oauthResourceId=resource-id
ENV oauthClientName=client-name
ENV oauthScope=read
ENV aqcuOauthRedirectUriTemplate=https://localhost/timeseries
ENV oauthClientSecret=changeme
ENV development=true
ENV LAUNCH_DEBUG=false
ENV aqcuLoginPage=oauth2/authorization/waterAuth
ENV TZ=America/Chicago

RUN rm -rf /usr/local/tomcat/webapps/ROOT && \
  rm -rf /usr/local/tomcat/webapps/docs && \
  rm -rf /usr/local/tomcat/webapps/examples

CMD ["/usr/local/tomcat/entrypoint.sh"]
