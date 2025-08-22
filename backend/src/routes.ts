import { Router, type Request, type Response } from "express";
import { createUserController, getUsersController } from "./api/controllers/usersController.ts";

export const routes = Router();

routes.get("/", (request: Request, response: Response) => {
    return response.json({ hello: "world" });
});

routes.get("/user", getUsersController);   

routes.post("/user", createUserController);
