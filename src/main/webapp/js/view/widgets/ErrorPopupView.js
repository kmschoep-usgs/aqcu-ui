AQCU.view.ErrorPopupView = AQCU.view.BaseView.extend({
	templateName: 'error-popup',
	
	events: {
	},
	
	initialize: function(options) {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		this.options = options;
		
		this.serviceId = this.options.serviceId;
		
		this.id = this.serviceId;
		
		this.error = this.options.error;
		this.title = this.options.title;
		this.helpEmail = this.options.helpEmail;
	},
	
	preRender: function() {
		this.context = {
			id: this.id,
			title : this.title,
			error : this.error,
			serviceId : this.serviceId,
			helpEmail: this.helpEmail
		};
	},
	
	afterRender: function() {
		var _this = this;
		this.$("#error-popup-" + this.id).modal('show')
		$("#error-popup-" + this.id).on('hidden.bs.modal', function () {
			_this.remove();
		})
	}
});	