const apiResponse = (message, status, data) => {
  return {
    message,
    status,
    data
  };
};

module.exports = apiResponse;
