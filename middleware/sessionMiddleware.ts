import session from 'express-session';

//express session provides session-handling middleware
//this third party middleware should be configured 

const sessionConfig =
{
    secret: 'thisShouldBeSecret',
    cookie: {secure: false},
    resave: false, 
    saveUninitialized: false
}

export const sessionMiddleware = session(sessionConfig);