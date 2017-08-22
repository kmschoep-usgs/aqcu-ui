/**
 */
AQCU.view.TimeSeriesSelectionFilterView = AQCU.view.BaseView.extend({
	templateName: 'time-series-selection-filter',
	
	bindings: {
	},

	events: {
	},

	initialize: function() {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		
		this.router = this.options.router;
		
		this.parentModel = this.options.parentModel;
		this.model = this.options.model || new Backbone.Model({
			//timeSeriesList: this.parentModel.get("timeSeriesList"), //this gets set by select,
			filter: this.parentModel.get("filter"),
			onlyPublish: true,
			onlyPrimary: true,
			computationFilter: [],
			periodFilter: [],
			unitFilter: [],
			parameterFilter: [],
			identifierFilter: []
		});
		var filter = this.model.get("filter");
		
		if(filter != null){
			this.model.set("onlyPublish", filter.onlyPublish);
			this.model.set("onlyPrimary", filter.onlyPrimary);
			this.model.set("computationFilter", filter.computationFilter);
			this.model.set("periodFilter", filter.periodFilter);
			this.model.set("unitFilter", filter.unitFilter);
			this.model.set("parameterFilter", filter.identifierFilter);
			this.model.set("identifierFilter", filter.identifierFilter);
		}
		
		this.parentModel.bind("change:site", this.render, this);
		
		//Stickit doesn't work well with default backbone model nested bindings
		//so we need to update each filter param individually
		this.model.bind("change:onlyPublish", this.updateFilter, this);
		this.model.bind("change:onlyPrimary", this.updateFilter, this);
		this.model.bind("change:computationFilter", this.updateFilter, this);
		this.model.bind("change:periodFilter", this.updateFilter, this);
		this.model.bind("change:unitFilter", this.updateFilter, this);
		this.model.bind("change:parameterFilter", this.updateFilter, this);
		this.model.bind("change:identifierFilter", this.updateFilter, this);
		this.parentModel.bind("change:filteredList", this.createParameterFilter, this);
		this.parentModel.bind("change:filteredList", this.createUnitFilter, this);
		this.parentModel.bind("change:filteredList", this.createIdentifierFilter, this);
	},
	
	/*override*/
	preRender: function() {
		this.context = {
			site : this.parentModel.get("site")
		};
	},
	
	afterRender: function () {
		this.createPublishPrimaryFilters();
		this.createComputationFilter();
		this.createPeriodFilter();
		this.createUnitFilter();
		this.createParameterFilter();
		this.createIdentifierFilter();
		this.stickit();
	},
	
	createPublishPrimaryFilters: function() {
		var publishFilter = new AQCU.view.CheckBoxField({
			router: this.router,
			model: this.model,
			fieldConfig: {
				fieldName : "onlyPublish",
				displayName : "Publish",
				description : "Publish Only"
			},
			el: '.publishFilter',
			immediateUpdate: true,
			startHidden: false
		});
		
		var primaryFilter = new AQCU.view.CheckBoxField({
			router: this.router,
			model: this.model,
			fieldConfig: {
				fieldName : "onlyPrimary",
				displayName : "Primary",
				description : "Primary Only"
			},
			el: '.primaryFilter',
			immediateUpdate: true,
			startHidden: false
		});
		
		$.extend(this.bindings, publishFilter.getBindingConfig());
		$.extend(this.bindings, primaryFilter.getBindingConfig());
	},
	
	createComputationFilter: function() {	
		$.ajax({
			url: AQCU.constants.serviceEndpoint +
					"/service/lookup/computations",
			timeout: 30000,
			dataType: "json",
			context: this,
			success: function (data) {			
				this.computationFilter = new AQCU.view.MultiselectField({
					el: '.computationFilter',
					model : this.model,
					fieldConfig: {
						fieldName: "computationFilter",
						displayName: "Filter Computations",
						description: "The list of time series below will be limited to the selected computations.",
						placeholder: "Computations to Show"
					},
					data: data,
					initialSelection: this.model.get("computationFilter")
				});
			},
			error: function (a, b, c) {
				$.proxy(this.router.unknownErrorHandler, this.router)(a, b, c)
			}
	    });
	},
	
	createPeriodFilter: function() {		
		$.ajax({
			url: AQCU.constants.serviceEndpoint +
					"/service/lookup/periods",
			timeout: 30000,
			dataType: "json",
			context: this,
			success: function (data) {			
				this.periodFilter = new AQCU.view.MultiselectField({
					el: '.periodFilter',
					model : this.model,
					fieldConfig: {
						fieldName: "periodFilter",
						displayName: "Filter Periods",
						description: "The list of time series below will be limited to the selected periods.",
						placeholder: "Periods to Show"
					},
					data: data,
					initialSelection: this.model.get("periodFilter")
				});
			},
			error: function (a, b, c) {
				$.proxy(this.router.unknownErrorHandler, this.router)(a, b, c)
			}
		});
	},
	
	createUnitFilter: function() {
		var filteredList = _.clone(this.parentModel.get("filteredList"));
		if (filteredList){
			var unitFilteredList = [];
			unitFilteredList = _.pluck(filteredList, 'units');
			uniqueFilteredList = _.uniq(unitFilteredList);
			$.ajax({
				url: AQCU.constants.serviceEndpoint +
					"/service/lookup/units",
					timeout: 30000,
					dataType: "json",
					context: this,
					success: function (data) {			
						this.unitFilter = new AQCU.view.MultiselectField({
							el: '.unitFilter',
							model : this.model,
							fieldConfig: {
								fieldName: "unitFilter",
								displayName: "Filter Parameter Units",
								description: "The list of time series below will be limited to the selected parameter units.",
								placeholder: "Parameter Units to Show"
							},
						data: data,
						initialSelection: uniqueFilteredList
					});
				},
				error: function (a, b, c) {
					$.proxy(this.router.unknownErrorHandler, this.router)(a, b, c)
				}
			});
		}
	},
	
	createIdentifierFilter: function() {
		var identifierSiteList = _.clone(this.parentModel.get("timeSeriesList"));
		var identifierFilteredList = _.clone(this.parentModel.get("filteredList"));
		if (identifierSiteList && identifierFilteredList){
			var identifierList = [];
			identifierList = _.map(_.pluck(identifierSiteList,'identifier'), function(ts){
				return ts.split("@",1);
			});
			var filteredList = [];
			filteredList = _.map(_.pluck(identifierFilteredList,'identifier'), function(ts){
				return ts.split("@",1);
			});
			this.identifierFilter = new AQCU.view.MultiselectField({
				el: '.identifierFilter',
				model : this.model,
				fieldConfig: {
					fieldName: "identifierFilter",
					displayName: "Filter Identifiers",
					description: "The list of time series below will be limited to the selected identifiers.",
					placeholder: "Identifiers to Show"
				},
				data: identifierList,
				initialSelection: filteredList
			});
		}
	},
	
	createParameterFilter: function() {
		var parameterSiteList = _.clone(this.parentModel.get("timeSeriesList"));
		var parameterFilteredList = _.clone(this.parentModel.get("filteredList"));
		if (parameterSiteList && parameterFilteredList){
			var parameterList = [];
			parameterList = _.pluck(parameterSiteList, 'parameter');
			uniqueParameterList = _.uniq(parameterList);
			var filteredList = [];
			filteredList = _.pluck(parameterFilteredList, 'parameter');
			uniqueFilteredList = _.uniq(filteredList);
			this.parameterFilter = new AQCU.view.MultiselectField({
				el: '.parameterFilter',
				model : this.model,
				fieldConfig: {
					fieldName: "parameterFilter",
					displayName: "Filter Parameters",
					description: "The list of time series below will be limited to the selected parameter.",
					placeholder: "Parameters to Show"
				},
				data: uniqueParameterList,
				initialSelection: uniqueFilteredList
			});
		}
	},
	
	updateFilter: function() {
		//Need to deep-copy the filter object into a new object to trigger the 
		//backbone 'change' event
		var filter = JSON.parse(JSON.stringify(this.model.get("filter")));
		filter.onlyPublish = this.model.get("onlyPublish");
		filter.onlyPrimary = this.model.get("onlyPrimary");
		filter.computationFilter = this.model.get("computationFilter");
		filter.periodFilter = this.model.get("periodFilter");
		filter.unitFilter = this.model.get("unitFilter");
		filter.identifierFilter = this.model.get("identifierFilter");
		filter.parameterFilter = this.model.get("parameterFilter");
		this.model.set("filter", filter);
		this.parentModel.set("filter", filter);
	}
});
