/**
 * Event Detail Page
 * Display single event details
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { eventService } from '../services';
import { getImageUrl } from '../utils/imageHelper';

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
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-2xl">Loading...</div>
        </div>
      </PublicLayout>
    );
  }

  if (!event) {
    return (
      <PublicLayout>
        <div className="container-custom py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <Link to="/events" className="text-primary-600 hover:underline">
            ← Back to Events
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const eventDate = new Date(event.event_date);
  const isPast = eventDate < new Date();

  return (
    <PublicLayout>
      <div className="container-custom py-16">
        <Link to="/events" className="text-primary-600 hover:underline mb-6 inline-block">
          ← Back to Events
        </Link>

        <div className="max-w-4xl mx-auto">
          {event.image_url && (
            <img
              src={getImageUrl(event.image_url)}
              alt={event.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          )}

          <div className="mb-4">
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                isPast ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
              }`}
            >
              {isPast ? 'Past Event' : 'Upcoming Event'}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-6">{event.title}</h1>

          <div className="bg-primary-50 p-6 rounded-lg mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📅</span>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">
                    {eventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🕐</span>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-semibold">
                    {eventDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              {event.location && (
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📍</span>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">{event.location}</p>
                  </div>
                </div>
              )}
              {event.venue && (
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🏢</span>
                  <div>
                    <p className="text-sm text-gray-600">Venue</p>
                    <p className="font-semibold">{event.venue}</p>
                  </div>
                </div>
              )}
            </div>

            {event.registration_link && !isPast && (
              <div className="mt-4">
                <a
                  href={event.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary inline-block"
                >
                  Register Now
                </a>
              </div>
            )}
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">About This Event</h2>
            <p className="text-gray-700 mb-6 text-lg">{event.description}</p>

            {event.full_description && (
              <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                {event.full_description}
              </div>
            )}
          </div>

          {event.max_participants && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
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
