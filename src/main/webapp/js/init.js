AQCU.initialize = function() {
	//Set up and start router
	AQCU.router = new AQCU.controller.AqcuRouter();
	Backbone.history.start();

	//Load and display version info
	AQCU.router.loadVersionTag();

	//global ajax handler to detect timed out sesssion
	$(document).ajaxSuccess(AQCU.router.checkSession);
	$(document).ajaxError(AQCU.router.checkSession);
	  
	// Tie in the Remedy support system
	var $toggle = $("#display-feedback-toggle");
        if (AQCU.constants.feedbackEmail && AQCU.constants.feedbackEmail !== "null") {
                $toggle.attr({
                        'href': 'mailto:' + AQCU.constants.feedbackEmail,
                        'target': '_blank'
                });
        } else {
                // No feedback email found, remove entire feedback line
                $('#footer-contact-info').remove();
        }
	
	AQCU.util.auth.verifyLoggedIn();
};