import { Router, type Request, type Response } from "express";

export const routes = Router();

routes.get("/", (request: Request, response: Response) => {
    return response.json({ hello: "world" });
});