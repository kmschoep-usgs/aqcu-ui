AQCU.view.SensorReadingSummaryReportView = AQCU.view.BaseReportView.extend({
	reportName: "Sensor Reading Summary", 
	reportAbbreviation: "SRS",
	reportType: "sensorreadingsummary",

	initialize: function() {
		AQCU.view.BaseReportView.prototype.initialize.apply(this, arguments);
		this.model.set("excludeComments", true);
	},
	
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createExcludeCommentsSelector();
	},
	
	constructReportOptions: function() {
		var reportOptions = AQCU.view.BaseReportView.prototype.constructReportOptions.apply(this, arguments);
		
		if(this.model.get("excludeComments")){
			reportOptions.excludeComments = this.model.get("excludeComments");
		}
		
 		return reportOptions;
	}
});

