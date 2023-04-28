import jwt from "jsonwebtoken";

export function jwtFilter(req, res, next) {
  const authHeader = req.headers["authorization"]
    ? req.headers["authorization"]
    : undefined;

  if (!authHeader)
    return res.status(401).json({ msg: "Authorization header is missing" }); // Unauthorized

  const authToken = authHeader.replace("Bearer ", "");

  try {
    let authorized = jwt.verify(authToken, "superSecret");
    req.userDetails = authorized;
    next();
  } catch (err) {
    console.log(err.name);
    res.status(400).send("Invalid token");
  }
}
