import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { Plus, Trash2, Building, Armchair, Calendar, Users } from 'lucide-react';
import dayjs from 'dayjs';

export const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'offices' | 'seats' | 'bookings' | 'users'>('offices');
  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);

  const { register: regOffice, handleSubmit: handleOfficeSubmit, reset: resetOffice } = useForm();
  const { register: regSeat, handleSubmit: handleSeatSubmit, reset: resetSeat } = useForm();

  const { data: offices = [] } = useQuery({
    queryKey: ['offices'],
    queryFn: async () => (await client.get('/offices')).data,
  });

  const { data: seats = [] } = useQuery({
    queryKey: ['seats'],
    queryFn: async () => (await client.get('/seats')).data,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => (await client.get('/bookings')).data,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await client.get('/users')).data,
  });

  const createOfficeMutation = useMutation({
    mutationFn: async (data: any) => client.post('/offices', data),
    onSuccess: () => {
      toast.success('Office created successfully!');
      queryClient.invalidateQueries({ queryKey: ['offices'] });
      setIsOfficeModalOpen(false);
      resetOffice();
    },
    onError: () => toast.error('Failed to create office.'),
  });

  const createSeatMutation = useMutation({
    mutationFn: async (data: any) => client.post('/seats', data),
    onSuccess: () => {
      toast.success('Working seat created successfully!');
      queryClient.invalidateQueries({ queryKey: ['seats'] });
      setIsSeatModalOpen(false);
      resetSeat();
    },
    onError: () => toast.error('Failed to create seat.'),
  });

  const deleteOfficeMutation = useMutation({
    mutationFn: async (id: string) => client.delete(`/offices/${id}`),
    onSuccess: () => {
      toast.success('Office deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['offices'] });
    },
  });

  const deleteSeatMutation = useMutation({
    mutationFn: async (id: string) => client.delete(`/seats/${id}`),
    onSuccess: () => {
      toast.success('Working seat deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['seats'] });
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (id: string) => client.delete(`/bookings/${id}`),
    onSuccess: () => {
      toast.success('Booking deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => client.delete(`/users/${id}`),
    onSuccess: () => {
      toast.success('User deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const onOfficeSubmit = (data: any) => {
    createOfficeMutation.mutate({
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      availability: true,
    });
  };

  const onSeatSubmit = (data: any) => {
    createSeatMutation.mutate({
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      availability: true,
      officeId: data.officeId,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Management</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage spaces, workspaces, memberships and transactions.</p>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        {[
          { id: 'offices', label: 'Offices', icon: Building },
          { id: 'seats', label: 'Seats', icon: Armchair },
          { id: 'bookings', label: 'Bookings', icon: Calendar },
          { id: 'users', label: 'Users', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 pb-4 font-semibold text-sm border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
        {activeTab === 'offices' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Coworking Offices</h3>
              <button
                onClick={() => setIsOfficeModalOpen(true)}
                className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                <Plus size={14} /> Add Office
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead>
                  <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 text-slate-950 dark:text-slate-50">Name</th>
                    <th className="pb-3 text-slate-950 dark:text-slate-50">Price</th>
                    <th className="pb-3 text-slate-950 dark:text-slate-50">Availability</th>
                    <th className="pb-3 text-right text-slate-950 dark:text-slate-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                  {offices.map((office: any) => (
                    <tr key={office.id}>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{office.name}</td>
                      <td className="py-3 font-medium text-slate-600 dark:text-slate-300">${office.price} / day</td>
                      <td className="py-3">
                        <span className={`inline-block h-2 w-2 rounded-full mr-1.5 ${office.availability ? 'bg-green-500' : 'bg-red-500'}`} />
                        {office.availability ? 'Available' : 'Occupied'}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => deleteOfficeMutation.mutate(office.id)}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'seats' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Working Seats</h3>
              <button
                onClick={() => setIsSeatModalOpen(true)}
                className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                <Plus size={14} /> Add Seat
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead>
                  <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 text-slate-950 dark:text-slate-50">Name</th>
                    <th className="pb-3 text-slate-950 dark:text-slate-50">Office</th>
                    <th className="pb-3 text-slate-950 dark:text-slate-50">Price</th>
                    <th className="pb-3 text-right text-slate-950 dark:text-slate-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                  {seats.map((seat: any) => (
                    <tr key={seat.id}>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{seat.name}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{seat.office?.name || 'N/A'}</td>
                      <td className="py-3 font-medium text-slate-600 dark:text-slate-300">${seat.price}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => deleteSeatMutation.mutate(seat.id)}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Bookings</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead>
                  <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 text-slate-950 dark:text-slate-50">User</th>
                    <th className="pb-3 text-slate-950 dark:text-slate-50">Space</th>
                    <th className="pb-3 text-slate-950 dark:text-slate-50">Seat</th>
                    <th className="pb-3 text-slate-950 dark:text-slate-50">Dates</th>
                    <th className="pb-3 text-right text-slate-950 dark:text-slate-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                  {bookings.map((booking: any) => (
                    <tr key={booking.id}>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{booking.user?.name || 'User'}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{booking.office?.name || 'Office'}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{booking.workingSeat?.name || 'Seat'}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">
                        {dayjs(booking.startDate).format('MMM D')} - {dayjs(booking.endDate).format('MMM D, YYYY')}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => deleteBookingMutation.mutate(booking.id)}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Platform Users</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead>
                  <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 text-slate-950 dark:text-slate-50">Name</th>
                    <th className="pb-3 text-slate-950 dark:text-slate-50">Email</th>
                    <th className="pb-3 text-slate-950 dark:text-slate-50">Role</th>
                    <th className="pb-3 text-right text-slate-950 dark:text-slate-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                  {users.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{item.name}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{item.email}</td>
                      <td className="py-3 capitalize text-slate-600 dark:text-slate-300">{item.role}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => deleteUserMutation.mutate(item.id)}
                          disabled={item.role === 'admin'}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded-md disabled:opacity-30 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isOfficeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Office</h3>
            <form onSubmit={handleOfficeSubmit(onOfficeSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                <input
                  type="text"
                  required
                  {...regOffice('name')}
                  className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:outline-none sm:text-sm"
                  placeholder="e.g. Executive Lounge A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  {...regOffice('description')}
                  className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:outline-none sm:text-sm"
                  placeholder="Details about space..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Price per day ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  {...regOffice('price')}
                  className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:outline-none sm:text-sm"
                  placeholder="25.00"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOfficeModalOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSeatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Working Seat</h3>
            <form onSubmit={handleSeatSubmit(onSeatSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Seat Name</label>
                <input
                  type="text"
                  required
                  {...regSeat('name')}
                  className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:outline-none sm:text-sm"
                  placeholder="e.g. Desk A-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Office Zone</label>
                <select
                  required
                  {...regSeat('officeId')}
                  className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:outline-none sm:text-sm"
                >
                  <option value="">Select Office...</option>
                  {offices.map((office: any) => (
                    <option key={office.id} value={office.id}>{office.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  {...regSeat('price')}
                  className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:outline-none sm:text-sm"
                  placeholder="15.00"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSeatModalOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
