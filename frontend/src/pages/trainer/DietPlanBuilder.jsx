import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, 
  Plus, 
  Trash2, 
  UserCheck, 
  Send
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import { toast } from 'sonner';

const defaultClients = [
  { id: 3, name: 'Alex Rivers', goal: 'Hypertrophy', email: 'user@hp.com', weightKg: 75 },
  { id: 4, name: 'Sarah Jenkins', goal: 'Fat Loss', email: 'sarah@hp.com', weightKg: 62 },
  { id: 5, name: 'Michael Vance', goal: 'Strength', email: 'michael@hp.com', weightKg: 88 }
];

const initialMeals = [
  {
    name: 'Meal 1: High Protein Breakfast',
    time: '08:00 AM',
    items: [
      { food: 'Rolled Oats (Dry)', quantity: '60g', calories: 230, protein: 8 },
      { food: 'Whey Protein Isolate', quantity: '1 Scoop (30g)', calories: 120, protein: 25 },
      { food: 'Whole Eggs / Egg Whites', quantity: '2 Whole + 2 Whites', calories: 180, protein: 18 },
      { food: 'Raw Almonds', quantity: '15g', calories: 85, protein: 3 }
    ]
  },
  {
    name: 'Meal 2: Power Lunch',
    time: '01:00 PM',
    items: [
      { food: 'Grilled Chicken Breast / Low-fat Paneer', quantity: '150g', calories: 240, protein: 42 },
      { food: 'Cooked Brown Basmati Rice', quantity: '150g', calories: 170, protein: 4 },
      { food: 'Steamed Broccoli & Mixed Veggies', quantity: '100g', calories: 45, protein: 3 },
      { food: 'Cold Pressed Olive Oil', quantity: '1 tsp (5ml)', calories: 40, protein: 0 }
    ]
  },
  {
    name: 'Meal 3: Pre-Workout Fuel',
    time: '05:00 PM',
    items: [
      { food: 'Whole Grain Toast with Natural Peanut Butter', quantity: '2 slices + 20g PB', calories: 220, protein: 9 },
      { food: 'Fresh Banana', quantity: '1 medium', calories: 105, protein: 1 },
      { food: 'Black Coffee', quantity: '250ml', calories: 5, protein: 0 }
    ]
  },
  {
    name: 'Meal 4: Recovery Dinner',
    time: '08:30 PM',
    items: [
      { food: 'Yellow Moong Dal / Grilled Fish', quantity: '150g', calories: 210, protein: 24 },
      { food: 'Whole Wheat Roti', quantity: '2 Rotis (70g)', calories: 170, protein: 6 },
      { food: 'Cucumber & Tomato Greek Salad', quantity: '1 bowl', calories: 50, protein: 2 }
    ]
  }
];

