import * as express from 'express';
import {Request, Response} from 'express';
import AuthenticationService from '../services/AuthenticationService';
import { LoginBody, SignupBody } from '../interfaces/AuthenticationInterfaces';
import { User } from '../entities/User';

declare module 'express-session' {
  export interface SessionData {
    loggedin?: boolean;
  }
}

export class AuthenticationController{

    router: express.Router;

    constructor() {
    this.router = express.Router();
    this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/users/all', this.getAll)
        this.router.post('/login', this.login)
        this.router.post('/signup', this.signup)
        this.router.delete('/users/delete', this.deleteUsers)
    }

    getAll = async (req: Request, res: Response) => {
      try {
        const users: User[] = await AuthenticationService.getInstance().getAll()
        res.status(200).send({users: users})
      } catch (error) {
        res.status(400).send({message: 'No users found!'})
      }
    };

    login = async (req: Request<{}, {}, LoginBody, {}>, res: Response) => {
        const {email, password} = req.body
      
      try {
        const userFound: User = await AuthenticationService.getInstance().login(email, password)
        req.session.loggedin = true;
      
        if (!userFound) res.status(400).send({message: "Invalid Username or Password"})
       
        else {
          res.status(200).send({user: userFound});
        } 
      } catch  {
      throw new Error("Error");
      }
      };

        signup =  async (req: Request<{}, {}, SignupBody, {}>, res: Response) => {
        const {email, password, userName} = req.body
      
      try {
       await AuthenticationService.getInstance().signup(email, password, userName)
      
        res.status(200).send({message: 'You\'ve signed up successfully!'});
      } catch {
        res.status(400).send({message: 'User with this email already exists!'});
      }
      }

      deleteUsers = async (req: Request<{}, {}, {}, { emails: string[] }>, res: Response) => {
        const { emails } = req.query;
        try {
          const results = await AuthenticationService.getInstance().deleteUsers(emails);
          res.status(200).send(results);
        } catch {
          res.status(400).send({ message: 'Delete user failed!' });
        }
      };
}