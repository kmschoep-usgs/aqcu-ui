AQCU.view.ErrorPopupView = AQCU.view.BaseView.extend({
	templateName: 'error-popup',
	
	events: {
	},
	
	initialize: function(options) {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		this.options = options;
		
		this.id = new Date().getMilliseconds();
		
		this.errors = [{ "error" : this.options.error, "lastServiceId": this.options.serviceId, count: 1}];
		
		this.title = this.options.title;
		this.helpEmail = this.options.helpEmail;
		
		if(this.options.onClose) {
			this.onClose = this.options.onClose
			this.onCloseContext = this.options.onCloseContext
		}
	},
	
	addError: function(error, serviceId) {
		var errorAlreadyExists = false;
		
		for(var i in this.errors) {
			var err = this.errors[i]
			if(err.error == error) {
				errorAlreadyExists = true;
				if(serviceId) {
					err.lastServiceId = serviceId;
				}
				err.count++;
				break;
			}
		}
		
		if(!errorAlreadyExists) {
			this.errors.push({ "error" : error, "lastServiceId": serviceId, count: 1});
		}
		
		if(this.errorBody) {
			this.errorBody.update(this.errors);
		}
		
	},
	
	preRender: function() {
		this.context = {
			id: this.id,
			title : this.title,
			helpEmail: this.helpEmail
		};
	},
	
	afterRender: function() {
		var _this = this;
		
		this.errorBody = new AQCU.view.ErrorPopupBodyView({
			errors: this.errors,
			helpEmail: this.helpEmail,
			el: this.$(".error-message")
		})
		
		this.$("#error-popup-" + this.id).modal('show')
		$("#error-popup-" + this.id).on('hidden.bs.modal', function () {
			if(_this.onClose) {
				if(_this.onCloseContext) {
					$.proxy(_this.onClose, _this.onCloseContext)()
				} else {
					_this.onClose()
				}
			}
			_this.remove();
		})
	},
	
	remove: function() {
		this.$( '.modal-backdrop' ).remove();
		AQCU.view.BaseView.prototype.remove.apply(this, arguments);
	}
});	