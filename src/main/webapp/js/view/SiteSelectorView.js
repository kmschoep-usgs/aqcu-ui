/**
 * Extends BaseView.js, see for full documentation of class functions.
 */
AQCU.view.SiteSelectorView = AQCU.view.BaseView.extend({
	templateName: 'site-selector',
       
	/**
	* Used by Backbone Stickit to bind HTML input elements to Backbone models.
	* This will be built up in the initialize function.
	*/
	bindings: {},

	events: {
		'click .site-selector-list-item': "onClickSiteItem",
		'click .site-selector-remove-site': "onClickSiteRemove"
	},
	
	initialize: function() {
		
		this.parentModel = this.options.parentModel;
		
		this.model = this.options.model || new Backbone.Model({
				selectedSite: null,
				siteList: []
			});

		this.model.bind("change:selectedSite", this.updateParentModelSelectedSite, this);
		this.model.bind("change:siteList", this.reRender, this);		
		
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		
		//TODO hook up site selector widget
	},
	
	reRender: function() {
		this.preRender();
		this.baseRender();
	},
	
	/*override*/
	preRender: function() {
		this.context = {
			sites : this.model.get("siteList")
		}
	},
	
	afterRender: function() {
		//TODO remove these lines, strictly for testing
		this.addSiteToList("111111", "TEST SITE 1");
		this.addSiteToList("222222", "TEST SITE 2");
		this.addSiteToList("333333", "TEST SITE 3");
	},
	
	addSiteToList: function(siteNumber, siteName) {
		var currentSiteList = _.clone(this.model.get("siteList")); //need to clone so that the change event is triggered
		currentSiteList.push({siteNumber: siteNumber, siteName: siteName});
		this.model.set("siteList", currentSiteList);
	},
	
	removeBySiteNumber: function(siteNumber) {
		var currentList = this.model.get("siteList");
		var newList = [];
		for(var i = 0; i < currentList.length; i++) {
			if(currentList[i].siteNumber != siteNumber) {
				newList.push(currentList[i]);
			}
		}
		this.model.set("siteList", newList);
	},
	
	onClickSiteItem: function(event) {
		var clickedDom = event.currentTarget;
		//Cheating by embedding values in HTML attributes, may want to 
		//use subviews/models to avoid this kind of hackery
		var siteNumber = $(clickedDom).attr("siteNumber"); 
		var siteName = $(clickedDom).attr("siteName"); 
		this.model.set("selectedSite", { siteNumber: siteNumber, siteName: siteName });
		this.reRender();
		//mark selected
		this.$el.find("[siteNumber='"+siteNumber+"']").parent().addClass("site-selector-selected-site");
	},

	onClickSiteRemove: function(event) {
		var clickedDom = event.currentTarget;
		//Cheating by embedding values in HTML attributes, may want to 
		//use subviews/models to avoid this kind of hackery
		var siteNumber = $(clickedDom).attr("siteNumber"); 
		this.removeBySiteNumber(siteNumber);
	},
	
	updateParentModelSelectedSite: function() {
		this.parentModel.set("selectedSite", this.model.get("selectedSite"))
	}
});