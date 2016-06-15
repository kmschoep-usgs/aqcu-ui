/**
 */
AQCU.view.ReportConfigSelectionView = AQCU.view.BaseView.extend({
	templateName: 'report-config-selection',
	
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
		
	// I don't love hard-coding these.  We'll see how much the list needs to change in the future...
	gwReportParameters: [
	                     "Elevation, GW, NGVD29", 
	                     "Elevation, GW, NAVD88", 
	                     "Elevation, GW, MSL",
	                     "Elevation, GW, PRVD02",
	                     "Elevation, GW, NMVD03",
	                     "Elevation, GW, HILOCAL",
	                     "Elevation, GW, GUVD63",
	                     "Elevation, GW, GUVD04",
	                     "Elevation, GW, ASVD62",
	                     "Elevation, GW, ASVD02",
	                     "Water level, depth LSD",
	                     "Elevation, correct BP, NGVD29",
	                     "Water level, depth MP",
	                     "Elevation, water, inc, NGVD29",
	                     "WaterLevel, BelowLSD"
	                     ],

	svpReportParameterLengthUnits: [
	                               ".ft", 
	                               ".in"],
	            
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
	
	showAvailableReport: function(reportFlavor, selectedTimeSeries){
		return (_.contains(['CORR','EXT', 'SRS'], reportFlavor)) 
		|| (reportFlavor == 'UV' 
			&& _.contains(['Instantaneous','Decumulated'], selectedTimeSeries.computation) 
			&& _.contains(['Points', 'Hourly'], selectedTimeSeries.period)) 
		|| (reportFlavor == 'DV'
			&& (
					_.contains(['Daily', 'Weekly'], selectedTimeSeries.period)  
					|| (
						_.contains(['Points', 'Hourly'], selectedTimeSeries.period) && _.contains(selectedTimeSeries.processorTypes.downChain, 'Statistics')
					)
				)
			)
		|| (reportFlavor == '5YR' && _.contains(this.gwReportParameters, selectedTimeSeries.parameter)) 
		|| (reportFlavor == 'SVP' && _.some(this.svpReportParameterLengthUnits, function(unit){
				return selectedTimeSeries.identifier.indexOf(unit) > -1 
					&& selectedTimeSeries.identifier.indexOf(".ft^") == -1;
				})
			)
		|| (reportFlavor == 'VD' 
			&& selectedTimeSeries.timeSeriesType === "ProcessorDerived" 
			&& _.contains(selectedTimeSeries.processorTypes.upChain, 'RatingModel')
			) 
	},
	
	createReportViews: function() {
		this.fetchProcessorTypes(this.selectedTimeSeries);
		for (var i = 0; i < this.availableReports.length; i++) {
			if 	(this.showAvailableReport(this.availableReports[i][0],this.selectedTimeSeries)){
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
