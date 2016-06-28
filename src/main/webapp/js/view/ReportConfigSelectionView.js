/**
 */
AQCU.view.ReportConfigSelectionView = AQCU.view.BaseView.extend({
	templateName: 'report-config-selection',
		
	// I don't love hard-coding these.  We'll see how much the list needs to change in the future...
	//TODO: make a service that delivers this information
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
	                               "ft", 
	                               "in"],
	            
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
		this.processorTypesFetched = $.Deferred();
		this.availableReportsPopulated = $.Deferred();
		this.availableReportViews = [];
		this.availableReports = [];
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
	
	/*
	 * @returns Jquery promise which is resolved if fetchProcessorTypes() returns successfully.
	 */
	fetchProcessorTypesPromise : function() {
		return this.processorTypesFetched.promise();
	},

	/*
	 * @returns Jquery promise which is resolved if populateAvailableReports() returns successfully.
	 */
	populateAvailableReportsPromise : function() {
		return this.availableReportsPopulated.promise();
	},
	
	fetchProcessorTypes: function(selectedTimeSeries){
		if(selectedTimeSeries.uid){
			var _this = this;
			$.ajax({
				url: AQCU.constants.serviceEndpoint + 
					"/service/lookup/timeseries/processorTypes",
				timeout: 120000,
				dataType: "json",
				data: {
					timeSeriesIdentifier: selectedTimeSeries.uid,
					startDate: this.parentModel.get("dateSelection").startDate,
					endDate: this.parentModel.get("dateSelection").endDate,
					waterYear: this.parentModel.get("dateSelection").waterYear,
					lastMonths: this.parentModel.get("dateSelection").lastMonths
				},
				context: this,
				success: function(data){
					if(data) {
						_this.processorTypesFetched.resolve(data);
					}
				},
				error: function() {
					_this.processorTypesFetched.reject();
				}
			});
		} else {
			this.processorTypesFetched.reject();
		}
		return this.processorTypesFetched.promise();
	},
	
	//TODO:  should be refactored so the logic exists in each report view using a strategy pattern.
	populateAvailableReports: function(selectedTimeSeries){
		this.availableReports = [];
		var _this = this;
		this.availableReports.push(AQCU.view.CorrectionsAtAGlanceReportView);
		if (
				_.contains(['Daily', 'Weekly'], selectedTimeSeries.period)  
				|| (
					_.contains(['Points', 'Hourly'], selectedTimeSeries.period) 
					&& _.contains(selectedTimeSeries.processorTypes.downChain, 'Statistics')
				)
			) {
			_this.availableReports.push(AQCU.view.DvHydrographReportView);
		};
		this.availableReports.push(AQCU.view.ExtremesReportView);
		if (_.contains(_this.gwReportParameters, selectedTimeSeries.parameter)) {
			_this.availableReports.push(AQCU.view.FiveYearGWSummaryReportView);
		};
		this.availableReports.push(AQCU.view.SensorReadingSummaryReportView);
		if (_.contains(this.svpReportParameterLengthUnits, selectedTimeSeries.units)){
			_this.availableReports.push(AQCU.view.SiteVisitPeakReportView);
		};
		if (_.contains(['Instantaneous','Decumulated'], selectedTimeSeries.computation) 
				&& _.contains(['Points', 'Hourly'], selectedTimeSeries.period)) {
			_this.availableReports.push(AQCU.view.UvHydrographReportView);
		};
		if (selectedTimeSeries.timeSeriesType === "ProcessorDerived" 
			&& _.contains(selectedTimeSeries.processorTypes.upChain, 'RatingModel')) {
			_this.availableReports.push(AQCU.view.VDiagramReportView);
		};
		this.availableReportsPopulated.resolve(_this.availableReports);
		return this.availableReportsPopulated.promise();
	},
	
	createReportViews: function() {
		var _this = this;
		this.$(".loading-indicator").show();
		this.fetchProcessorTypes(_this.selectedTimeSeries).done(function(data){
			_this.selectedTimeSeries.processorTypes = data;
			_this.populateAvailableReports(_this.selectedTimeSeries).done(function(availableReports){
				_.each(availableReports, function(report){
					var view = new report({
						parentModel: _this.parentModel,
						savedReportsController: _this.savedReportsController,
						selectedTimeSeries: _this.selectedTimeSeries,
						router: _this.router
					});
					_this.$(".loading-indicator").hide();
					_this.$('.available-reports').append(view.el);
					_this.availableReportViews.push(view);	
			
				});
			});
		});
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
