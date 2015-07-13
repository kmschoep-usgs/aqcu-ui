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
				siteList: []
			});

		this.model.bind("change:selectedSite", this.updateParentModelSelectedSite, this);
		this.model.bind("change:siteList", this.refreshView, this);		
		
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		
		//TODO hook up site selector widget
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
		//TODO replace both of these widgets with single site select widget
		this.searchField = new AQCU.view.TextField({
			searchModel: this.model,
			fieldConfig: {
				fieldName : "search_site_no",
				displayName : "",
				placeHolderText: "Search by site number"
			},
			renderTo: this.$('.site-search')
		});
		$.extend(this.bindings, this.searchField.getBindingConfig());
		
		this.siteSelect = new AQCU.view.SelectField({
			router: this.router,
			fieldConfig: {
				fieldName : "select_site_no",
				displayName : "",
				description : ""
			},
			renderTo: this.$el.find('.site-select-widget'),
			startHidden: false
		});
		$.extend(this.bindings, this.siteSelect.getBindingConfig());
		
		var siteSelect = this.siteSelect;
		
		this.model.bind("change:select_site_no", function() {
			var siteNumber = this.model.get("select_site_no");
			if(siteNumber) {
				var siteName = siteSelect.getDisplayValue(siteNumber).replace(siteNumber + " - ", ""); 
				this.addSiteToList(siteNumber, siteName);
				this.model.set("search_site_no", "");
			}
		}, this);	
		
		this.model.bind("change:search_site_no", function() {
			var siteSearchTerm = this.model.get("search_site_no");
			if(this.model.get("search_site_no") && this.model.get("search_site_no").length >= 5) {
				siteSelect.showLoader();
				$.ajax({
					url: "service/nwisra/report/SiteInformation/json?",
					timeout: 120000,
					dataType: "json",
					data: {"sitefile.site_no.like.varchar.trim": '%'+siteSearchTerm+'%'}, //using this expression might be slow
					context: this,
					success: function(data) {
						siteSelect.hideLoader();
						var siteList = [];
						for(var i = 0; i < data.records.length; i++) {
							siteList.push({ KeyValue: data.records[i].SITE_NO, DisplayValue: data.records[i].SITE_NO + " - " + data.records[i].STATION_NM});
						}
						siteSelect.setSelectOptions(siteList);
						siteSelect.updateSelectedOption();
					},
					error: $.proxy(this.router.unknownErrorHandler, this.router)
				});
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