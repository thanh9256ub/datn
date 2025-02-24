import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import InvoiceList from './InvoiceList';

export default function DonHang({ onSelectInvoice, onDeleteInvoice }) {
  const [invoices, setInvoices] = useState([
    { id: 1, customerId: 101, description: "Hóa đơn 1" },
    { id: 2, customerId: 102, description: "Hóa đơn 2" }
  ]);
  const [canAdd, setCanAdd] = useState(true);
  const [invoiceCount, setInvoiceCount] = useState(2);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const addInvoice = () => {
    if (!canAdd) return;

    const newInvoiceCount = invoiceCount + 1;
    const newInvoice = { id: newInvoiceCount, customerId: 100 + newInvoiceCount, description: `Hóa đơn ${newInvoiceCount}` };
    setInvoices([newInvoice, ...invoices]);
    setInvoiceCount(newInvoiceCount);
    setSelectedInvoice(0);
    onSelectInvoice(newInvoice.id);
    setCanAdd(false);

    setTimeout(() => {
      setCanAdd(true);
    }, 3000); // Chờ 3 giây sau mỗi lần tạo hóa đơn
  };

  const removeSelectedInvoice = (index) => {
    const invoiceToRemove = invoices[index];
    if (invoiceToRemove) {
      onDeleteInvoice(invoiceToRemove.id);
    }
    setInvoices(invoices.filter((_, idx) => idx !== index));
    if (selectedInvoice === index) {
      setSelectedInvoice(null);
      onSelectInvoice(null);
    }
  };

  const handleSelectInvoice = (index) => {
    setSelectedInvoice(index);
    onSelectInvoice(invoices[index].id);
  };

  return (
    <div className="d-flex align-items-center rounded p-2 w-100 overflow-hidden" style={{ marginBottom: "10px" }}>
      <Button variant="success" className="rounded-pill px-4 py-2" onClick={addInvoice} disabled={!canAdd}>
        Tạo hóa đơn
      </Button>
      <div className="mx-2 border-start border-dark" style={{ height: "24px" }}></div>
      <InvoiceList
        invoices={invoices}
        selectedInvoice={selectedInvoice}
        handleSelectInvoice={handleSelectInvoice}
        removeSelectedInvoice={removeSelectedInvoice}
      />
    </div>
  );
}
