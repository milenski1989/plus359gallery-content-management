
import bcrypt from "bcrypt"
import { dbConnection } from "../database";
import { User } from "../entities/User";
import { In } from "typeorm";

const userRepository = dbConnection.getRepository(User);

export default class AuthenticationService {

    private static authenticationService: AuthenticationService;

    private constructor() {}

    static getInstance() {
        if (!AuthenticationService.authenticationService) {
            AuthenticationService.authenticationService = new AuthenticationService()
        }

        return AuthenticationService.authenticationService
    }

    async getAll() {
      try {
        const users: User[] = await userRepository.find()
        return users
      } catch (error) {
        throw new Error('No users found!')
      }
    }

    async login(email: string, password: string) {
        let authenticated: boolean
      
        try {
          let userFound: User = await userRepository.findOne({
            where: [{ email: email }, { userName: email }]
          })
      
          if (userFound) {
           authenticated = await bcrypt.compare(password, userFound.password)
           if (authenticated) return userFound
           else return null
          }
        } catch(error) {
         throw new Error("Invalid credentials");
        }
        
      };

      async signup(email: string, password: string, userName: string) {
        try {
            const userFound: User = await userRepository.findOneBy({ email: email });
    
            if (!userFound) {
                const saltRounds = 10;
                const hash = await bcrypt.hash(password, saltRounds);
    
                const user: User = userRepository.create({
                    email: email,
                    password: hash,
                    userName: userName,
                    superUser: 0
                });
    
                await dbConnection.getRepository(User).save(user);
    
                return { success: true, message: "You've signed up successfully!" };
            } else {
                throw new Error("User with this email already exists!");
            }
        } catch (error) {
            throw error;
        }
    };
    

      async deleteUsers(emails: string[]) {
        const promises = []
        try {
          const foundUsers: User[] = await userRepository.find({where: {
            email: In(emails)
          }})
    
          if (foundUsers.length) {

            for (let user of foundUsers) {
              promises.push(
                userRepository.delete({email: user.email})
              );
            }

            const result = await Promise.all(promises);
            return result;

          } else {
             throw new Error('User with this email was not found!')
          }
        } catch (error) {
          throw new Error(error);
        }
      }
}