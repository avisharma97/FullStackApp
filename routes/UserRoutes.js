const express = require("express");
const {
  registercontroller,
  loginController,
  UpdateUserController,
  requireSingIn,
} = require("../controllers/userController");

//riouter object
const router = express.Router();

//routes
// REGISTER || POST
router.post("/register", registercontroller);

// LOGIN || POST
router.post("/login", loginController);

//UPDATE || PUT
router.put("/updateuser", requireSingIn, UpdateUserController);

//export
module.exports = router;
