import React from 'react';
import { Button } from 'react-bootstrap';

const InvoiceList = ({ invoices, selectedInvoice, handleSelectInvoice, removeSelectedInvoice }) => {
  return (
    <div className="d-flex flex-nowrap overflow-auto" style={{ maxWidth: "950px", whiteSpace: "nowrap" }}>
      {invoices.map((invoice, index) => (
        <div key={index} className="d-flex align-items-center mx-1">
          <Button
            variant={selectedInvoice === index ? "primary" : "light"}
            className="border px-3 py-2"
            onClick={() => handleSelectInvoice(index)}
          >
            {invoice.orderCode}
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
  );
};

export default InvoiceList;
