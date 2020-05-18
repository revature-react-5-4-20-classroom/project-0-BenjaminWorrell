import { User } from "../models/User";
import { PoolClient, QueryResult, Pool } from "pg";
import { connectionPool } from ".";

export async function getAllUsers(): Promise<User[]>
{
    let client: PoolClient = await connectionPool.connect();
    client.query("SET search_path TO project_zero");
    try
    {
        let result: QueryResult;
        result = await client.query(`SELECT users.id, users.username, users.password, users.first_name, 
        users.last_name, users.email, roles.role_name FROM users INNER JOIN roles ON users.role_id = roles.id`);
        console.log(result.rows);
        return result.rows.map((u)=>
        {
            return new User(u.id, u.username, u.password, u.first_name, u.last_name, u.email, u.role_name);
        })
    }
    catch(e)
    {   
        throw new Error(`Failed to query all users: ${e.message}`);
    }
    finally
    {
        client && client.release();
    }
}

export async function getUserById(id: number): Promise<User[]>
{
    let client: PoolClient = await connectionPool.connect();
    client.query("SET search_path TO project_zero");
    try
    {
        let result: QueryResult;
        result = await client.query(`Select * FROM users WHERE id = $1`, [id]);
        return result.rows.map((u)=>
        {
            return new User(u.id, u.username, u.password, u.first_name, u.last_name, u.email, u.role_name);
        })
    }
    catch(e)
    {
        throw new Error(`Couldn\'t find a user with that id: ${e.message}`);
    }
    finally
    {
        client && client.release();
    }
}
export async function findUserByUsernamePassword(username: string, password: string) : Promise<User>
{
    let client : PoolClient
    client = await connectionPool.connect();
    client.query("SET search_path TO project_zero");
    try
    {
        let result : QueryResult;
        result = await client.query(`SELECT users.id, users.username, users.password, users.first_name, 
        users.last_name, users.email, roles.role_name FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.username = $1 AND users.password = $2;`, [username, password]);
        const matchingUser = result.rows.map((u)=>
        {
            return new User(u.id, u.username, u.password, u.first_name, u.last_name, u.email, u.role_name);
        });
        if(matchingUser.length > 0)
        {
            return matchingUser[0];
        }
        else
        {
            throw new Error('Username or password isn\'t correct');
        }
    }
    catch(e)
    {
        throw new Error(`Failed to validate User with DB: ${e.message}`);
    }
    finally
    {
        client && client.release();

    }
    
}