import { Router } from "express";
import { getUsers } from "../controllers/admin.js";


export const adminRouter = new Router()

adminRouter.get("/getusers", (req, res, next) => {
    getUsers(req, res)
})