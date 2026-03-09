/**
 * Public Events Page
 * Display all published events
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { eventService } from '../services';
import { getImageUrl } from '../utils/imageHelper';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';

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
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-[3px] border-primary-200 border-t-primary-600 animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary-400/15 rounded-full blur-[120px]" />
        </div>
        <div className="container-custom relative fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Events</h1>
          <p className="text-lg text-primary-200 max-w-xl">Join us in making a difference</p>
        </div>
      </section>

      {/* Filter Buttons */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-20 lg:top-[88px] z-30">
        <div className="container-custom py-4">
          <div className="flex gap-2">
            {[{ key: 'upcoming', label: 'Upcoming Events' }, { key: 'all', label: 'All Events' }].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  filter === f.key
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container-custom py-16">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-gray-400" size={20} />
            </div>
            <p className="text-lg text-gray-500 font-medium">
              No {filter === 'upcoming' ? 'upcoming' : ''} events available yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {events.map((event, index) => {
              const eventDate = new Date(event.event_date);
              const isPast = eventDate < new Date();

              return (
                <Link
                  key={event.id}
                  to={`/events/${event.slug}`}
                  className="card card-hover group overflow-hidden fade-in-up"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {event.image_url && (
                    <div className="overflow-hidden h-52 relative">
                      <img
                        src={getImageUrl(event.image_url)}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}
                  <div className="p-7">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isPast
                          ? 'bg-gray-50 text-gray-500 border border-gray-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isPast ? 'Past Event' : 'Upcoming'}
                      </span>
                      {event.is_featured && (
                        <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">Featured</span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary-700 transition-colors">{event.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-xs text-gray-400">
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt size={10} />
                        {eventDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaClock size={10} />
                        {eventDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {event.location && (
                        <p className="flex items-center gap-2">
                          <FaMapMarkerAlt size={10} />
                          {event.location}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-50">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 group-hover:gap-3 transition-all duration-300">
                        View Details <FaChevronRight size={10} />
                      </span>
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
