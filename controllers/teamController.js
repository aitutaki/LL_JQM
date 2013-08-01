var LL = LL || {};
LL.Controllers = LL.Controllers || {};

LL.Controllers.team = (function() {

	var _initialised = false;
	var _c = {};

	function _init(cb) {

		if (!_initialised)
		{
		}

		$("#team [data-model]").each(function(idx, elem) {
			var $el = $(elem);
			var prop = $el.attr("data-model");
			$(elem).html( (_c.data[prop] || "&nbsp;") );
		});

		// Set the back button
		// $(".ll-header a.button .text").text("League").parent().show();
		$(".ll-header a.button").show();
		// Set the footer button
		$(".ll-footer .selected").removeClass("selected");
		$("#team_home").addClass("selected");

		_initialised = true;
		cb();
	}

	function _onClose() {
	}

	_c = {
		init: _init,
		onClose: _onClose,
		data: null
	};

	return _c;
})();
