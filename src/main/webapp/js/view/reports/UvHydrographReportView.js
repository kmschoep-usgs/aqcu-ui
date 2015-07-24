AQCU.view.UvHydrographReportView = AQCU.view.BaseReportView.extend({
	reportName: "UV Hydrograph",
	reportType: "swuvhydrograph",
	optionalRelatedTimeseriesConfig: [{
			requestId: "secondaryTimeseriesIdentifier",
			display: "Secondary Time Series",
			direction: "downchain",
			publish: 'true',
			computation: 'Unknown',
			period: 'Unknown'
		},{
			requestId: "upchainTimeseriesIdentifier",
			display: "Upchain Time Series",
			direction: "upchain",
			publish: 'true',
			computation: 'Unknown',
			period: 'Unknown'
		},{
			requestId: "derivedMeanTimeseriesIdentifier",
			display: "Daily Mean",
			direction: "downchain",
			publish: 'true',
			computation: 'Mean',
			period: 'Daily'
		},{
			requestId: "derivedMaxTimeseriesIdentifier",
			display: "Daily Max",
			direction: "downchain",
			publish: 'true',
			computation: 'Max',
			period: 'Daily'
		},{
			requestId: "derivedMinTimeseriesIdentifier",
			display: "Daily Min",
			direction: "downchain",
			publish: 'true',
			computation: 'Minn',
			period: 'Daily'
		}],
	optionalRatingModels: [{ 
			requestId: "ratingModelIdentifier", 
			display: "Primary Rating Model", 
			bindTo: "primaryTimeseriesIdentifier"
		},{ 
			requestId: "secondaryRatingModelIdentifier", 
			display: "Secondary Rating Model", 
			bindTo: "secondaryTimeseriesIdentifier"
	}],
	
	removeSelectFields: function() {
		//TODO remove additional comparison site/timeserie selector
		AQCU.view.BaseReportView.prototype.removeSelectFields.apply(this, arguments);
	},
	
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		//TODO build additional comparison site/timeseries selector
	},
	
	constructReportOptions: function() {
		var reportOptions = AQCU.view.BaseReportView.prototype.constructReportOptions.apply(this, arguments);
		//TODO add comparaison time series selection
		//TODO set ratingModelIdentifier to one either the primary or secondary depending on report
		return reportOptions;
	},

	validate: function() {
		var valid = AQCU.view.BaseReportView.prototype.validate.apply(this, arguments);
		//TODO run additional validation rules to try and stop invlaid Q/GW/WQ configurations
		return valid;
	}
});