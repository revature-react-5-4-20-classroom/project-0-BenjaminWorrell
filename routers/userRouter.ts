import { User } from "../models/User";
import { PoolClient, QueryResult } from "pg";
import { connectionPool } from "../repository";
import express, { Application, Response, Request } from "express";
import { getAllUsers, getUserById } from "../repository/user-data-access";
import { checkLogin } from "../middleware/authMiddleware";

export const userRouter: Application = express();

userRouter.get('/', async (req:Request, res: Response)=>
{
    const users: User[] = await getAllUsers();
    res.json(users);
});
userRouter.get(':id', checkLogin())
userRouter.get('/:id', async (req: Request, res: Response)=>
{
    const id = +req.params.id;
    if(isNaN(id))
    {
        res.status(400).send('Must include numeric id in path');
    }
    else if(req.session && (req.session.user.role !== 'Financial Manager' && req.session.user.id !== id))
    {
        res.status(401).send('You are not authorized to view this page');
    }
    else
    {
        const users: User[] = await getUserById(id);
        res.json(users);
        
    }

})