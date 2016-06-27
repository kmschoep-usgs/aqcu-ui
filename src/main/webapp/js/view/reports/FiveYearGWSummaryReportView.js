AQCU.view.FiveYearGWSummaryReportView = AQCU.view.BaseReportView.extend({
	reportName: "Five Year Ground Water Summary", 
	reportAbbreviation: "5YR",
	reportType: "fiveyeargwsum",
	requiredRelatedTimeseriesConfig: [{
			requestId: "firstDownChainIdentifier",
			display: "First Downchain Stat Derived Time Series",
			direction: "downchain",
			publish: 'true',
			period: 'Daily',
			dynamicParameter: 'true'
		}],
		
	initialize: function() {
		AQCU.view.BaseReportView.prototype.initialize.apply(this, arguments);
		this.model.bind("change:selectedTimeSeries", function() { this.loadAllTimeSeriesOptions() }, this); //additional event handler
	},
	
	loadAllRequiredTimeseries: function (params) {
		var _this = this;
		if (this.model.get("selectedTimeSeries") && this.model.get("dateSelection")
				&& _.find(this.requiredRelatedTimeseriesConfig, function(ts){
					if (ts.requestId === params.requestId) {
					return true
					} else
						return false
				})
			){
			_this.loadRelatedTimeseries(params).done(function(derivationChains){
				_this.setRelatedTimeseries(params.requestId, derivationChains);
			});
		}
		if (this.model.get("selectedTimeSeries") && this.model.get("dateSelection")
				&& _.find(this.optionalRelatedTimeseriesConfig, function(ts){
					if (ts.requestId === params.requestId) {
						return true
						} else
							return false
				})
				) {
			_this.loadRelatedTimeseries(params).done(function(derivationChains){
				_this.setRelatedTimeseries(params.requestId, derivationChains);
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
	}
	
});

