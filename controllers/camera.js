const Product = require('../models/product');
//const Cart = require('../models/cart');
const request = require('request');

const xml2js = require('xml2js');
const parser = new xml2js.Parser({
  attrkey: "ATTR"
});
const mongoose = require('mongoose');

mongoose.connect(
  'mongodb://localhost:27017/regis', {
    useNewUrlParser: true,
  },
);
mongoose.Promise = global.Promise;

const Save = require('../models/save');
const Demo = require('../models/demo');

/** GLOBAL VARIABLE SX-80 IP Address */
var sx80_ip = "10.1.110.140";

exports.zoom = (req, res, next) => {
  console.log("startStop");
  const ip = req.params.ip;
  var options = {
    'method': 'GET',
    'url': 'http://'+ ip +'/cgi-bin/aw_ptz?cmd=%23Z80&res=1',
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.send("ok");
  });
}

exports.dezoom = async (req, res, next) => {
  const ip = req.params.ip;
  var options = {
    'method': 'GET',
    'url': 'http://'+ ip +'/cgi-bin/aw_ptz?cmd=%23Z20&res=1',
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.send("ok");
  });
}

exports.stopZoom = (req, res, next) => {
  console.log("zoomStop");
  const ip = req.params.ip;
  var options = {
    'method': 'GET',
    'url': 'http://'+ ip +'/cgi-bin/aw_ptz?cmd=%23Z50&res=1',
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.send("ok");
  });
}

exports.zoomExtremum = async (req, res, next) => {
  var ip = req.body.ip;
  var extremum = req.body.extremum;
  var value = "";
  if (extremum == "max") {
    value = "FFF";
  } else if (extremum == "min") {
    value = "555";
  }
  var options = {
    'method': 'GET',
    'url': 'http://' + ip + '/cgi-bin/aw_ptz?cmd=%23AXZ' + value + '&res=1',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log('reponse zoom: ' + response.body);
    res.send("ok");
  });


}

exports.left = async (req, res, next) => {
  const ip = req.params.ip;
  var options = {
    'method': 'GET',
    'url': 'http://'+ ip +'/cgi-bin/aw_ptz?cmd=%23PTS2050&res=1',
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.send("ok");
  });
}

exports.right = async (req, res, next) => {
  const ip = req.params.ip;
  var options = {
    'method': 'GET',
    'url': 'http://'+ ip +'/cgi-bin/aw_ptz?cmd=%23PTS8050&res=1',
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.send("ok");
  });
}

exports.stopPanTilt = async (req, res, next) => {
  const ip = req.params.ip;
  var options = {
    'method': 'GET',
    'url': 'http://'+ ip +'/cgi-bin/aw_ptz?cmd=%23PTS5050&res=1',
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.send("ok");
  });
}

exports.up = async (req, res, next) => {
  const ip = req.params.ip;
  var options = {
    'method': 'GET',
    'url': 'http://'+ ip +'/cgi-bin/aw_ptz?cmd=%23PTS5080&res=1',
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.send("ok");
  });
}

exports.down = async (req, res, next) => {
  const ip = req.params.ip;
  var options = {
    'method': 'GET',
    'url': 'http://'+ ip +'/cgi-bin/aw_ptz?cmd=%23PTS5020&res=1',
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.send("ok");
  });
}

exports.center = (req, res, next) => {
  const ip = req.params.ip;
  var options = {
    'method': 'GET',
    'url': 'http://' + ip + '/cgi-bin/aw_ptz?cmd=%23APC80008000&res=1',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.send("ok");
  });
}

exports.test = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);
}

exports.getAdvanced = (req, res, next) => {
  const demoName = (req.query.demoName != undefined) ? req.query.demoName : "";
  Product.fetchAll(products => {
    getKrammerConfig().then(async config => {
      res.render('regis/advanced', {
        cameras: products,
        pageTitle: 'Regis',
        krammerConfig: config,
        sx80Config: await getMainVideoSourceAndshareSource(sx80_ip),
        demoList: await getAllDemo(),
        demoName: demoName,
        path: '/'
      });
    })
  });
};

exports.getScenario = (req, res, next) => {
  getSaves().then(save => {
    res.render('regis/scenario', {
      saves: save,
      pageTitle: 'Scene',
      path: '/scenario'
    });
  });
};

exports.getDemo = (req, res, next) => {
  getAllDemo().then(demoDocs => {
    res.render('regis/demo', {
      demoList: demoDocs,
      pageTitle: 'demo',
      path: '/demo'
    });
  });
};

