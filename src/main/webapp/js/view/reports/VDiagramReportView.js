AQCU.view.VDiagramReportView = AQCU.view.BaseReportView.extend({
	reportName: "V-Diagram", 
	reportAbbreviation: "VDI",
	reportType: "vdiagram",
	relatedTimeseriesConfig: [{
			requestId: "upchainTimeseriesIdentifier",
			display: "Gage Height",
			parameter: "Gage height",
			direction: "upchain",
			required: true,
			computation: 'Instantaneous',
			period: 'Points'
		}],
	ratingModels: [{ 
			requestId: "ratingModelIdentifier", 
			display: "Primary Rating Model", 
			required: true,
			bindTo: "primaryTimeseriesIdentifier"
		}],
	controlConditions: [
	    {text: "Unspecified", value: "unspecified", id: 0},
	    {text: "Clear", value: "clear", id: 1},
	    {text: "Fill Control Changed", value: "fillControlChanged", id: 2},
	    {text: "Debris - Light", value: "debrisLight", id: 3},
	    {text: "Debris - Moderate", value: "debrisModerate", id: 4},
	    {text: "Debris - Heavy", value: "debrisHeavy", id: 5},
	    {text: "Vegetation - Light", value: "vegetationLight", id: 6},
	    {text: "Vegetation - Moderate", value: "vegetationModerate", id: 7},
	    {text: "Vegetation - Heavy", value: "vegetationHeavy", id: 8},
	    {text: "Ice - Anchor", value: "iceAnchor", id: 9},
	    {text: "Ice - Cover", value: "iceCover", id: 10},
	    {text: "Ice - Shore", value: "iceShore", id: 11},
	    {text: "Submerged", value: "submerged", id: 12},
	    {text: "No Flow", value: "noFlow", id: 13}
	],
	
	removeSelectFields: function() {
		if(this.priorYearsHistoric){
			this.priorYearsHistoric.remove();
		}
		AQCU.view.BaseReportView.prototype.removeSelectFields.apply(this, arguments);
	},
	
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createHistoricSelector();
		this.createControlConditionFilter();
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
			model: this.model,
			fieldConfig: {
				fieldName   : "priorYearsHistoric",
				displayName: "Years of Historic Measurements",
				description : "This will set the number of years back from the selected data of historic measurements to include in the report"
			},
			renderTo: newContainer,
			startHidden: false
		});		
		$.extend(this.bindings, this.priorYearsHistoric.getBindingConfig());
		this.priorYearsHistoric.setSelectOptions(select2YearsBackData);
	},
	
	createControlConditionFilter: function() {
	    var newContainer = $('<div class="aqcu-vdiag-control-conditions"></div>');
	    this.advancedOptionsContainer.append(newContainer);
	    
	    this.controlConditionFilter = new AQCU.view.MultiselectField({
		el: '.aqcu-vdiag-control-conditions',
		model : this.model,
		fieldConfig: {
			fieldName: "controlConditionFilter",
			displayName: "Filter Control Condition",
			description: "This will filter the control condition",
			placeholder: "Filter..."
		},
		data: this.controlConditions,
		initialSelection: [9, 10, 11]
	    });
	},
	
	constructReportOptions: function() {
		var reportOptions = AQCU.view.BaseReportView.prototype.constructReportOptions.apply(this, arguments);
		if(this.model.get("priorYearsHistoric")) {
		    reportOptions.priorYearsHistoric = this.model.get("priorYearsHistoric");
		}
 		return reportOptions;
	}
});