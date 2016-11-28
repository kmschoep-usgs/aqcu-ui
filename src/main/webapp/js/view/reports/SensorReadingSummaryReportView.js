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
	
	createExcludeCommentsSelector: function() {
		var excludeField = $("<div><div><div class='row field-container'>" +
				
				"<div class='col-sm-5 col-md-5 col-lg-5'>" +
				"<label for='excludeComments'>Additional Options</label><br>" +
				"</div>" +
				
				"<div class='checkbox col-sm-7 col-md-7 col-lg-7'>" +
				"<label><input class='excludeComments' name='excludeComments' type='checkbox'>Exclude Comments</label>" +
				"</div>" +
				
				"</div></div></div>");//not sure this warrants using a template YET
		this.model.set("excludeMinMax", false);
		$.extend(this.bindings, {
			".excludeComments" : "excludeComments"
		});
		this.advancedOptionsContainer.append(excludeField);
	},
	
	
	constructReportOptions: function() {
		var reportOptions = AQCU.view.BaseReportView.prototype.constructReportOptions.apply(this, arguments);
		
		if(this.model.get("excludeComments")){
			reportOptions.excludeComments = this.model.get("excludeComments");
		}
		
 		return reportOptions;
	}
});

