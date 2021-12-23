import axios from "axios";

export const bookingList = async () =>
  await axios
    .get(`${process.env.VUE_APP_API_HOST}/api/v1/booking/`)
    .then(({ data, status }) => ({ data, status }))
    .catch(({ response: { status } = {} }) => ({ status }));

export const bookingCreate = async (payload) =>
  await axios
    .post(`${process.env.VUE_APP_API_HOST}/api/v1/booking/`, payload)
    .then(({ data, status }) => ({ data, status }))
    .catch(({ response: { data: errors, status } = {} }) => {
      if (status === 400 || status === 404) {
        return { errors, status };
      } else {
        return {
          status,
        };
      }
    });

export const bookingCancel = async (payload) =>
  await axios
    .post(`${process.env.VUE_APP_API_HOST}/api/v1/booking/cancel/`, payload)
    .then(({ data, status }) => ({ data, status }))
    .catch(({ response: { data: errors, status } = {} }) => {
      if (status === 400 || status === 404) {
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
