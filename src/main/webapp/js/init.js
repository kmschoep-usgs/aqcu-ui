AQCU.initialize = function() {
	//Set up and start router
	AQCU.router = new AQCU.controller.AqcuRouter();
	Backbone.history.start();

	//Load and display version info
	AQCU.router.loadVersionTag();

	// Tie in the Remedy support system
	var $toggle = $("#display-feedback-toggle");
        if (AQCU.constants.helpEmail && AQCU.constants.helpEmail !== null) {
                $toggle.attr({
                        'href': 'mailto:' + AQCU.constants.helpEmail,
                        'target': '_blank'
                });
        } else {
                // No feedback email found, remove entire feedback line
                $('#footer-contact-info').remove();
        }

};