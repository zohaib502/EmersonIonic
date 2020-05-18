

//*************************  Environment **********************************/

/**
 *
 * Change env to following
 * dev = development
 * prod = production
 * qa = qa
 */

var env = 'dev';

var local = {
  bucket_url: null,
  config_url: null,
  files: null,
  hardVersion: null,
  softVersion: null,
  localPath: null,
  assetPath: null,
  phVar1: null,
  phVar2: null,
  phVar3: null,
  old_softVersion: null
}


local.hardVersion = '7.0.4.1';

////////////////////////////////////////////////////////


/////////////////  CONFIG SETTINGS //////////////////
var updateConfig = {
  dev: {
    config_url: 'https://s3.us-east-2.amazonaws.com/emerson-app-update/dev/app-config.json',
    bucket_url: 'https://s3.us-east-2.amazonaws.com/emerson-app-update/dev/'
  },
  crp: {
    config_url: 'https://s3.us-east-2.amazonaws.com/emerson-app-update/crp/app-config.json',
    bucket_url: 'https://s3.us-east-2.amazonaws.com/emerson-app-update/crp/'
  },
  fat: {
    config_url: 'https://s3.us-east-2.amazonaws.com/emerson-app-update/fat/app-config.json',
    bucket_url: 'https://s3.us-east-2.amazonaws.com/emerson-app-update/fat/'
  },
  tst3: {
    config_url: 'https://s3.us-east-2.amazonaws.com/emerson-app-update/tst3/app-config.json',
    bucket_url: 'https://s3.us-east-2.amazonaws.com/emerson-app-update/tst3/'
  },
  prod: {
    config_url: 'https://s3.us-east-2.amazonaws.com/emerson-app-update/prod/app-config.json',
    bucket_url: 'https://s3.us-east-2.amazonaws.com/emerson-app-update/prod/'
  },
  qa: {
    config_url: 'https://s3.us-east-2.amazonaws.com/emerson-app-update/qa/app-config.json',
    bucket_url: 'https://s3.us-east-2.amazonaws.com/emerson-app-update/qa/'
  }
}

/////////////////////////////////////////////////// End Environment //////////////////////////////////////////////////////


////////////////////////////////////  localDB ///////////////////////////////////////////////////////////////////////

var localDB = null;

document.addEventListener('deviceready', function () {
  localDB = window.sqlitePlugin.openDatabase({
    name: 'localDB.sqlite',
    location: 'default',
  });

  initLocalDB();

});


function initLocalDB() {
  localDB.executeSql("SELECT * FROM localStore", [], function (rs) {
    console.log('+++++++++ LOCAL DB FOUND ++++++++++ ', rs.rows);
    updateInitValuesInDB()
  }, function (error) {
    createLocalStateTable();
    console.log('XXXXXXXXXX LOCALDB NOT FOUND XXXXXXXXXX ', error.message);
  });
}

function createLocalStateTable() {
  localDB.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS localStore (key	TEXT, value	BLOB)');
    tx.executeSql("INSERT INTO localStore ('key') VALUES ('bucket_url'),('config_url'),('files'),('hardVersion'),('softVersion'),('localPath'),('assetPath'),('phVar1'),('phVar2'),('phVar3'),('old_softVersion')");
  }, function (error) {
    console.log('localStore Creation ERROR: ' + error.message);
  }, function () {
    console.log('LocalDB localStore Created  OK');
    updateInitValuesInDB();
  });
}


function updateInitValuesInDB() {

  localDB.transaction(function (tx) {
    tx.executeSql("UPDATE localStore SET value = '" + updateConfig[env].config_url + "' WHERE key = 'config_url'");
    tx.executeSql("UPDATE localStore SET value = '" + updateConfig[env].bucket_url + "' WHERE key = 'bucket_url'");
    tx.executeSql("UPDATE localStore SET value = '" + local.hardVersion + "' WHERE key = 'hardVersion'");
  }, function (error) {
    console.log('updateInitValuesInDB ERROR: ' + error.message);
  }, function () {
    console.log('DB initially updated  OK');
    setLocalValuesFromDB();
  });

}


