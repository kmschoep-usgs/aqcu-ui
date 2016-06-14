/**
 */
AQCU.view.ReportConfigSelectionView = AQCU.view.BaseView.extend({
	templateName: 'report-config-selection',
	
	//Someday this may change dynamically depending on selected TS
	availableReports: [
	                  // ['CORR', AQCU.view.CorrectionsAtAGlanceReportView],
	                  // ['DV', AQCU.view.DvHydrographReportView],
	                  // ['EXT', AQCU.view.ExtremesReportView],
	                  // ['5YR', AQCU.view.FiveYearGWSummaryReportView],
	                  // ['SRS', AQCU.view.SensorReadingSummaryReportView],
	                  // ['SVP', AQCU.view.SiteVisitPeakReportView],
	                  // ['UV', AQCU.view.UvHydrographReportView],
	                  // ['VD', AQCU.view.VDiagramReportView]
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
	ajaxCalls: {},
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
	
	fetchProcessorTypes: function(){
		if(this.selectedTimeSeries.uid){
			var _this = this;
			var stuff;
			$.ajax({
				url: AQCU.constants.serviceEndpoint + 
					"/service/lookup/timeseries/processorTypes",
				timeout: 120000,
				dataType: "json",
				data: {
					timeSeriesIdentifier: _this.selectedTimeSeries.uid,
					startDate: this.parentModel.get("dateSelection").startDate,
					endDate: this.parentModel.get("dateSelection").endDate,
					waterYear: this.parentModel.get("dateSelection").waterYear,
					lastMonths: this.parentModel.get("dateSelection").lastMonths
				},
				context: this,
				success: function(data){
					if(data) {
						stuff = data;
						_this.selectedTimeSeries.processorTypes = data;
					}
				},
				error: function() {
					_this.selectedTimeSeries.processorTypes = null;
				}
			});
		} else {
			_this.selectedTimeSeries.processorTypes = null;
		}
	},
	
	//createReportViews: function() {
		//this.fetchProcessorTypes(this.selectedTimeSeries);
		//for (var i = 0; i < this.availableReports.length; i++) {
		//	if 	(
		//		(_.contains(['CORR','EXT', 'SRS'], this.availableReports[i][0])) ||
		//		(this.availableReports[i][0] == 'UV' && _.contains(['Instantaneous','Decumulated'],this.selectedTimeSeries.computation) && _.contains(['Points', 'Hourly'], this.selectedTimeSeries.period)) 
		//		){
		//		var view = new this.availableReports[i][1]({
		//			parentModel: this.parentModel,
		//			savedReportsController: this.savedReportsController,
		//			selectedTimeSeries: this.selectedTimeSeries,
		//			router: this.router
		//		});
		//		this.$('.available-reports').append(view.el);
		//		this.availableReportViews.push(view);
		//	}
		
		
		//}
	//},		
	
	createReportViews: function() {
		this.fetchProcessorTypes();
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
