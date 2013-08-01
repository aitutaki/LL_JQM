var LL = LL || {};
LL.Controllers = LL.Controllers || {};

LL.Controllers.club = (function() {

	var _initialised = false;
	var _c = {};

	function _init(cb) {

		if (!_initialised)
		{
			$("#club_teams").click(function(e) {
				DAL.getClubTeams(_c.data.clubID, "", function(resp) {
					LL.Controllers.search.data = resp.data;
					LL.Controllers.search.options.display = "teamName";
					LL.Controllers.search.options.icon = "img";
					LL.Controllers.search.onClick = function(rec) {
						LL.Controllers.team.data = rec;
						APP.navigate("team", true);
					};
					APP.navigate("search", false);
				});
			});
		}

		$("#club [data-model]").each(function(idx, elem) {
			var $el = $(elem);
			var prop = $el.attr("data-model");
			$(elem).html( (_c.data[prop] || "&nbsp;") );
		});

		// Set the back button
		// $(".ll-header a.button .text").text("League").parent().show();
		$(".ll-header a.button").show();
		// Set the footer button
		$(".ll-footer .selected").removeClass("selected");
		$("#club_home").addClass("selected");

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
