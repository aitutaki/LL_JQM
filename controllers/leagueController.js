var LL = LL || {};
LL.Controllers = LL.Controllers || {};

LL.Controllers.league = (function() {

	var _initialised = false;
	var _c = {};

	function _init(cb) {

		if (!_initialised)
		{
			$("#league_home").click(function(e) {
				APP.navigate("league", false);
			});

			$("#league_clubs").click(function(e) {
				DAL.getClubs(APP.leagueContext, "", function(resp) {
					LL.Controllers.search.data = resp.data;
					LL.Controllers.search.options.display = "clubName";
					LL.Controllers.search.options.icon = "img";
					LL.Controllers.search.onClick = function(rec) {
						LL.Controllers.club.data = rec;
						APP.navigate("club", true);
					};
					APP.navigate("search", false);
				});
			});

			$("#league_teams").click(function(e) {
				DAL.getTeams(APP.leagueContext, "", function(resp) {
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

		$("#league [data-model]").each(function(idx, elem) {
			var $el = $(elem);
			var prop = $el.attr("data-model");
			$(elem).html( (_c.data[prop] || "&nbsp;") );
		});

		// Set the back button
		// $(".ll-header a.button .text").text("Home").parent().show();
		$(".ll-header a.button").show();
		// Set the footer button
		$(".ll-footer .selected").removeClass("selected");
		$("#league_home").addClass("selected");

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
