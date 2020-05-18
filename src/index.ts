import express, { Application, Request, Response } from "express";
import bodyParser from 'body-parser';
import { PoolClient, QueryResult } from "pg";
import { connectionPool } from "../repository";
import { User } from "../models/User";
import { userRouter } from "../routers/userRouter";
import { findUserByUsernamePassword } from "../repository/user-data-access";
import { sessionMiddleware } from "../middleware/sessionMiddleware";
import { reimbursementRouter } from "../routers/reimbursementRouter";

const app: Application = express();
const PORT = 2020;

app.use(bodyParser.json());
app.use(sessionMiddleware);



app.post('/login',  async (req: Request, res: Response)=>
{
    const {username, password} = req.body;
    if(!username || !password)
    {
        res.status(400).send('Please include username and password');
    }
    else
    {
        try
        {
            const user = await findUserByUsernamePassword(username, password);
            if(req.session)
            {
                req.session.user = user;
            }
            res.json(user)
        }
        catch (e)
        {
            console.log(e.message);
            res.status(400).send('invalid Credentials');
        }
    }
})

app.listen(PORT, () =>
{
    console.log(`app has started listening on http://localhost:${PORT}`);
    let client: PoolClient;
    connectionPool.connect().then
    (
        (client: PoolClient)=>
        {
            console.log('connected');
            client.query("SET search_path TO project_zero");
        }
    )
    .catch((err)=>
        {
            console.log(err.message);
        }

     )
})

app.use('/users', userRouter);
app.use('/reimbursements', reimbursementRouter);