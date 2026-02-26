/**
 * Donation Verify Page
 * Handles redirect back from Khalti / eSewa and verifies the payment
 */

import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DonateVerify = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | failed
  const [donation, setDonation] = useState(null);

  useEffect(() => {
    verify();
  }, []);

  const verify = async () => {
    const gateway = searchParams.get('gateway');

    try {
      if (gateway === 'khalti') {
        const pidx = searchParams.get('pidx');
        if (!pidx) { setStatus('failed'); return; }

        const res = await axios.post(`${API_BASE}/donate/khalti/verify`, { pidx });
        setDonation(res.data.data);
        setStatus('success');

      } else if (gateway === 'esewa') {
        // eSewa encodes response as base64 in `data` param
        const encoded = searchParams.get('data');
        if (!encoded) { setStatus('failed'); return; }

        const decoded = JSON.parse(atob(encoded));
        const res = await axios.post(`${API_BASE}/donate/esewa/verify`, {
          transaction_uuid: decoded.transaction_uuid,
          total_amount: decoded.total_amount,
        });
        setDonation(res.data.data);
        setStatus('success');

      } else {
        setStatus('failed');
      }
    } catch {
      setStatus('failed');
    }
  };

  return (
    <PublicLayout>
      <div className="container-custom py-24 flex flex-col items-center text-center min-h-[60vh] justify-center">
        {status === 'loading' && (
          <>
            <FaSpinner className="text-primary-600 text-5xl animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Verifying your payment…</h2>
            <p className="text-gray-400 text-sm mt-2">Please wait, do not close this page.</p>
          </>
        )}

        {status === 'success' && (
          <div className="fade-in-up">
            <FaCheckCircle className="text-primary-500 text-6xl mb-5 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-500 mb-1">
              Your donation of{' '}
              <span className="font-semibold text-gray-800">
                Rs. {parseFloat(donation?.amount || 0).toLocaleString()}
              </span>{' '}
              was received successfully.
            </p>
            {donation?.name && donation.name !== 'Anonymous' && (
              <p className="text-gray-400 text-sm mb-6">Donor: {donation.name}</p>
            )}
            <p className="text-sm text-gray-400 mb-8">
              Your contribution helps us protect the rights of migrant workers across the nation.
            </p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        )}

        {status === 'failed' && (
          <div className="fade-in-up">
            <FaTimesCircle className="text-red-500 text-6xl mb-5 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-500 mb-8">
              We could not verify your payment. No amount was charged. Please try again.
            </p>
            <Link to="/donate" className="btn btn-primary">
              Try Again
            </Link>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default DonateVerify;
