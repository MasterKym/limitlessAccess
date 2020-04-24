const jwt = require("jsonwebtoken");

function verifyLogin(req, res, next) {
  console.log(req);

  const loginToken = req.cookies["login-token"];
  if (!loginToken) return res.status(401).send("You need to log in first!");

  try {
    const verified = jwt.verify(loginToken, process.env.SECRET_TOKEN);
    res.locals.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}


module.exports = verifyLogin;