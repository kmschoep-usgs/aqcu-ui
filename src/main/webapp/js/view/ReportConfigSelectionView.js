/**
 */
AQCU.view.ReportConfigSelectionView = AQCU.view.BaseView.extend({
	templateName: 'report-config-selection',
	
	//Someday this may change dynamically depending on selected TS
	availableReports: [
	                   ['CORR', AQCU.view.CorrectionsAtAGlanceReportView],
	                   ['DV', AQCU.view.DvHydrographReportView],
	                   ['EXT', AQCU.view.ExtremesReportView],
	                   ['5YR', AQCU.view.FiveYearGWSummaryReportView],
	                   ['SRS', AQCU.view.SensorReadingSummaryReportView],
	                   ['SVP', AQCU.view.SiteVisitPeakReportView],
	                   ['UV', AQCU.view.UvHydrographReportView],
	                   ['VD', AQCU.view.VDiagramReportView]
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
	
	fetchProcessorTypes: function(selectedTimesSeries){
		if(selectedTimesSeries.uid){
			var _this = this;
			$.ajax({
				url: AQCU.constants.serviceEndpoint + 
					"/service/lookup/timeseries/processorTypes",
				timeout: 120000,
				dataType: "json",
				data: {
					timeSeriesIdentifier: selectedTimesSeries.uid,
					startDate: this.parentModel.get("dateSelection").startDate,
					endDate: this.parentModel.get("dateSelection").endDate,
					waterYear: this.parentModel.get("dateSelection").waterYear,
					lastMonths: this.parentModel.get("dateSelection").lastMonths
				},
				context: this,
				success: function(data){
					if(data[0]) {
						this.selectedTimesSeries.processorTypes = data;
					}
				},
				error: function() {
					this.selectedTimesSeries.processorTypes = null;
				}
			});
		} else {
			this.selectedTimesSeries.processorTypes = null;
		}
	},
	
	createReportViews: function() {
		//this.fetchProcessorTypes(this.selectedTimeSeries);
		for (var i = 0; i < this.availableReports.length; i++) {
			if 	(
				(_.contains(['CORR','EXT', 'SRS'], this.availableReports[i][0])) ||
				(this.availableReports[i][0] == 'UV' && _.contains(['Instantaneous','Decumulated'],this.selectedTimeSeries.computation) && _.contains(['Points', 'Hourly'], this.selectedTimeSeries.period)) 
				){
				var view = new this.availableReports[i][1]({
					parentModel: this.parentModel,
					savedReportsController: this.savedReportsController,
					selectedTimeSeries: this.selectedTimeSeries,
					router: this.router
				});
				this.$('.available-reports').append(view.el);
				this.availableReportViews.push(view);
			}
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
