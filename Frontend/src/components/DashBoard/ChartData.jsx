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
import { useMemo } from "react";
import TotalUserChart from "./TotalUserChart";
import TotalProductChart from "./TotalProductChart";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Sample orders data
const orders = [
  {
    id: 1,
    userId: 5,
    orderItems: [{ id: 2001, productId: 301, orderId: 1001, quantity: 2 }],
    totalAmount: 236000,
    orderDate: "2025-04-18T08:37:38.726Z",
    shippingDate: "2025-04-20T08:37:38.726Z",
    orderStatus: "PENDING",
    paymentMethod: "VNPay",
  },
  {
    id: 2,
    userId: 3,
    orderItems: [
      { id: 2002, productId: 302, orderId: 1002, quantity: 1 },
      { id: 2003, productId: 303, orderId: 1002, quantity: 3 },
    ],
    totalAmount: 578000,
    orderDate: "2025-04-18T10:15:22.123Z",
    shippingDate: "2025-04-21T10:15:22.123Z",
    orderStatus: "ACCEPT",
    paymentMethod: "COD",
  },
  {
    id: 2,
    userId: 3,
    orderItems: [
      { id: 2002, productId: 302, orderId: 1002, quantity: 1 },
      { id: 2003, productId: 303, orderId: 1002, quantity: 3 },
    ],
    totalAmount: 578000,
    orderDate: "2025-04-18T10:15:22.123Z",
    shippingDate: "2025-04-21T10:15:22.123Z",
    orderStatus: "DECLINED",
    paymentMethod: "COD",
  },
  {
    id: 2,
    userId: 3,
    orderItems: [
      { id: 2002, productId: 302, orderId: 1002, quantity: 1 },
      { id: 2003, productId: 303, orderId: 1002, quantity: 3 },
    ],
    totalAmount: 578000,
    orderDate: "2025-04-18T10:15:22.123Z",
    shippingDate: "2025-04-21T10:15:22.123Z",
    orderStatus: "DECLINED",
    paymentMethod: "COD",
  },
  {
    id: 2,
    userId: 3,
    orderItems: [
      { id: 2002, productId: 302, orderId: 1002, quantity: 1 },
      { id: 2003, productId: 303, orderId: 1002, quantity: 3 },
    ],
    totalAmount: 578000,
    orderDate: "2025-04-18T10:15:22.123Z",
    shippingDate: "2025-04-21T10:15:22.123Z",
    orderStatus: "DECLINED",
    paymentMethod: "COD",
  },
  {
    id: 2,
    userId: 3,
    orderItems: [
      { id: 2002, productId: 302, orderId: 1002, quantity: 1 },
      { id: 2003, productId: 303, orderId: 1002, quantity: 3 },
    ],
    totalAmount: 578000,
    orderDate: "2025-04-18T10:15:22.123Z",
    shippingDate: "2025-04-21T10:15:22.123Z",
    orderStatus: "DECLINED",
    paymentMethod: "COD",
  },
  {
    id: 2,
    userId: 3,
    orderItems: [
      { id: 2002, productId: 302, orderId: 1002, quantity: 1 },
      { id: 2003, productId: 303, orderId: 1002, quantity: 3 },
    ],
    totalAmount: 578000,
    orderDate: "2025-04-18T10:15:22.123Z",
    shippingDate: "2025-04-21T10:15:22.123Z",
    orderStatus: "DECLINED",
    paymentMethod: "COD",
  },
];

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

const ChartData = ({ orders: propOrders }) => {
  // Use propOrders if provided, otherwise fallback to static orders
  const dataOrders = propOrders || orders;

  // Remove duplicates (optional, uncomment if duplicates are unintentional)
  /*
  const uniqueOrders = Array.from(
    new Map(dataOrders.map((order) => [order.id, order])).values()
  );
  */

  // Filter orders for ACCEPT and DECLINED
  const filteredOrders = dataOrders.filter((order) =>
    ["ACCEPT", "DECLINED"].includes(order.orderStatus)
  );

  // Aggregate counts by month and status
  const statusTotals = useMemo(() => {
    const totals = {
      ACCEPT: Array(12).fill(0), // Array for 12 months
      DECLINED: Array(12).fill(0),
    };

    filteredOrders.forEach((order) => {
      const date = new Date(order.orderDate);
      const monthIndex = date.getMonth(); // 0 = January, 11 = December
      const status = order.orderStatus;
      totals[status][monthIndex] += 1;
    });

    return totals;
  }, [filteredOrders]);

  // Prepare chart data
  const chartData = {
    labels, // 12 months
    datasets: [
      {
        label: "ACCEPTED",
        data: statusTotals.ACCEPT,
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Green for ACCEPT
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "DECLINED",
        data: statusTotals.DECLINED,
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Red for DECLINED
        borderColor: "rgba(255, 99, 132, 1)",
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
        text: "Number of Orders by Status",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 1000,
        title: {
          display: true,
          text: "Number of Orders",
        },
        ticks: {
          stepSize: 100, // Whole numbers for counts
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

  // Handle empty data
  if (filteredOrders.length === 0) {
    return <div className="p-4">No ACCEPT or DECLINED orders available</div>;
  }

  return (
    // <div>
    //   <div>
    //     {/* <div className="p-6 w-full h-[600px] bg-white shadow-lg rounded-lg">
    //       <Bar data={chartData} options={options} />
    //     </div> */}
    //     {/* <div className="p-6 w-1/2 h-[600px] bg-white shadow-lg rounded-lg">
    //       <Bar data={chartData} options={options} />
    //     </div>
    //   </div>
    //   <div className="flex flex-row gap-4">
    //     <div className="p-6 w-1/2 h-[600px] bg-white shadow-lg rounded-lg">
    //       <Bar data={chartData} options={options} />
    //     </div>
    //     <div className="p-6 w-1/2 h-[600px] bg-white shadow-lg rounded-lg">
    //       <Bar data={chartData} options={options} />
    //     </div> */}
    //   </div>
    // </div>
    <div className="layout_container">
      <div className="layout_content flex flex-row gap-5">
        <div className="chart_content w-1/2">
          <TotalUserChart />
        </div>
        <div className="chart_content w-1/2">
          <TotalProductChart />
        </div>
      </div>
    </div>
  );
};

export default ChartData;