exports.getDemoById = async (req, res, next) => {
  const demoId = req.params.id;
  const edit = (req.query.edit === "true") ? true : false;
  const demo = await Demo.findById(demoId);
  if (!demo) {
    return res.redirect('/');
  }
  const ids = demo.scene;
  const demoName = demo.name;
  Save.find().where('_id').in(ids).exec(async (err, records) => {
    var list = await sortListWithIds(records, ids);
    var allDemo = await getAllDemo();
    res.render('regis/scene-of-demo', {
      saves: list,
      pageTitle: 'Scene',
      path: '/scene-of-demo',
      demoId: demoId,
      demoName: demoName,
      demoList: allDemo,
      edit: edit
    });
  });
};

exports.getSortDemo = async (req, res, next) => {
  const demoId = req.body.demoId;
  const demo = await Demo.findById(demoId);
  if (!demo) {
    return res.redirect('/');
  }
  const ids = demo.scene;
  const demoName = demo.name;
  Save.find().where('_id').in(ids.reverse()).exec(async (err, records) => {
    //mongoose ne renvoi pas les documents dans le meme ordre que ma list de ids
    var list = await sortListWithIds(records, ids);
    res.render('regis/sort-demo', {
      scenes: list,
      pageTitle: 'Sort Scene',
      path: '/sort-demo',
      demoId: demoId,
      demoName: demoName,
      listIdScene: ids
    });
  });
};

exports.setPreset = (req, res, next) => {
  var presetNumber = req.body.preset;
  const ip = req.body.ip;
  setPreset(ip, presetNumber, res);
};

exports.savePreset = (req, res, next) => {
  var presetNumber = req.body.preset;
  const ip = req.body.ip;
  savePreset(ip, presetNumber, res);
};

exports.setMainVideoSource = async (req, res, next) => {
  var source = req.body.mainVideoSource;
  disableAllTally();
  await sleep(500);
  setMainVideoSource(source, sx80_ip, res);
}

exports.setShareSource = (req, res, next) => {
  var source = req.body.shareSource;
  var xml =
    "<Command>" +
    "<Presentation>" +
    "<Start>" +
    "<ConnectorId>" + source + "</ConnectorId>" +
    "</Start>" +
    "</Presentation>" +
    "</Command>";

  var options = {
    method: "POST",
    url: "https://" + sx80_ip + "/putxml",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cHJlc2VuY2U6QzFzYzAxMjM="
    },
    body: xml
  };
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //permet de contourner l'erreur "error self signed certificate"

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(error);

    res.send("ok");
  });
}

exports.stopSharing = (req, res, next) => {
  stopSharing(sx80_ip);
}

exports.setInOutKrammer = (req, res, next) => {
  const output = req.body.output;
  const input = req.body.input;
  setInOut(input, output);
}

exports.saveConfig = async (req, res, next) => {
  const {
    mainVideoSource,
    shareSelection,
    allOutInput,
    configName,
    demoId
  } = req.body;
  getConfigOfAllCam().then((value) => {
    value.forEach(e => console.log(e));
    var save = new Save({
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: configName,
      position: value,
      mainVideoSource: mainVideoSource,
      shareSelection: shareSelection,
      allInputOutput: allOutInput,
      subName: configName + demoId //to avoid duplicate key of scene name into a demo
    });
    Demo.findById(demoId, function (err, demo) {
      if (!demo) { // si lié a aucune demo alors on créer une Demo par défaut
        const date = new Date();
        const currentDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        var defaultDemo = new Demo({
          name: currentDate,
          scene: [save._id]
        });
        defaultDemo.save(function (err, save) {
          if (err) {
            return console.error(err);
          }
        });
      } else {
        demo.scene.push(save._id);
        demo.save(function (err, save) {
          if (err) return console.error(err);
        });
      }
    });

    save.save(function (err, save) {
      if (err) {
        res.status(401).end('Duplicate Scene Name !');
        return console.error(err);
      }
      console.log(save.name + " saved to REGIS db.");
      res.sendStatus(201);
    });
  });
}

exports.startScenario = (req, res, next) => {
  const saveId = req.body.saveId;
  Save.findById(saveId, async function (err, save) {
    if (!save) {
      return res.redirect('/');
    }
    const {
      position,
      name,
      mainVideoSource,
      shareSelection,
      allInputOutput
    } = save;
    setAllInOut(allInputOutput);


    if (shareSelection != "") {
      setShareSource(shareSelection, sx80_ip);
    } else {
      stopSharing(sx80_ip);
    }

    disableAllTally();
    await sleep(1000);
    setMainVideoSource(mainVideoSource, sx80_ip);

    //Si GRILLE HDMI ALORS ON NE SET PAS LES CAMERAS
    position.forEach(cam => {
      setZoom(cam.ip, cam.zoom);
      setPanTiltValue(cam.ip, cam.panTilt.pan, cam.panTilt.tilt);
    });
    //console.log(save);
    res.sendStatus(200);
  });
}

exports.endDemo = (req, res, next) => {
  stopSharing(sx80_ip);
  disableAllTally();
  res.redirect('/');
}

