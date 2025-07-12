import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const days = [
  { key: 'Mon', label: 'Lun' },
  { key: 'Tue', label: 'Mar' },
  { key: 'Wed', label: 'Mer' },
  { key: 'Thu', label: 'Gio' },
  { key: 'Fri', label: 'Ven' },
  { key: 'Sat', label: 'Sab' },
  { key: 'Sun', label: 'Dom' },
];

// schedule: { Selim: [{ day, available, start, end }...], Daniel: [...] }
export default function WeeklyHoursEditor({ selectedBarber, schedule, setSchedule, barbers }) {
  console.log('barbers in WeeklyHoursEditor', barbers);
  const barberSchedule = schedule[selectedBarber] || days.map(d => ({ day: d.key, available: false, start: '09:00', end: '17:00' }));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [barberIdMap, setBarberIdMap] = useState({});

  useEffect(() => {
    async function fetchBarbers() {
      const { data, error } = await supabase.from('barbers').select('barber_id, name');
      if (data) {
        const map = {};
        data.forEach(barber => {
          map[barber.name] = barber.barber_id;
        });
        setBarberIdMap(map);
      }
    }
    fetchBarbers();
  }, []);

  useEffect(() => {
    async function fetchWorkingHours() {
      if (!selectedBarber) return;
      // Find the barber_id for the selectedBarber
      const barber = barbers.find(b => b.name === selectedBarber);
      if (!barber) return;
      const barber_id = barber.barber_id;

      const { data, error } = await supabase
        .from('barber_working_hours')
        .select('*')
        .eq('barber_id', barber_id);

      if (data) {
        const scheduleForBarber = days.map(d => {
          const found = data.find(item => item.day === d.key);
          return found
            ? {
                day: found.day,
                available: found.available,
                start: found.start,
                end: found.end,
              }
            : { day: d.key, available: false, start: '09:00', end: '17:00' };
        });
        setSchedule(prev => ({ ...prev, [selectedBarber]: scheduleForBarber }));
      }
    }
    fetchWorkingHours();
  }, [selectedBarber, barbers]);

  useEffect(() => {
    async function fetchAllBarbersWorkingHours() {
      if (!barbers || barbers.length === 0) return;
      // Fetch all working hours for all barbers
      const { data, error } = await supabase
        .from('barber_working_hours')
        .select('*');
      if (data) {
        // Group by barber_id
        const grouped = {};
        barbers.forEach(barber => {
          grouped[barber.name] = days.map(d => {
            const found = data.find(item => item.barber_id === barber.barber_id && item.day === d.key);
            return found
              ? {
                  day: found.day,
                  available: found.available,
                  start: found.start,
                  end: found.end,
                }
              : { day: d.key, available: false, start: '09:00', end: '17:00' };
          });
        });
        setSchedule(prev => ({ ...prev, ...grouped }));
      }
    }
    fetchAllBarbersWorkingHours();
  }, [barbers]);

  const handleToggle = (idx) => {
    const updated = barberSchedule.map((item, i) => i === idx ? { ...item, available: !item.available } : item);
    setSchedule({ ...schedule, [selectedBarber]: updated });
  };

  const handleTimeChange = (idx, field, value) => {
    const updated = barberSchedule.map((item, i) => i === idx ? { ...item, [field]: value } : item);
    setSchedule({ ...schedule, [selectedBarber]: updated });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    // Prepare upsert data: add barber_name field
    const upsertData = barberSchedule.map(item => {
      const { unavailable, ...rest } = item;
      return {
        ...rest,
        barber_name: selectedBarber,
        barber_id: barberIdMap[selectedBarber], // Use the fetched ID
      };
    });
    const { error } = await supabase
      .from('barber_working_hours')
      .upsert(upsertData, { onConflict: 'barber_id,day' });
    if (error) {
      setMessage('Errore durante il salvataggio: ' + error.message);
    } else {
      setMessage('Orari salvati con successo!');
    }
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-salon-black">Set Working Hours for {selectedBarber}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {barberSchedule.map((item, idx) => (
          <div key={item.day} className="flex items-center gap-4 p-2 bg-white/20 rounded-xl">
            <span className="w-10 font-bold text-salon-black">{days.find(d => d.key === item.day)?.label}</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={item.available}
                onChange={() => handleToggle(idx)}
                className="accent-urban-neon w-5 h-5"
              />
              <span className="text-xs text-salon-black">Available</span>
            </label>
            <input
              type="time"
              value={item.start}
              disabled={!item.available}
              onChange={e => handleTimeChange(idx, 'start', e.target.value)}
              className="ml-2 px-2 py-1 rounded border border-gray-300 text-salon-black bg-white/80 disabled:opacity-50"
            />
            <span className="mx-1 text-salon-black">-</span>
            <input
              type="time"
              value={item.end}
              disabled={!item.available}
              onChange={e => handleTimeChange(idx, 'end', e.target.value)}
              className="px-2 py-1 rounded border border-gray-300 text-salon-black bg-white/80 disabled:opacity-50"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 px-6 py-2 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition disabled:opacity-50"
      >
        {saving ? 'Salvataggio...' : 'Salva Orari'}
      </button>
      {message && (
        <div className={`mt-4 text-center font-semibold ${message.includes('successo') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>
      )}
    </div>
  );
}