/**
 */
AQCU.view.ReportConfigSelectionView = AQCU.view.BaseView.extend({
	templateName: 'report-config-selection',
	
	//Someday this may change dynamically depending on selected TS
	availableReports: [
		AQCU.view.CorrectionsAtAGlanceReportView,
		AQCU.view.DvHydrographReportView,
		AQCU.view.ExtremesReportView,
		AQCU.view.FiveYearGWSummaryReportView,
		AQCU.view.SensorReadingSummaryReportView,
		AQCU.view.SiteVisitPeakReportView,
		AQCU.view.TimeSeriesSummaryFullReportView,
		AQCU.view.UvHydrographReportView,
		AQCU.view.VDiagramReportView
		],
	
	/**
	* Used by Backbone Stickit to bind HTML input elements to Backbone models.
	* This will be built up in the initialize function.
	*/
	bindings: {},

	events: {
	},
	
	initialize: function() {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
			
		this.parentModel = this.options.parentModel;
		this.savedReportsController = this.options.savedReportsController;
		
		this.parentModel.bind("change:selectedTimeSeries", this.render, this);
		
		this.availableReportViews = [];
	},
	
	/*override*/
	preRender: function() {
		this.removeReportViews();
		this.context = {
			site : this.parentModel.get("site"),
			selectedTimeSeries : this.parentModel.get("selectedTimeSeries")
		};
	},
	
	afterRender: function () {
		this.createReportViews();
	},		
			
	createReportViews: function() {
		for (var i = 0; i < this.availableReports.length; i++) {
			var view = new this.availableReports[i]({
				parentModel: this.parentModel,
				savedReportsController: this.savedReportsController,
				router: this.router
			});
			this.$('.available-reports').append(view.el);
			this.availableReportViews.push(view);
		}
	},		
			
	removeReportViews: function() {		
		while(this.availableReportViews.length > 0) {		
			this.availableReportViews[0].remove();		
			this.availableReportViews.shift();		
		}		
	}
});
