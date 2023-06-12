const database = require("./database");

const informations = "firstname, lastname, email, city, language"

const getUsers = (req, res) => {
  let sql = `select ${informations} from users`;
  const sqlValues = [];

  if (req.query.language  != null) {
    sql += " where language  = ?";
    sqlValues.push(req.query.language );

      if (req.query.city  != null) {
       sql += " and city  = ?";
       sqlValues.push(req.query.city );
  }
  
} else if (req.query.city  != null) {
    sql += " where city  <= ?";
    sqlValues.push(req.query.city );
  }


  database
    .query(sql, sqlValues)
    .then(([users]) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};


const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query(`select ${informations} from users where id = ?`, [id])
    .then(([user]) => {
      if (user[0] != null) {
        res.json(user[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postUser = (req, res) => {
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;
  
    database
      .query(
        "INSERT INTO users (firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
        [firstname, lastname, email, city, language, hashedPassword]
      )
      .then(([result]) => {
        res.location(`/api/users/${result.insertId}`).sendStatus(201);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving the user");
      });
  };
  

  const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const user = req.body;
  
    database
      .query(
        "UPDATE users SET ? WHERE id = ?",
        [user , id]
      )
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error editing the movie");
      });
  };


  const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    database
      .query("DELETE FROM users WHERE id = ?", [id])
      .then(([result]) => {
        if (result.affectedRows > 0) res.sendStatus(204);
        else res.sendStatus(404);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  };



module.exports = {
  getUsers,
  getUserById,
  postUser,
  updateUser,
  deleteUser,
};