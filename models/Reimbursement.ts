export class Reimbursement
{
    id: number
    author: number
    amount: number
    dateSubmitted: number
    dateResolved: number
    description: string
    resolver: number
    status: number 
    type: number

    constructor(id: number, author: number, amount: number, dateSubmitted: number, dateResolved: number, description: string, resolver: number, status: number, type: number)
    {
        this. id = id;
        this.author = author;
        this. amount = amount; 
        this.dateSubmitted = dateSubmitted;
        this.dateResolved = dateResolved;
        this.description = description;
        this.resolver = resolver;
        this.status= status;
        this.type = type;
    }


}