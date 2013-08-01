var UTILS = (function() {
	var _this = this;
	var _includes = [];

	_this.photoPath = "EPLC_Photos/";

	function _msgboxbutton(text, cb)
	{
	/// <field name="_msgboxbutton" type="function">Button class for use by msgbox()</field>
	/// <param name="text" type="String">Text to display on the button.</param>
	/// <param name="cb" type="function">Function to call when the button is clicked.</param>
	  function nowork() {};
	  
	  this.text = text;
	  this.cb = cb || nowork;
	}

	function _msgbox(text, title, btns)
	{
	    /// <summary name="_msgbox" type="function">Abstracts use of alert() and confirm()</summary>
        /// <param name="text" type="String">Text to display as the message.</param>
        /// <param name="title" type="String">Text to display as the window title.</param>
        /// <param name="btns" type="Array">Array of EPLC.Utils.MSGBOXBUTTON.</param>
	  var lbls = "";
	  if (typeof title == "undefined") title = "EIMS";
	  if (typeof btns == "undefined" || btns.length == 0) btns = [new _msgboxbutton("OK", function(){})];

	  if (navigator.notification)
	  {
		if (btns.length == 1)
		{
		  navigator.notification.alert(text, btns[0].cb, title, btns[0].text);
		}
		else if (btns.length > 1)
		{

		  var checkDeviceMsgbox = device.platform;
		  //Check if device is android - This check fixes the YES/NO order issue.
		  if (checkDeviceMsgbox == 'Android') {
			  //btns.reverse();
		  }

		  for (var i=0; i < btns.length; i++)
		  {
			if (i > 0) lbls += ",";
			lbls += btns[i].text;
		  }
		  navigator.notification.confirm(text, function(idx) {
			var cb = btns[idx - 1].cb;
			if (cb) cb();
		  }, title, lbls);
		  
		  
		}
		else
		{
		  throw "msgbox: Unspported buttons array";
		}
	  }
	  else
	  {
		if (btns.length == 1)
		{
		  // This is a standard alert
		  alert (text);
		  if (btns[0].cb()) btns[0].cb();
		}
		else if (btns.length == 2)
		{
		  // Assume this to be a yes/no confirm box
		  var result = confirm(text);
		  if (result)
		  {
			if (btns[0].cb()) btns[0].cb();
		  }
		  else
		  {
			if (btns[1].cb()) btns[1].cb();
		  }
		}
		else
		{
		  throw "msgbox: Unspported buttons array";
		}
	  }
	}

	function _hasConnection(is2GOK)
	{
	    /// <summary name="hasConnection" type="function">Simple function for signal checking. Returns boolean.</summary>
	  var conn = null;
	  var ok = true;
	  device = (typeof device != "undefined") ? device : {};
      var platform = device.platform || "";
	  
	  is2GOK = is2GOK || false;
		
	  if (navigator &&
		  navigator.network &&
		  navigator.network.connection)
	  {
		conn = navigator.network.connection.type;
	  }
	  
	  if (conn && Connection)
	  {
		if (platform == "iPhone" || platform == "iPad" || platform == "iOS")
		{
		  // iPhone can only report 2G (and wifi apparently)
		  if (conn === Connection.CELL_2G || conn === Connection.WIFI)
		  {
			ok = true;
		  }
		  else
		  {
			ok = false;
		  }
		}
		else
		{
		  
		  if (conn == Connection.NONE || conn == Connection.UNKNOWN)
		  {
			ok = false;
		  }
		  else
		  {
			if (conn == Connection.CELL_2G && (!is2GOK))
			{
			  ok = false;
			}
			else
			{
			  ok = true;
			}
		  }
		}
	  }
	  return ok;
	}

	function _includeFiles(selector, cb)
	{
	    /// <summary name="include" type="function">Includes content from external files denoted by the [data-include] attribute.</summary>
	    /// <param name="selector" type="String">Selector within which to find required content.</param>
	    /// <param name="cb" type="function">Function to call upon completion of an individual inclusion, receives the DOM element in a jQuery wrapper.</param>

		selector = selector || "body";
		$(selector).find("[data-include]:empty").each(function(idx, elem) {
			var $elem = $(elem);
			var url = $elem.attr("data-include");
			var fnd = false;

			// Check if we've already loaded this file.
			for (var i=0; i < _includes.length; i++)
			{
				if (_includes[i].url == url)
				{
					fnd = true;
					$elem.html(_includes[i].html);
					cb($elem);
					break;
				}
			}

			if (!fnd)
			{
				$elem.load(url, function(response, stat, xhr) {
					if (xhr.status == 200)
					{
						_includes.push({"url": url, html: $elem.html() });
						cb($elem);
					}
					else
					{
						throw "File '" + url + "' could not be included.";
					}
				});
			}
		});
	}

	function _downloadFile(url)
	{
	    /// <summary name="_downloadFile" type="function">Redirects the WebView to a given URL, if this is a non-displayable file, it will be downloaded</summary>
        /// <param name="url" type="string">URL to the file to download</param>
	    var platform = "PC";
	    var checkDevice = "PC";
	    var osVersion = 1;

	    if (device)
	    {
	        osVersion = parseFloat(device.version, 10);
	        platform = device.platform;
	        checkDevice = device.platform;
	        if (platform === "iOS")
	        {
	            platform = device.name;
	        }
	    }
    
	    if (platform == "Android" && navigator && navigator.app)
	    {
	        navigator.app.loadUrl(url, { openExternal:true } );
	    }
	    else
	    {
	        if (checkDevice == 'iPhone' || checkDevice == 'iPad') {
	            if (osVersion >= 6)
	            {
	                window.open(url, '_blank', 'location=yes');
	            }
	            else
	            {
	                window.location.href = url;
	            }
	        }
	    }
	}


	function _takePhoto(useCamera, cb, fn)
	{
	    /// <summary name="_takePhoto" type="function">Takes a photo using the device's camera. Returns the filename to the callback.</summary>
	    /// <param name="cb" type="function">Callback method, receives the filename of the image.</param>
	    var lvl = 0;

	    // We need to do a special-case for IOS devices.
	    if ((!Camera) || (!navigator.camera))
	    {
	        throw "PhoneGap required.";
	    }
	    var iOS = (device.platform === "iPhone" || device.platform === "iPad");

	    function onFail(msg)
	    {
	        if (msg != "Camera cancelled." && msg != "Selection cancelled." && msg != "no image selected")
	        {
	            _msgbox("Unable to take photo. " + lvl + " : " + msg, "Photo");
	        }
	    }

	    function createFileEntry(imageURI)
	    {
	        window.resolveLocalFileSystemURI(imageURI, copyPhoto, onFail);
	    }

	    function copyPhoto(fileEntry)
	    {
	        lvl = 1;
	        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys)
	        {
	            lvl = 2;
	            fileSys.root.getDirectory(_this.photoPath, { create: true, exclusive: false }, function (dir)
	            {
	                lvl = 3;
	                var d = new Date();
	                var ar = fileEntry.name.split(".");
	                var ext = ar[ar.length - 1];
	                fn = fn || d.valueOf();

	                lvl = 4;
	                fileEntry.copyTo(dir, fn + "." + ext,
                        function (f)
                        {http://localhost:22164/WOR/client/default/images
                            var ret = "";
                            if (_this.photoPath[_this.photoPath.length - 1] === "/")
                                ret = _this.photoPath + fn + "." + ext
                            else
                                ret = _this.photoPath + "/" + fn + "." + ext;
                            cb(ret);
                            //cb(f.fullPath);
                        }, onFail);
	            }, onFail);
	        }, onFail);
	    }

	    var settings = {
	        quality: 50,
	        destinationType: Camera.DestinationType.FILE_URI,
	        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
	        correctOrientation: true,
          targetWidth: 800,
          targetHeight: 600
	    };

	    //settings.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;

	    if (useCamera) settings.sourceType = Camera.PictureSourceType.CAMERA;
	    navigator.camera.getPicture(
            // Success handler
            function (url)
            {
                createFileEntry(url);
                /*
                if (iOS)
                {
                    createFileEntry(url);
                }
                else
                {
                    //cb(url);
                    var ar = url.split("/");
                    var ret = ar[ar.length-1];
                    cb && cb(_this.photoPath + ret);
                }
                */
            }, onFail, settings);
	}

	function _readBinaryData(fn, cbOK, cbFail)
	{
	    /// <summary name="readBinaryData" type="function">Reads a photo file and returns the binary data to a callback.</summary>
	    /// <param name="fn" type="function">File to read.</param>
	    /// <param name="cbOK" type="function">Callback method called if the file was read successfully. Receives the binary data and the filename.</param>
	    /// <param name="cbFail" type="function">Callback method called if the file read failed.</param>
	    if (fn.indexOf('file:') != -1)
	    {
	        console.log("replaced file path...");//Iphone specific?
	        fn = /file:\/\/.*?(\/.*)/.exec(fn)[1];
	    }

	    // Create a file reader
	    var reader = new FileReader();

	    // On load complete we return the resulting data
	    reader.onload = function (evt)
	    {
	        if (evt.target.result && evt.target.result !== null && evt.target.result !== '')
	        {
	            // Data is two chunks comma seperated so get data by splitting at comma
	            var dataStr = evt.target.result;
	            var split = dataStr.split(',');
	            cbOK(split[1], fn);
	        }
	    };

	    // On error display an error
	    reader.onerror = function (evt)
	    {
	        console.log('There was an error reading the file: ' + fn + ":" + JSON.stringify(evt));
	        _msgbox("There was an error reading the file: " + fn, "Photo", [
                    new _msgboxbutton("OK", function() { cbFail(fn); })
	            ]);
	        cbFail(fn);
	    };

	    // Read the supplied file URI
	    reader.readAsDataURL(fn);
	}

	function _removePhoto(fn, cbOK, cbFail)
	{
	    /// <summary name="removePhoto" type="function">Removes a photo file from the device (nothing specific about photos here really).</summary>
	    /// <param name="fn" type="function">File to remove.</param>
	    /// <param name="cbOK" type="function">Callback method called if the file was removed successfully.</param>
	    /// <param name="cbFail" type="function">Callback method called if the file removal failed.</param>
	    var lvl = 0;

	    function err(e)
	    {
	        console.log("Unable to remove temp photo file: " + fn + " [" + lvl + "] \n\n" + JSON.stringify(e || {}));
	        cbFail && cbFail(fn);
	    }

	    function delFile(f)
	    {
	        lvl = 2;
	        f.remove(function (fe)
	        {
	            cbOK(fn);
	            return;
	        }, err);
	    }

	    try
	    {
	        lvl = 1;
	        if (fn.substr(0, 8).toLowerCase() !== "file:///")
	        {
	            fn = "file:///" + fn;
	        }
	        
	        //window.resolveLocalFileSystemURI(fn, delFile, err);
	        delFile(fn);
	    }
	    catch (e)
	    {
	        err();
	    }
	}

	function _readLocalStorage(key, cb)
	{
	    /// <summary name="_readLocalStorage" type="function">Reads an individual key from Local Storage.</summary>
	    /// <param name="key" type="String">Key to read.</param>
	    /// <param name="cb" type="function">Callback method called upon read, passed the read data.</param>
	    var ret = window.localStorage.getItem(key);
	    if (cb) cb(ret);
	}

	function _saveLocalStorage(key, data, cb)
	{
	    /// <summary name="_saveLocalStorage" type="function">Saves an individual key to Local Storage.</summary>
	    /// <param name="key" type="String">Key to write.</param>
	    /// <param name="data" type="String">Data to write to Local Storage.</param>
	    /// <param name="cb" type="function">Callback method called upon save.</param>
	    window.localStorage.setItem(key, data);
	    if (cb) cb();
	}

	function _getAbsPath(fn, cb)
	{
	    /// <summary name="getAbsolutePath" type="function">Get absolute path from a relative path.</summary>
	    /// <param name="fn" type="String">Relative path to convert.</param>
	    /// <param name="cb" type="function">Callback method, receives the  full filename and an optional error code.</param>
	    if (typeof LocalFileSystem === "undefined")
	    {
	        cb && cb(fn);
	        return false;
	    }
	    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem)
	    {
	        fileSystem.root.getFile(fn, null,
                // Success, got the file
                function (fe)
                {
                    cb && cb(fe.fullPath);
                },
                // Failed to locate file
                function (e)
                {
                    cb && cb(null, e.code);
                });
	    }, function (e)
	    {
	        cb && cb(null, e.code);
	    });
	}

	return {

	    msgbox: _msgbox,
	    MSGBOXBUTTON: _msgboxbutton,
	    hasConnection: _hasConnection,
	    include: _includeFiles,
        downloadFile: _downloadFile,

	    /// <field name="FileSystem" type="Object">Namespace for File System-specific functionality.</param>
	    FileSystem: {
	        /// <field name="getAbsolutePath" type="function">Get absolute path from a relative path.</param>
	        /// <param name="fn" type="String">Relative path to convert.</param>
	        /// <param name="cb" type="function">Callback method, receives the  full filename and an optional error code.</param>
	        getAbsolutePath: _getAbsPath
	    },

        /// <field name="Photo" type="Object">Namespace for Photo-specific functionality.</param>
	    Photo: {
	        /// <field name="filePath" type="String">Path where photos will be stored on iOS devices.</param>
	        filePath: _this.photoPath,
	        /// <field name="getFromGallery" type="function">Takes a photo using the device's camera. Returns the filename to the callback.</param>
	        getFromCamera: function (cb, fn) { _takePhoto(true, cb, fn) },

	        /// <field name="getFromGallery" type="function">Takes a photo using the device's gallery. Returns the filename to the callback.</param>
	        /// <param name="cb" type="function">Callback method, receives the filename of the image.</param>
	        getFromGallery: function (cb, fn) { _takePhoto(false, cb, fn) },

	        /// <field name="readBinaryData" type="function">Reads a photo file and returns the binary data to a callback.</param>
	        /// <param name="fn" type="function">File to read.</param>
	        /// <param name="cbOK" type="function">Callback method called if the file was read successfully. Receives the binary data and the filename.</param>
	        /// <param name="cbFail" type="function">Callback method called if the file read failed.</param>
	        readBinaryData: _readBinaryData,

	        /// <field name="removePhoto" type="function">Removes a photo file from the device (nothing specific about photos here really).</param>
	        /// <param name="fn" type="function">File to remove.</param>
	        /// <param name="cbOK" type="function">Callback method called if the file was removed successfully.</param>
	        /// <param name="cbFail" type="function">Callback method called if the file removal failed.</param>
            removePhoto: _removePhoto
		},
	    Storage: {
            /// <field name="Storage" type="object">Namespace for storage-related methods.</field>
		    load: _readLocalStorage,
            save: _saveLocalStorage
		}
	};
})();
