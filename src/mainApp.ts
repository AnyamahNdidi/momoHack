import express, { Application, Request, Response, NextFunction, application } from "express"
import cors from "cors"
import cookie from "cookie-session";
import { errorHandler } from "./middleware/ErrorHandler"
import agentRouter from "./router/userRouter"
import marchantRouter from "./router/marchantRouter"
import fundWalletRouter from "./router/fundWalletRouter"

export const mainApp = (app:Application) => {
    
    app.use(express.json()).use(cors())
        .use("/api/v1", agentRouter)
        .use("/api/v1", marchantRouter)
        .use("/api/v1", fundWalletRouter)
        
      
        .use(cookie({
            name: "session",
            keys: ["key1", "keys2"],
            maxAge: 24 * 60 * 60 * 1000
        }))
        .use((req: any, res: Response, next: NextFunction) => {
            if (req.session && !req.session.regenerate)
            {
                req.session.regenerate = (cb: any) => {
                    return cb()
                }
                if (req.session && !req.session.save)
                {
                    req.session.save = (cb: any) => {
                        return cb()
                    }
                }
                next()
            }
        })
       
        .get("/success", (req: Request, res: Response) => {
            res.status(200).json({
                message: `Auth Successful `,
            })
            
        })
        .get("/failure", (req: Request, res: Response) => {
            res.status(200).json({
                message: "Something went wrong",
            })
            
        })
       

    
        
    //   .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
     .get("/", (req: Request, res: Response) => {
            
            res.status(200).json({
                message:"api is ready"
            })
        
     })
    .get("/api/ejs:id", (req: Request, res: Response) => {
            
             const id = req.params.id
             const name = "edwin"
            return res.render("AdminVerification",{id, name})
        })
    
    .use(errorHandler)
}