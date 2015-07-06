(function($) {
	$.fn.bootstrapTransfer = function(options) {
		var stackSelectors = true; //toggle here
		var settings = $.extend({}, $.fn.bootstrapTransfer.defaults, options);
		var _this;
		var availableDiv = '<div class="selector-available">\
            <h2>Available</h2>\
            <div class="selector-filter">\
                <table width="100%" border="0">\
                    <tr>\
                        <td style="width:14px;">\
                            <i class="icon-search"></i>\
                        </td>\
                        <td>\
                            <div style="padding-left:10px;">\
                                <input type="text" class="filter-input">\
                            </div>\
                        </td>\
                    </tr>\
                </table>\
            </div>\
            <select multiple="multiple" class="filtered remaining">\
            </select>\
            <a class="selector-chooseall' + (stackSelectors ? ' selectorchooseall-top-bottom' : '') + '">Choose all</a>\
			<div class="nwis-loading-indicator" ' +
				(stackSelectors ?
						'style="width:100%;height:50%;position:absolute;top:0;left:0;display:none;"' :
						'style="width:50%;height:100%;position:absolute;top:0;left:0;display:none;"') + '/>\
        </div>';

		var chooserDiv = '<div class="selector-chooser">\
            <a class="selector-add">add</a>\
            <a class="selector-remove">rem</a>\
        </div>';

		var selectedDiv = '<div class="selector-chosen">\
            <h2>Chosen <span class="chosen-count"></span></h2>\
            <div class="selector-filter right">\
                <p>Select from available</p>\
            </div>\
            <select multiple="multiple" class="filtered target">\
            <input type="hidden" name="' + settings.fieldName + '" class="vision_field_' + settings.fieldName + '"/> \
            </select>\
            <a class="selector-clearall' + (stackSelectors ? ' selectorclearall-top-bottom' : '') + '">Clear all</a>\
			<div class="nwis-loading-indicator" ' +
				(stackSelectors ?
						'style="width:100%;height:50%;position:absolute;top:55%;left:0;display:none;"' :
						'style="style="width:50%;height:100%;position:absolute;top:0;left:50%;display:none;"') + '/>\
        </div>';

		var templateSideBySide = '<table width="100%" cellspacing="0" cellpadding="0">\
	            <tr>\
	            <td width="48%">'
				+ availableDiv +
				'</td>\
	            <td>\
                <div class="selector-chooser">\
	                <a class="selector-add">add</a>\
	                <a class="selector-remove">rem</a>\
	            </div>\
	            <td width="48%">'
				+ selectedDiv +
				'</td>\
	        </tr>\
	    </table>';

		var templateTopBottom = '<table width="100%" cellspacing="0" cellpadding="0">\
            <tr>\
            <td width="100%">'
				+ availableDiv +
				'</td>\
            </tr>\
            <tr>\
                <td class="selector-top-bottom"><a class="selector-add">add</a></td>\
                <td class="selector-top-bottom"><a class="selector-remove">rem</a></td>\
            </tr>\
            <tr><td width="100%">'
				+ selectedDiv +
				'</td>\
	        </tr>\
	    </table>';

		var template = stackSelectors ? templateTopBottom : templateSideBySide;
		/* #=============================================================================== */
		/* # Expose public functions */
		/* #=============================================================================== */
		this.populate = function(input) {
			_this.populate(input);
		};
		this.clearInputs = function() {
			_this.clearInputs();
		};
		this.set_values = function(values) {
			_this.set_values(values);
		};
		this.get_values = function() {
			return _this.get_values();
		};
		this.loadOptions = function(filterParams, callback) {
			return _this.loadOptions(filterParams, callback);
		};
		this.update_values = function() {
			return _this.update_values();
		};

		return this.each(function() {

			_this = $(this);
			/* #=============================================================================== */
			/* # Add widget markup */
			/* #=============================================================================== */
			_this.append(template);
			_this.addClass("bootstrap-transfer-container");
			/* #=============================================================================== */
			/* # Initialize internal variables */
			/* #=============================================================================== */
			_this.$router = settings.router; //VisionRouter
			_this.$filter_input = _this.find('.filter-input');
			_this.$remaining_select = _this.find('select.remaining');
			_this.$target_select = _this.find('select.target');
			_this.$value_field = _this.find('input.vision_field_' + settings.fieldName);
			_this.$add_btn = _this.find('.selector-add');
			_this.$remove_btn = _this.find('.selector-remove');
			_this.$choose_all_btn = _this.find('.selector-chooseall');
			_this.$clear_all_btn = _this.find('.selector-clearall');
			_this.$loaders = _this.find('.nwis-loading-indicator');
			_this._remaining_list = [];
			_this._target_list = [];
			/* #=============================================================================== */
			/* # Apply settings */
			/* #=============================================================================== */
			/* target_id */
			if (settings.target_id != '')
				_this.$target_select.attr('id', settings.target_id);
			/* height */
			_this.find('select.filtered').css('height', settings.height);
			/* #=============================================================================== */
			/* # Wire internal events */
			/* #=============================================================================== */
			_this.$add_btn.click(function() {
				_this.move_elems(_this.$remaining_select.val(), false, true);
			});
			_this.$remaining_select.dblclick(function() {
				_this.move_elems(_this.$remaining_select.val(), false, true);
			});
			_this.$remove_btn.click(function() {
				_this.move_elems(_this.$target_select.val(), true, false);
			});
			_this.$target_select.dblclick(function() {
				_this.move_elems(_this.$target_select.val(), true, false);
			});
			_this.$choose_all_btn.click(function() {
				_this.move_all(false, true);
			});
			_this.$clear_all_btn.click(function() {
				_this.move_all(true, false);
			});
			// Returns a function, that, as long as it continues to be invoked, will not
			// be triggered. The function will be called after it stops being called for
			// N milliseconds. If `immediate` is passed, trigger the function on the
			// leading edge, instead of the trailing.
			// http://stackoverflow.com/questions/12538344
			var debounce = function(func, wait, immediate) {
				var timeout;
				return function() {
					var context = this, args = arguments;
					var later = function() {
						timeout = null;
						if (!immediate) {
							func.apply(context, args);
						}
					};
					if (immediate && !timeout) {
						func.apply(context, args);
					}

					clearTimeout(timeout);
					timeout = setTimeout(later, wait);
				};
			};
			_this.$filter_input.keydown(debounce(function() {
				// Only update the list after the key has not been hit for a half second
				_this.update_lists(true);
			}, 500));
			/* #=============================================================================== */
			/* # Implement public functions */
			/* #=============================================================================== */
			_this.clearInputs = function() {
				_this._remaining_list = [];
				_this._target_list = [];
				_this.$remaining_select.find('option').each(function() {
					$(this).remove();
				});
				_this.$target_select.find('option').each(function() {
					$(this).remove();
				});
			};

			_this.populate = function(input, callback) {
				// input: [{value:_, content:_}]
				_this.$filter_input.val('');
				for (var i in input) {
					var e = input[i];
					_this._remaining_list.push([{value: e.value, content: e.content, description: e.description}, true]);
					_this._target_list.push([{value: e.value, content: e.content, description: e.description}, false]);
				}

				_this.update_lists(true);
				_this.update_values(callback);
				_this.hideLoaders();
			};
			_this.set_values = function(values) {
				_this.move_elems(values, false, true);
			};
			_this.get_values = function() {
				return _this.get_internal(_this.$target_select);
			};

			_this.loadOptions = function(filterParams, callback) {
				_this.showLoaders();
				var options = []

				var ajax = $.ajax({
					url: AQCU.constants.serviceEndpoint + "/reference/list/" + settings.lookupType + "/json",
					timeout: 120000,
					dataType: "json",
					data: filterParams,
					success: function(data) {
						for (var i = 0; i < data.length; i++) {
							options.push({
								value: data[i]["KeyValue"],
								content: data[i]["DisplayValue"]
							});
						}
						_this.populate(options, callback);
					},
					error: _this.$router.unknownErrorHandler,
					context: _this.$router
				});
				return ajax;
			}

			_this.update_values = function(callback) {
				var prevSetValues = _this.$value_field.val();
				if (prevSetValues) {
					_this.set_values(prevSetValues.split(","));
				}
				if (callback)
					callback();
			}
			/* #=============================================================================== */
			/* # Implement private functions */
			/* #=============================================================================== */
			// Cursor get/set functions based on example from
			// http://www.sitepoint.com/6-jquery-cursor-functions/
			_this.getCursorPosition = function(el) {
			    if(el.lengh == 0) return -1;
			    return _this.getSelectionStart($(el));
			};
			
			_this.getSelectionStart = function(el) {
			    if(el.lengh == 0) return -1;
			    input = el[0];
			 
			    var pos = input.value.length;
			 
			    if (input.createTextRange) {
			        var r = document.selection.createRange().duplicate();
			        r.moveEnd('character', input.value.length);
			        if (r.text == '') 
			        pos = input.value.length;
			        pos = input.value.lastIndexOf(r.text);
			    } else if(typeof(input.selectionStart)!="undefined")
			    pos = input.selectionStart;
			 
			    return pos;
			};
			
			_this.setCursorPosition = function(el, position) {
			    if(el.lengh == 0) return el;
			    return _this.setCursorSelection($(el), position, position);
			};
			
			_this.setCursorSelection = function(el, selectionStart, selectionEnd) {
			    if(el.lengh == 0) return el;
			    input = el[0];
			 
			    if (input.createTextRange) {
			        var range = input.createTextRange();
			        range.collapse(true);
			        range.moveEnd('character', selectionEnd);
			        range.moveStart('character', selectionStart);
			        range.select();
			    } else if (input.setSelectionRange) {
			        input.focus();
			        input.setSelectionRange(selectionStart, selectionEnd);
			    }
			 
			    return el;
			};
			
			_this.hideLoaders = function() {
				_this.$loaders.hide();
			};

			_this.showLoaders = function() {
				_this.$loaders.show();
			};

			_this.get_internal = function(selector) {
				var res = [];
				selector.find('option').each(function() {
					res.push($(this).val());
				})
				return res;
			};
			_this.to_dict = function(list) {
				var res = {};
				for (var i in list)
					res[list[i]] = true;
				return res;
			}
			_this.update_lists = function(force_hilite_off) {
				var old;
				if (!force_hilite_off) {
					old = [_this.to_dict(_this.get_internal(_this.$remaining_select)),
						_this.to_dict(_this.get_internal(_this.$target_select))];
				}
				
				var formParent = _this.$remaining_select.parent();
				var parentChildren = formParent.children();
				
				// Remember the cursor position in case of detachment
				var cursorPos = _this.getCursorPosition(_this.$filter_input);
				
				// Must detach the filtered remaining list and peer elements from DOM to avoid massive slowdown in Chrome 36
				if (_this.$filter_input.val()) {
					parentChildren.detach();	
				}
				
				_this.$remaining_select.empty();
				_this.$target_select.empty();
				
				var lists = [_this._remaining_list, _this._target_list];
				var source = [_this.$remaining_select, _this.$target_select];
				for (var i in lists) {
					for (var j in lists[i]) {
						var e = lists[i][j];
						if (e[1]) {
							var selected = '';
							if (!force_hilite_off && settings.hilite_selection && !old[i].hasOwnProperty(e[0].value)) {
								selected = 'selected="selected"';
							}
							source[i].append('<option ' + selected + 'value="' + e[0].value + '"' + (e[0].description ? ' title ="' + e[0].description + '"' : '') + ' >' + e[0].content + '</option>');
						}
					}
				}
				
				// Handle the case of filtering the available list
				if (_this.$filter_input.val()) {
					_this.$remaining_select.find('option').each(function() {
						var inner = _this.$filter_input.val().toLowerCase();
						var outer = $(this).html().toLowerCase();
						if (outer.indexOf(inner) == -1) {
							$(this).remove();
						}
					});
					
					// Replace detached elements
					formParent.append(parentChildren);
					_this.setCursorPosition(_this.$filter_input, cursorPos);
				}

				$('body').trigger('nwis.reporting.lists.updated');
				this.updateButtons();
			};

			_this.updateButtons = function() {
				if (_this.$remaining_select.find('option').size() > 0) {
					_this.$add_btn.addClass("selector-add-enabled");
					_this.$choose_all_btn.addClass("selector-chooseall-enabled");
				} else {
					_this.$add_btn.removeClass("selector-add-enabled");
					_this.$choose_all_btn.removeClass("selector-chooseall-enabled");
				}

				if (_this.$target_select.find('option').size() > 0) {
					_this.$remove_btn.addClass("selector-remove-enabled");
					_this.$clear_all_btn.addClass("selector-clearall-enabled");
				} else {
					_this.$remove_btn.removeClass("selector-remove-enabled");
					_this.$clear_all_btn.removeClass("selector-clearall-enabled");
				}
			};

			_this.set_hidden_value = function() {
				var value = "";
				_this.$target_select.find('option').each(function(i, o) {
					if (!value) {
						value += o.value;
					} else {
						value += "," + o.value;
					}
				})
				_this.$value_field.val(value).change();
			};

			_this.move_elems = function(values, b1, b2) {
				for (var i in values) {
					val = values[i];
					for (var j in _this._remaining_list) {
						var e = _this._remaining_list[j];
						if (e[0].value == val) {
							e[1] = b1;
							_this._target_list[j][1] = b2;
						}
					}
				}
				_this.update_lists(false);
				_this.set_hidden_value();
			};
			_this.move_all = function(b1, b2) {
				for (var i in _this._remaining_list) {
					_this._remaining_list[i][1] = b1;
					_this._target_list[i][1] = b2;
				}
				_this.update_lists(false);
				_this.set_hidden_value();
			};
			_this.data('bootstrapTransfer', _this);
			return _this;
		});
	};
	$.fn.bootstrapTransfer.defaults = {
		'height': '10em',
		'hilite_selection': true,
		'target_id': ''
	}
})(jQuery);
