/**
 * Public Events Page
 * Display all published events
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { eventService } from '../services';
import { getImageUrl } from '../utils/imageHelper';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = filter === 'upcoming' ? { upcoming: true } : {};
      const response = await eventService.getAll(params);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
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

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold">Events</h1>
          <p className="text-xl mt-2">Join us in making a difference</p>
        </div>
      </section>

      {/* Filter Buttons */}
      <div className="bg-gray-50 border-b">
        <div className="container-custom py-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'upcoming'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Events
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container-custom py-16">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No {filter === 'upcoming' ? 'upcoming' : ''} events available yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const eventDate = new Date(event.event_date);
              const isPast = eventDate < new Date();

              return (
                <Link
                  key={event.id}
                  to={`/events/${event.slug}`}
                  className="card overflow-hidden hover:scale-105 transition"
                >
                  {event.image_url && (
                    <img
                      src={getImageUrl(event.image_url)}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          isPast
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {isPast ? 'Past Event' : 'Upcoming'}
                      </span>
                      {event.is_featured && (
                        <span className="text-yellow-500">★ Featured</span>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {event.description}
                    </p>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <span className="mr-2">📅</span>
                        {eventDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="flex items-center">
                        <span className="mr-2">🕐</span>
                        {eventDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {event.location && (
                        <p className="flex items-center">
                          <span className="mr-2">📍</span>
                          {event.location}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 text-primary-600 font-medium">
                      View Details →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Events;
