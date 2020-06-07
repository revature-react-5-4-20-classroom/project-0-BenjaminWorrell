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
        users.last_name, users.email, roles.role_name FROM users INNER JOIN roles ON users.role_id = roles.id ORDER BY users.id`);
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
        result = await client.query(`SELECT users.id, users.username, users.password, users.first_name, 
        users.last_name, users.email, roles.role_name FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.id = $1` , [id]);
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

// export async function updateUser(id: number, newValue: string)
// {
//     let client: PoolClient = await connectionPool.connect();
//     client.query("SET search_path TO project_zero");
//     try
//     {
//         let result: QueryResult = await client.query(`UPDATE users SET username = $2 WHERE id = $3`, [newValue, id]);
//     }
//     catch(e)
//     {
//         throw new Error(`Failed to update user: ${e.message}`);
//     }
//     finally
//     {
//         client && client.release();
//     }
     
// }

// export async function updateUser(id: number, username?: string, password?: string, firstName?: string, lastName?: string, email?: string, role?: string): Promise<User[]>
// {
//     let client: PoolClient = await connectionPool.connect();
//     client.query("SET search_path TO project_zero");
//     try
//     {
//         if(username)
//         {
//             console.log('got to username conditional');
//             let result: QueryResult;
//             result = await client.query(`UPDATE users SET username = $1 where id = $2`, [username, id]);
//         }
//         if(password)
//         {
//             console.log('got to password conditional');
//             let result: QueryResult;
//             result = await client.query(`UPDATE users SET "password" = $1 where id = $2`, [password, id]);
//         }
//         if(firstName)
//         {
//             let result: QueryResult;
//             result = await client.query(`UPDATE users SET first_name = $1 where id = $2`, [firstName, id]);
//         }
//         if(lastName)
//         {
//             let result: QueryResult;
//             result = await client.query(`UPDATE users SET last_name = $1 where id = $2`, [lastName, id]);
//         }
//         if(email)
//         {
//             console.log('got to email conditional');
//             let result: QueryResult;
//             result = await client.query(`UPDATE users SET email = $1 where id = $2`, [email, id]);
//         }
//         if(role)
//         {
//             if(role === "Financial Manager")
//             {
//                 let result: QueryResult;
//                 result = await client.query(`UPDATE users SET role_id = 2 where id = $1`, [id]);
//             }
//             if(role === "Admin")
//             {
//                 let result: QueryResult;
//                 result = await client.query(`UPDATE users SET role_id = 1 where id = $1`, [id]);
//             }
//             if(role === "User")
//             {
//                 let result: QueryResult;
//                 result = await client.query(`UPDATE users SET role_id = 1 where id = $1`, [id]);
//             }
//         }
//         let result: QueryResult;
//         result = await client.query(`Select * FROM users WHERE id = $1`, [id]);
//         const user: User[] = result.rows.map((u)=>
//         {
//             return new User(u.id, u.username, u.password, u.first_name, u.last_name, u.email, u.role_name);
//         })
//         return user;

//     }
//     catch(e)
//     {
//         throw new Error(`Couldn't update user: ${e.message}`);
//     }
//     finally
//     {
//         client && client.release();
//     }
// }