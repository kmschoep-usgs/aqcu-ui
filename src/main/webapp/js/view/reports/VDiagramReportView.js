AQCU.view.VDiagramReportView = AQCU.view.BaseReportView.extend({
	reportName: "V-Diagram", 
	reportAbbreviation: "VDI",
	reportType: "vdiagram",
	instructions: "The upchain time series and primary rating model must be specified in the Advanced Report Options.",
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
	 conditionList: [],
	 initialIdList: [],
	
	removeSelectFields: function() {
		if(this.priorYearsHistoric){
			this.priorYearsHistoric.remove();
		}
		AQCU.view.BaseReportView.prototype.removeSelectFields.apply(this, arguments);
	},
	
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createInstructions();
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
	    	    
	    $.ajax({
		url: AQCU.constants.serviceEndpoint +
				"/service/lookup/controlConditions",
		timeout: 30000,
		dataType: "json",
		context: this,
		success: function (data) {
		    this.conditionList = [];
		    this.initialIdList = [];
		    for (var i = 0; i < data.length; i++) {
			this.conditionList.push({ 
			    id  : i,
			    value: data[i].value,
			    text: data[i].name.replace(/_/g, " ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
			    initial: data[i].name.toUpperCase().indexOf("ICE")>=0
			});
			
			if(data[i].name.toUpperCase().indexOf("ICE")>=0){
			    this.initialIdList.push(i);
			}
		    }
		   
		    this.controlConditionFilter = new AQCU.view.MultiselectField({
			el: '.aqcu-vdiag-control-conditions',
			model : this.model,
			fieldConfig: {
			    fieldName: "excludeConditions",
			    displayName: "Exclude Control Conditions",
			    description: "Field Visit Measurements that have a Control Condition which matches one of the selected values will be excluded from the report.",
			    placeholder: "Control Conditions to Exclude"
			},
			data: this.conditionList,
			initialSelection: this.initialIdList,
			valueField: 'value'
		    });
		},
		error: function (a, b, c) {
		    $.proxy(this.router.unknownErrorHandler, this.router)(a, b, c)
		}
	    });
	},
	
	constructReportOptions: function() {
		var reportOptions = AQCU.view.BaseReportView.prototype.constructReportOptions.apply(this, arguments);
		if(this.model.get("priorYearsHistoric")) {
		    reportOptions.priorYearsHistoric = this.model.get("priorYearsHistoric");
		}
		
		if(this.model.get("excludeConditions") && this.model.get("excludeConditions").length > 0) {
		    _this = this;
		    
		    //Select the control condition objects that are being excluded
		    var excludedConditions = this.conditionList.filter(function(condition){
			return _this.model.get("excludeConditions").indexOf(condition.id.toString()>=0);
		    });
		    
		    var excludedValues = [];
		    
		    //Extract the value property from the control condition objects
		    for(var i = 0; i < excludedConditions.length; i++){
			excludedValues.push(excludedConditions[i].value);
		    }
		    
		    //Join the values into a comma-separated list
		    reportOptions.excludeConditions = excludedValues.join();
		}
 		return reportOptions;
	}
});