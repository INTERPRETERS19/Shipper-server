const User = require("../models/shipper");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWTSecret = process.env.JWT_SECRET;
const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.json({
      success: false,
      message: "user not found, with the given email!",
    });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({
      success: false,
      message: "email / password does not match!",
    });
  }
  const token = jwt.sign({ userId: user._id }, JWTSecret, {
    expiresIn: "1d",
  });

  const userInfo = {
    firstName: user.firstName,
    email: user.email,
    id: user._id,
  };

  res.json({ success: true, user: userInfo, token });
};
