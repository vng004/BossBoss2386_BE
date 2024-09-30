import express from "express";
import {  getUser, getUserById, getUserInfo, Login, Register, updateUserRole } from "../controllers/auth.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
import authSchema from "../validation/authShema.js";
import { forgotPassword } from "../controllers/forgotPassword.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const routerAuth = express.Router();

routerAuth.post("/forgot-password", forgotPassword);


// routerAuth.use(checkAuth)
routerAuth.get('/user/:id', getUserById);
routerAuth.get('/user', getUserInfo);
routerAuth.get('/users', getUser);
routerAuth.patch('/user/:id/role', updateUserRole);

routerAuth.use(validBodyRequest(authSchema));
routerAuth.post("/register", Register);
routerAuth.post("/login", Login);


export default routerAuth;
