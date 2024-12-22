const errorHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError) {
        // JSON parsing error
        return res.status(400).json({
            error: "Bad Request",
            message: "Invalid JSON format.",
            details: err.message
        });
    }

    if (err.status === 404) {
        // Route not found error
        return res.status(404).json({
            error: "Not Found",
            message: err.name || "Resource not found.",
            details: err.message
        });
    }

    // Other errors
    console.error(err);
    res.status(500).json({
        error: "Internal Server Error",
        message: "Something went wrong on the server.",
        details: err.message
    });
};

export default errorHandler;