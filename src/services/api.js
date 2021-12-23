import axios from "axios";

export const bookingList = async () =>
  await axios
    .get(`${process.env.VUE_APP_API_HOST}/api/v1/booking/`)
    .then(({ data, status }) => ({ data, status }))
    .catch(({ response: { status } = {} }) => ({ status }));

export const bookingCreate = async ({ day, identifier, slot }) =>
  await axios
    .post(`${process.env.VUE_APP_API_HOST}/api/v1/booking/`, {
      day,
      identifier,
      slot,
    })
    .then(({ data, status }) => ({ data, status }))
    .catch(({ response: { data: errors, status } = {} }) => {
      if (status === 400) {
        return { errors, status };
      } else {
        return {
          status,
        };
      }
    });

export const slotList = async () =>
  await axios
    .get(`${process.env.VUE_APP_API_HOST}/api/v1/slot/`)
    .then(({ data, status }) => ({ data, status }))
    .catch(({ response: { status = undefined } = {} }) => ({ status }));

export const healthStatus = async () =>
  await axios
    .get(`${process.env.VUE_APP_API_HOST}/api/v1/health/`)
    .then(({ status }) => status)
    .catch(() => undefined);
