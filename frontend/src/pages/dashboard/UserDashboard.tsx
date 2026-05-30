import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import client from '../../api/client';
import { useBookingStore } from '../../stores/bookingStore';
import toast from 'react-hot-toast';
import { Calendar, Armchair, Building, X, Clock, HelpCircle } from 'lucide-react';
import dayjs from 'dayjs';

export const UserDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { selectedOfficeId, selectedSeatId, startDate, endDate, setSelectedOfficeId, setSelectedSeatId, setDates } = useBookingStore();

  const { register, watch } = useForm({
    defaultValues: {
      startDate,
      endDate,
    }
  });

  const formStart = watch('startDate');
  const formEnd = watch('endDate');

  React.useEffect(() => {
    setDates(formStart, formEnd);
  }, [formStart, formEnd, setDates]);

  const { data: offices = [], isLoading: officesLoading } = useQuery({
    queryKey: ['offices'],
    queryFn: async () => {
      const res = await client.get('/offices');
      return res.data;
    }
  });

  const { data: seats = [], isLoading: seatsLoading } = useQuery({
    queryKey: ['seats'],
    queryFn: async () => {
      const res = await client.get('/seats');
      return res.data;
    }
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await client.get('/bookings');
      return res.data;
    }
  });

  const bookMutation = useMutation({
    mutationFn: async (data: { workingSeatId: string; officeId: string; startDate: string; endDate: string }) => {
      return client.post('/bookings', data);
    },
    onSuccess: () => {
      toast.success('Seat booked successfully!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setSelectedSeatId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to book seat. It may already be occupied.');
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return client.delete(`/bookings/${id}`);
    },
    onSuccess: () => {
      toast.success('Booking cancelled successfully!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => {
      toast.error('Failed to cancel booking.');
    }
  });

  const handleBook = () => {
    if (!selectedOfficeId || !selectedSeatId) {
      toast.error('Please select both an office and a working seat.');
      return;
    }
    bookMutation.mutate({
      officeId: selectedOfficeId,
      workingSeatId: selectedSeatId,
      startDate,
      endDate,
    });
  };

  const filteredSeats = seats.filter((seat: any) => seat.officeId === selectedOfficeId);
  const activeOffice = offices.find((o: any) => o.id === selectedOfficeId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome to Coworking</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Book your working seat and see analytics in real time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
              <Calendar className="text-primary-500" size={20} />
              Choose Booking Range
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Start Date</label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:outline-none sm:text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">End Date</label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:outline-none sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
              <Building className="text-primary-500" size={20} />
              1. Select Coworking Office
            </h3>
            
            {officesLoading ? (
              <p className="text-sm text-slate-500">Loading offices...</p>
            ) : offices.length === 0 ? (
              <p className="text-sm text-slate-500">No offices found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offices.map((office: any) => (
                  <button
                    key={office.id}
                    onClick={() => setSelectedOfficeId(office.id)}
                    className={`flex flex-col text-left p-5 border rounded-xl shadow-sm transition-all ${
                      selectedOfficeId === office.id
                        ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/20 ring-1 ring-primary-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-slate-900 dark:text-white text-base">{office.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{office.description}</span>
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-4">${office.price} / day</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedOfficeId && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
                <Armchair className="text-primary-500" size={20} />
                2. Choose Working Seat in {activeOffice?.name}
              </h3>
              
              {seatsLoading ? (
                <p className="text-sm text-slate-500">Loading seats...</p>
              ) : filteredSeats.length === 0 ? (
                <p className="text-sm text-slate-500">No seats found in this office.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredSeats.map((seat: any) => (
                    <button
                      key={seat.id}
                      onClick={() => setSelectedSeatId(seat.id)}
                      className={`flex flex-col items-center justify-center p-4 border rounded-xl shadow-sm transition-all ${
                        selectedSeatId === seat.id
                          ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/20 ring-1 ring-primary-500'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <Armchair size={24} className={selectedSeatId === seat.id ? 'text-primary-500' : 'text-slate-400'} />
                      <span className="font-semibold text-xs mt-2 text-slate-900 dark:text-white">{seat.name}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">${seat.price}</span>
                    </button>
                  ))}
                </div>
              )}

              {selectedSeatId && (
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleBook}
                    disabled={bookMutation.isPending}
                    className="flex justify-center items-center py-2.5 px-6 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none disabled:opacity-50 transition-colors"
                  >
                    {bookMutation.isPending ? 'Confirming...' : 'Book Selected Seat Now'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
              <Clock className="text-primary-500" size={20} />
              Your Active Bookings
            </h3>
            
            {bookingsLoading ? (
              <p className="text-sm text-slate-500">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle size={32} className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No active bookings yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: any) => (
                  <div key={booking.id} className="border border-slate-100 dark:border-slate-800 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-950/20 relative">
                    <button
                      onClick={() => cancelMutation.mutate(booking.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Cancel Booking"
                    >
                      <X size={16} />
                    </button>
                    <div className="font-bold text-sm text-slate-900 dark:text-white pr-6">
                      {booking.office?.name || 'Office Space'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Seat: <span className="font-medium text-slate-800 dark:text-slate-200">{booking.workingSeat?.name || 'N/A'}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Range: <span className="font-medium text-slate-800 dark:text-slate-200">
                        {dayjs(booking.startDate).format('MMM D')} - {dayjs(booking.endDate).format('MMM D, YYYY')}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
