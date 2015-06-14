var util = require("./util"),
    _ = require('lodash'),
    express = require('express'),
    documentAPI = express.Router(),
    db = require("../db/index"),
    Setting = db.models.Setting;


// Read existing settings
// -----------
// 
// GET /api/settings

var getSettings = function(req, res, next) {
  Setting.getAll(util.out(res, next));
};

// Update settings
// -----------
// 
// PUT /api/settings
// 
// Input:
// 
// {
//   data: "SUBSTANCE_DOC_JSON"
// }

var updateSettings = function(req, res, next) {
  var user = req.user;
  var settingsData = req.body;

  Setting.setMany(settingsData, util.out(res, next));
};


documentAPI.route('/settings')
  .get(util.checkAuth, getSettings)
  .put(util.checkToken, updateSettings);

module.exports = documentAPI;