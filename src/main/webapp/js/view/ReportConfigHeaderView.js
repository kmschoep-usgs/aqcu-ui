/**
 */
AQCU.view.ReportConfigHeaderView = AQCU.view.BaseView.extend({
	templateName: 'report-config-header',
	
	/**
	* Used by Backbone Stickit to bind HTML input elements to Backbone models.
	* This will be built up in the initialize function.
	*/
	bindings: {},

	events: {
		"click .primary-ts-selector": "removeTimeSeries"
	},
	
	initialize: function() {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
			
		this.parentModel = this.options.parentModel;
		
		this.parentModel.bind("change:site change:selectedTimeSeries", this.render, this);
	},
	
	/*override*/
	preRender: function() {
		this.context = {
			site : this.parentModel.get("site"),
			selectedTimeSeries : this.parentModel.get("selectedTimeSeries")
		};
	},
	
	afterRender: function () {		
	},		
	
	removeTimeSeries: function() {
		this.parentModel.set("selectedTimeSeries", null);
	}
});
