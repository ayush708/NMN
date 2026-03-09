/**
 * Event Detail Page
 * Display single event details
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { eventService } from '../services';
import { getImageUrl } from '../utils/imageHelper';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaBuilding, FaUsers } from 'react-icons/fa';

const EventDetail = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventService.getBySlug(slug);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-[3px] border-primary-200 border-t-primary-600 animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!event) {
    return (
      <PublicLayout>
        <div className="container-custom py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <Link to="/events" className="text-primary-600 hover:underline inline-flex items-center gap-2">
            <FaArrowLeft size={12} /> Back to Events
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const eventDate = new Date(event.event_date);
  const isPast = eventDate < new Date();

  return (
    <PublicLayout>
      <div className="container-custom py-10">
        <Link to="/events" className="text-primary-600 hover:text-primary-700 mb-8 inline-flex items-center gap-2 text-sm font-semibold group">
          <FaArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" /> Back to Events
        </Link>

        <div className="max-w-4xl mx-auto">
          {event.image_url && (
            <div className="rounded-3xl overflow-hidden mb-8 shadow-card">
              <img
                src={getImageUrl(event.image_url)}
                alt={event.title}
                className="w-full h-80 md:h-96 object-cover"
              />
            </div>
          )}

          <div className="mb-5">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
              isPast ? 'bg-gray-100 text-gray-600 border border-gray-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {isPast ? 'Past Event' : 'Upcoming Event'}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-8">{event.title}</h1>

          <div className="bg-gradient-to-br from-primary-50 to-emerald-50/50 rounded-3xl p-6 md:p-8 mb-8 border border-primary-100/50">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <FaCalendarAlt className="text-primary-600" size={14} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Date</p>
                  <p className="font-bold text-gray-900">
                    {eventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <FaClock className="text-primary-600" size={14} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Time</p>
                  <p className="font-bold text-gray-900">
                    {eventDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              {event.location && (
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt className="text-primary-600" size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Location</p>
                    <p className="font-bold text-gray-900">{event.location}</p>
                  </div>
                </div>
              )}
              {event.venue && (
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <FaBuilding className="text-primary-600" size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Venue</p>
                    <p className="font-bold text-gray-900">{event.venue}</p>
                  </div>
                </div>
              )}
            </div>

            {event.registration_link && !isPast && (
              <div className="mt-6 pt-5 border-t border-primary-100/50">
                <a
                  href={event.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Register Now
                </a>
              </div>
            )}
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-extrabold mb-4">About This Event</h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">{event.description}</p>

            {event.full_description && (
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.full_description}
              </div>
            )}
          </div>

          {event.max_participants && (
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <FaUsers className="text-amber-600" size={14} />
              </div>
              <p className="text-sm text-gray-700">
                <strong>Limited Seats:</strong> Maximum {event.max_participants} participants
              </p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default EventDetail;
