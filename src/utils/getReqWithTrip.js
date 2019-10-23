/* eslint-disable no-restricted-syntax */
import Sequelize from 'sequelize';

const { Op } = Sequelize;

const getReqsWithTrips = (query) => {
  const entries = Object.entries(query);
  const newData = {};
  for (const [key, value] of entries) {
    newData[key] = value;
  }
  const { destination, reason, ...reqData } = newData;
  const {
    status, address, id, ...tripData
  } = newData;
  if (tripData.reason) {
    tripData.reason = { [Op.like]: `${tripData.reason}%` };
  }
  return { tripData, reqData };
};

export default getReqsWithTrips;
