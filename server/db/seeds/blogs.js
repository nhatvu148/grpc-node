exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("blogs").del()
    .then(function () {
      // Inserts seed entries
      return knex("blogs").insert([
        {
          author: "Nhat Vu",
          title: "Nhat Vu Blog Title",
          content: "Fist blog",
        },
        { author: "Will", title: "John blog title", content: "First blog" },
        { author: "Fuad", title: "Akbar blog title", content: "first Blog" },
      ]);
    });
};
