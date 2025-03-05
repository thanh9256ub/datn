import React, { useState, useEffect } from "react";
import SanPham from "./SanPham/SanPham";
import ThanhToan from "./ThanhToan/ThanhToan";
import { Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';

const BanHang = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [canAdd, setCanAdd] = useState(true);
  const [invoiceCount, setInvoiceCount] = useState(0);

  const fetchInvoices = () => {
    axios.get('http://localhost:8080/order')
      .then(response => {
        const filteredInvoices = response.data.data.filter(invoice => invoice.status === 1);
        setInvoices(filteredInvoices);
        setInvoiceCount(filteredInvoices.length);
        console.log('Fetched orders:', filteredInvoices);
      })
      .catch(error => console.error('Error fetching orders:', error));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const addInvoice = () => {
    if (!canAdd) return;

    const newInvoice = { employee: 1, status: 0 };

    axios.post('http://localhost:8080/order/add', newInvoice)
      .then(response => {
        setCanAdd(false);
        fetchInvoices(); 
        setCanAdd(true);
      })
      .catch(error => console.error('Error adding invoice:', error));
  };

  const removeSelectedInvoice = (index) => {
    const invoiceToRemove = invoices[index];
    if (invoiceToRemove) {
      axios.put(`http://localhost:8080/order/edit/${invoiceToRemove.id}`, { status: 1 })
        .then(response => {
          handleDeleteInvoice(invoiceToRemove.id);
          setInvoices(invoices.filter((_, idx) => idx !== index));
          if (selectedInvoiceId === invoiceToRemove.id) {
            setSelectedInvoiceId(null);
          }
        })
        .catch(error => console.error('Error deleting invoice:', error));
    }
  };

  const handleSelectInvoice = (index) => {
    const selectedInvoiceId = invoices[index].id;
    setSelectedInvoiceId(selectedInvoiceId);
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (selectedInvoiceId === invoiceId) {
      setSelectedInvoiceId(null);
    }
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      <Row className="align-items">
        <Col md={8}>
          <div className="p-3 border">
            <div className="d-flex align-items-center rounded p-2 w-100 overflow-hidden" style={{ marginBottom: "10px" }}>
              <div style={{ flexShrink: 0 }}>
                <Button variant="success" className="rounded-pill px-4 py-2" onClick={addInvoice} disabled={!canAdd}>
                  Tạo hóa đơn
                </Button>
              </div>
              <div className="mx-2 border-start border-dark" style={{ height: "24px" }}></div>
              <div className="d-flex flex-nowrap overflow-auto" style={{ maxWidth: "950px", whiteSpace: "nowrap" }}>
                {invoices.map((invoice, index) => (
                  <div key={index} className="d-flex align-items-center mx-1">
                    <Button
                      variant={selectedInvoiceId === invoice.id ? "primary" : "light"}
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
            </div>
            <SanPham selectedInvoice={selectedInvoiceId} />
          </div>
        </Col>
        <Col md={4}>
          <div className="p-3 border">
            <ThanhToan />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BanHang;
