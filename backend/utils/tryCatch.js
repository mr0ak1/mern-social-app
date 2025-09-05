const TryCatch = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next)
    } catch (error) {
      console.log(error.message)
      res.status(500).json({
        message: "Server Error",
      })
    }
  }
}

export default TryCatch
