import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, AlertCircle, Plus, Check, Edit3, Save, Clock, ChefHat, Sparkles, Activity } from 'lucide-react';

export const MealsTab: React.FC = () => {
  const { profile, meals, updateMeal, dietaryNotes, updateDietaryNotes, addPost, showToast } = useApp();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState(dietaryNotes);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [editSlot, setEditSlot] = useState<'lunch' | 'dinner'>('lunch');
  const [dishInput, setDishInput] = useState('');
  const [providerInput, setProviderInput] = useState('');

  const handleSaveNotes = () => {
    updateDietaryNotes(notesInput);
    setIsEditingNotes(false);
  };

  const startEditingMeal = (mealId: string, slot: 'lunch' | 'dinner', currentDish: string, currentProvider: string) => {
    setEditingMealId(mealId);
    setEditSlot(slot);
    setDishInput(currentDish);
    setProviderInput(currentProvider);
  };

  const handleSaveMeal = (mealId: string) => {
    if (!dishInput.trim()) {
      showToast('Specificare la portata del pasto', 'info');
      return;
    }
    const targetMeal = meals.find((m) => m.id === mealId);
    if (!targetMeal) return;

    const updatedLunch = editSlot === 'lunch' ? { dish: dishInput.trim(), provider: providerInput.trim() || 'Internal', status: targetMeal.lunch.status } : targetMeal.lunch;
    const updatedDinner = editSlot === 'dinner' ? { dish: dishInput.trim(), provider: providerInput.trim() || 'Internal', status: targetMeal.dinner.status } : targetMeal.dinner;

    updateMeal(mealId, updatedLunch, updatedDinner);
    setEditingMealId(null);
  };

  const handleToggleStatus = (mealId: string, slot: 'lunch' | 'dinner') => {
    const targetMeal = meals.find((m) => m.id === mealId);
    if (!targetMeal) return;

    const item = slot === 'lunch' ? targetMeal.lunch : targetMeal.dinner;
    const nextStatus: 'pianificato' | 'consumato' = item.status === 'consumato' ? 'pianificato' : 'consumato';

    const updatedLunch = slot === 'lunch' ? { ...targetMeal.lunch, status: nextStatus } : targetMeal.lunch;
    const updatedDinner = slot === 'dinner' ? { ...targetMeal.dinner, status: nextStatus } : targetMeal.dinner;

    updateMeal(mealId, updatedLunch, updatedDinner);

    if (nextStatus === 'consumato') {
      addPost(`Validazione Pasto (${slot === 'lunch' ? 'Pranzo' : 'Cena'}) - ${targetMeal.day}: "${item.dish}" (${item.provider}).`, 'food', true);
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-8 pb-24 md:pb-12 font-sans bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
            <Utensils className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-emerald-700" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nutritional Protocol</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none text-emerald-900">Piano Alimentare Settimanale</h1>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Logistica pasti e restrizioni dietetiche per {profile?.recipientName || 'Rosa Rossi'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-black bg-emerald-50 text-emerald-800 px-4 py-2 rounded border border-emerald-100 uppercase tracking-widest flex items-center gap-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Standard Nutrizionale Attivo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column: Dietary Notes */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-400" />
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Note Cliniche & Dietetiche</h2>
              </div>

              {!isEditingNotes ? (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-700 rounded-md border border-slate-200 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-1.5 bg-emerald-700 text-white font-black text-[10px] rounded uppercase tracking-widest shadow-sm"
                >
                  Salva
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <textarea
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                rows={10}
                className="w-full p-4 rounded border border-slate-300 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:border-emerald-700 font-medium"
              />
            ) : (
              <div className="bg-slate-50 rounded p-5 border border-slate-100 text-sm text-slate-600 whitespace-pre-line leading-relaxed italic">
                {dietaryNotes}
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 leading-none">Interazioni Allergiche</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-red-50 text-red-700 text-[9px] font-black rounded border border-red-100 uppercase tracking-widest">No Zuccheri</span>
                <span className="px-2 py-1 bg-red-50 text-red-700 text-[9px] font-black rounded border border-red-100 uppercase tracking-widest">Iposodico</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[9px] font-black rounded border border-slate-200 uppercase tracking-widest">Idratazione +</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Planner */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-emerald-700" />
              <span>Calendario Operativo Pasti</span>
            </h2>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sincronizzazione H24</span>
          </div>

          <div className="grid gap-4">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-stretch gap-6 transition-all hover:border-emerald-200"
              >
                {/* Day title */}
                <div className="md:w-32 shrink-0 flex items-center md:border-r border-slate-100 md:pr-6">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-800">
                    {meal.day}
                  </span>
                </div>

                {/* Meals content */}
                <div className="flex-1 grid md:grid-cols-2 gap-4">
                  {/* Lunch */}
                  <div className="bg-slate-50/50 rounded p-4 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-orange-400" /> Pranzo
                        </span>
                        <button
                          onClick={() => handleToggleStatus(meal.id, 'lunch')}
                          className={`text-[9px] font-black px-2 py-1 rounded border uppercase tracking-widest transition-all ${
                            meal.lunch.status === 'consumato'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                              : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {meal.lunch.status}
                        </button>
                      </div>

                      {editingMealId === meal.id && editSlot === 'lunch' ? (
                        <div className="space-y-2 mt-2">
                          <input
                            type="text"
                            value={dishInput}
                            onChange={(e) => setDishInput(e.target.value)}
                            placeholder="Descrizione portata"
                            className="w-full h-10 px-3 rounded border border-slate-300 bg-white text-xs font-bold focus:outline-none focus:border-emerald-700"
                          />
                          <input
                            type="text"
                            value={providerInput}
                            onChange={(e) => setProviderInput(e.target.value)}
                            placeholder="Ente erogatore"
                            className="w-full h-10 px-3 rounded border border-slate-300 bg-white text-xs font-bold focus:outline-none focus:border-emerald-700"
                          />
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => setEditingMealId(null)}
                              className="px-3 h-8 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase tracking-widest border border-slate-200"
                            >
                              Esc
                            </button>
                            <button
                              onClick={() => handleSaveMeal(meal.id)}
                              className="px-4 h-8 bg-emerald-700 text-white rounded text-[10px] font-black uppercase tracking-widest shadow-sm"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => startEditingMeal(meal.id, 'lunch', meal.lunch.dish, meal.lunch.provider)}
                          className="cursor-pointer group"
                        >
                          <p className="text-sm font-black text-slate-800 group-hover:text-emerald-700 transition-colors leading-tight mb-2">
                            {meal.lunch.dish}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Provider: {meal.lunch.provider}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dinner */}
                  <div className="bg-slate-50/50 rounded p-4 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-blue-400" /> Cena
                        </span>
                        <button
                          onClick={() => handleToggleStatus(meal.id, 'dinner')}
                          className={`text-[9px] font-black px-2 py-1 rounded border uppercase tracking-widest transition-all ${
                            meal.dinner.status === 'consumato'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                              : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {meal.dinner.status}
                        </button>
                      </div>

                      {editingMealId === meal.id && editSlot === 'dinner' ? (
                        <div className="space-y-2 mt-2">
                          <input
                            type="text"
                            value={dishInput}
                            onChange={(e) => setDishInput(e.target.value)}
                            placeholder="Descrizione portata"
                            className="w-full h-10 px-3 rounded border border-slate-300 bg-white text-xs font-bold focus:outline-none focus:border-emerald-700"
                          />
                          <input
                            type="text"
                            value={providerInput}
                            onChange={(e) => setProviderInput(e.target.value)}
                            placeholder="Ente erogatore"
                            className="w-full h-10 px-3 rounded border border-slate-300 bg-white text-xs font-bold focus:outline-none focus:border-emerald-700"
                          />
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => setEditingMealId(null)}
                              className="px-3 h-8 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase tracking-widest border border-slate-200"
                            >
                              Esc
                            </button>
                            <button
                              onClick={() => handleSaveMeal(meal.id)}
                              className="px-4 h-8 bg-emerald-700 text-white rounded text-[10px] font-black uppercase tracking-widest shadow-sm"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => startEditingMeal(meal.id, 'dinner', meal.dinner.dish, meal.dinner.provider)}
                          className="cursor-pointer group"
                        >
                          <p className="text-sm font-black text-slate-800 group-hover:text-emerald-700 transition-colors leading-tight mb-2">
                            {meal.dinner.dish}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Provider: {meal.dinner.provider}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
