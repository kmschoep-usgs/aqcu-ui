/**
 * Extends BaseView.js, see for full documentation of class functions.
 */
AQCU.view.TimeSeriesView = AQCU.view.BaseView.extend({
	templateName: 'time-series',

	/**
	* Used by Backbone Stickit to bind HTML input elements to Backbone models.
	* This will be built up in the initialize function.
	*/
	bindings: {},

	events: {
		'click #time-series-prototype-btn': "goToPrototype"
	},
	initialize: function() {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		
		this.router = this.options.router;
		
		this.model = this.options.model || new Backbone.Model({
				selectedSite: null,
				filterPublish: true,
				filterPrimary: true
			});

		this.model.bind("change:selectedSite", this.siteSelected, this);	
	},
	
	afterRender: function() {
		this.siteSelectorPanel = new AQCU.view.SiteSelectorView({
			parentModel: this.model,
			router: this.router,
			el: this.$el.find(".site-selection-panel")
		});
		
		this.reportConfigPanel = new AQCU.view.ReportConfigView({
			parentModel: this.model,
			router: this.router,
			el: this.$el.find(".report-config-panel")
		});
		
		this.stickit();
	},
	
	siteSelected: function() {
		this.reportConfigPanel.setSite(this.model.get("selectedSite"));
	}
});