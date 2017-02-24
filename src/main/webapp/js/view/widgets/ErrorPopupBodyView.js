AQCU.view.ErrorPopupBodyView = AQCU.view.BaseView.extend({
	templateName: 'error-message-body',
	
	events: {
	},
	
	initialize: function(options) {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		this.options = options;
		this.errors = this.options.errors;
		this.helpEmail = this.options.helpEmail;
	},
	
	update: function(errors) {
		this.errors = errors;
		if(this.rendered) {
			this.render();
		}
	},
	
	preRender: function() {
		this.context = {
			errors : this.errors,
			helpEmail: this.helpEmail
		};
	},
	
	afterRender: function() {
		this.rendered = true
	}
});	