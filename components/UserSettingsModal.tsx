
import React, { useState } from 'react';
import type { UserSettings } from '../types';
import { CloseIcon } from './Icons';

interface UserSettingsModalProps {
  onClose: () => void;
  onSave: (settings: UserSettings) => void;
  initialSettings: UserSettings | null;
}

const InputField: React.FC<{ label: string; id: string; type?: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, id, type = 'number', value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-medium-text mb-1">{label}</label>
        <input id={id} name={id} type={type} value={value} onChange={onChange} required className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
    </div>
);

const SelectField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ label, id, value, onChange, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-medium-text mb-1">{label}</label>
        <select id={id} name={id} value={value} onChange={onChange} required className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none">
            {children}
        </select>
    </div>
);

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ onClose, onSave, initialSettings }) => {
  const [settings, setSettings] = useState<UserSettings>(initialSettings || {
    age: 30,
    gender: 'male',
    weight: 155,
    height: 69,
    activityLevel: 'moderate',
    goal: 'maintenance',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: (e.target as HTMLInputElement).type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-dark-card rounded-2xl w-full max-w-md border border-dark-border shadow-2xl">
        <header className="p-4 flex justify-between items-center border-b border-dark-border">
          <h2 className="text-xl font-bold">Your Profile</h2>
          {initialSettings && (
             <button onClick={onClose} className="p-2 rounded-full hover:bg-dark-border transition-colors" aria-label="Close">
                <CloseIcon className="w-6 h-6" />
             </button>
          )}
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-medium-text">
            This information helps us calculate your daily calorie needs accurately.
          </p>
          <div className="grid grid-cols-2 gap-4">
              <InputField label="Age" id="age" value={settings.age} onChange={handleChange} />
              <SelectField label="Gender" id="gender" value={settings.gender} onChange={handleChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
              </SelectField>
              <InputField label="Weight (lbs)" id="weight" value={settings.weight} onChange={handleChange} />
              <InputField label="Height (in)" id="height" value={settings.height} onChange={handleChange} />
          </div>
          
          <SelectField label="Fitness Goal" id="goal" value={settings.goal} onChange={handleChange}>
            <option value="loss">Weight Loss</option>
            <option value="maintenance">Maintain Weight</option>
            <option value="gain">Weight Gain</option>
          </SelectField>

          <SelectField label="Activity Level" id="activityLevel" value={settings.activityLevel} onChange={handleChange}>
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
              <option value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</option>
              <option value="active">Very active (hard exercise/sports 6-7 days a week)</option>
              <option value="very_active">Extra active (very hard exercise/sports & physical job)</option>
          </SelectField>

          <button type="submit" className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-dark-bg font-bold py-3 rounded-lg mt-4 hover:opacity-90 transition-opacity">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSettingsModal;