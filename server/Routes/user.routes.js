const express = require("express");
const {
    registerUser,
    authUser,
    allUsers,
} = require("../controllers/user.controllers");
const { protect } = require("../middleWare/auth.middleWare");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);

module.exports = router;