const express = require("express");
const passport = require("../config/passport");

const router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/api/auth/login-failed"
    }),
    (req, res) => {
        res.redirect(
            `${process.env.FRONTEND_URL}/auth/success`
        );
    }
);

router.get("/login-failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "Google authentication failed"
    });
});

router.get("/me", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    res.json({
        success: true,
        data: req.user
    });
});

router.post("/logout", (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }

        req.session.destroy((sessionError) => {
            if (sessionError) {
                return next(sessionError);
            }

            res.clearCookie("connect.sid");

            res.json({
                success: true,
                message: "Logged out successfully"
            });
        });
    });
});

module.exports = router;