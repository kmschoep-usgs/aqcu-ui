/**
 * Utility functions dealing with  the user interface
 */
AQCU.util.ui = function() {
	window.keys = [];

	window.addEventListener('keyup', function(e) {
		keys[e.keyCode] = false;
	});

	return {
		addCommas: function(nStr) {
			nStr += '';
			var x = nStr.split('.');
			var x1 = x[0];
			var x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
		},
		addGlobalHotkey: function(callback, keyValues) {
			if (typeof keyValues === "number")
				keyValues = [keyValues];

			var fnc = function(cb, val) {
				return function(e) {
					keys[e.keyCode] = true;
					AQCU.util.ui.executeHotkeyTest(cb, val);
				};
			}(callback, keyValues);
			window.addEventListener('keydown', fnc);
			return fnc;
		},
		executeHotkeyTest: function(callback, keyValues) {
			var allKeysValid = true;
			for (var i = 0; i < keyValues.length; ++i) {
				allKeysValid = allKeysValid && keys[keyValues[i]];
			}

			if (allKeysValid)
				callback();
		},
		/**
		 * Appends an event listener to DOM object and attaches a tooltip to the mouse pointer on event execution
		 * @param {type} args
		 * @returns {undefined}
		 */
		addTooltipToContainer: function(args) {
			args = args || {};

			var description = args.description,
					$container = args.container,
					position = args.position || {
						at: 'right center'
					},
			track,
					showDuration = args.showDuration || 5000;

			if (args.track !== undefined) {
				track = args.track === true;
			} else {
				track = true;
			}

			if (description && $container) {
				//hack to allow a reinitialization
				try {
					$container.tooltip('disable');
				} catch (e) {
				}
				// Create Bootstrap tooltip for node
				$container
						// title is required for JQuery UI tooltips to work
						.attr('title', description)
						.tooltip({
							content: description,
							track: track,
							position: position,
							open: args.open,
							show: {
								delay: args.showDelay || 500
							},
							open: function(event, el) {
								setTimeout(function() {
									$(el.tooltip).hide("fade");
								}, showDuration);
							}
						});
			}
		}
	};
}();