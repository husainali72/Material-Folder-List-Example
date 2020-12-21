import moment from "moment";

export const BASE_URL = "https://api.airtable.com";

export const convertDateForShow = (date) => {
  if (date) {
    return moment(date).format("LLL");
  } else {
    return moment().format("LLL");
  }
};
