import type { Request, Response } from "express";
import { getUsers, createUser } from "../services/userService.ts";

export const getUsersController = async (req: Request, res: Response) => {
    try{
        const users = await getUsers();
        res.status(200).json(users);
    }
    catch(error){
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
};

export const createUserController = async (req: Request, res: Response) => {
    try{
        const user = await createUser(req.body);
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
};  