exports.call = (req, res, next) => {
  const webexNumber = req.body.webexNumber;
  console.log(webexNumber);
  callWebexNumber(webexNumber, sx80_ip);
  res.status(204).send();
}

exports.endCall = (req, res, next) => {
  console.log("end call");
  disconnectCall(sx80_ip);
  res.status(204).send();
}

/************************** FUNCTION **********************************/


function getZoom(ip) {
  return new Promise(resolve => {
    var options = {
      'method': 'GET',
      'url': 'http://' + ip + '/cgi-bin/aw_ptz?cmd=%23AXZ&res=1',
      'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body.substr(3))
      resolve(response.body.substr(3));
    });
  });
}

function setZoom(ip, value) {
  var options = {
    'method': 'GET',
    'url': 'http://' + ip + '/cgi-bin/aw_ptz?cmd=%23AXZ' + value + '&res=1',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log('reponse zoom: ' + response.body);
  });
}

function getPanTiltValue(ip) {
  return new Promise(resolve => {
    var options = {
      'method': 'GET',
      'url': 'http://' + ip + '/cgi-bin/aw_ptz?cmd=%23APC&res=1',
      'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body.substr(3, 4))
      var values = {
        pan: response.body.substr(3, 4),
        tilt: response.body.substr(7, 4)
      }
      resolve(values);
    });
  });
}

function setPanTiltValue(ip, pan, tilt) {
  var options = {
    'method': 'GET',
    'url': 'http://' + ip + '/cgi-bin/aw_ptz?cmd=%23APC' + pan + tilt + '&res=1',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}

function getConfigOfAllCam() {
  return new Promise((resolve, reject) => {
    Product.fetchAll(cameras => {
      var position = [];
      var count = cameras.length;
      let completed = 0;
      for (let i = 0; i < count; i++) {
        Promise.all([
          getZoom(cameras[i].ip),
          getPanTiltValue(cameras[i].ip)
        ]).then(values => {
          position.push({
            ip: cameras[i].ip,
            zoom: values[0],
            panTilt: values[1]
          });
          completed++;
          if (completed == count) {
            resolve(position);
          }
        });
      }
    });
  });
}

function setPreset(ip, presetNumber, res) {
  console.log(ip);
  if (presetNumber < 10) {
    presetNumber = "0" + presetNumber;
  }
  var options = {
    'method': 'GET',
    'url': 'http://' + ip + '/cgi-bin/aw_ptz?cmd=%23R' + presetNumber + '&res=1',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.send("ok");
    console.log("Send preset OK");
    // console.log(response);
  });
}

function savePreset(ip, presetNumber, res) {
  if (presetNumber < 10) {
    presetNumber = "0" + presetNumber;
  }
  var options = {
    'method': 'GET',
    'url': 'http://' + ip + '/cgi-bin/aw_ptz?cmd=%23M' + presetNumber + '&res=1',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.send("ok");
    console.log("Save preset OK");
  });
}

function setInOut(input, output) {
  var options = {
    'method': 'POST',
    'url': 'http://websrv2.ciscofrance.com:15136/setInOut',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "input": input,
      "output": output
    })

  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}

/**
 * Function qui permet de configurer tous les input/ouput de krammer en un appel HTTP
 * @param {*} stringInOut exemple :"1>1,2>2,5>3,8>4,8>5,8>6,7>7,6>8" où INPUT>OUTPUT
 */
function setAllInOut(stringInOut) {
  var options = {
    'method': 'POST',
    'url': 'http://websrv2.ciscofrance.com:15136/setAllInOut',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "allConfigString": stringInOut
    })
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}

function getKrammerConfig() {
  return new Promise(resolve => {
    var options = {
      'method': 'GET',
      'url': 'http://websrv2.ciscofrance.com:15136/actualConfig',
      'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      resolve(JSON.parse(response.body))
    });
  });
}

function getSaves() {
  return Save.find({}, (err, docs) => {
    if (!err) {
      return new Promise((resolve) => {
        resolve(docs);
      });
    }
    throw err;
  });
}

function getAllDemo() {
  return Demo.find({}, (err, docs) => {
    if (!err) {
      return new Promise((resolve) => {
        resolve(docs);
      });
    }
    throw err;
  });
}

