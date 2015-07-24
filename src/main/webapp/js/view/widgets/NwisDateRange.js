/**
 * Backbone view to encapsulate the an NWIS partial date rante widget.
 * Date format yyyymmdd, sends "yyyymmdd,yyyymmdd" the the server.
 */
AQCU.view.NwisDateRange = Backbone.View.extend({
	NUMBER_OF_YEARS_BACK: 250,
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
				</label>\
			</div>\
			<div class='col-sm-7 col-lg-7'>\
				<input type='text' class='vision_date_field vision_date_{{fieldName}}_from' placeholder='Any...'/> <b>to</b> <input type='text' class='vision_date_field vision_date_{{fieldName}}_to' placeholder='Any...' /> \
				<input type='hidden' name='{{fieldName}}' class='vision_field vision_field_{{fieldName}}'/>\
			</div>\
		</div>"),
	/**
	 * Backbone events object. See backbone documentation
	 */
	events: {
	},
	/**
	 * Will create and render a date range field field using a fieldConfig options defined in NWIS Search Models.
	 */
	initialize: function() {
		this.model = this.options.model; //NWIS search model
		this.fieldConfig = this.options.fieldConfig;

		this.renderTo = this.options.renderTo;

		this.model.on("change:" + this.fieldConfig.fieldName, function(m, v, e) {
			this.$(".vision_field_" + this.fieldConfig.fieldName).val(v);
			if (!v)
				this.clearDisplayValues();
		}, this);

		this.events["change .vision_field_" + this.fieldConfig.fieldName] = this.updateDisplayValues;
		this.events["change .vision_date_" + this.fieldConfig.fieldName + "_from"] = this.setHiddenValue;
		this.events["change .vision_date_" + this.fieldConfig.fieldName + "_to"] = this.setHiddenValue;

		this.render();

		Backbone.View.prototype.initialize.apply(this, arguments);
	},
	render: function() {
		var newDom = this.template(
				$.extend(
						{},
						this.fieldConfig
						)
				); //new DOM elements created from templates
		this.$el.append(newDom);
		this.renderTo.append(this.el);

		//transform each input to a date picker
		var dateFormat = "yymmdd";
		var dateOpts = {
			minDate: "-" + this.NUMBER_OF_YEARS_BACK + "Y",
			maxDate: "+0D",
			yearRange: "-" + this.NUMBER_OF_YEARS_BACK + "Y:+0D",
			changeMonth: true,
			changeYear: true
		};
		this.$(".vision_date_" + this.fieldConfig.fieldName + "_from").datepicker(dateOpts);
		this.$(".vision_date_" + this.fieldConfig.fieldName + "_from").datepicker("option", "dateFormat", dateFormat);
		this.$(".vision_date_" + this.fieldConfig.fieldName + "_to").datepicker(dateOpts);
		this.$(".vision_date_" + this.fieldConfig.fieldName + "_to").datepicker("option", "dateFormat", dateFormat);
	},
	/**
	 * The HTML that is generated here can be bound using Backbone stickit with the following
	 * config attributes.
	 * @returns JSON object containing a single config for this element
	 */
	getBindingConfig: function() {
		var binding = {};
		var _this = this;
		binding[".vision_field_" + this.fieldConfig.fieldName] = {
			observe: this.fieldConfig.fieldName,
			update: function($el, val, model, options) {
				$el.val(val);
				_this.updateDisplayValues();
			}
		};
		return binding;
	},
	clearDisplayValues: function() {
		//suspend bind events
		this.undelegateEvents();
		this.$(".vision_date_" + this.fieldConfig.fieldName + "_from").val("");
		this.$(".vision_date_" + this.fieldConfig.fieldName + "_to").val("");
		this.delegateEvents();
	},
	/**
	 * Helper function to sync up the hidden value with the two date fields
	 */
	updateDisplayValues: function() {
		var value = this.$(".vision_field_" + this.fieldConfig.fieldName).val().split(',');
		if (value[0]) {
			this.$(".vision_date_" + this.fieldConfig.fieldName + "_from").val(value[0]);
		}
		if (value[1]) {
			this.$(".vision_date_" + this.fieldConfig.fieldName + "_to").val(value[1]);
		}
	},
	/**
	 * Helper function, when when either display values are updated, the hidden value is updated
	 */
	setHiddenValue: function() {
		var oldVal = this.$(".vision_field_" + this.fieldConfig.fieldName).val();
		var fromDate = this.$(".vision_date_" + this.fieldConfig.fieldName + "_from").val();
		var toDate = this.$(".vision_date_" + this.fieldConfig.fieldName + "_to").val();

		if (!toDate || !fromDate) { //both values are required for a value to register
			if (oldVal)
				this.$(".vision_field_" + this.fieldConfig.fieldName).val("");
		} else {
			var hiddenVal = fromDate + "," + toDate;
			this.$(".vision_field_" + this.fieldConfig.fieldName).val(hiddenVal);
		}

		if (oldVal != this.$(".vision_field_" + this.fieldConfig.fieldName).val()) {
			this.$(".vision_field_" + this.fieldConfig.fieldName).change();
		}
	}

});