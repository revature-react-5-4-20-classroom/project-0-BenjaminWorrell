import { PoolClient, QueryResult } from "pg";
import { connectionPool } from "../repository";
import express, { Application, Response, Request } from "express";
import { Reimbursement } from "../models/Reimbursement";
import {findReimbursementByStatusId, findReimbursementByUserId, addNewReimbursement, findReimbursementById} from "../repository/reimbursement-data-access"
import { checkLogin} from "../middleware/authMiddleware";

export const reimbursementRouter: Application = express();

reimbursementRouter.get('/status/:id', checkLogin());
reimbursementRouter.get('/status/:id', async (req: Request, res: Response)=>
{
    const id = +req.params.id;
    if(isNaN(id))
    {
        res.status(400).send('Must include numeric id in path');
    }
    else if(id !== 1 && id !== 2 && id !== 3)
    {
        res.status(400).send('Enter a valid status ID: 1, 2 or 3');
    }
    else if(req.session && req.session.user.role !== 'Financial Manager')
    {
        res.status(401).send('You are not authorized to view this page');
    }
    else
    {
        const reimbursements: Reimbursement[] = await findReimbursementByStatusId(id);
        res.json(reimbursements);
        
    }

})

reimbursementRouter.get('/userId/:id', checkLogin());
reimbursementRouter.get('/userId/:id', async (req: Request, res: Response)=>
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
        const reimbursements: Reimbursement[] = await findReimbursementByUserId(id);
        if(reimbursements.length==0)
        {
            res.status(400).send('No reimbursements submitted by a user with that ID')
        }
        else
        {
        res.json(reimbursements);
        }
    }

})

reimbursementRouter.post('/', async (req: Request, res: Response)=>
{
    let{author, amount, dateSubmitted, dateResolved, description, resolver, status, type} = req.body;
    if(author && amount && dateSubmitted && dateResolved && description && resolver && status && type)
    {
        let newReim = new Reimbursement(0, author, amount, dateSubmitted, dateResolved, description, resolver, status, type)
        await addNewReimbursement(newReim)
        res.status(201).json(newReim);
    }
    else
    {
        res.status(400).send('Please include the required fields');
    }
})
reimbursementRouter.patch('/', checkLogin())
reimbursementRouter.patch('/', async (req: Request, res: Response)=>
{
    const args=req.body;
    if(req.session && req.session.user.role !== 'Financial Manager')
    {
        res.status(401).send('You are not authorized to view this page');   
    }
    else
    {
        let client: PoolClient = await connectionPool.connect();
        client.query("SET search_path TO project_zero");
        if(!args.id)
        {
            res.status(400).send('Must include id in request');
        }
        else
        {
            for(let i in args)
            {
                if(i === "id"){}
                else if(i==="author")
                {
                    let result: QueryResult = await client.query(`UPDATE reimbursements SET author = $1 WHERE id = $2`, [args[i], args.id])
                }
                else if(i==="amount")
                {
                    let result: QueryResult = await client.query(`UPDATE reimbursements SET amount = $1 WHERE id = $2`, [args[i], args.id])
                }
                else if(i==="dateSubmitted")
                {
                    let result: QueryResult = await client.query(`UPDATE reimbursements SET dateSubmitted = $1 WHERE id = $2`, [args[i], args.id])
                }
                else if(i==="dateResolved")
                {
                    let result: QueryResult = await client.query(`UPDATE reimbursements SET dateResolved = $1 WHERE id = $2`, [args[i], args.id])
                }
                else if(i==="description")
                {
                    let result: QueryResult = await client.query(`UPDATE reimbursements SET description = $1 WHERE id = $2`, [args[i], args.id])
                }
                else if(i==="resolver")
                {
                    let result: QueryResult = await client.query(`UPDATE reimbursements SET resolver = $1 WHERE id = $2`, [args[i], args.id])
                }
                else if(i==="status")
                {
                    let result: QueryResult = await client.query(`UPDATE reimbursements SET status = $1 WHERE id = $2`, [args[i], args.id])
                }
                else if(i==="type")
                {
                    let result: QueryResult = await client.query(`UPDATE reimbursements SET type = $1 WHERE id = $2`, [args[i], args.id])
                }
            }
            const reimbursements: Reimbursement[] = await findReimbursementById(+args.id);
            res.json(reimbursements);
        } 
    }
})

