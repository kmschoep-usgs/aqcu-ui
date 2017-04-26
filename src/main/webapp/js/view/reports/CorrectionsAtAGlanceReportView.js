AQCU.view.CorrectionsAtAGlanceReportView = AQCU.view.BaseReportView.extend({
	reportName: "Corrections at a Glance", 
	reportAbbreviation: "CORR",
	reportType: "correctionsataglance",
	excludedCorrections: [],
        
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createCorrectionExclusionSelector();
		this.bindToCorrectionExclusionSelectors(this.updateExcludedCorrections, this);
	},
	
	//create exclude delete corrections filter
	createCorrectionExclusionSelector: function() {
		var excludeCorrectionField = $("<div><div><div class='row field-container'>" +
				
				"<div class='col-sm-5 col-md-5 col-lg-5'>" +
				"<label for='excludedCorrections'>Exclude Corrections</label><br>" +
				"</div>" +
				
				"<div class='checkbox col-sm-7 col-md-7 col-lg-7'>" +
				"<label><input class='excludeDeleteRegion' name='excludeDeleteRegion' type='checkbox'>Exclude Delete Region Corrections</label>" +
				"</div>" +
				
				"</div></div></div>");//not sure this warrants using a template YET
		this.model.set("excludeDeleteRegion", false);
		$.extend(this.bindings, {
			".excludeDeleteRegion" : "excludeDeleteRegion"
		});
		this.advancedOptionsContainer.append(excludeCorrectionField);
	},
        
	bindToCorrectionExclusionSelectors: function(bindFunc, scope) {
		this.model.bind("change:excludeDeleteRegion", bindFunc, scope);
	},
        
	updateExcludedCorrections: function() {
			this.excludedCorrections = [];
			this.excludedCorrections.push(this.model.get("excludeDeleteRegion")?"DELETE_REGION":null);
	},
        
	constructReportOptions: function() {
		var reportOptions = AQCU.view.BaseReportView.prototype.constructReportOptions.apply(this, arguments);
		if(this.excludedCorrections.length > 0) {
		    reportOptions.excludedCorrections = this.excludedCorrections.join(',');
		}
		return reportOptions;
	}
});