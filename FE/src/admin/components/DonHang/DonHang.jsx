import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

export default function DonHang() {
  const [invoices, setInvoices] = useState(["Hóa đơn 1", "Hóa đơn 2"]);
  const [canAdd, setCanAdd] = useState(true);
  const [invoiceCount, setInvoiceCount] = useState(2);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const invoiceContainerRef = useRef(null);

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

  const removeSelectedInvoice = () => {
    if (selectedInvoice !== null) {
      setInvoices(invoices.filter((_, index) => index !== selectedInvoice));
      setSelectedInvoice(null);
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
