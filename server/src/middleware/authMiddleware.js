const ApiError = require("../utils/apiError");
const jwt = require('jsonwebtoken');
const { user } = require("../model/user.model");
const ApiResponse = require('../utils/apiResponse.js');

const Verify_jwt = async (req, res, next) => {
    try {
        // console.log("cookies : ", req.cookies);
        // console.log("cookies : ", req.headers['authorization']);

        const token = req.cookies?.accessToken || req.headers['Authorization']?.replace("Bearer ", "") || req.headers['authorization']?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json(new ApiResponse(401, null, 'Unauthorized request: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user_id = decoded._id;

        const userFind = await user.findById(user_id).select("-password");
        if (!userFind) {
            return res.status(401).json(new ApiResponse(401, null, "No user found"));
        }

        // Attach the user information to the request object
        req.userId = userFind._id;

        next();
    } catch (err) {
        console.log("Error in verification of JWT {B} : ", err);
        next(err);
    }
}

module.exports = Verify_jwt;
