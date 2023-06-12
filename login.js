const database = require("./database");

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
    const { email } = req.body;

    database
    .query(`select * from users where email = ?`, [email])
    .then(([answer]) => {
      if (answer[0] != null) {

        req.user = answer[0];

        next();
      } else {
        res.status(401).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
  };


  module.exports = {
    getUserByEmailWithPasswordAndPassToNext,
  };