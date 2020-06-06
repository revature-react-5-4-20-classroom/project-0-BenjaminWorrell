import { User } from "../models/User";
import { PoolClient, QueryResult } from "pg";
import { connectionPool } from "../repository";
import express, { Application, Response, Request } from "express";
import { getAllUsers, getUserById} from "../repository/user-data-access";
import { checkLogin } from "../middleware/authMiddleware";
import bodyParser from 'body-parser';

export const userRouter: Application = express();
userRouter.use(bodyParser.json());

userRouter.get('/', checkLogin())
userRouter.get('/', async (req:Request, res: Response)=>
{
    if(req.session && !(req.session.user.role === 'Financial Manager' || req.session.user.role === 'Admin'))
    {
        console.log("You are not authorized to view this page");
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
        console.log("Made it to the backend");
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

userRouter.patch('/', checkLogin());
userRouter.patch('/', async (req: Request, res: Response)=>
{
    const args = req.body;
    if(req.session && (req.session.user.role !== "Admin" || req.session.user.role !== "Financial Manager"))
    {
        res.status(401).send('You are not authorized to view this page');   
    }
    else
    {
        let client: PoolClient = await connectionPool.connect();
        client.query("SET search_path TO project_zero");
        if(!args.id)
        {
            res.status(400).send('Must include user id in request');
        }

        for(let i in args)
        {
            if(i === "id")
            {
            }
            else if(i ==="username")
            {
                let result: QueryResult = await client.query(`UPDATE users SET username = $1 WHERE id = $2`, [args[i], args.id]);
                
            }
            else if(i === "password")
            {
                let result: QueryResult = await client.query(`UPDATE users SET password = $1 WHERE id = $2`, [args[i], args.id]);
            }
            else if(i === "email")
            {
                let result: QueryResult = await client.query(`UPDATE users SET email = $1 WHERE id = $2`, [args[i], args.id]);
            }
            else if(i === "firstName")
            {
                let result: QueryResult = await client.query(`UPDATE users SET first_name = $1 WHERE id = $2`, [args[i], args.id]);
            }
            else if(i === "lastName")
            {
                let result: QueryResult = await client.query(`UPDATE users SET last_name = $1 WHERE id = $2`, [args[i], args.id]);
            }
            else if(i === "role")
            {
                if(args.role !== "Financial Manager")
                {
                    let result: QueryResult;
                    result = await client.query(`UPDATE users SET role_id = 2 where id = $1`, [args.id]);
                }
                if(args.role === "Admin")
                {
                    let result: QueryResult;
                    result = await client.query(`UPDATE users SET role_id = 1 where id = $1`, [args.id]);
                }
                if(args.role === "User")
                {
                    let result: QueryResult;
                    result = await client.query(`UPDATE users SET role_id = 1 where id = $1`, [args.id]);
                }
            }

            
        }
    }
 
    const users: User[] = await getUserById(+args.id); 
    res.status(201).json(users)
})