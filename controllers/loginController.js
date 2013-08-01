var LL = LL || {};
LL.Controllers = LL.Controllers || {};

LL.Controllers.login = (function() {

	var $uid, $pwd, $btn, $frm;
	var _initialised = false;

	function _init(cb) {
		APP.log("init 1");
		$(".ll-header a.button").hide();
		if (_initialised) return true;
		APP.log("init 2");

		$frm = $("#login_form");
		$uid = $("#login_uid");
		$pwd = $("#login_pwd");
		$btn = $("#login_submit");
		$tst = $("#login_test");
		APP.log("init 3");

		$btn.click(_login);
		$tst.click(_test);
		APP.log("init 4");

		_initialised = true;
		cb && cb();
	}

	function _test()
	{
		$.ajax({
			url: "http://leagueligh1.eweb801.discountasp.net/api/leagues",
			contentType: "application/json",
			dataType: "json",
			success: function(data, textStatus, jqHXR) {
				alert(JSON.stringify(data));
			}
		});
	}

	function _login(e)
	{
		e.preventDefault();
		e.stopImmediatePropagation();
		APP.log("1");
		if ($frm[0].checkValidity())
		{
		APP.log("2");
			DAL.login($uid.val(), $pwd.val(), _login_cb);
		}
		else
		{
			APP.log("2.1");
		}
	}

	function _login_cb(resp)
	{
		APP.log("3");
		if (resp instanceof DALResponse)
		{
		APP.log("4");
			if (resp.status == 200)
			{
		APP.log("5");
				APP.userID = resp.data.ID;
				// $(".ll-footer").removeClass("hide");
				APP.navigate("home", true);
			}
			else
			{
		APP.log("6");
			}
		}
		else
		{
			throw "Unknown response.";
		}
	}

	function _onClose() {
	}

	return {
		init: _init,
		onClose: _onClose
	};
})();