function setMainVideoSource(source, ip, res = undefined) {
  /* Attention les IP peuvent changer */
  Product.fetchAll(camera => {
    switch (source) {
      case "1":
        console.log("1")
        setTally(1, camera[0].ip);
        break;
      case "2":
          console.log("2")
        setTally(1, camera[1].ip);
        break;

      case "3":
          console.log("3")
        setTally(1, camera[2].ip);
        break;

      default:
        disableAllTally();
        break;
    }
  });
  var xml =
    "<Command>" +
    "<Video>" +
    "<Input>" +
    "<SetMainVideoSource>" +
    "<ConnectorId>" + source + "</ConnectorId>" +
    "</SetMainVideoSource>" +
    "</Input>" +
    "</Video>" +
    "</Command>";

  var options = {
    method: "POST",
    url: "https://" + ip + "/putxml",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cHJlc2VuY2U6QzFzYzAxMjM="
    },
    body: xml
  };
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //permet de contourner l'erreur "error self signed certificate"

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(error);

    if(res != undefined){
      res.send('ok');
    }
  });
}

function setShareSource(source, ip) {
  var xml =
    "<Command>" +
    "<Presentation>" +
    "<Start>" +
    "<ConnectorId>" + source + "</ConnectorId>" +
    "</Start>" +
    "</Presentation>" +
    "</Command>";

  var options = {
    method: "POST",
    url: "https://" + ip + "/putxml",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cHJlc2VuY2U6QzFzYzAxMjM="
    },
    body: xml
  };
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //permet de contourner l'erreur "error self signed certificate"

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(error);
  });
}

function getMainVideoSourceAndshareSource(ip) {
  return new Promise(resolve => {
    var options = {
      method: "GET",
      url: "http://" + ip + "/status.xml", //?location=/Status/Video/Input/MainVideoSource",
      headers: {
        "Content-Type": "text/xml",
        Authorization: "Basic cHJlc2VuY2U6QzFzYzAxMjM="
      }
    };
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //permet de contourner l'erreur "error self signed certificate"

    request(options, function (error, response) {
      if (error) throw new Error(error);
      parser.parseString(response.body, function (error, result) {
        if (error === null) {
          var mainVideoSource = result.Status.Video[0].Input[0].MainVideoSource[0];
          var shareSource = (result.Status.Conference[0].Presentation[0].Mode[0] === "Sending") ? result.Status.Conference[0].Presentation[0].LocalInstance[0].Source[0] : "Not_Sending";
          console.log(result.Status.Conference[0].Presentation[0].Mode[0])
          resolve({
            mainVideoSource: mainVideoSource,
            shareSource: shareSource
          });
        } else {
          console.log(error);
        }
      });
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function callWebexNumber(number, ip) {
  var xml =
    "<Command>" +
    "<Dial>" +
    "<Number>" + number + "</Number>" +
    "</Dial>" +
    "</Command>";

  var options = {
    method: "POST",
    url: "https://" + ip + "/putxml",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cHJlc2VuY2U6QzFzYzAxMjM="
    },
    body: xml
  };
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //permet de contourner l'erreur "error self signed certificate"

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    //console.log(error);
  });
}

function stopSharing(ip) {
  var xml =
    "<Command>" +
    "<Presentation>" +
    "<Stop>" +
    "</Stop>" +
    "</Presentation>" +
    "</Command>";

  var options = {
    method: "POST",
    url: "https://" + ip + "/putxml",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cHJlc2VuY2U6QzFzYzAxMjM="
    },
    body: xml
  };
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //permet de contourner l'erreur "error self signed certificate"

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(error);

    //res.send("ok");
  });
}

function disconnectCall(ip) {
  var xml =
    "<Command>" +
    "<Call>" +
    "<Disconnect>" + "</Disconnect>" +
    "</Call>" +
    "</Command>";

  var options = {
    method: "POST",
    url: "https://" + ip + "/putxml",
    headers: {
      "Content-Type": "text/xml",
      Authorization: "Basic cHJlc2VuY2U6QzFzYzAxMjM="
    },
    body: xml
  };
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //permet de contourner l'erreur "error self signed certificate"

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    //console.log(error);
  });
}


/**
 * Enable/Disable red light of the panasonic camera
 * @param {*} mode: 1  -> enable
 * @param {*} mode: 0 -> disable
 * @param {*} ip: ip adress of the camera
 */
function setTally(mode, ip) {
  var options = {
    'method': 'GET',
    'url': 'http://' + ip + '/cgi-bin/aw_ptz?cmd=%23DA' + mode + '&res=1',
    'headers': {
      'Cookie': 'Session=0'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log("set TALLY :")
    console.log("BODY: " + response.body);
  });
}

function disableAllTally() {
  Product.fetchAll(products => {
    products.forEach(element => {
      setTally(0, element.ip);
    });
  });
}







/**
 * 
 * @param {*} items : Scene Object
 * @param {*} idsList : Scene id List
 */
function sortListWithIds(items, idsList) {
  return new Promise(resolve => {
    var list = [];
    for (let index = 0; index < idsList.length; index++) {
      for (let i = 0; i < items.length; i++) {
        if (String(items[i]._id) == idsList[index]) {
          list.push(items[i]);
          break;
        }
      }
    }
    resolve(list.reverse());
  });

}