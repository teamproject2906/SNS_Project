import { getOrders } from "../services/orderService";
import { useState, useEffect } from "react";
import { OrderStatus } from "../constants/DataConstant";

const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderStatus, setOrderStatus] = useState(OrderStatus.PENDING);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        console.log(userId, orderStatus);
        if (Number.isInteger(userId) && (orderStatus)) {
            const fetchOrders = async () => {
                try {
                    setLoading(true);
                    const response = await getOrders(userId, orderStatus);
                    setOrders(response);
                } catch (error) {
                    setError(error);
                } finally {
                    setLoading(false);
                }
            }
            fetchOrders();
        }
    }, [userId, orderStatus]);

    return { orders, loading, error, orderStatus, setOrderStatus, userId, setUserId };
}

export default useOrders;
