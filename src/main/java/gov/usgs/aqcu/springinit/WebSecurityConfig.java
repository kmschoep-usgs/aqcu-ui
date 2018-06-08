package gov.usgs.aqcu.springinit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;

import gov.usgs.aqcu.CustomOAuth2UserService;

@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	CustomOAuth2UserService customOAuth2UserService;
	@Autowired
	ClientRegistrationRepository clientRegistrationRepository;
	@Value("${aqcu.login.page}")
	String loginPage;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
			.httpBasic().disable()
			.cors().and()
			.authorizeRequests()
				.antMatchers("/js/**", "/images/**", "/css/**", "/webjars/**", "/version").permitAll()
				.anyRequest().fullyAuthenticated()
			.and()
				.logout().permitAll()
			.and()
				.csrf().disable()
				.oauth2Login()
					.loginPage("/" + loginPage)
					.defaultSuccessUrl("/")
					.clientRegistrationRepository(clientRegistrationRepository)
					.userInfoEndpoint()
						.userService(customOAuth2UserService)
		;
	}

}
