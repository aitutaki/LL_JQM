var LL = LL || {};
LL.Controllers = LL.Controllers || {};

LL.Controllers.player = (function() {

	var _initialised = false;

	function _init() {
		if (_initialised) return true;

		_initialised = true;
	}

	function _onClose() {
	}

	return {
		init: _init,
		onClose: _onClose
	};
})();