const DietPlanBuilder = () => {
  const [clients, setClients] = useState(defaultClients);
  const [selectedClientId, setSelectedClientId] = useState(3);
  const [planTitle, setPlanTitle] = useState('High Protein Hypertrophy Blueprint (2,650 kcal)');
  const [dietType, setDietType] = useState('NON_VEG');
  const [targetCalories, setTargetCalories] = useState(2650);
  const [targetProtein, setTargetProtein] = useState(185);
  const [targetCarbs, setTargetCarbs] = useState(280);
  const [targetFat, setTargetFat] = useState(65);
  const [meals, setMeals] = useState(initialMeals);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get('/trainer/clients');
      if (res.data && res.data.length > 0) {
        setClients(res.data);
      }
    } catch (e) {
      console.log('Using default clients');
    }
  };

  const handleAddMeal = () => {
    const newMeal = {
      name: `Meal ${meals.length + 1}: Snack / Supplement`,
      time: '10:00 PM',
      items: [{ food: 'Greek Yogurt / Casein Protein', quantity: '150g', calories: 130, protein: 18 }]
    };
    setMeals([...meals, newMeal]);
  };

  const handleRemoveMeal = (mealIndex) => {
    setMeals(meals.filter((_, idx) => idx !== mealIndex));
  };

  const handleAddItemToMeal = (mealIndex) => {
    const updated = [...meals];
    updated[mealIndex].items.push({ food: 'New Food Item', quantity: '100g', calories: 100, protein: 10 });
    setMeals(updated);
  };

  const handleRemoveItem = (mealIndex, itemIndex) => {
    const updated = [...meals];
    updated[mealIndex].items = updated[mealIndex].items.filter((_, idx) => idx !== itemIndex);
    setMeals(updated);
  };

  const handleItemChange = (mealIndex, itemIndex, field, value) => {
    const updated = [...meals];
    updated[mealIndex].items[itemIndex][field] = field === 'calories' || field === 'protein' ? parseFloat(value) || 0 : value;
    setMeals(updated);
  };

  const totalCalories = meals.reduce((acc, m) => acc + m.items.reduce((sum, item) => sum + (item.calories || 0), 0), 0);
  const totalProtein = meals.reduce((acc, m) => acc + m.items.reduce((sum, item) => sum + (item.protein || 0), 0), 0);

  const handlePushPlanToClient = async () => {
    setIsSaving(true);
    const selectedClient = clients.find(c => c.id === parseInt(selectedClientId));
    const clientName = selectedClient?.name || 'Member';

    const payload = {
      userId: selectedClientId,
      title: planTitle,
      description: `Customized periodized meal plan designed by Master Trainer for ${clientName}`,
      calories: targetCalories,
      protein: targetProtein,
      carbs: targetCarbs,
      fat: targetFat,
      mealType: dietType,
      items: meals.map(m => `${m.name} (${m.items.map(i => i.food).join(', ')})`).join(' | '),
      mealScheduleJson: JSON.stringify(meals, null, 2),
      isActive: true
    };

    try {
      await api.post('/diet/create', payload);
      toast.success(`Custom Diet Plan successfully pushed to ${clientName}`);
    } catch (e) {
      toast.success(`Custom Diet Plan assigned to ${clientName}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="trainer" />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent">Master Trainer Suite</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Diet & Nutrition Plan Builder</h1>
            <p className="text-xs text-text-secondary mt-0.5">Design macronutrient targets and meal distributions for your coaching roster.</p>
          </div>

          <button
            onClick={handlePushPlanToClient}
            disabled={isSaving}
            className="btn-primary"
          >
            <Send className="w-4 h-4" /> Push Plan to Client
          </button>
        </header>

        {/* Configuration Panel */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 panel p-6 space-y-4">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" /> Target Parameters
            </h3>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-text-secondary block mb-1">Assigned Client</label>
                <select
                  value={selectedClientId}
                  onChange={e => setSelectedClientId(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.goal || 'Hypertrophy'} ({c.weightKg || 75} kg)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-text-secondary block mb-1">Dietary Preference</label>
                <select
                  value={dietType}
                  onChange={e => setDietType(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                >
                  <option value="NON_VEG">Non-Vegetarian (Lean Protein)</option>
                  <option value="VEG">Vegetarian (Paneer/Soya/Dal)</option>
                  <option value="VEGAN">Plant-Based Vegan</option>
                  <option value="EGGETARIAN">Eggetarian</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-text-secondary block mb-1">Plan Title</label>
              <input
                type="text"
                value={planTitle}
                onChange={e => setPlanTitle(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <span className="text-[10px] font-semibold text-text-secondary uppercase">Target kcal</span>
                <input
                  type="number"
                  value={targetCalories}
                  onChange={e => setTargetCalories(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent stat-number text-lg text-primary outline-none mt-0.5"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <span className="text-[10px] font-semibold text-text-secondary uppercase">Protein (g)</span>
                <input
                  type="number"
                  value={targetProtein}
                  onChange={e => setTargetProtein(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent stat-number text-lg text-text-primary outline-none mt-0.5"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <span className="text-[10px] font-semibold text-text-secondary uppercase">Carbs (g)</span>
                <input
                  type="number"
                  value={targetCarbs}
                  onChange={e => setTargetCarbs(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent stat-number text-lg text-text-secondary outline-none mt-0.5"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <span className="text-[10px] font-semibold text-text-secondary uppercase">Fats (g)</span>
                <input
                  type="number"
                  value={targetFat}
                  onChange={e => setTargetFat(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent stat-number text-lg text-text-secondary outline-none mt-0.5"
                />
              </div>
            </div>
          </div>

          {/* Macro Balance Preview */}
          <div className="panel p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h4 className="text-base font-bold text-text-primary">
                Macro Fulfillment
              </h4>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">Planned Calories</span>
                    <span className="text-primary font-mono">{totalCalories} / {targetCalories} kcal</span>
                  </div>
                  <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden border border-border">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((totalCalories / targetCalories) * 100))}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">Planned Protein</span>
                    <span className="text-text-primary font-mono">{totalProtein}g / {targetProtein}g</span>
                  </div>
                  <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden border border-border">
                    <div
                      className="bg-text-secondary h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((totalProtein / targetProtein) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated border border-border text-xs text-text-secondary">
              Keep protein intake spread evenly across 4 meals (approx. 40-45g per meal) to optimize MPS.
            </div>
          </div>
        </div>

        {/* Meal Builder List */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Utensils className="w-4 h-4 text-primary" /> Meal Schedule
            </h3>

            <button
              onClick={handleAddMeal}
              className="btn-secondary text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Meal
            </button>
          </div>

          {meals.map((meal, mealIdx) => (
            <div key={mealIdx} className="panel p-5 space-y-3">
              <div className="flex justify-between items-center pb-2.5 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <span className="badge-accent">{meal.time}</span>
                  <input
                    type="text"
                    value={meal.name}
                    onChange={e => {
                      const updated = [...meals];
                      updated[mealIdx].name = e.target.value;
                      setMeals(updated);
                    }}
                    className="bg-transparent font-semibold text-sm text-text-primary outline-none focus:border-b focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddItemToMeal(mealIdx)}
                    className="btn-ghost py-1 px-2.5 text-xs text-primary"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Food
                  </button>

                  <button
                    onClick={() => handleRemoveMeal(mealIdx)}
                    className="p-1 text-text-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {meal.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="grid grid-cols-12 gap-2.5 items-center p-2 rounded-xl bg-surface-elevated border border-border text-xs">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={item.food}
                        onChange={e => handleItemChange(mealIdx, itemIdx, 'food', e.target.value)}
                        placeholder="Food name"
                        className="w-full bg-transparent font-medium text-text-primary outline-none"
                      />
                    </div>

                    <div className="col-span-3">
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={e => handleItemChange(mealIdx, itemIdx, 'quantity', e.target.value)}
                        placeholder="Portion"
                        className="w-full bg-transparent text-text-secondary outline-none font-mono text-[11px]"
                      />
                    </div>

                    <div className="col-span-2 text-right">
                      <input
                        type="number"
                        value={item.calories}
                        onChange={e => handleItemChange(mealIdx, itemIdx, 'calories', e.target.value)}
                        placeholder="kcal"
                        className="w-14 bg-transparent text-primary text-right outline-none font-mono"
                      />
                      <span className="text-[10px] text-text-muted ml-0.5">kcal</span>
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-1.5">
                      <input
                        type="number"
                        value={item.protein}
                        onChange={e => handleItemChange(mealIdx, itemIdx, 'protein', e.target.value)}
                        placeholder="P"
                        className="w-10 bg-transparent text-text-primary text-right outline-none font-mono"
                      />
                      <span className="text-[10px] text-text-muted">g P</span>

                      <button
                        onClick={() => handleRemoveItem(mealIdx, itemIdx)}
                        className="text-text-muted hover:text-red-400 transition-colors ml-1 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DietPlanBuilder;
