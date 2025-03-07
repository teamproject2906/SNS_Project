import { useState } from "react";
import DataTable from "react-data-table-component";

const OrderTable = () => {
  const [orders] = useState([
    { id: 1, user: "Alice", product: "Laptop", quantity: 1, total: "$1000" },
    { id: 2, user: "Bob", product: "Phone", quantity: 2, total: "$1000" },
  ]);

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "User", selector: (row) => row.user, sortable: true },
    { name: "Product", selector: (row) => row.product, sortable: true },
    { name: "Quantity", selector: (row) => row.quantity, sortable: true },
    { name: "Total", selector: (row) => row.total, sortable: true },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold my-4">Orders</h3>
      <DataTable columns={columns} data={orders} pagination />
    </div>
  );
};

export default OrderTable;
