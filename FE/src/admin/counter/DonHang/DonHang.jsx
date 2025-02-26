import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import InvoiceList from './InvoiceList';

export default function DonHang({ onSelectInvoice, onDeleteInvoice }) {
  const [invoices, setInvoices] = useState([
    { id: 1, customerId: 101, description: "Hóa đơn 1" },
    { id: 2, customerId: 102, description: "Hóa đơn 2" }
  ]);
  const [canAdd, setCanAdd] = useState(true);
  const [invoiceCount, setInvoiceCount] = useState(0);
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
        }, 1000); // Chờ 1 giây sau mỗi lần tạo hóa đơn
      })
      .catch(error => console.error('Error adding invoice:', error));
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

  useEffect(() => {
    if (invoiceContainerRef.current) {
      invoiceContainerRef.current.scrollLeft = 0;
    }
  }, [invoices]);

  return (
    <div className="d-flex align-items-center border border-primary rounded p-2 w-100 overflow-hidden">
      <Button className="btn btn-success rounded-pill px-4 py-2" onClick={addInvoice} disabled={!canAdd}>
        Tạo hóa đơn
      </Button>

      <div className="mx-2 border-start border-dark" style={{ height: "24px" }}></div>

      <div
        ref={invoiceContainerRef}
        className="d-flex flex-nowrap overflow-auto"
        style={{ maxWidth: "950px", whiteSpace: "nowrap" }}
      >
        {invoices.map((invoice, index) => (
          <Button
            key={index}
            className={`btn btn-light border mx-1 ${selectedInvoice === index ? 'active' : ''}`}
            onClick={() => setSelectedInvoice(index)}
          >
            {invoice}
          </Button>
        ))}
      </div>

      <Trash className="ms-auto cursor-pointer" size={24} onClick={removeSelectedInvoice} />
    </div>
  );
}
