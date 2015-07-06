/**
 * Displays a window which contains a scrolling grid. Automatically builds columns and grid from a 
 * webservice URL which implements required services
 * 
 * Takes 
 * 	gridSourceUrl - webservice source. Webservice must implement /json and /columns services
 * 	data - json object of parameters for webservice call
 * 	title - title to be displayed in Window header
 * 	gridHeight - optional height of grid, will default to 600 pixels
 * 	parent - the parent element that this window will be under
 */
AQCU.view.PopupView = Backbone.View.extend({
	events: {
	},
	/**
	 * save all required config options
	 */
	initialize: function() {
		this.message = this.options.message;
		this.title = this.options.title;
		this.callback = this.options.callback;
		this.buttons = this.options.buttons;
		this.hideCloseButton = this.options.hideCloseButton;
		this.render();
		Backbone.View.prototype.initialize.apply(this, arguments);
	},
	/**
	 * create container divs for window and grid, attaching to parent element. Then initialize
	 * ScrollingGridView inside grid div.
	 */
	render: function() {
		//create dom and attach to parent
		this.messageDiv = $('<div>');
		this.messageDiv.addClass('nwis-modal-error-window');
		this.messageDiv.attr("title", this.title);
		this.messageDiv.html(this.message);
		$(document.body).append(this.messageDiv);

		var dialogWidth = 600;
		var dialogHeight = 300;
		var posX = window.innerWidth * 0.05;
		var posY = (window.innerHeight - dialogHeight) / 2;

		var _this = this;

		var buttonConfig = {
			width: dialogWidth,
			position: [posX, posY],
			modal: true,
			resizable: false
		};

		if (!this.buttons) {
			buttonConfig.buttons = {
				Ok: function() {
					$.proxy(_this.remove, _this)();
				}
			};
		} else {
			buttonConfig.buttons = this.buttons;
		}

		if (!this.hideCloseButton) {
			buttonConfig.close = function(event, ui) {
				$.proxy(_this.remove, _this)();
			};
		}

		this.messageDiv.dialog(buttonConfig);
	},
	/**
	 * Custom remove. Making sure to remove all created HTML divs as well as subviews.
	 */
	remove: function() {
		if (this.callback) {
			this.callback();
		}
		this.messageDiv.dialog("destroy");
		$(this.messageDiv).remove();
		Backbone.View.prototype.remove.apply(this, arguments);
	}
});	