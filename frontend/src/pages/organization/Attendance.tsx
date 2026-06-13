import React, { useState } from 'react';

type ShiftAttendee = { id: string; name: string; attended: boolean };
type Shift = { id: string; title: string; date: string; registered: number; attendees: ShiftAttendee[] };

const MOCK_SHIFTS: Shift[] = [
  {
    id: '1', title: 'Riverbank Cleanup — Morning Team', date: '2026-06-22', registered: 5,
    attendees: [
      { id: 'a1', name: 'Alemu Bekele', attended: false },
      { id: 'a2', name: 'Selam Tadesse', attended: false },
      { id: 'a3', name: 'Dawit Yohannes', attended: false },
      { id: 'a4', name: 'Hana Girma', attended: false },
      { id: 'a5', name: 'Merit Alem', attended: false },
    ]
  },
  {
    id: '2', title: 'Youth Outreach — Workshop Assistants', date: '2026-06-23', registered: 3,
    attendees: [
      { id: 'b1', name: 'Liya Solomon', attended: false },
      { id: 'b2', name: 'Yonas Tesfaye', attended: false },
      { id: 'b3', name: 'Beza Haile', attended: false },
    ]
  },
];

export default function Attendance() {
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS);
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const selectedShift = shifts.find(s => s.id === selectedShiftId) || null;

  const toggleAttendance = (attendeeId: string) => {
    setShifts(shifts.map(shift =>
      shift.id === selectedShiftId
        ? { ...shift, attendees: shift.attendees.map(a => a.id === attendeeId ? { ...a, attended: !a.attended } : a) }
        : shift
    ));
  };

  const markAll = (val: boolean) => {
    setShifts(shifts.map(shift =>
      shift.id === selectedShiftId
        ? { ...shift, attendees: shift.attendees.map(a => ({ ...a, attended: val })) }
        : shift
    ));
  };

  const saveAttendance = () => {
    showToast(`✅ Attendance saved for "${selectedShift?.title}"!`);
  };

  return (
    <div className="space-y-6 pb-10 relative">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-50 text-green-800 border border-green-200 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold animate-bounce">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#DA121A] tracking-tight">Attendance Logger</h1>
          <p className="text-sm text-slate-500 mt-1">Select a shift and mark which volunteers showed up.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shifts List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Your Shifts</h2>
          {shifts.map(shift => {
            const attended = shift.attendees.filter(a => a.attended).length;
            return (
              <button
                key={shift.id}
                onClick={() => setSelectedShiftId(shift.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedShiftId === shift.id
                    ? 'bg-[#DA121A] text-white border-[#DA121A] shadow-md'
                    : 'bg-white border-slate-200 hover:border-[#DA121A] hover:shadow-sm'
                }`}
              >
                <div className={`font-bold text-sm mb-1 ${selectedShiftId === shift.id ? 'text-white' : 'text-slate-900'}`}>
                  {shift.title}
                </div>
                <div className={`text-xs flex items-center gap-3 ${selectedShiftId === shift.id ? 'text-red-100' : 'text-slate-500'}`}>
                  <span>📅 {shift.date}</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider ${
                    selectedShiftId === shift.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {attended}/{shift.registered} Attended
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Attendance Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          {!selectedShift ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <span className="text-4xl">👈</span>
              <p className="font-medium">Select a shift to log attendance</p>
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="font-bold text-slate-900">{selectedShift.title}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Date: {selectedShift.date} · {selectedShift.registered} Registered</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => markAll(true)} className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
                      Mark All ✓
                    </button>
                    <button onClick={() => markAll(false)} className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                      Clear All
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 divide-y divide-slate-100">
                {selectedShift.attendees.map((person) => (
                  <label key={person.id} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                        person.attended ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}>
                        {person.attended
                          ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          : person.name.charAt(0)
                        }
                      </div>
                      <span className={`font-semibold text-sm transition-colors ${person.attended ? 'text-green-700' : 'text-slate-700'}`}>
                        {person.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                        person.attended ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {person.attended ? 'Present' : 'Absent'}
                      </span>
                      <input
                        type="checkbox"
                        checked={person.attended}
                        onChange={() => toggleAttendance(person.id)}
                        className="w-5 h-5 accent-[#DA121A] cursor-pointer"
                      />
                    </div>
                  </label>
                ))}
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="text-sm text-slate-500 font-medium">
                  <span className="font-black text-green-700">{selectedShift.attendees.filter(a => a.attended).length}</span> of {selectedShift.registered} marked present
                </div>
                <button
                  onClick={saveAttendance}
                  className="bg-[#DA121A] hover:bg-[#b00e15] text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Save Attendance
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
