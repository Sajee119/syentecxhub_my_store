import { useState, useEffect, useRef } from 'react';
import Seo from '../../components/common/Seo';
import { useParams, Link } from 'react-router-dom';
import { Printer, ArrowLeft, Package, Download } from 'lucide-react';
import API from '../../api/axios';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useAuth } from '../../context/AuthContext';

export default function InvoicePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef(null);

  useEffect(() => {
    API.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Invoice #${order?.invoiceNumber}</title>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; padding: 40px; color: #1f2937; max-width: 800px; margin: 0 auto; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px 8px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
        .total { font-size: 18px; font-weight: bold; }
        .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; border-bottom: 2px solid #6366f1; padding-bottom: 20px; }
        .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: #eef2ff; color: #4f46e5; }
      </style></head>
      <body>
        <div class="header">
          <div><h1 style="margin:0; color:#4f46e5;">My Store</h1><p style="margin:4px 0; color:#6b7280;">123 Commerce St, San Francisco, CA</p></div>
          <div style="text-align:right;"><h2 style="margin:0;">INVOICE</h2><p style="margin:4px 0; color:#6b7280;">#${order?.invoiceNumber}</p></div>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
          <div><strong>Bill To:</strong><br/>${order?.shippingAddress?.fullName}<br/>${order?.shippingAddress?.street}<br/>${order?.shippingAddress?.city}, ${order?.shippingAddress?.state} ${order?.shippingAddress?.zip}</div>
          <div style="text-align:right;"><strong>Date:</strong> ${new Date(order?.createdAt).toLocaleDateString()}<br/><strong>Status:</strong> <span class="badge">${order?.status}</span></div>
        </div>
        <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th style="text-align:right;">Total</th></tr></thead>
        <tbody>${order?.items?.map(i => `<tr><td>${i.name}</td><td>${i.quantity}</td><td>$${i.price.toFixed(2)}</td><td style="text-align:right;">$${(i.price * i.quantity).toFixed(2)}</td></tr>`).join('') || ''}</tbody>
        </table>
        <div style="margin-left:auto; width:300px;">
          <div style="display:flex; justify-content:space-between;"><span>Subtotal:</span><span>$${order?.subtotal?.toFixed(2)}</span></div>
          <div style="display:flex; justify-content:space-between;"><span>Shipping:</span><span>${order?.shippingFee === 0 ? 'Free' : '$' + order?.shippingFee?.toFixed(2)}</span></div>
          <div style="display:flex; justify-content:space-between;"><span>Tax:</span><span>$${order?.tax?.toFixed(2)}</span></div>
          ${order?.discount ? `<div style="display:flex; justify-content:space-between; color:#10b981;"><span>Discount:</span><span>-$${order.discount.toFixed(2)}</span></div>` : ''}
          <div style="display:flex; justify-content:space-between; font-size:18px; font-weight:bold; border-top:2px solid #000; padding-top:8px; margin-top:8px;"><span>Total:</span><span>$${order?.total?.toFixed(2)}</span></div>
        </div>
        <div class="footer"><p>Thank you for your business!</p><p>My Store - support@mystore.com</p></div>
        <script>window.print();</script>
      </body></html>
    `);
    w.document.close();
  };

  if (loading) return <div className="animate-pulse h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl max-w-4xl mx-auto mt-8" />;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>;
  if (user?.role !== 'admin' && order.user?._id !== user?._id) return <div className="text-center py-20 text-gray-500">Not authorized</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Seo title="Invoice" description="View and print your order invoice." />
      <Breadcrumb items={[{ label: 'Orders', path: '/account/orders' }, { label: `Invoice #${order.invoiceNumber}` }]} />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Invoice #{order.invoiceNumber}</h1>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn-secondary text-sm flex items-center gap-2"><Printer className="w-4 h-4" /> Print</button>
        </div>
      </div>

      <div ref={invoiceRef} className="glass-card p-8 print:p-0 print:shadow-none">
        <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-primary-500">
          <div>
            <h2 className="text-2xl font-extrabold text-primary-600">My Store</h2>
            <p className="text-sm text-gray-500 mt-1">123 Commerce St, Suite 100<br />San Francisco, CA 94102</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">INVOICE</h3>
            <p className="text-sm text-gray-500">#{order.invoiceNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Bill To</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{order.shippingAddress?.fullName}</p>
            <p className="text-sm text-gray-500">{order.shippingAddress?.street}</p>
            <p className="text-sm text-gray-500">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Details</p>
            <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">Status: <span className="badge bg-primary-50 text-primary-600 capitalize">{order.status}</span></p>
          </div>
        </div>

        <table className="w-full text-sm mb-8">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="text-left py-3 font-medium text-gray-500 uppercase text-xs">Item</th>
              <th className="text-center py-3 font-medium text-gray-500 uppercase text-xs">Qty</th>
              <th className="text-right py-3 font-medium text-gray-500 uppercase text-xs">Price</th>
              <th className="text-right py-3 font-medium text-gray-500 uppercase text-xs">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 font-medium">{item.name}</td>
                <td className="py-3 text-center text-gray-500">{item.quantity}</td>
                <td className="py-3 text-right text-gray-500">${item.price.toFixed(2)}</td>
                <td className="py-3 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto w-full max-w-xs space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span><span>{order.shippingFee === 0 ? <span className="text-green-600">Free</span> : `$${order.shippingFee?.toFixed(2)}`}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Tax</span><span>${order.tax?.toFixed(2)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-sm"><span className="text-green-600">Discount</span><span className="text-green-600">-${order.discount?.toFixed(2)}</span></div>}
          <div className="flex justify-between font-bold text-lg border-t border-gray-300 dark:border-gray-700 pt-2">
            <span>Total</span><span className="text-primary-600">${order.total?.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-400">
          <p className="font-medium text-gray-600 dark:text-gray-300 mb-1">Thank you for your business!</p>
          <p>My Store — support@mystore.com</p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Link to="/account/orders" className="btn-secondary text-sm flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Orders</Link>
        <button onClick={handlePrint} className="btn-primary text-sm flex items-center gap-2"><Download className="w-4 h-4" /> Download PDF</button>
      </div>
    </div>
  );
}
