const express = require("express");
const {
    allMessages,
    sendMessage,
} = require("../controllers/messages.controllers");
const { protect } = require("../middleWare/auth.middleWare");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;
