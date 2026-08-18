import User from "../models/user.model.js";
import genToken from "../utils/token.js";

export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email
            });
        }

        let token = await genToken(user._id);

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            http: true,
            secure: false, // must be true when sameSite is 'none'
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res.status(200).json(user);
       

    } catch (error) {
        console.log("Google Auth Error:", error);
        return res.status(500).json({ message: "Google auth error" });
    }
};

export const logOut = async (req, res) => {
    try {
        await res.clearCookie("token");
        return res.status(200).json({ message: "Logout successfully" });

    } catch (error) {
        console.log("Logout Error:", error);
        return res.status(500).json({ message: "Logout error" });
    }
};