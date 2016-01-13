/**
 * The saved reports view exists mostly as a button which launches a window for the rest of the view.
 * The rest of the view will use a global Saved Reports service (SavedReportsController) for
 * storing/retreiving saved reports.
 */
AQCU.view.SavedReportsView = AQCU.view.BaseView.extend({
	templateName: 'saved-reports',

	events: {
		
	},
	
	initialize: function() {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		
		this.id = new Date().getMilliseconds();
		this.router = this.options.router;
		this.controller = this.options.controller;
		
		this.model = this.options.model || new Backbone.Model({
				savedReports: []
			});
	},
	
	preRender: function() {
		this.context = {
			id: this.id,
			savedReports : this.model.get("savedReports"),
		};
	},
	
	afterRender: function() {
	}
});