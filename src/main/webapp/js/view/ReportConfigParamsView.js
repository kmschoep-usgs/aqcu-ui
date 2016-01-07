/**
 */
AQCU.view.ReportConfigParamsView = AQCU.view.BaseView.extend({
	templateName: 'report-config-params',
	
	/**
	* Used by Backbone Stickit to bind HTML input elements to Backbone models.
	* This will be built up in the initialize function.
	*/
	bindings: {},

	events: {
	},
	
	initialize: function() {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
			
		this.parentModel = this.options.parentModel;
		
		this.parentModel.bind("change:site", this.render, this);
	},
	
	/*override*/
	preRender: function() {
		this.context = {
			site : this.parentModel.get("site")
		};
	},
	
	afterRender: function () {
		this.dateRange = new AQCU.view.DateField({
			el      : '.date-range',
			model   : this.parentModel,
			format  : "yyyy-mm-dd",
			fieldConfig: {
				isDateRange        : true,
				includeLastMonths  : true,
				includeWaterYear   : true,
				startDateFieldName : "startDate",
				endDateFieldName   : "endDate",
				displayName        : "Date Range",
				fieldName          : "date_range",
				description        : ""
			},
		});
	}
});
