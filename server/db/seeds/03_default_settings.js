exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('settings').insert({
      key: "journal_name",
      value: "Substance Journal"
    }),
    knex('settings').insert({
      key: "journal_description",
      value: "With Substance Journal you can self-host your scientific publications."
    })
  );
};