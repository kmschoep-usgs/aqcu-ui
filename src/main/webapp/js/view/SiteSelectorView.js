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
		this.router = this.options.router;
		this.parentModel = this.options.parentModel;
		
		this.model = this.options.model || new Backbone.Model({
				selectedSite: null,
				siteList: AQCU.util.localStorage.getData("aqcuSiteList") || [] 
			});

		this.model.bind("change:selectedSite", this.updateParentModelSelectedSite, this);
		this.model.bind("change:siteList", this.refreshView, this);		
		this.model.bind("change:siteList", function() { AQCU.util.localStorage.setData("aqcuSiteList", this.model.get("siteList")) }, this);
		
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
	},
	
	refreshView: function() {
		this.preRender();
		this.baseRender();
		this.afterRender();
	},
	
	/*override*/
	preRender: function() {
		//need to create a deep clone of the site list
		var clonedSiteList = [];
		var siteList = this.model.get("siteList");
		var selectedSite = this.model.get("selectedSite");
		for(var i = 0; i < siteList.length; i++) {
			var clonedSite = _.clone(siteList[i]);
			if(selectedSite && clonedSite.siteNumber == selectedSite.siteNumber) {
				clonedSite.selected = true;
			}
			clonedSiteList.push(clonedSite);
		}
		this.context = {
			sites : clonedSiteList
		}
	},
	
	afterRender: function() {
		//create and bind site search
		this.createSiteSelectorWidget();
		this.stickit();
	},
	
	createSiteSelectorWidget: function() {
		this.siteSelect = new AQCU.view.Select2Field({
			router: this.router,
			fieldConfig: {
				fieldName   : "select_site_no",
				description : "Search by site name or number"
			},
			select2: {
				placeholder : "Search by site name or number",
				dropdownCssClass: "site-selector-search-list-width",
				ajax : {
					url: AQCU.constants.serviceEndpoint + "/service/lookup/sites",
				    dataType: 'json',
				    data: function (params) {
					    return {
							pageSize: 10,
							siteNumber: params.term
						}
				    },
				    processResults: function (data, page) {
				    	var siteList = [];
						for (var i = 0; i < data.length; i++) {
							siteList.push({ 
								id  : data[i].siteNumber,
								text: data[i].siteNumber +" - "+ data[i].siteName}
							);
						}
				        return {results: siteList};
				    },
				    cache: true
				},
			},
			renderTo: this.$el.find('.site-select-widget'),
			startHidden: false,
		});
		$.extend(this.bindings, this.siteSelect.getBindingConfig());
		
		this.model.bind("change:select_site_no", function() {
			var siteNumber = this.model.get("select_site_no");
			if (siteNumber) {
				var displayValue = this.siteSelect.getDisplayValue(siteNumber);
				if(displayValue) {
					var siteName = displayValue.replace(siteNumber + " - ", ""); 
					this.addSiteToList(siteNumber, siteName);
				}
			}
		}, this);	
	},
	
	addSiteToList: function(siteNumber, siteName) {
		var siteList = this.model.get("siteList");
		
		var exists = false;
		for(var i = 0; i < siteList.length; i++) {
			if(siteList[i].siteNumber == siteNumber) {
				exists = true;
				break;
			}
		}
		
		if(!exists) {
			var newSiteList = _.clone(siteList); //need to clone so that the change event is triggered
			newSiteList.push({siteNumber: siteNumber, siteName: siteName});
			this.model.set("siteList", newSiteList);
		}
	},
	
	removeBySiteNumber: function(siteNumber) {
		var currentList = this.model.get("siteList");
		var newList = [];
		for(var i = 0; i < currentList.length; i++) {
			if(this.model.get("selectedSite") && this.model.get("selectedSite").siteNumber == siteNumber) {
				this.model.set("selectedSite", null);
			}
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
		this.refreshView();
		//mark selected
		this.$el.find("[siteNumber='"+siteNumber+"']").parent().addClass("");
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
