/**
 */
AQCU.view.TimeSeriesSelectionFilterView = AQCU.view.BaseView.extend({
	templateName: 'time-series-selection-filter',
	
	bindings: {
		"#onlyPublish" : "onlyPublish",
		"#onlyPrimary" : "onlyPrimary"
	},

	events: {
	},

	initialize: function() {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		
		this.router = this.options.router;
		
		this.parentModel = this.options.parentModel;
		
		this.model = this.options.model || new Backbone.Model({
				timeSeriesList: this.options.timeSeriesList, //this gets set by select,
				filter: this.parentModel.get("filter"),
				onlyPublish: true,
				onlyPrimary: true
		});
		
		this.parentModel.bind("change:site", this.render, this);
		
		//Stickit doesn't work well with default backbone model nested bindings
		//so we need to update each filter param individually
		this.model.bind("change:onlyPublish", this.updateFilter, this);
		this.model.bind("change:onlyPrimary", this.updateFilter, this);
		this.model.bind("change:includeComputations", this.updateFilter, this);
		this.model.bind("change:includePeriods", this.updateFilter, this);
	},
	
	/*override*/
	preRender: function() {
		this.context = {
			site : this.parentModel.get("site")
		};
	},
	
	afterRender: function () {
		this.stickit();
	},
	
	updateFilter: function() {
		//Need to deep-copy the filter object into a new object to trigger the 
		//backbone 'change' event
		var filter = JSON.parse(JSON.stringify(this.model.get("filter")));
		filter.onlyPublish = this.model.get("onlyPublish") == null ? false : true;
		filter.onlyPrimary = this.model.get("onlyPrimary") == null ? false : true;
		filter.includeComputations = this.model.get("includeComputations");
		filter.includePeriods = this.model.get("includePeriods");
		this.model.set("filter", filter);
		this.parentModel.set("filter", filter);
	}
});