function setLocalValuesFromDB() {
  var q = "SELECT * FROM localStore";
  localDB.executeSql(q, [], function (rs) {

    try {
      for (var i = 0; i < rs.rows.length; i++) {
        this.local[rs.rows.item(i).key] = rs.rows.item(i).value;
      }
      continueAfterInit();
      console.log('setLocalValuesFromDB ', rs.rows);
    } catch (error) {
      console.log(error.message);
    }
  }, function (error) {
    console.log('setLocalValuesFromDB ERROR: ', error.message);
  });
}



function setLocalDBItem(key, value) {

  var q = "UPDATE localStore SET value = '" + value + "' WHERE key = '" + key + "'";

  localDB.executeSql(q, [], function (rs) {
    console.log('localDB item Set ');
  }, function (error) {
    console.log('LOCALDB SQL statement SET ERROR: ', error.message);
  });
}

function getLocalDBItem(key) {
  var q = "SELECT * from localStore WHERE key = '" + key + "'";
  localDB.executeSql(q, [], function (rs) {
    if (rs.rows.length > 0) {
      console.log('localDB item get ' + rs.rows.item(0).key + " = ", rs.rows.item(0).value);
      return rs.rows.item(0).value;
    } else {
      console.log('Key Not Found.');
      return null;
    }

  }, function (error) {
    console.log('LOCALDB SQL statement GET ERROR: ', error.message);
  });
}






function continueAfterInit() {

  console.log("Environment is Set");


  setTimeout(function ($this) {
    try {
      $this.setInitVars();
    } catch (error) {
      console.log(error.message);
    }
  }, 1000, this);

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var jsonConfigUrl = '';


var configObj = {};

var appendPath = true;

var localDebug = false;



function setInitVars() {
  jsonConfigUrl = updateConfig[env].config_url;
  try {
    if (local.softVersion == null || local.softVersion == '' || local.softVersion == undefined) {
      local.softVersion = local.hardVersion;
      setLocalDBItem('softVersion', local.hardVersion);
    }
  } catch (error) {
    console.log(error.message);
  }


  setTimeout(function ($this) {
    try {
      $this.initAppLoading();
    } catch (error) {
      console.log(error.message);
    }
  }, 2000, this);


}





console.log("Init is loaded");


console.log("=========================  Inscript    ===============");

function initAppLoading() {

  try {
    console.log("CONFIG URL ::" + jsonConfigUrl);
    console.log("softVersion ::" + local.softVersion);
    console.log("hardVersion ::" + local.hardVersion);
    console.log("=========================  Init    ===============");

    loadConfig(function (response) {

      // Parse JSON string into object
      configObj = JSON.parse(response);

      setConfigLocalDB();
      console.log("=========================  config    ===============", configObj);


      loadFiles();


    }, function () {
      errorOnLoadConfig();
    });
  } catch (error) {
    errorOnLoadConfig();
    console.log(error.message);
  }
};



function loadFiles() {
  var ScriptLoader = new cScriptLoader(getFilesWithPath(configObj.files));
  ScriptLoader.loadFiles();
}


function errorOnLoadConfig() {
  try {
    if (!configObj.hardVersion) {
      configObj.softVersion = local.softVersion;
      configObj.hardVersion = local.hardVersion;
      configObj.files = local.files ? local.files.split(',') : ['build/main.css', 'build/vendor.js', 'build/main.js'];
    }
    configObj.localPath = local.localPath;
    if (local.softVersion != local.hardVersion) {
      appendPath = true;
    } else {
      appendPath = false;
    }

    loadFiles();
  } catch (error) {
    console.log(error.message);
  }
}


function setConfigLocalDB() {
  setLocalDBItem('files', configObj.files);
  configObj.localPath = local.localPath;

  if (configObj.localPath == null || configObj.localPath == 'null') {
    appendPath = false;
  }

  if (local.softVersion == local.hardVersion) {
    appendPath = false;
  }


  if (localDebug) {
    appendPath = false;
  }
}



function getFilesWithPath(files) {
  var aFiles = []
  try {
    if (appendPath) {
      for (var i = 0; i < files.length; i++) {
        aFiles.push(configObj.localPath + local.softVersion + '/' + files[i]);
      }
      console.log("AppendPath:: ", aFiles);

      setLocalDBItem('assetPath', configObj.localPath + local.softVersion + '/');
      return aFiles;
    } else {
      console.log("NormalPath:: ", aFiles);
      setLocalDBItem('assetPath', '');
      return files;
    }
  } catch (error) {
    console.log(error.message);
  }

}

function loadConfig(callback, errorCallback) {

  console.log('final call : ', jsonConfigUrl);
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");

  xobj.open('GET', jsonConfigUrl + '?nocache=' + (new Date()).getTime(), true); // Replace 'my_data' with the path to your file
  /*xobj.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
  xobj.setRequestHeader('cache-control', 'max-age=0');
  xobj.setRequestHeader('expires', '0');
  xobj.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
  xobj.setRequestHeader('pragma', 'no-cache');*/

  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    } else if (xobj.readyState != 4 && xobj.status != "200" || xobj.status == "0") {
      console.log("Error Loading Config! ", xobj.status, xobj.readyState);
      errorCallback();
    }
  };
  xobj.send(null);
}



