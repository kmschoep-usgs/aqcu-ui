package gov.usgs.aqcu;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
public class WaterAuthSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
	@Autowired
	OAuth2AuthorizedClientService clientService;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {
		//Set NWIS Auth Cookie
		String token = getToken();

		//Only create a cookie if we have a token
		if(token != null) {
			Cookie cookie = new Cookie("NwisAuthCookie", token);
			cookie.setPath("/");
			response.addCookie(cookie);
		}

		//Continue with normal login process
		super.onAuthenticationSuccess(request, response, authentication);		
	}

	private String getToken() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String accessToken = null;

		if(authentication instanceof OAuth2AuthenticationToken) {
			OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;

			OAuth2AuthorizedClient client = clientService
					.loadAuthorizedClient(oauthToken.getAuthorizedClientRegistrationId(), oauthToken.getName());

			if (null != client && null != client.getAccessToken()) {
				accessToken = client.getAccessToken().getTokenValue();
			}
		}

		return accessToken;
	}
}
