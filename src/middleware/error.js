const errorMiddleware = (err, req, res, next) => {
  res.json({
    errors: [
      {
        message: err.message,
      },
    ],
  });
};

export default errorMiddleware;
