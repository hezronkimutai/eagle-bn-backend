/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import db from '../database/models';

const getReqsWithTrips = async () => {
  const requests = await db.Requests.findAll({ raw: true });

  for (const i in requests) {
    requests[i].Trips = await db.Trips.findAll({
      where: { RequestId: requests[i].id },
      raw: true,
    });
  }
  return requests;
};

export default getReqsWithTrips;
