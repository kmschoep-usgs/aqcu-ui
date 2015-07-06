/**
 * Utility functions dealing with auth state and cookies
 */
AQCU.util.auth = function() {
	return {
		doLogin : function(username, password, landingPage) {
    		$.ajax({
    			url: AQCU.constants.serviceEndpoint + "/auth/authenticate",
    			async: false,
    			dataType: "json",
    			type: "POST",
    			data: {
    				username : username,
    				password : password
    			},
    			success: function(data) {
    				AQCU.util.auth.setAuthToken(data.tokenId);
    				window.location = landingPage;
    			},
    			error: function() {
    				window.location = AQCU.constants.nwisRaHome + "/login.jsp?failedAttempt=true"
    			},
    			context: this
    		});
    	},
    	
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
    	logout : function() {
    		$.ajax({
    			url: AQCU.constants.serviceEndpoint + "/auth/logout",
    			async: false,
    			dataType: "json",
    			type: "POST",
    			success: function(data) {
    				AQCU.util.auth.setAuthToken();
        			window.location = AQCU.constants.nwisRaHome + "/login.jsp";
    			},
    			error: function() {
    				AQCU.util.auth.setAuthToken(null);
        			window.location = AQCU.constants.nwisRaHome + "/login.jsp";
    			},
    			context: this
    		});
    	},
    	verifyLoggedIn : function() {
    		var currentToken = AQCU.util.auth.getAuthToken();
    		$.ajax({
    			url: AQCU.constants.serviceEndpoint + "/service/lookup/report/types",
    			async: false,
    			dataType: "json",
    			type: "GET",
    			success: function(data) {
    				//do nothing, login state is good
    			},
    			error: function() {
    				//global 401 handler should get this
    			},
    			context: this
    		});
    	}
	};
}();

//global ajax settings
$.ajaxSetup({
    statusCode: {
        401: function(){
        	var currentToken = AQCU.util.auth.getAuthToken();
        	if(!currentToken) {
    			window.location = AQCU.constants.nwisRaHome + "login.jsp";
    		} else {
    			window.location = AQCU.constants.nwisRaHome + "login.jsp?timedOut=true";
    		}
        }
    },
	headers: {
		"Authorization": "Bearer " + AQCU.util.auth.getAuthToken()
	}
});