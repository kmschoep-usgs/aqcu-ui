/**
 * Backbone view to encapsulate the shuttlebox widget
 */
AQCU.view.MultiSelectShuttle = Backbone.View.extend({
	/**
	 * Handlebars template
	 */
	template: Handlebars.compile("\
		<div class='row nwis-field-container'>\
			<div class='col-sm-5 col-lg-5'>\
				<label for='{{fieldName}}'>\
					{{displayName}}&nbsp;&nbsp;\
					{{#if description}}\
					<i class='fa fa-question-circle nwis-search-form-category-tip-target' title='{{description}}'></i>\
					{{/if}}\
				</label>\&nbsp;\
			    {{#if hideable}}<div class='nwis-multi-expander ui-icon {{#if startHidden}}ui-icon-circle-triangle-e{{else}}ui-icon-circle-triangle-s{{/if}}'></div>{{/if}}\
			</div>\
			<div class='col-sm-7 col-lg-7'>\
				<div class='nwis-multi-expander-selected' {{#if startHidden}}{{else}}style='display: none;'{{/if}}>...</div> \
			</div>\
			<div class='col-sm-11 col-lg-11'>\
				<div class='vision_field_{{fieldName}}_container' {{#if startHidden}}style='display: none;'{{/if}}></div> \
			</div>\
		</div>"),
	/**
	 * Backbone events object. See backbone documentation
	 */
	events: {
		"click .nwis-multi-expander": "toggleCollapse",
		"click .nwis-multi-expander-selected": "toggleCollapse"
	},
	/**
	 * Will create and render a shuttlebox field using a fieldConfig options defined in NWIS Search Models.
	 */
	initialize: function() {
		this.router = this.options.router; //NWIS Vision Router
		this.searchModel = this.options.searchModel; //NWIS search model
		this.height = this.options.height;
		this.fieldConfig = this.options.fieldConfig;
		this.renderTo = this.options.renderTo;
		this.startHidden = this.options.startHidden | false;
		this.hideable = this.options.hideable;
		this.filterRequired = this.options.filterRequired;

		if (this.hideable !== false) {
			this.hideable = true;
		}

		this.events["change .vision_field_" + this.fieldConfig.fieldName] = this.updateSelectedValuesDisplay;

		this.render();

		Backbone.View.prototype.initialize.apply(this, arguments);

		this.updateSelectedValuesDisplay();
	},
	render: function() {
		var newDom = this.template(
				$.extend(
						{
							hideable: this.hideable,
							startHidden: this.startHidden
						},
				this.fieldConfig
						)
				); //new DOM elements created from templates
		this.$el.append(newDom);
		this.renderTo.append(this.el);

		//transform to shuttle using
		this.fieldContainer = this.$(".vision_field_" + this.fieldConfig.fieldName + "_container").bootstrapTransfer($.extend(
				{
					"height": this.height,
					router: this.router
				},
		this.fieldConfig
				));
	},
	/**
	 * The HTML that is generated here can be bound using Backbone stickit with the following
	 * config attributes.
	 * @returns JSON object containing a single config for this element
	 */
	getBindingConfig: function() {
		var binding = {};
		var _this = this;
		binding[".vision_field_" + _this.fieldConfig.fieldName] = {
			observe: _this.fieldConfig.fieldName,
			update: function($el, val) {
				$el.val(val);
				_this.updateSelectedValuesDisplay();
			}
		};
		return binding;
	},
	/**
	 * return a handle to the bootstrap-transfer enabled JQuery wrapped DOM object
	 * @returns
	 */
	getFieldContainer: function() {
		return this.fieldContainer;
	},
	/**
	 * Triggers an ajax call to load the shuttlebox
	 * @param params
	 */
	loadOptions: function(params) {
		if (this.filterRequired && !params) {
			this.fieldContainer.clearInputs();
			this.fieldContainer.set_values([]); //make sure to blank out values
			return;
		}
		this.fieldContainer.clearInputs();
		var _this = this;
		var updateFunc = function() {
			$.proxy(_this.updateSelectedValuesDisplay, _this)();
		};
		this.loadAjax = this.fieldContainer.loadOptions(params, updateFunc);
	},
	/**
	 * Populates the shuttlebox with the given select options. Options be an array with json objects.
	 * Example format:
	 * [
	 * 	{value:"1", content:"Apple"},
	 * 	{value:"2", content:"Orange"},
	 *  {value:"3", content:"Banana"}
	 * ]
	 */
	populate: function(options) {
		var wireTooltips = function(event) {
			$(event.data.el).find('option').each(function(i, option) {
				var $option = $(option);
				AQCU.util.ui.addTooltipToContainer({
					description: $option.attr('title') || '',
					container: $option
				});
			});
		};

		$('body').
				off('nwis.reporting.lists.updated', wireTooltips).
				on('nwis.reporting.lists.updated', null, this, wireTooltips);

		this.fieldContainer.clearInputs();
		var _this = this;
		var updateFunc = function() {
			$.proxy(_this.updateSelectedValuesDisplay, _this)();
		};
		this.loadAjax = this.fieldContainer.populate(options, updateFunc);
	},
	/**
	 * Hides or shows the input.
	 */
	toggleCollapse: function() {
		var f = this.$(".vision_field_" + this.fieldConfig.fieldName + "_container");
		var sv = this.$(".nwis-multi-expander-selected");

		if (f.is(":visible")) {
			f.hide("blind", {}, 250);
			sv.show();
			this.$('.nwis-multi-expander').addClass("ui-icon-circle-triangle-e");
			this.$('.nwis-multi-expander').removeClass("ui-icon-circle-triangle-s");
		} else {
			f.show("blind", {}, 250);
			sv.hide();
			this.$('.nwis-multi-expander').addClass("ui-icon-circle-triangle-s");
			this.$('.nwis-multi-expander').removeClass("ui-icon-circle-triangle-e");
		}
	},
	/**
	 * Helper function to render the collapsed display of values
	 */
	updateSelectedValuesDisplay: function() {
		var values = this.$('.vision_field_' + this.fieldConfig.fieldName).val();
		var valueString = "";
		if (!values) {
			valueString = "<span class='nwis-search-form-input-select-none-selected'> Any...</span>";
		} else {
			valueString = values.replace(/,/g, ", ");
		}

		this.$('.nwis-multi-expander-selected').html(valueString);

		if (values.length > 0) {
			this.$('.chosen-count').html("(" + values.split(",").length + ")");
		} else {
			this.$('.chosen-count').html("");
		}
	},
	/**
	 * Helper function
	 */
	showValues: function() {
		this.fieldContainer.update_values();
	},
	/*Make sure to kill ajax load if this is removed*/
	remove: function() {
		if (this.loadAjax) {
			this.loadAjax.abort();
		}
		Backbone.View.prototype.remove.apply(this, arguments);
	}

});