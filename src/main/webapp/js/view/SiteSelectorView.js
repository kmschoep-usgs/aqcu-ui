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
		'click .site-selector-remove-site': "onClickSiteRemove",
		'click .sortByNumber': "clickSortByNumberButton",
		'click .sortByName': "clickSortByNameButton"
	},
	
	initialize: function() {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		
		this.router = this.options.router;
		this.parentModel = this.options.parentModel;
		
		this.model = this.options.model || new Backbone.Model({
				selectedSite: null,
				siteList: AQCU.util.localStorage.getData("aqcuSiteList") || [] 
			});

		this.model.bind("change:selectedSite",   this.updateParentModelSelectedSite, this);
		this.model.bind("change:siteList",       this.updateSiteList, this);
		this.model.bind("change:select_site_no", this.onSiteSearchSelect, this);	
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
		this.dragAndDropSites();
	},
	
	createSiteSelectorWidget: function() {
		this.siteSelect = new AQCU.view.Select2Field({
			el:'.site-select-widget',
			model:this.model,
			fieldConfig: {
				fieldName   : "select_site_no",
				description : "Search by location name or number"
			},
			select2: {
				placeholder : "Search by location name or number",
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
				    cache: true,
					error: $.proxy(this.router.unknownErrorHandler, this.router)
				},
			},
		});
	},

	updateSiteList: function() {
		this.refreshView(); 
		AQCU.util.localStorage.setData("aqcuSiteList", this.model.get("siteList"));
	},
	
	onSiteSearchSelect : function() {
		var siteNumber = this.model.get("select_site_no");
		if (siteNumber) {
			var displayValue = this.siteSelect.getDisplayValue(siteNumber);
			if (displayValue) {
				var siteName = displayValue.replace(siteNumber + " - ", ""); 
				this.addSiteToList(siteNumber, siteName);
			}
		}
	},
	
	addSiteToList: function(siteNumber, siteName) {
		var siteList = this.model.get("siteList");
		var exists = false;
		for(var i = 0; i < siteList.length; i++) {
			if(siteList[i].siteNumber === siteNumber) {
				var searchSiteNumber = siteList[i].siteNumber;
				var searchSiteName = siteList[i].siteName;
				exists = true;
				this.selectSiteOnSearch(searchSiteNumber, searchSiteName);
				break;
			}
		}
		
		if(!exists) {
			var _this = this;
			var $ul = this.$('.sortable');
			var newSiteList = _.clone(siteList); //need to clone so that the change event is triggered
			newSiteList.unshift({siteNumber: siteNumber, siteName: siteName});
			this.model.set("siteList", newSiteList);
			for(var i = 0; i < newSiteList.length; i++){
			    var searchSiteNumber = newSiteList[i].siteNumber;
			    var searchSiteName = newSiteList[i].siteName;
			    if(newSiteList[i].siteNumber === siteNumber){
				this.selectSiteOnSearch(searchSiteNumber, searchSiteName);
				break;
			    }
			}
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
	
	selectSiteOnSearch: function(siteNumber, siteName){
	    this.model.set("selectedSite", {siteNumber: siteNumber, siteName: siteName});
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
		this.$el.parent().removeClass('aqcu-loading-indicator');
	},
	
	updateParentModelSelectedSite: function() {
		this.parentModel.set("selectedSite", this.model.get("selectedSite"));
	},
	
	dragAndDropSites: function(){
	    var _this = this;
	    //add id's to the li elements so after sorting we can save the order in localstorage
	    this.$( ".sortable > li" ).each(function(index, domEle){ $(domEle).attr('id', 'item_'+index);});

	    this.$( ".sortable" ).sortable({
		placeholder: "ui-state-highlight",
		update: function() {  
		    _this.$('.sortSiteButtons div').removeClass('activeSort');
		    _this.$('.sortSiteButtons div .fa').remove();
		    localStorage.setItem("sorted", _this.$(".sortable").sortable("toArray"));
		}
	    });
    
	    this.restoreSorted();
	    
	},
	
	clickSortByNumberButton: function(){
	    var _this = this;
	    this.alphabetizeSiteList(0, '.sortByNumber');
	    localStorage.setItem("sorted", _this.$(".sortable").sortable("toArray") );
	    this.restoreSorted();
	    this.highlightSortButton('.sortByNumber');
	},
	
	clickSortByNameButton: function(){
	    var _this = this;
	    this.alphabetizeSiteList(1, '.sortByName');
	    localStorage.setItem("sorted", _this.$(".sortable").sortable("toArray") );
	    this.restoreSorted();
	    this.highlightSortButton('.sortByName');
	},
	
	highlightSortButton: function(button){
	    this.$('.sortSiteButtons div').removeClass('activeSort');
	    this.$(button).addClass('activeSort');
	},

	//Resorts the order back to how the user had it
	restoreSorted: function(){
	    var sorted = localStorage["sorted"];      
	    if(sorted === undefined) return;

	    var elements = this.$(".sortable");
	    var sortedArr = sorted.split(",");
	    for (var i = 0; i < sortedArr.length; i++){
		var el = elements.find("#" + sortedArr[i]);
		this.$(".sortable").append(el);
	    };
	},
	
	alphabetizeSiteList: function(option, buttonClicked){
	    var list, i, switching, b, shouldSwitch, dir, switchcount = 0;
	    list = this.$(".sortable");
	    switching = true;
	    dir = "asc"; 
	    while (switching) {
	        switching = false;
		b = list.children();
		for (i = 0; i < (b.length - 1); i++) {
		    shouldSwitch = false;
		    var stringSection1 = this.$(b[i]).text().toLowerCase().split(/-(.+)/);
		    var stringSection2 = this.$(b[i + 1]).text().toLowerCase().split(/-(.+)/);
		    if (dir == "asc") {
			if (stringSection1[option] > stringSection2[option]) {
			    shouldSwitch= true;
			    break;
			}
		    } else if (dir == "desc") {
			if (stringSection1[option] < stringSection2[option]) {
			    shouldSwitch= true;
			    break;
			}
		    }
		}
		if (shouldSwitch) {
		    list.append(b[i]);
		    switching = true;
		    switchcount ++;
		} else {
		    if (switchcount == 0 && dir == "asc") {
			dir = "desc";
			switching = true;
		    }
		}
	    }
	    if(dir === 'asc'){
		this.$('.fa').remove();
		this.$(buttonClicked).append('<i class="fa fa-caret-up"></i>');
	    }
	    else if(dir === 'desc'){
		this.$('.fa').remove();
		this.$(buttonClicked).append('<i class="fa fa-caret-down"></i>');
	    }
	}
	
});
