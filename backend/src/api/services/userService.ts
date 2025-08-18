import { AppDataSource } from "../../data-source.ts";
import { User } from "../entities/User.ts";

export async function getUsers() {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    return users;
};

export async function createUser(user: User) {
    const userRepository = AppDataSource.getRepository(User);
    const newUser = userRepository.create(user);
    await userRepository.save(newUser);
    return newUser;
};