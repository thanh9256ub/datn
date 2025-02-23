import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

export default function DonHang() {
  const [invoices, setInvoices] = useState(["Hóa đơn 1", "Hóa đơn 2"]);
  const [canAdd, setCanAdd] = useState(true);
  const [invoiceCount, setInvoiceCount] = useState(2);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const addInvoice = () => {
    if (!canAdd) return;

    const newInvoiceCount = invoiceCount + 1;
    setInvoices([`Hóa đơn ${newInvoiceCount}`, ...invoices]);
    setInvoiceCount(newInvoiceCount);
    setCanAdd(false);

    setTimeout(() => {
      setCanAdd(true);
    }, 3000); // Chờ 3 giây sau mỗi lần tạo hóa đơn
  };

  const removeSelectedInvoice = (index) => {
    setInvoices(invoices.filter((_, idx) => idx !== index));
  };

  return (
    <div className="d-flex align-items-center rounded p-2 w-100 overflow-hidden" style={{ marginBottom: "10px" }}>

      <Button variant="success" className="rounded-pill px-4 py-2" onClick={addInvoice} disabled={!canAdd}>
        Tạo hóa đơn
      </Button>

      <div className="mx-2 border-start border-dark" style={{ height: "24px" }}></div>

      <div className="d-flex flex-nowrap overflow-auto" style={{ maxWidth: "950px", whiteSpace: "nowrap" }}>
        {invoices.map((invoice, index) => (
          <div key={index} className="d-flex align-items-center mx-1">
            <Button
              variant={selectedInvoice === index ? "primary" : "light"}
              className="border px-3 py-2"
              onClick={() => setSelectedInvoice(index)}
            >
              {invoice}
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="ms-2"
              onClick={() => removeSelectedInvoice(index)}
            >
              X
            </Button>
          </div>
        ))}
      </div>
      
    </div>
  );
}
