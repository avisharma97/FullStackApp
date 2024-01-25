const express = require("express");
const { requireSingIn } = require("../controllers/userController");
const {
  createPostController,
  getAllPostsContoller,
  getUserPostsController,
  deletePostController,
  updatePostController,
} = require("../controllers/PostController");

//router object
const router = express.Router();

// CREATE POST || POST
router.post("/createpost", requireSingIn, createPostController);

//GET ALL POSTs
router.get("/getallpost", getAllPostsContoller);

//GET USER POSTs
router.get("/getuserpost", requireSingIn, getUserPostsController);

//DELEET POST
router.delete("/deletepost/:id", requireSingIn, deletePostController);

//UPDATE POST
router.put("/updatepost/:id", requireSingIn, updatePostController);

//export
module.exports = router;
