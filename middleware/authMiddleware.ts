import express, {Request, Response, NextFunction } from "express";




export function checkLogin()
{
    return (req: Request, res: Response, next: NextFunction)=>
    {
        if(!req.session || !req.session.user)
        {
            res.status(401).send('Please login')
        }
       else
       {
           next();
       }
    }
}