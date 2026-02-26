/**
 * Donate Page
 * Khalti and eSewa payment integration
 */

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaHeart, FaCheckCircle, FaTimesCircle, FaShieldAlt, FaHandsHelping } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PRESET_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

const Donate = () => {
  const [searchParams] = useSearchParams();
  const gatewayStatus = searchParams.get('status');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    customAmount: '',
    message: '',
  });
  const [gateway, setGateway] = useState('khalti');
  const [loading, setLoading] = useState(false);

  const effectiveAmount = form.amount === 'custom' ? form.customAmount : form.amount;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePreset = (val) => {
    setForm((prev) => ({ ...prev, amount: String(val), customAmount: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!effectiveAmount || parseFloat(effectiveAmount) < 10) {
      toast.error('Minimum donation amount is Rs. 10');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name || 'Anonymous',
        email: form.email,
        phone: form.phone,
        amount: effectiveAmount,
        message: form.message,
      };

      if (gateway === 'khalti') {
        const res = await axios.post(`${API_BASE}/donate/khalti/initiate`, payload);
        // Redirect to Khalti payment page
        window.location.href = res.data.data.payment_url;

      } else {
        // eSewa: get form data then POST a hidden form
        const res = await axios.post(`${API_BASE}/donate/esewa/initiate`, payload);
        const d = res.data.data;

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = d.esewa_url;

        const fields = {
          amount: d.amount,
          tax_amount: d.tax_amount,
          total_amount: d.total_amount,
          transaction_uuid: d.transaction_uuid,
          product_code: d.product_code,
          product_service_charge: 0,
          product_delivery_charge: 0,
          success_url: d.success_url,
          failure_url: d.failure_url,
          signed_field_names: 'total_amount,transaction_uuid,product_code',
        };

        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }

    } catch (err) {
      toast.error(err?.response?.data?.message || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  // Show success/failure feedback after redirect back
  if (gatewayStatus === 'failed') {
    return (
      <PublicLayout>
        <div className="container-custom py-24 flex flex-col items-center text-center">
          <FaTimesCircle className="text-red-500 text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-500 mb-6">Your payment could not be completed. No amount was charged.</p>
          <a href="/donate" className="btn btn-primary">Try Again</a>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container-custom relative text-center fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/10 text-primary-100 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
            <FaHeart size={12} /> Support Our Mission
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Make a Donation</h1>
          <p className="text-lg text-primary-200 max-w-xl mx-auto">
            Your generosity directly supports migrant workers fighting for their rights and dignity.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-slate-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10 items-start">

            {/* ─── Donation Form ─────────────────────────── */}
            <div className="lg:col-span-2">
              <div className="card p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Choose Your Donation</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Preset amounts */}
                  <div>
                    <label className="label">Select Amount (NPR)</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                      {PRESET_AMOUNTS.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handlePreset(val)}
                          className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                            form.amount === String(val)
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400'
                          }`}
                        >
                          Rs. {val.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    {/* Custom amount */}
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, amount: 'custom' }))}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold border transition-all mb-2 ${
                        form.amount === 'custom'
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400'
                      }`}
                    >
                      Custom Amount
                    </button>
                    {form.amount === 'custom' && (
                      <div className="relative mt-2">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                          Rs.
                        </span>
                        <input
                          type="number"
                          name="customAmount"
                          value={form.customAmount}
                          onChange={handleChange}
                          placeholder="Enter amount"
                          min={10}
                          className="input pl-12"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>

                  {/* Donor info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="98XXXXXXXX"
                        className="input"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="label">Message <span className="text-gray-400 font-normal">(optional)</span></label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Leave a message of support…"
                      className="input resize-none"
                    />
                  </div>

                  {/* Gateway selector */}
                  <div>
                    <label className="label">Pay With</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'khalti', label: 'Khalti', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-300' },
                        { id: 'esewa', label: 'eSewa', color: 'text-green-700', bg: 'bg-green-50 border-green-300' },
                      ].map((gw) => (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => setGateway(gw.id)}
                          className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                            gateway === gw.id
                              ? `${gw.bg} ${gw.color} shadow-sm`
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <span
                            className={`h-3 w-3 rounded-full ${
                              gw.id === 'khalti' ? 'bg-purple-600' : 'bg-green-600'
                            }`}
                          />
                          {gw.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  {effectiveAmount && parseFloat(effectiveAmount) >= 10 && (
                    <div className="bg-primary-50 border border-primary-100 rounded-xl px-5 py-4 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Donation</span>
                      <span className="text-xl font-bold text-primary-700">
                        Rs. {parseFloat(effectiveAmount).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !effectiveAmount || parseFloat(effectiveAmount) < 10}
                    className="btn btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Redirecting to {gateway === 'khalti' ? 'Khalti' : 'eSewa'}…
                      </span>
                    ) : (
                      <>
                        <FaHeart size={14} />
                        Donate via {gateway === 'khalti' ? 'Khalti' : 'eSewa'}
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                    <FaShieldAlt size={11} />
                    Payments are processed securely. NMN never stores your card details.
                  </p>
                </form>
              </div>
            </div>

            {/* ─── Sidebar Info ──────────────────────────── */}
            <div className="space-y-5">
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-xl bg-primary-100 flex items-center justify-center">
                    <FaHandsHelping className="text-primary-600" size={16} />
                  </div>
                  <h3 className="font-semibold text-gray-900">Why Donate?</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  {[
                    'Provide legal aid to migrant workers',
                    'Fund training and e-learning programs',
                    'Support families in crisis',
                    'Advocate for fair immigration policy',
                    'Run community outreach campaigns',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FaCheckCircle className="text-primary-500 mt-0.5 shrink-0" size={13} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-6 bg-primary-700 text-white border-0">
                <p className="text-sm font-semibold mb-1 text-primary-100">100% of donations go to</p>
                <p className="text-lg font-bold">Direct program support</p>
                <p className="text-xs text-primary-200 mt-2">
                  No administrative fees are deducted from your donation.
                </p>
              </div>

              <div className="card p-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
                  Accepted Gateways
                </p>
                <div className="flex gap-3">
                  <div className="flex-1 bg-purple-50 border border-purple-100 rounded-xl py-3 text-center text-sm font-bold text-purple-700">
                    Khalti
                  </div>
                  <div className="flex-1 bg-green-50 border border-green-100 rounded-xl py-3 text-center text-sm font-bold text-green-700">
                    eSewa
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Donate;
