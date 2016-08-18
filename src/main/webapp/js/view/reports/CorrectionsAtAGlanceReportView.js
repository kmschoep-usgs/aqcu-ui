AQCU.view.CorrectionsAtAGlanceReportView = AQCU.view.BaseReportView.extend({
	reportName: "Corrections at a Glance", 
	reportAbbreviation: "CORR",
	reportType: "correctionsataglance",
        
        buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
	}
});