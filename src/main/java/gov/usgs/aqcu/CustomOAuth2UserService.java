package gov.usgs.aqcu;

import java.text.ParseException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.JWTParser;

@Component
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
	private static final String MISSING_USER_NAME_ATTRIBUTE_ERROR_CODE = "missing_user_name_attribute";
	private static final String UNABLE_TO_PARSE_TOKEN_ERROR_CODE = "unable_to_parse_token";
	private static final String INVALID_AUDIENCE_ERROR_CODE = "invalid_audience";

	@Value("${oauthResourceId}")
	private String resourceId;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		Assert.notNull(userRequest, "userRequest cannot be null");

		String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
		if (!StringUtils.hasText(userNameAttributeName)) {
			OAuth2Error oauth2Error = new OAuth2Error(
				MISSING_USER_NAME_ATTRIBUTE_ERROR_CODE,
				"Missing required \"user name\" attribute name in UserInfoEndpoint for Client Registration: " +
					userRequest.getClientRegistration().getRegistrationId(),
				null
			);
			throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
		}

		Map<String, Object> userAttributes = new HashMap<>();

		try {
			JWT a = JWTParser.parse(userRequest.getAccessToken().getTokenValue());
			JWTClaimsSet x = a.getJWTClaimsSet();
			userAttributes = x.getClaims();
			validateAudience(x.getAudience());
		} catch (ParseException e) {
			OAuth2Error oauth2Error = new OAuth2Error(
					UNABLE_TO_PARSE_TOKEN_ERROR_CODE,
					"Error parsing token: " +
						e.getMessage(),
					null
				);
				throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
		}

		GrantedAuthority authority = new OAuth2UserAuthority(userAttributes);
		Set<GrantedAuthority> authorities = new HashSet<>();
		authorities.add(authority);

		return new DefaultOAuth2User(authorities, userAttributes, userNameAttributeName);
	}

	private void validateAudience(List<String> userAttributes) {
		if (StringUtils.hasText(resourceId) && !userAttributes.contains(resourceId)) {
			OAuth2Error oauth2Error = new OAuth2Error(INVALID_AUDIENCE_ERROR_CODE,
					"Audience did not include:" + resourceId,
					null);
			throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
		}
	}

}
