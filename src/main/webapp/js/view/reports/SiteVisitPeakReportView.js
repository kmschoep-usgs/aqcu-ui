AQCU.view.SiteVisitPeakReportView = AQCU.view.BaseReportView.extend({
	reportName: "Site Visit Peak", 
	reportAbbreviation: "SVP",
	reportType: "sitevisitpeak",
	
	initialize: function() {
		AQCU.view.BaseReportView.prototype.initialize.apply(this, arguments);
		this.model.set("excludeComments", true);
	},
	
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createExcludeCommentsSelector();
	},
	
	createExcludeCommentsSelector: function() {
	    var newContainer = $("<div>");
	    var excludeCommentsSelector  = new AQCU.view.CheckBoxField({
		    router: this.router,
		    model: this.model,
		    fieldConfig: {
			    fieldName : "excludeComments",
			    displayName : "Additional Options",
			    description : "Exclude Comments"
		    },
		    renderTo: newContainer,
		    startHidden: false
	    });

	    this.model.set("excludeComments", false);
	    $.extend(this.bindings, excludeCommentsSelector.getBindingConfig());
	    this.advancedOptionsContainer.append(newContainer);
	},
	
	
	constructReportOptions: function() {
		var reportOptions = AQCU.view.BaseReportView.prototype.constructReportOptions.apply(this, arguments);
		
		if(this.model.get("excludeComments")){
			reportOptions.excludeComments = this.model.get("excludeComments");
		}
		
 		return reportOptions;
	}
});


