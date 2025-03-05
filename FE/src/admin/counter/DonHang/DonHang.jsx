import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import InvoiceList from './InvoiceList';
import axios from 'axios';

export default function DonHang({ onSelectInvoice, onDeleteInvoice }) {
  const [invoices, setInvoices] = useState([]);
  const [canAdd, setCanAdd] = useState(true);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    // Fetch invoices from the API
    axios.get('http://localhost:8080/order')
      .then(response => {
        setInvoices(response.data.data);
        setInvoiceCount(response.data.data.length);
        console.log('Fetched orders:', response.data);
      })
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  const addInvoice = () => {
    if (!canAdd) return;

    const newInvoiceCount = invoiceCount + 1;
    const newInvoice = { id: newInvoiceCount, orderCode: `O${newInvoiceCount}`, customerId: 100 + newInvoiceCount, description: `Hóa đơn ${newInvoiceCount}` };

    // Send POST request to the API to add the new invoice
    axios.post('http://localhost:8080/order/add', newInvoice)
      .then(response => {
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
      // Send DELETE request to the API to delete the invoice
      axios.delete(`http://localhost:8080/order/${invoiceToRemove.id}`)
        .then(response => {
          onDeleteInvoice(invoiceToRemove.id);
          setInvoices(invoices.filter((_, idx) => idx !== index));
          if (selectedInvoice === index) {
            setSelectedInvoice(null);
            onSelectInvoice(null);
          }
        })
        .catch(error => console.error('Error deleting invoice:', error));
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
