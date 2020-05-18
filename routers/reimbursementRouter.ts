import { PoolClient, QueryResult } from "pg";
import { connectionPool } from "../repository";
import express, { Application, Response, Request } from "express";
import { Reimbursement } from "../models/Reimbursement";
import {findReimbursementByStatusId, findReimbursementByUserId} from "../repository/reimbursement-data-access"
import { checkLogin} from "../middleware/authMiddleware";

export const reimbursementRouter: Application = express();

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
