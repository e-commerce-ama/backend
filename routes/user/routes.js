import Router from "express";
import getUser from "../../controllers/user/userController.js";

const userRoutes = Router();

userRoutes.get('/user/:id', getUser)

export default userRoutes