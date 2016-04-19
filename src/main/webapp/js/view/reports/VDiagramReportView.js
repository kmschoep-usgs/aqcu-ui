AQCU.view.VDiagramReportView = AQCU.view.BaseReportView.extend({
	reportName: "V-Diagram",
	reportType: "vdiagram",
	requiredRelatedTimeseriesConfig: [{
			requestId: "upchainTimeseriesIdentifier",
			display: "Gage Height",
			parameter: "Gage height",
			direction: "upchain",
			publish: 'true',
			computation: 'Instantaneous',
			period: 'Points'
		}],
	requiredRatingModels: [{ requestId: "ratingModelIdentifier", display: "Primary Rating Model", bindTo: "primaryTimeseriesIdentifier"}],
	
	removeSelectFields: function() {
		if(this.priorYearsHistoric){
			this.priorYearsHistoric.remove();
		}
		AQCU.view.BaseReportView.prototype.removeSelectFields.apply(this, arguments);
	},
	
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createHistoricSelector();
	},
	
	createHistoricSelector: function() {
		var newContainer = $('<div class="aqcu-vdiag-history-years"></div>');
		this.advancedOptionsContainer.append(newContainer);
		
		if(!this.model.get("priorYearsHistoric")) {
			this.model.set("priorYearsHistoric", "0");
		}
		
		var select2YearsBackData = [];
		for(var i = 0; i <= 25; i++) {
			select2YearsBackData.push({ KeyValue: "" + i, DisplayValue: "" + i});
		}

		this.priorYearsHistoric = new AQCU.view.SelectField({
			el: '.aqcu-vdiag-history-years',
			model : this.model,
			fieldConfig: {
				fieldName   : "priorYearsHistoric",
				displayName: "Years of Historic Measurements",
				description : "This will set the number of years back from the selected data of historic measurements to include in the report"
			},
			renderTo: newContainer,
			startHidden: false,
		});		
		$.extend(this.bindings, this.priorYearsHistoric.getBindingConfig());
		this.priorYearsHistoric.setSelectOptions(select2YearsBackData);
	},
	
	
	constructReportOptions: function() {
		var reportOptions = AQCU.view.BaseReportView.prototype.constructReportOptions.apply(this, arguments);
		if(this.model.get("priorYearsHistoric")) {
			reportOptions.priorYearsHistoric = this.model.get("priorYearsHistoric");
		}
 		return reportOptions;
	}
});