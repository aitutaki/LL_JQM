var APP = (function() {
	var _scr;
	var _dlg;
	var _overlay;

	var _sndClick = new Audio("lib/sound/click.wav");
	var _breadcrumb = [];

	function _log(txt)
	{
		console.log("*** LL *** [" + txt + "]");
	}

	function _init()
	{
		/*
		_scr = new iScroll('ll-scroll', {
			useTransform: false,
			onBeforeScrollStart: function (e) {
				var target = e.target;
				while (target.nodeType != 1) target = target.parentNode;

				if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
					e.preventDefault();
				}
			});
		*/
		$(".ll-header a.button").click(function(e) {
			APP.previous();
		});

		DAL.onError = function(resp) {
			UTILS.msgbox(resp.message, "Error");
		};

		_overlay = $("#ll-overlay");

		$(".ll-footer-btn").click(function(e) {
			$(".ll-footer-btn.selected").removeClass("selected");
			$(e.currentTarget).addClass("selected");
		});

		$("#btnHome").click(function(e) {
			_nav("home");
		});

		$("#btnSearch").click(function(e) {
			_nav("search");
		});

		$("#btnPhoto").click(function(e) {
			UTILS.msgbox("Where do you wish to get a photo from?", "Photo", [
				UTILS.MSGBOXBUTTON("Camera", _camera),
				UTILS.MSGBOXBUTTON("Gallery", _gallery)
			]);
		});

	}

	function _playSound()
	{
	}

	function _camera() {
		UTILS.Photo.getFromCamera(function(fn) {
			UTILS.msgbox(fn);
		});
	}

	function _gallery() {
		UTILS.Photo.getFromGallery(function(fn) {
			UTILS.msgbox(fn);
		});
	}

	function _nav(pg, addToBreadcrumb)
	{
		addToBreadcrumb = addToBreadcrumb || false;

		if (ret.controller)
		{
			ret.controller.onClose && ret.controller.onClose();
		}

		if (ret.view)
		{
			ret.view.removeClass("active");
		}
		ret.view = $("#" + pg);
		ret.controller = LL.Controllers[pg];
		ret.controller.init(function() {
			if (addToBreadcrumb)
			{
				_breadcrumb.push(pg);
			}
			$.mobile.changePage("#" + pg);
			/*
			ret.view.addClass("active");
			if (ret.footer && ret.view.attr("data-footer") == "false") ret.footer.addClass("hide");
			if (ret.view.attr("data-footer"))
			{
				if (ret.footer) ret.footer.addClass("hide");
				ret.footer = $("#" + ret.view.attr("data-footer")).removeClass("hide").find("a:first").addClass("selected");
			}
			*/
			// _sndClick.play();
		});
	}

	function _prev()
	{
		_breadcrumb.pop();
		var pg = _breadcrumb[_breadcrumb.length - 1];
		_nav(pg, false);
	}

	function _dlgO($el)
	{
		_dlg = $el;
		_overlay.removeClass("hide");
		$el.removeClass("hide");
		$el.css("z-index", 9000);
	}

	function _dlgC()
	{
		_dlg.addClass("hide");
		_overlay.addClass("hide");
	}

	// Public interface
	var ret = {
		log: _log,
		imagePath : "http://leagueligh1.eweb801.discountasp.net/Images/Uploads/150/",
		controller: null,
		view: null,
		scroller: _scr,
		init: _init,
		navigate: _nav,
		previous: _prev,
		dialog: {
			open: _dlgO,
			close: _dlgC
		}
	};

	return ret;
})();
