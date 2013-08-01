var LL = LL || {};
LL.Controllers = LL.Controllers || {};

LL.Controllers.search = (function() {

	var _c = {};
	var _initialised = false;
	var mode = "player";
	var $txt, $btn, $ul, $mode;

	function _init(cb) {
		$txt = $("#search_text");
		$txt.val("");

		$btn = $("#search_btnSearch");
		$ul = $("#search_results");
		$mode = $("#search_icon");

		if (!_initialised) {
			$btn.click(_filter);
			$txt.keypress(function(e) {
				if (e.keyCode === 13)
				{
					$btn.click();
				}
			});
			$txt.keyup(function(e) {
				$btn.click();
			});
			$mode.click(function(e) {
				$("#search_mode").click();
			});

			$ul.click(function(e) {
				// APP.navigate("player");
				// var idx = $(e.target).parents("li:first").index();
				var idx = 0;
				var $li = $(e.target);

				if (!$li.is("li"))
				{
					$li = $li.parents("li:first");
				}
				var idx = $li.index();

				_c.onClick(_c.data[idx]);
			});

			_initialised = true;
		}
		if (_c.data)
		{
			_showResults(_c.data);
		}
		cb();
	}

	function _showResults(data)
	{
		var html = "";
		if (data)
		{
			$ul.empty();
			for (var i=0; i < data.length; i++)
			{
				var item = data[i];
				var $li = $("<li>");
				var $a = $("<a href=\"#\"></a>");
				if (_c.options.icon) // && item[_c.options.icon])
				{
					var $i = $("<img>");
					$i.attr("src", item[_c.options.icon] || "lib/img/dummy.png");
					$i.attr("border", "0");
					$a.append($i);
				}
				$a.append("<div class=\"search_results_text\">" + item[_c.options.display] + "</div>");
				$li.append($a);
				$ul.append($li);
				// APP.dialog.close();
			}
		}
	}

	function _search() {
		if ($txt.val() === "") return false;
		APP.dialog.open($("#search_msg"));
		
		var data = {
			mode: mode,
			term: $txt.val()
		};
		DAL.search(data, _showResults);
	}

	function _filter() {
		var $li = $ul.children("li");
		var term = $txt.val();

		$li.each(function(idx, elem) {
			var rec = _c.data[idx];
			// var fnd = (rec[_c.options.display].indexOf(term) > -1);
			var fnd = (rec[_c.options.display].search(new RegExp(term, "i")) > -1);
			if (fnd)
			{
				$(elem).show();
			}
			else
			{
				$(elem).hide();
			}
		});
	}

	function _onClose() {
	}

	_c = {
		init: _init,
		onClose: _onClose,
		onClick: function(){},
		options: {
			display: "Description",
			id: "ID",
			icon: "",
		}
	};
	return _c;
})();
