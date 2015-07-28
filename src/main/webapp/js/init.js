AQCU.initialize = function() {
	//Set up and start router
	AQCU.router = new AQCU.controller.AqcuRouter();
	Backbone.history.start();

	//Load and display version info
	AQCU.router.loadVersionTag();

	//global ajax handler to detect timed out sesssion
	$(document).ajaxSuccess(AQCU.router.checkSession);
	$(document).ajaxError(AQCU.router.checkSession);
	  
	// Tie in the JIRA Issue Collector if we have an endpoint
	var $toggle = $("#display-nwis-feedback-toggle");
	if ($('script[id="script-tag-jira-collection-url"]').attr('src').length) {
		window.ATL_JQ_PAGE_PROPS = {
			"triggerFunction": function(showCollectorDialog) {

				//Requries that jQuery is available! 
				$toggle.click(function(e) {
					e.preventDefault();
					showCollectorDialog();
				});
			}};
	} else {
		// If an endpoint was not found, replace mailto with an email address obtained from JNDI, if exists
		if (AQCU.constants.feedbackEmail) {
			$toggle.attr({
				'href': 'mailto:' + AQCU.constants.feedbackEmail,
				'target': '_blank'
			});
		} else {
			// No feedback email found, remove entire feedback line
			$('#footer-contact-info').remove();
		}
	}
	
	AQCU.util.auth.verifyLoggedIn();
};