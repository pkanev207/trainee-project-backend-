// import { Request, Response, NextFunction } from 'express';

// // This can be shortened..

// import { Request, Response, NextFunction } from 'express';
// export const myMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   ...
// };

// // to this..
// import { RequestHandler } from 'express';
// export const myMiddleware: RequestHandler = (req, res, next) => {
//   ...
// };

// // or in case it handles the error object
// import { ErrorRequestHandler } from 'express';
// export const myMiddleware: ErrorRequestHandler = (err, req, res, next) => {
//   ...
// };

export {};
