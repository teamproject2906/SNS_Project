import mainRequest from "../api/mainRequest";

export const createOrder = async (payload) => {
  try {
    const response = await mainRequest.post("/api/v1/order-details", payload);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
