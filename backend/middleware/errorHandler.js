/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle axios errors from Screenshotlayer API
  if (err.response) {
    const status = err.response.status || 500;
    let message = err.message;
    let type = 'api_error';
    let code = status;

    try {
      // Attempt to parse JSON even if responseType was arraybuffer
      const contentType = err.response.headers?.['content-type'] || '';
      if (contentType.includes('application/json')) {
        const data = typeof err.response.data === 'string'
          ? JSON.parse(err.response.data)
          : (err.response.data instanceof ArrayBuffer
              ? JSON.parse(Buffer.from(err.response.data).toString('utf8'))
              : err.response.data);
        if (data && data.error) {
          message = data.error.info || message;
          type = data.error.type || type;
          code = data.error.code || code;
        }
      } else if (err.response.data instanceof ArrayBuffer) {
        // Fallback: try to read text
        const text = Buffer.from(err.response.data).toString('utf8');
        message = text || message;
      }
    } catch (parseErr) {
      // ignore parse errors
    }

    return res.status(status).json({
      success: false,
      error: { message, type, code }
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        message: err.message,
        type: 'validation_error',
        details: err.errors
      }
    });
  }

  // Handle generic errors
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      type: err.type || 'internal_error'
    }
  });
};

/**
 * Not found handler middleware
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      type: '404_not_found',
      path: req.originalUrl
    }
  });
};
