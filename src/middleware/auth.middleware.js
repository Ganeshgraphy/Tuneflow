const jwt = require("jsonwebtoken");

async function artistAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded: ", decoded);

    if (decoded.role != "artist") {
      return res.status(401).json({
        message: "Unauthorized access! you are not an artist",
      });
    }

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(402).json({
      message: "Unauthorized access",
      err,
    });
  }
}

async function authUser(req, res, next) {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if(decoded.role !== "user" || decoded.role !== "artist"){
            return res.status(401).json({message: "Unauthorized"})
        }

        req.user = decoded;
        next();
    } catch(err){
        return res.status(401).json({message: "Unauthorized"})
    }
}

module.exports = { artistAuth, authUser };
