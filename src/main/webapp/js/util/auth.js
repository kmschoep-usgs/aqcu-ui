/**
 * Utility functions dealing with auth state and cookies
 */
AQCU.util.auth = function() {
	return {
		setAuthToken : function (tokenId) {
			if(!tokenId) {
				tokenId = "";
			}
			$.cookie("NwisAuthCookie", tokenId);
		},

		getAuthToken : function () {
			var token = $.cookie("NwisAuthCookie");
			return token;
		},

		redirectFunction : function(){
			window.location = AQCU.constants.loginPage;
		} 
	};
}();

//global ajax settings
$.ajaxSetup({
	statusCode: {
		401: AQCU.util.auth.redirectFunction,
		403: AQCU.util.auth.redirectFunction
	},
	headers: {
		"Authorization": "Bearer " + AQCU.util.auth.getAuthToken()
	}
});