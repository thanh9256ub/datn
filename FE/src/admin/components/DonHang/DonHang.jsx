import { useState } from "react";
import { Button } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

export default function DonHang() {
  const [invoices, setInvoices] = useState(["Hóa đơn 1", "Hóa đơn 2", "Hóa đơn 3"]);

  const addInvoice = () => {
    setInvoices([...invoices, `Hóa đơn ${invoices.length + 1}`]);
  };

  const removeInvoices = () => {
    setInvoices([]);
  };

  return (
    <div className="d-flex align-items-center border border-primary rounded p-2 w-100 overflow-hidden">
       
      <Button className="btn btn-success rounded-pill px-4 py-2" onClick={addInvoice}>
        Tạo hóa đơn
      </Button>
      
      
      <div className="mx-2 border-start border-dark" style={{ height: "24px" }}></div>
      
       
      <div className="d-flex flex-nowrap overflow-auto">
        {invoices.map((invoice, index) => (
          <Button key={index} className="btn btn-light border mx-1">
            {invoice}
          </Button>
        ))}
      </div>
      
       
      <Trash className="ms-auto cursor-pointer" size={24} onClick={removeInvoices} />
    </div>
  );
}
