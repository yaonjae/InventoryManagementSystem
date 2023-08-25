const authorizeToken = async (req, res, next) => {
  const token = req.headers?.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }else{
    jwt.verify(token, "SECRET", async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid token" });
        }else{
            req.user = decoded
            next()
        }
      });
  }
};

module.exports.authorizeToken = authorizeToken
