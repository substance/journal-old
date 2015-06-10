var SAMPLE_DOC = require("../../../data/sample_doc");

exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('documents').insert({
      creator: "admin",
      title: "Test document",
      abstract: "My abstract",
      published_on: new Date(),
      data: JSON.stringify(SAMPLE_DOC)
    })
  );
};