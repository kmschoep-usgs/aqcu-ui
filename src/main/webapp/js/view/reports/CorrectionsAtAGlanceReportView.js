AQCU.view.CorrectionsAtAGlanceReportView = AQCU.view.BaseReportView.extend({
	reportName: "Corrections at a Glance", 
	reportAbbreviation: "CORR",
	reportType: "correctionsataglance",
	excludedCorrections: ["excludeDeleteRegion"],
	
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createCorrectionExclusionSelector();
		this.bindToCorrectionExclusionSelectors(this.updateExcludedCorrections, this);
	},
	constructReportOptions: function() {
		var reportOptions = AQCU.view.BaseReportView.prototype.constructReportOptions.apply(this, arguments);
		if(this.excludedCorrections.length > 0) {
						reportOptions.excludedCorrections = this.excludedCorrections.join(',');
		}

		return reportOptions;
	}
	
});