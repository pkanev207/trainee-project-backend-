export const errorHandler = (err: any, req: any, res: any, next: any): void => {
  if (res.statusCode === undefined) {
    res.status(500);
  }

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
