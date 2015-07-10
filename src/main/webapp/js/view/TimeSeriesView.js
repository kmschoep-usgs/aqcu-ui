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
		'click #nav-home': "goRaHome",
		'click #time-series-prototype-btn': "goToPrototype"
	},
	initialize: function() {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		
		this.model = this.options.model || new Backbone.Model({
				selectedSite: null
			});

		this.model.bind("change:selectedSite", this.siteSelected, this);	
	},
	
	afterRender: function() {
		this.siteSelectorPanel = new AQCU.view.SiteSelectorView({
			parentModel: this.model,
			el: this.$el.find(".site-selection-panel")
		});
		
		this.reportConfigPanel = new AQCU.view.ReportConfigView({
			parentModel: this.model,
			el: this.$el.find(".report-config-panel")
		});
		
		this.stickit();
	},
	
	siteSelected: function() {
		alert("Selected site " + this.model.get("selectedSite").siteNumber);
		//TODO UPDATE or reinitialize report-config view with new site selection
	}
});