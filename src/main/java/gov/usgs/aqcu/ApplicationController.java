package gov.usgs.aqcu;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ApplicationController {

	@Autowired
	OAuth2AuthorizedClientService clientService;

	@GetMapping(value={"/", "/index"})
	public String home(HttpServletResponse response) {
		Cookie cookie = new Cookie("NwisAuthCookie", getToken());
		response.addCookie(cookie);
		return "home";
	}

	protected String getToken() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;

		OAuth2AuthorizedClient client = clientService
				.loadAuthorizedClient(oauthToken.getAuthorizedClientRegistrationId(), oauthToken.getName());

		String accessToken = "";
		if (null != client && null != client.getAccessToken()) {
			accessToken = client.getAccessToken().getTokenValue();
		}

		return accessToken;
	}

}
