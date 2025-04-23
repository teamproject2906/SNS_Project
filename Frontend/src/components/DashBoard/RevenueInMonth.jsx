import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "../../pages/Login/app/static";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define 12 months
const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const RevenueInMonth = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const token = getToken();
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/v1/order-details", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const completedOrders = res.data.filter(
        (item) => item.orderStatus === "COMPLETED"
      );
      setOrders(completedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.response?.data.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Aggregate revenue by month
  const monthlyRevenue = useMemo(() => {
    const revenue = Array(12).fill(0); // Array for 12 months

    orders.forEach((order) => {
      const date = new Date(order.orderDate);
      const monthIndex = date.getMonth(); // 0 = January, 11 = December
      revenue[monthIndex] += order.totalAmount;
    });

    return revenue;
  }, [orders]);

  // Prepare chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthlyRevenue,
        backgroundColor: "rgba(255, 159, 64, 0.6)", // Orange for revenue
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Revenue by Month",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${context.dataset.label}: ${value.toLocaleString()} VND`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue (VND)",
        },
        ticks: {
          callback: (value) => value.toLocaleString(), // Format numbers with commas
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };

  // Handle loading and empty data
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (orders.length === 0) {
    return <div className="p-4">No completed orders available</div>;
  }

  return (
    <div className="p-6 w-full h-[400px] bg-white shadow-lg rounded-lg">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RevenueInMonth;