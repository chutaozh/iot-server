const responseHandler = (req, res, next) => {
    res.sendResponse = ({
        code = 200,
        data = null,
        message = null,
    }) => {
        res.status(200).json({
            code,
            success: code === 200,
            message,
            data,
            datetime: new Date().getTime(),
        });
    };

    next();
};

module.exports = responseHandler;