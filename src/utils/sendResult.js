const sendResult = async (res, status, msg, data) => res.status(status).json({
  status,
  msg,
  data
});
export default sendResult;
