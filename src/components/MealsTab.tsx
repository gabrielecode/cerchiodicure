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
    <div className="w-full px-4 md:px-8 py-8 pb-24 md:pb-12 font-sans bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
            <Utensils className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Nutritional Protocol</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none text-emerald-900 dark:text-emerald-400">Piano Alimentare Settimanale</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Logistica pasti e restrizioni dietetiche per {profile?.recipientName || 'Rosa Rossi'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 px-4 py-2 rounded border border-emerald-100 dark:border-emerald-800 uppercase tracking-widest flex items-center gap-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
            <span>Standard Nutrizionale Attivo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column: Dietary Notes */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-400" />
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <h2 className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-[0.2em]">Note Cliniche & Dietetiche</h2>
              </div>

            {!isEditingNotes ? (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-md border border-slate-200 dark:border-slate-700 transition-all"
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
                className="w-full p-4 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 font-medium"
              />
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-5 border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed italic">
                {dietaryNotes}
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 leading-none">Interazioni Allergiche</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-[9px] font-black rounded border border-red-100 dark:border-red-900/40 uppercase tracking-widest">No Zuccheri</span>
                <span className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-[9px] font-black rounded border border-red-100 dark:border-red-900/40 uppercase tracking-widest">Iposodico</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-black rounded border border-slate-200 dark:border-slate-700 uppercase tracking-widest">Idratazione +</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Planner */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Calendario Operativo Pasti</span>
            </h2>
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Sincronizzazione H24</span>
          </div>

        {meals.length === 0 ? (
          <div className="flex justify-center mt-12">
            <button
              onClick={async () => {
                const batch = writeBatch(db);
                const days = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];
                const dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
                days.forEach((dayId, index) => {
                  const mealRef = doc(db, 'circles', circleId!, 'meals', dayId);
                  batch.set(mealRef, {
                    day: dayNames[index],
                    lunch: { dish: '', provider: '', status: 'pianificato' },
                    dinner: { dish: '', provider: '', status: 'pianificato' },
                    circleId: circleId!,
                    createdBy: auth.currentUser?.uid,
                    order: index
                  });
                });
                await batch.commit();
                showToast('Piano settimanale creato!');
              }}
              className="px-6 py-3 bg-emerald-700 text-white font-black uppercase tracking-widest rounded-lg shadow-md"
            >
              Crea piano settimanale
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {[...meals].sort((a, b) => (a as any).order - (b as any).order).map((meal) => (
              <div
                key={meal.id}
                className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-stretch gap-6 transition-all hover:border-emerald-200 dark:hover:border-emerald-700"
              >
                {/* Day title */}
                <div className="md:w-32 shrink-0 flex items-center md:border-r border-slate-100 dark:border-slate-800 md:pr-6">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">
                    {meal.day}
                  </span>
                </div>

                {/* Meals content */}
                <div className="flex-1 grid md:grid-cols-2 gap-4">
                  {/* Lunch */}
                  <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded p-4 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-orange-400" /> Pranzo
                        </span>
                        <button
                          onClick={() => handleToggleStatus(meal.id, 'lunch')}
                          className={`text-[9px] font-black px-2 py-1 rounded border uppercase tracking-widest transition-all ${
                            meal.lunch.status === 'consumato'
                              ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                              : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
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
                            className="w-full h-10 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold dark:text-slate-100 focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500"
                          />
                          <input
                            type="text"
                            value={providerInput}
                            onChange={(e) => setProviderInput(e.target.value)}
                            placeholder="Ente erogatore"
                            className="w-full h-10 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold dark:text-slate-100 focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500"
                          />
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => setEditingMealId(null)}
                              className="px-3 h-8 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-600"
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
                          <p className="text-sm font-black text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-tight mb-2">
                            {meal.lunch.dish || 'Pianifica pranzo...'}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Provider: {meal.lunch.provider || '-'}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dinner */}
                  <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded p-4 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-blue-400" /> Cena
                        </span>
                        <button
                          onClick={() => handleToggleStatus(meal.id, 'dinner')}
                          className={`text-[9px] font-black px-2 py-1 rounded border uppercase tracking-widest transition-all ${
                            meal.dinner.status === 'consumato'
                              ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                              : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
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
                            className="w-full h-10 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold dark:text-slate-100 focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500"
                          />
                          <input
                            type="text"
                            value={providerInput}
                            onChange={(e) => setProviderInput(e.target.value)}
                            placeholder="Ente erogatore"
                            className="w-full h-10 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold dark:text-slate-100 focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500"
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
                          <p className="text-sm font-black text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-tight mb-2">
                            {meal.dinner.dish || 'Pianifica cena...'}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Provider: {meal.dinner.provider || '-'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
