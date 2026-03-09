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
    name: '', email: '', phone: '', amount: '', customAmount: '', message: '',
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
        window.location.href = res.data.data.payment_url;
      } else {
        const res = await axios.post(`${API_BASE}/donate/esewa/initiate`, payload);
        const d = res.data.data;

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = d.esewa_url;

        const fields = {
          amount: d.amount, tax_amount: d.tax_amount, total_amount: d.total_amount,
          transaction_uuid: d.transaction_uuid, product_code: d.product_code,
          product_service_charge: 0, product_delivery_charge: 0,
          success_url: d.success_url, failure_url: d.failure_url,
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

  if (gatewayStatus === 'failed') {
    return (
      <PublicLayout>
        <div className="container-custom py-24 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <FaTimesCircle className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-500 mb-8">Your payment could not be completed. No amount was charged.</p>
          <a href="/donate" className="btn btn-primary">Try Again</a>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary-400/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-secondary-400/10 rounded-full blur-[100px]" />
        </div>
        <div className="container-custom relative text-center fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-primary-100 text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-6 border border-white/10">
            <FaHeart size={11} /> Support Our Mission
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Make a Donation</h1>
          <p className="text-lg text-primary-200/80 max-w-xl mx-auto">
            Your generosity directly supports migrant workers fighting for their rights and dignity.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* Donation Form */}
            <div className="lg:col-span-2">
              <div className="card p-8 md:p-10">
                <h2 className="text-xl font-extrabold text-gray-900 mb-7">Choose Your Donation</h2>

                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* Preset amounts */}
                  <div>
                    <label className="label">Select Amount (NPR)</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                      {PRESET_AMOUNTS.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handlePreset(val)}
                          className={`py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-300 ${
                            form.amount === String(val)
                              ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400 hover:text-primary-700'
                          }`}
                        >
                          Rs. {val.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, amount: 'custom' }))}
                      className={`w-full py-3 rounded-2xl text-sm font-bold border-2 transition-all mb-2 ${
                        form.amount === 'custom'
                          ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'
                      }`}
                    >
                      Custom Amount
                    </button>
                    {form.amount === 'custom' && (
                      <div className="relative mt-3">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">Rs.</span>
                        <input type="number" name="customAmount" value={form.customAmount} onChange={handleChange}
                          placeholder="Enter amount" min={10} className="input pl-12" autoFocus />
                      </div>
                    )}
                  </div>

                  {/* Donor info */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Full Name <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="input" />
                    </div>
                    <div>
                      <label className="label">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input" />
                    </div>
                    <div>
                      <label className="label">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="98XXXXXXXX" className="input" />
                    </div>
                  </div>

                  <div>
                    <label className="label">Message <span className="text-gray-400 font-normal">(optional)</span></label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                      placeholder="Leave a message of support..." className="input resize-none" />
                  </div>

                  {/* Gateway selector */}
                  <div>
                    <label className="label">Pay With</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'khalti', label: 'Khalti', activeClass: 'bg-purple-50 border-purple-300 text-purple-700', dot: 'bg-purple-600' },
                        { id: 'esewa', label: 'eSewa', activeClass: 'bg-green-50 border-green-300 text-green-700', dot: 'bg-green-600' },
                      ].map((gw) => (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => setGateway(gw.id)}
                          className={`flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border-2 font-bold text-sm transition-all duration-300 ${
                            gateway === gw.id
                              ? `${gw.activeClass} shadow-sm`
                              : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          <span className={`h-3 w-3 rounded-full ${gw.dot}`} />
                          {gw.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  {effectiveAmount && parseFloat(effectiveAmount) >= 10 && (
                    <div className="bg-gradient-to-r from-primary-50 to-emerald-50/50 border border-primary-100 rounded-2xl px-6 py-5 flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">Total Donation</span>
                      <span className="text-2xl font-extrabold text-primary-700">
                        Rs. {parseFloat(effectiveAmount).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !effectiveAmount || parseFloat(effectiveAmount) < 10}
                    className="btn btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Redirecting to {gateway === 'khalti' ? 'Khalti' : 'eSewa'}...
                      </span>
                    ) : (
                      <><FaHeart size={14} /> Donate via {gateway === 'khalti' ? 'Khalti' : 'eSewa'}</>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                    <FaShieldAlt size={11} />
                    Payments are processed securely. NMN never stores your card details.
                  </p>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="card p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                    <FaHandsHelping className="text-primary-600" size={15} />
                  </div>
                  <h3 className="font-bold text-gray-900">Why Donate?</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  {[
                    'Provide legal aid to migrant workers',
                    'Fund training and e-learning programs',
                    'Support families in crisis',
                    'Advocate for fair immigration policy',
                    'Run community outreach campaigns',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <FaCheckCircle className="text-primary-500 mt-0.5 shrink-0" size={13} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-7 bg-gradient-to-br from-primary-700 to-primary-800 text-white border-0">
                <p className="text-sm font-semibold mb-1 text-primary-200">100% of donations go to</p>
                <p className="text-lg font-extrabold">Direct program support</p>
                <p className="text-xs text-primary-300 mt-2">
                  No administrative fees are deducted from your donation.
                </p>
              </div>

              <div className="card p-7">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Accepted Gateways</p>
                <div className="flex gap-3">
                  <div className="flex-1 bg-purple-50 border border-purple-100 rounded-2xl py-3.5 text-center text-sm font-bold text-purple-700">Khalti</div>
                  <div className="flex-1 bg-green-50 border border-green-100 rounded-2xl py-3.5 text-center text-sm font-bold text-green-700">eSewa</div>
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