function getOS() {
  var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'],
    os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'MacOS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}



var cScriptLoader = (function () {
  function cScriptLoader(files) {
    var _this = this;
    this.log = function (t) {
      console.log("ScriptLoader: " + t);
    };
    this.withNoCache = function (filename) {
      if (filename.indexOf("?") === -1)
        filename += "?no_cache=" + new Date().getTime();
      else
        filename += "&no_cache=" + new Date().getTime();
      return filename;
    };
    this.loadStyle = function (filename) {
      // HTMLLinkElement
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = _this.withNoCache(filename);
      _this.log('Loading style ' + filename);
      link.onload = function () {
        _this.log('Loaded style "' + filename + '".');
      };
      link.onerror = function () {
        _this.log('Error loading style "' + filename + '".');
      };
      _this.m_head.appendChild(link);
    };
    this.loadScript = function (i) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = _this.withNoCache(_this.m_js_files[i]);
      var loadNextScript = function () {
        if (i + 1 < _this.m_js_files.length) {
          _this.loadScript(i + 1);
        }
      };
      script.onload = function () {
        _this.log('Loaded script "' + _this.m_js_files[i] + '".');
        loadNextScript();
      };
      script.onerror = function () {
        _this.log('Error loading script "' + _this.m_js_files[i] + '".');
        loadNextScript();
      };
      _this.log('Loading script "' + _this.m_js_files[i] + '".');
      _this.m_head.appendChild(script);
    };
    this.loadFiles = function () {
      // this.log(this.m_css_files);
      // this.log(this.m_js_files);
      for (var i = 0; i < _this.m_css_files.length; ++i)
        _this.loadStyle(_this.m_css_files[i]);
      _this.loadScript(0);
    };
    this.m_js_files = [];
    this.m_css_files = [];
    this.m_head = document.getElementsByTagName("head")[0];

    // this.m_head = document.head; // IE9+ only
    function endsWith(str, suffix) {
      if (str === null || suffix === null)
        return false;
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    for (var i = 0; i < files.length; ++i) {
      if (endsWith(files[i], ".css")) {
        this.m_css_files.push(files[i]);
      }
      else if (endsWith(files[i], ".js")) {
        this.m_js_files.push(files[i]);
      }
      else
        this.log('Error unknown filetype "' + files[i] + '".');
    }
  }

  return cScriptLoader;
})();
