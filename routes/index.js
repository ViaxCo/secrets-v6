const express = require("express");
const router = express.Router();
const {
  getHome,
  getGoogleAuth,
  getGoogleAuthCallback,
  getLogin,
  getRegister,
  getSecrets,
  getLogout,
  getSubmitPage,
} = require("../controllers");

const {
  loginUser,
  registerUser,
  submitSecret,
  deleteSecret,
  deleteAccount,
} = require("../controllers");

router.route("/").get(getHome);
router.route("/auth/google").get(getGoogleAuth);
router.route("/auth/google/secrets").get(getGoogleAuthCallback);
router.route("/login").get(getLogin).post(loginUser);
router.route("/register").get(getRegister).post(registerUser);
router.route("/secrets").get(getSecrets);
router.route("/logout").get(getLogout);
router.route("/submit").get(getSubmitPage).post(submitSecret);
router.route("/delete/:index").post(deleteSecret);
router.route("/delete-account/:id").post(deleteAccount);

module.exports = router;
