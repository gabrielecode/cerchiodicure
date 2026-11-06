import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, AlertCircle, Plus, Check, Edit3, Save, Clock, ChefHat, Sparkles } from 'lucide-react';

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
      showToast('Inserisci il piatto', 'info');
      return;
    }
    const targetMeal = meals.find((m) => m.id === mealId);
    if (!targetMeal) return;

    const updatedLunch = editSlot === 'lunch' ? { dish: dishInput.trim(), provider: providerInput.trim() || 'Famiglia', status: targetMeal.lunch.status } : targetMeal.lunch;
    const updatedDinner = editSlot === 'dinner' ? { dish: dishInput.trim(), provider: providerInput.trim() || 'Famiglia', status: targetMeal.dinner.status } : targetMeal.dinner;

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
      addPost(`🍽️ Pasto (${slot === 'lunch' ? 'Pranzo' : 'Cena'}) di ${targetMeal.day} consumato: "${item.dish}" (${item.provider}).`, 'food', true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#7BA88A]/20 text-[#7BA88A] flex items-center justify-center shrink-0">
            <Utensils className="w-7 h-7 text-[#7BA88A]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pasti & Nutrizione</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pianificazione settimanale e preferenze alimentari per {profile?.recipientName || 'Nonna Rosa'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-3 py-1.5 rounded-xl border border-emerald-200/60 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Piano Nutrizionale Attivo</span>
          </span>
        </div>
      </div>

      {/* Dietary Restrictions & Preferences Card */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 rounded-3xl p-6 shadow-sm border border-amber-200/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Restrizioni Alimentari & Preferenze</h2>
              <p className="text-xs text-slate-500">Indicazioni mediche e gusti personali da rispettare</p>
            </div>
          </div>

          {!isEditingNotes ? (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-100 font-semibold rounded-xl border border-slate-200 text-xs transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#7BA88A]" />
              <span>Modifica Note</span>
            </button>
          ) : (
            <button
              onClick={handleSaveNotes}
              className="px-4 py-2 bg-[#7BA88A] hover:bg-[#6c987c] text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salva Note</span>
            </button>
          )}
        </div>

        {isEditingNotes ? (
          <textarea
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            rows={4}
            className="w-full p-4 rounded-2xl border border-amber-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7BA88A]"
          />
        ) : (
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-amber-200/50 text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {dietaryNotes}
          </div>
        )}
      </div>

      {/* Weekly Meal Planner */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#7BA88A]" />
            <span>Calendario dei Pasti Settimanale</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Lunedì – Domenica</span>
        </div>

        <div className="grid gap-4">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Day title */}
              <div className="md:w-36 shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7BA88A] bg-[#7BA88A]/10 px-3 py-1 rounded-lg">
                  {meal.day}
                </span>
              </div>

              {/* Meals content */}
              <div className="flex-1 grid md:grid-cols-2 gap-4">
                {/* Lunch */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Pranzo
                      </span>
                      <button
                        onClick={() => handleToggleStatus(meal.id, 'lunch')}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                          meal.lunch.status === 'consumato'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>{meal.lunch.status === 'consumato' ? 'Consumato' : 'Pianificato'}</span>
                      </button>
                    </div>

                    {editingMealId === meal.id && editSlot === 'lunch' ? (
                      <div className="space-y-2 mt-2">
                        <input
                          type="text"
                          value={dishInput}
                          onChange={(e) => setDishInput(e.target.value)}
                          placeholder="Descrizione piatto"
                          className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs"
                        />
                        <input
                          type="text"
                          value={providerInput}
                          onChange={(e) => setProviderInput(e.target.value)}
                          placeholder="Chi lo prepara (es. Spitex, Marco)"
                          className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs"
                        />
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => setEditingMealId(null)}
                            className="px-3 h-8 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                          >
                            Annulla
                          </button>
                          <button
                            onClick={() => handleSaveMeal(meal.id)}
                            className="px-3 h-8 bg-[#7BA88A] text-white rounded-lg text-xs font-medium"
                          >
                            Salva
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => startEditingMeal(meal.id, 'lunch', meal.lunch.dish, meal.lunch.provider)}
                        className="cursor-pointer group py-1"
                      >
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-[#7BA88A] transition-colors">
                          {meal.lunch.dish}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Preparato da: {meal.lunch.provider}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dinner */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" /> Cena
                      </span>
                      <button
                        onClick={() => handleToggleStatus(meal.id, 'dinner')}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                          meal.dinner.status === 'consumato'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>{meal.dinner.status === 'consumato' ? 'Consumato' : 'Pianificato'}</span>
                      </button>
                    </div>

                    {editingMealId === meal.id && editSlot === 'dinner' ? (
                      <div className="space-y-2 mt-2">
                        <input
                          type="text"
                          value={dishInput}
                          onChange={(e) => setDishInput(e.target.value)}
                          placeholder="Descrizione piatto"
                          className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs"
                        />
                        <input
                          type="text"
                          value={providerInput}
                          onChange={(e) => setProviderInput(e.target.value)}
                          placeholder="Chi lo prepara (es. Spitex, Marco)"
                          className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs"
                        />
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => setEditingMealId(null)}
                            className="px-3 h-8 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                          >
                            Annulla
                          </button>
                          <button
                            onClick={() => handleSaveMeal(meal.id)}
                            className="px-3 h-8 bg-[#7BA88A] text-white rounded-lg text-xs font-medium"
                          >
                            Salva
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => startEditingMeal(meal.id, 'dinner', meal.dinner.dish, meal.dinner.provider)}
                        className="cursor-pointer group py-1"
                      >
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-[#7BA88A] transition-colors">
                          {meal.dinner.dish}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Preparato da: {meal.dinner.provider}</p>
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
  );
};
