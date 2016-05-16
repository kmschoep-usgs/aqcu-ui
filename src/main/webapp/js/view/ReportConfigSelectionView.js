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
		this.selectedTimeSeries = this.options.selectedTimeSeries;
		this.savedReportsController = this.options.savedReportsController;
		this.availableReportViews = [];
	},
	
	/*override*/
	preRender: function() {
		this.removeReportViews();
		this.context = {
			site : this.parentModel.get("site")
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
				selectedTimeSeries: this.selectedTimeSeries,
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
	},
	
	remove: function() {
		this.removeReportViews();
	}
});
