const express = require("express");
const router = express.Router();

const registerRouter = require("./api/register");
const checkEmailRouter = require("./api/checkEmail");
const updatepwRouter = require("./api/updatepw");
const contractRouter = require("./api/contract");
const noticeRouter = require("./api/notice");
const faqRouter = require("./api/faq");
const extractContractRouter = require("./api/extractContract");

router.use("/register", registerRouter);
router.use("/checkEmail", checkEmailRouter);
router.use("/updatepw", updatepwRouter);
router.use("/contract", contractRouter);
router.use("/notice", noticeRouter);
router.use("/faq", faqRouter);
router.use("/extractContract", extractContractRouter);

module.exports = router;
