describe("Select2Field.js", function() {

	var select2;
	
	var setupDom = function(){
		if ($('.select2').length === 0) {
			// this does not load the CSS
			$(document.head).append( $('<link rel="stylesheet" type="text/css" href="/webjars/select2/4.0.0/css/select2.css"/>') );
			// this CSS also is not applied
			$(document.head).append( $('<style>.dropdownCssClass{width:33px;} .vision_select_field_asdf{color:red;} span{color:red;}</style>') );
			// this is necessary - a landing place for the widget
		    $(document.body).append( $('<div class="select2"></div>') );
		}
	}
	
	beforeEach(function(){
		setupDom();
		
		select2 = new AQCU.view.Select2Field({
			el:'.select2',
			fieldConfig: {
				fieldName   : "asdf",
			},
			select2: {
				placeholder : "some placeholder text",
				dropdownCssClass: "dropdownCssClass",
			}	
		});
	});
	
	afterEach(function(){
		$('.select2').html('');
	});
	
	it("Defines these public attributes and API functions", function() {
		since('select2 definition').expect(AQCU.view.Select2Field).toBeDefined();
		since('select2 instance').expect(select2).toBeDefined();
	});
	
	it('injects DOM elements',function(){
		//since('Drop down class should be used').expect($('.dropdownCssClass').length).toBe(1);
		since('Create a hidden input with id class').expect($('.vision_field_asdf').length).toBe(1);
		since('Create select with id class').expect($('.vision_select_field_asdf').length).toBe(1);
		since('Placeholder text should be set').expect($('.select2-selection__placeholder').text()).toBe("some placeholder text");
	});
	
	it('should fire setHiddenValue on change',function(){
		$(select2.selector).html('');
		$(select2.selector).append($('<option value="1">option 1</otpion>'))
		$(select2.selector).append($('<option value="2">option 2</otpion>'))
		$(select2.selector).append($('<option value="3">option 3</otpion>'))
		
		since('initial hidden value should be empty because of tests do not suppor ajax').expect( $('.vision_field_asdf').val() ).toBe('');
		
		$(select2.selector).val('2');
		$(select2.selector).change();
		since('change event to set hidden value').expect( $('.vision_field_asdf').val() ).toBe('2');
		
	})

	it('should show a field label (and description) only when given display name (and description)',function(){
		since('No display name is given there should be no <label> elements for display name')
			.expect( $('label').length ).toBe(0);
		since('No decription is given there should be no <i> elements for description')
			.expect( $('i').length ).toBe(0);
		
	    $('div.select2').append( $('<div class="select2labeled"></div>') );		
	    $('div.select2').append( $('<div class="select2described"></div>') );		
		
		select2label = new AQCU.view.Select2Field({
			el:'.select2labeled',
			fieldConfig: {
				fieldName   : "asdf2",
				displayName : "ASDF2",
			},
			select2: {
				placeholder : "some other placeholder text",
				dropdownCssClass: "dropdownCssClass",
			}	
		});

		since('No decription is given there should be no <i> elements for description')
			.expect( $('i').length ).toBe(0);
		var labeled = $('label');
		since('A display name is given there should be a label single element')
			.expect( labeled.length ).toBe(1);
		since('A display name is given, ASDF2, there should be a label with that text')
			.expect( labeled.text().trim() ).toBe("ASDF2");

		select2desc = new AQCU.view.Select2Field({
			el:'.select2described',
			fieldConfig: {
				fieldName   : "asdf3",
				displayName : "ASDF3",
				description : "ASDF3 Description"
			},
			select2: {
				placeholder : "another placeholder text",
				dropdownCssClass: "dropdownCssClass",
			}	
		});

		var desc = $('i.fa');
		since('With a decription is given there should be an <i> elements for description')
			.expect( desc.length ).toBe(1);
		since('A decription is given, ASDF Description, there should be a <i> element with that text')
			.expect( desc[0].title ).toBe("ASDF3 Description");
		
	});

});

