import mainRequest from "../api/mainRequest";

export const createOrder = async (payload) => {
  try {
    const response = await mainRequest.post("/api/v1/order-details", payload);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getOrders = async (userId, orderStatus) => {
  try {
    const response = await mainRequest.get(
      `/api/v1/order-details/user/${userId}/status/${orderStatus}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
}

export const getOrderById = async (orderId) => {
  try {
    const response = await mainRequest.get(`/api/v1/order-details/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
