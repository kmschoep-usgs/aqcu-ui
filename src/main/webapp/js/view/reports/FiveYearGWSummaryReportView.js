AQCU.view.FiveYearGWSummaryReportView = AQCU.view.BaseReportView.extend({
	reportName: "Five Year Ground Water Summary", 
	reportAbbreviation: "5YR",
	reportType: "fiveyeargwsum",
	instructions: "At least one stat-derived time series must be specified in the Advanced Report Options.",
	relatedTimeseriesConfig: [{
			requestId: "firstStatDerivedIdentifier",
			display: "Stat Derived Time Series 1",
			direction: "downchain",
			required: false,
			oneOfSeveralRequired: true,
			defaultComputation: "Mean",
			period: 'Daily',
			dynamicParameter: 'true',
			autofillWithSameUnits: "true"
		},{
			requestId: "secondStatDerivedIdentifier",
			display: "Stat Derived Time Series 2",
			direction: "downchain",
			required: false,
			oneOfSeveralRequired: true,
			defaultComputation: 'Max',
			period: 'Daily',
			autofillWithSameUnits: "true"
		},{
			requestId: "thirdStatDerivedIdentifier",
			display: "Stat Derived Time Series 3",
			direction: "downchain",
			required: false,
			oneOfSeveralRequired: true,
			defaultComputation: 'Min',
			period: 'Daily',
			autofillWithSameUnits: "true"
		},{
			requestId: "fourthStatDerivedIdentifier",
			display: "Stat Derived Time Series 4",
			direction: "downchain",
			required: false,
			oneOfSeveralRequired: true,
			defaultComputation: 'Median',
			period: 'Daily',
			autofillWithSameUnits: "true"
	}],
		
	initialize: function() {
		AQCU.view.BaseReportView.prototype.initialize.apply(this, arguments);
		this.model.bind("change:selectedTimeSeries", function() { this.loadAllTimeSeriesOptions() }, this); //additional event handler
	},
	
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createInstructions();
		this.createExcludeMinMaxSelector();
	},
	
	loadAllRequiredTimeseries: function (params) {
		var _this = this;
		if (this.model.get("selectedTimeSeries") && this.model.get("dateSelection")
				&& _.find(this.relatedTimeseriesConfig, function(ts){
					if (ts.requestId === params.requestId) {
					return true
					} else
						return false
				})
			){
			_this.loadRelatedTimeseries(params).done(function(derivationChains){
				_this.setRelatedTimeseries(params, derivationChains, params.parameter);
			});
		}
	},	
		
	loadAllTimeSeriesOptions : function() {
		if(this.model.get("site")) {
			for(var key in this.builtSelectorFields){
				if(this.selectorParams[key].dynamicParameter && this.model.get('selectedTimeSeries')){
					this.selectorParams[key].parameter = this.model.get('selectedTimeSeries').parameter;
				}
			} 
			AQCU.view.BaseReportView.prototype.loadAllTimeSeriesOptions.apply(this, arguments);
		}
	},
	
	constructReportOptions: function() {
		var reportOptions = AQCU.view.BaseReportView.prototype.constructReportOptions.apply(this, arguments);
		
		if(this.model.get("excludeMinMax")){
			reportOptions.excludeMinMax = this.model.get("excludeMinMax");
		}
		
 		return reportOptions;
	}
});

