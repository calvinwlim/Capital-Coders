import axios from "axios";

export const calculateMonths = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth();
  return `${months} months`;
};
