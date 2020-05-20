import { User } from "../models/User";
import { PoolClient, QueryResult } from "pg";
import { connectionPool } from "../repository";
import express, { Application, Response, Request } from "express";
import { getAllUsers, getUserById, updateUser } from "../repository/user-data-access";
import { checkLogin } from "../middleware/authMiddleware";
import bodyParser from 'body-parser';

export const userRouter: Application = express();
userRouter.use(bodyParser.json());

userRouter.get('/', checkLogin())
userRouter.get('/', async (req:Request, res: Response)=>
{
    if(req.session && req.session.user.role !== 'Financial Manager')
    {
        res.status(401).send('You are not authorized to view this page');
    }
    else
    {
        const users: User[] = await getAllUsers();
        res.json(users);
    }
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

//userRouter.patch('/', checkLogin());
userRouter.patch('/', async (req: Request, res: Response)=>
{
    const args = req.body;
    if(!args.id)
    {
        console.log()
        res.status(400).send('Must include user id in request');
    }

    for(let i in args)
    {
        if(i === "id")
        {
        }
        else
        {
            console.log(i);
            console.log(args[i]);
            updateUser(+args.id, i, args[i]);
        }
    }
    // else
    // {
    //     if(args.username && args.password && args.firstName && args.lastName && args.email && args.role)
    //     {
    //         updateUser(+args.id, args.username, args.password, args.firstName, args.lastName, args.email, args.role);
    //     }
    //     else if(args.username && args.password && args.firstName && args.lastName && args.email)
    //     {
    //         updateUser(+args.id, args.username, args.password, args.firstName, args.lastName, args.email);
    //     }
    //     else if(args.username && args.password && args.firstName && args.lastName)
    //     {
    //         updateUser(+args.id, args.username, args.password, args.firstName, args.lastName);
    //     }
    //     else if(args.username && args.password && args.firstName)
    //     {
    //         updateUser(+args.id, args.username,args.password, args.firstName);
    //     }
    //     else if(args.username && args.password)
    //     {
    //         updateUser(+args.id, args.username,args.password,);
    //     }
    //     else if(args.username)
    //     {
    //         updateUser(+args.id, args.username);
    //     }
    const users: User[] = await getUserById(+args.id); 
    res.status(201).json(users)
})