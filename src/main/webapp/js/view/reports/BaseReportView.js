AQCU.view.BaseReportView = AQCU.view.BaseView.extend({
	templateName: 'report-card',
	reportName: null, //Display name of report
	selectedTimeSeries: null, //array of json objects describing selected timeseries, this array is ordered
	
	bindings: {},

	events: {
//		'click .config-btn': 'launchAdvanceOptions',
//		'click .display-btn': 'applyReportOptions'
	},
	
	initialize: function() {
		this.parentModel = this.options.parentModel;
		this.model = new Backbone.Model({});
		
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
	},
	
	preRender: function() {
		this.context = {
			reportName: this.reportName
		}
	},
	
	afterRender: function() {
		this.stickit();
	},
});