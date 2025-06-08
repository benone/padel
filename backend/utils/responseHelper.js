// Helper functions for consistent API responses
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const sendError = (res, message = 'Internal Server Error', statusCode = 500, error = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: error ? error.message : null,
    timestamp: new Date().toISOString()
  });
};

const sendPaginated = (res, data, total, page = 1, limit = 10, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasMore
    },
    timestamp: new Date().toISOString()
  });
};

// Simulate network delay for realistic API behavior
const simulateDelay = (min = 100, max = 500) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
  simulateDelay
};