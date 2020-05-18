import { Reimbursement } from "../models/Reimbursement";
import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";


export async function findReimbursementByStatusId(id: number): Promise<Reimbursement[]> 
{
     let client: PoolClient
    client = await connectionPool.connect();
    client.query("SET search_path TO project_zero");
    try
    {
        let result: QueryResult
        result = await client.query(`SELECT * FROM reimbursements WHERE $1 = status ORDER BY date_submitted`, [id]);
        const matchingReim = result.rows.map((r)=>
        {
            return new Reimbursement(r.id, r.author, r.amount, r.date_submitted, r.date_resolved, r.description, r.resolver, r.status, r.type)
        })
        console.log(matchingReim);
        return matchingReim;
   
    }
    catch(e)
    {
        throw new Error(`Query failed ${e.message}`);
    }
    finally
    {
        client && client.release();
    }
}
export async function findReimbursementByUserId(id: number): Promise<Reimbursement[]> 
{
     let client: PoolClient
    client = await connectionPool.connect();
    client.query("SET search_path TO project_zero");
    try
    {
        let result: QueryResult
        result = await client.query(`SELECT * FROM reimbursements WHERE $1 = author ORDER BY date_submitted`, [id]);
        const matchingReim = result.rows.map((r)=>
        {
            return new Reimbursement(r.id, r.author, r.amount, r.date_submitted, r.date_resolved, r.description, r.resolver, r.status, r.type)
        })
        console.log(matchingReim);
        return matchingReim;
   
    }
    catch(e)
    {
        throw new Error(`Query failed ${e.message}`);
    }
    finally
    {
        client && client.release();
    }
}


