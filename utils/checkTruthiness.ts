// type Falsy = 0 | "" | false | null | undefined;

// export function truthy<T>(x: T): x is Exclude<T, Falsy> {
//   return !!(x as any);
// }

// export function falsy<T>(x: T): x is T & Falsy {
//   return !(x as any);
// }

// // middleware/authCheck.ts
// import { Request, Response, NextFunction } from 'express';

// export const authCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   ...
// };

// // server.ts
// import { authCheckMiddleware } from './middleware/authCheck';
// app.use('/api', authCheckMiddleware);

// We keep the request definitions in one file:
// import { Request } from "express"
// export interface IGetUserAuthInfoRequest extends Request {
//   user: string // or any other type
// }

// And then in the file where we are writing the controller functions:
// import { Response } from "express"
// import { IGetUserAuthInfoRequest } from "./definitionfile"

// app.get('/auth/userInfo', validateUser,  (req: IGetUserAuthInfoRequest, res: Response) => {
//   res.status(200).json(req.user); // Start calling status function to be compliant with Express 5.0
// });
