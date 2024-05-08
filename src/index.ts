import { PrismaClient } from '@prisma/client'
const express = require('express');
import { Request, Response } from 'express';

import zod, { string } from "zod"

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

//user routes

const signupBody = zod.object({
    username: zod.string().email().min(2),
    password: zod.string().min(6),
    firstName: string(),
    lastName: string()
})

app.post('/signup', async (req: Request,res: Response)=>{

    const success =  signupBody.safeParse(req.body);
    if(!success){
       return res.status.json({
            message: "Wrong inputs"
        })
    }

    const existingUser = await prisma.user.findFirst({
        where:{
            username: req.body.username
        }
    })

    if(existingUser){
        return req.status(411).json({
            msg: 'User already exists'
        })
    }

    const data = await prisma.user.create({
        data:{
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstName,
            lastName: req.body.lastName
        }
    })


    res.json({
        msg: 'User signed up successfully'
    })
})

//get todos

const todoBody = zod.object({
    title: zod.string(),
    description: zod.string()
})

app.get("/todos", async (req: Request,res: Response)=>{

    const success = todoBody.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            msg: 'Invalid inputs'
        })
    }

    const todoData = await prisma.todo.findMany();

    res.json({
        todoData
    })

})

//put todos

const todoInput = zod.object({
    title: zod.string(),
    description: zod.string()
})


app.post("/todos",async (req:Request,res: Response)=>{

    const success = todoInput.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            msg: 'Invalid inputs'
        })
    }

    const resp = await prisma.todo.create({
        data:{
            title: req.body.title,
            Description: req.body.description
        }
    })

})





