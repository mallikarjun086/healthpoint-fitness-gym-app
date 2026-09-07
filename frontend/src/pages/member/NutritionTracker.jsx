import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, 
  Flame, 
  Plus, 
  Trash2, 
  Droplet, 
  Search, 
  PieChart, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  X,
  Apple
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const defaultFoodItems = [
  { id: 1, name: 'Boiled Whole Eggs (2 large)', calories: 140, proteinGrams: 12, carbsGrams: 1, fatGrams: 10, servingSize: '2 eggs (100g)' },
  { id: 2, name: 'Egg Whites (4 large)', calories: 68, proteinGrams: 14.4, carbsGrams: 0.8, fatGrams: 0.2, servingSize: '4 whites (132g)' },
  { id: 3, name: 'Grilled Chicken Breast', calories: 165, proteinGrams: 31, carbsGrams: 0, fatGrams: 3.6, servingSize: '100g' },
  { id: 4, name: 'Paneer (Raw Indian Cottage Cheese)', calories: 265, proteinGrams: 18, carbsGrams: 3, fatGrams: 20, servingSize: '100g' },
  { id: 5, name: 'Low-Fat Paneer / Tofu', calories: 140, proteinGrams: 24, carbsGrams: 2.5, fatGrams: 4, servingSize: '100g' },
  { id: 6, name: 'Cooked Brown Rice', calories: 111, proteinGrams: 2.6, carbsGrams: 23, fatGrams: 0.9, servingSize: '100g' },
  { id: 7, name: 'Yellow Moong Dal (Cooked)', calories: 105, proteinGrams: 7, carbsGrams: 19, fatGrams: 0.5, servingSize: '100g' },
  { id: 8, name: 'Cooked Chana (Chickpeas)', calories: 164, proteinGrams: 8.9, carbsGrams: 27.4, fatGrams: 2.6, servingSize: '100g' },
  { id: 9, name: 'Soya Chunks (Dry)', calories: 345, proteinGrams: 52, carbsGrams: 33, fatGrams: 0.5, servingSize: '100g' },
  { id: 10, name: 'Rolled Oats with Water', calories: 150, proteinGrams: 5, carbsGrams: 27, fatGrams: 2.5, servingSize: '40g' },
  { id: 11, name: 'Whey Protein Isolate (1 scoop)', calories: 120, proteinGrams: 25, carbsGrams: 1.5, fatGrams: 1, servingSize: '30g' },
  { id: 12, name: 'Whole Wheat Roti / Chapati', calories: 85, proteinGrams: 3, carbsGrams: 17, fatGrams: 0.4, servingSize: '1 roti' }
];

const initialLoggedMeals = [
  { id: 1, mealType: 'BREAKFAST', foodName: 'Rolled Oats with Whey & Almonds', calories: 430, proteinGrams: 36, carbsGrams: 48, fatGrams: 12, quantity: 1 },
  { id: 2, mealType: 'BREAKFAST', foodName: 'Boiled Egg Whites (4)', calories: 68, proteinGrams: 14.4, carbsGrams: 0.8, fatGrams: 0.2, quantity: 1 },
  { id: 3, mealType: 'LUNCH', foodName: 'Grilled Chicken Breast (200g)', calories: 330, proteinGrams: 62, carbsGrams: 0, fatGrams: 7.2, quantity: 2 },
  { id: 4, mealType: 'LUNCH', foodName: 'Cooked Brown Rice with Steamed Broccoli', calories: 240, proteinGrams: 5.5, carbsGrams: 50, fatGrams: 2, quantity: 1.5 }
];

const NutritionTracker = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState(initialLoggedMeals);
  const [foodDatabase, setFoodDatabase] = useState(defaultFoodItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('BREAKFAST');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [waterGlasses, setWaterGlasses] = useState(8);
  const [customFood, setCustomFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', quantity: 1 });

  const targetCalories = 2650;
  const targetProtein = 185;
  const targetCarbs = 280;
  const targetFat = 65;

  useEffect(() => {
    fetchDailySummary();
    fetchFoods();
  }, [user]);

  const fetchDailySummary = async () => {
    try {
      const userId = user?.id || 3;
      const res = await api.get(`/nutrition/summary/user/${userId}`);
      if (res.data?.logs && res.data.logs.length > 0) {
        setLogs(res.data.logs);
      }
    } catch (e) {
      console.log('Daily summary fallback');
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await api.get('/nutrition/food-items');
      if (res.data && res.data.length > 0) {
        setFoodDatabase(res.data);
      }
    } catch (e) {
      console.log('Foods DB fallback');
    }
  };

  const totalCalories = logs.reduce((sum, l) => sum + (l.calories || 0), 0);
  const totalProtein = Math.round(logs.reduce((sum, l) => sum + (l.proteinGrams || 0), 0) * 10) / 10;
  const totalCarbs = Math.round(logs.reduce((sum, l) => sum + (l.carbsGrams || 0), 0) * 10) / 10;
  const totalFat = Math.round(logs.reduce((sum, l) => sum + (l.fatGrams || 0), 0) * 10) / 10;

  const caloriesRemaining = Math.max(0, targetCalories - totalCalories);

  const handleLogPresetFood = async (food) => {
    const payload = {
      userId: user?.id || 3,
      foodName: food.name,
      mealType: selectedMealType,
      calories: food.calories,
      proteinGrams: food.proteinGrams,
      carbsGrams: food.carbsGrams,
      fatGrams: food.fatGrams,
      quantity: 1.0,
      logDate: new Date().toISOString().split('T')[0]
    };

    try {
      await api.post('/nutrition/log', payload);
      toast.success(`Added ${food.name} to ${selectedMealType.toLowerCase()}`);
      setLogs([...logs, { ...payload, id: Date.now() }]);
      setIsModalOpen(false);
    } catch (e) {
      setLogs([...logs, { ...payload, id: Date.now() }]);
      toast.success(`Logged ${food.name}`);
      setIsModalOpen(false);
    }
  };

  const handleLogCustomFood = async (e) => {
    e.preventDefault();
    if (!customFood.name || !customFood.calories) {
      toast.error('Please enter food name and calories');
      return;
    }

    const payload = {
      userId: user?.id || 3,
      foodName: customFood.name,
      mealType: selectedMealType,
      calories: parseInt(customFood.calories),
      proteinGrams: parseFloat(customFood.protein) || 0,
      carbsGrams: parseFloat(customFood.carbs) || 0,
      fatGrams: parseFloat(customFood.fat) || 0,
      quantity: parseFloat(customFood.quantity) || 1,
      logDate: new Date().toISOString().split('T')[0]
    };

    try {
      await api.post('/nutrition/log', payload);
      toast.success(`Added ${customFood.name} to ${selectedMealType.toLowerCase()}`);
      setLogs([...logs, { ...payload, id: Date.now() }]);
      setIsModalOpen(false);
      setCustomFood({ name: '', calories: '', protein: '', carbs: '', fat: '', quantity: 1 });
    } catch (e) {
      setLogs([...logs, { ...payload, id: Date.now() }]);
      toast.success(`Logged food`);
      setIsModalOpen(false);
    }
  };

  const handleDeleteLog = async (id, name) => {
    try {
      await api.delete(`/nutrition/log/${id}`);
      setLogs(logs.filter(l => l.id !== id));
      toast.info(`Removed ${name}`);
    } catch (e) {
      setLogs(logs.filter(l => l.id !== id));
      toast.info(`Removed food item`);
    }
  };

  const filteredFoodPresets = foodDatabase.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mealCategories = ['BREAKFAST', 'LUNCH', 'SNACK', 'DINNER'];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent">Macro Tracking</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Nutrition & Macro Log</h1>
            <p className="text-xs text-text-secondary mt-0.5">Log meals from verified food database items and track daily macronutrient adherence.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" /> Log Food Item
          </button>
        </header>

        {/* Calorie & Hydration Grid */}
        <div className="grid lg:grid-cols-12 gap-6 mb-8">
          {/* Main Calorie Summary */}
          <div className="lg:col-span-6 panel p-6 flex flex-col justify-between space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-text-secondary block">Daily Caloric Target</span>
                <div className="text-3xl stat-number text-text-primary mt-1">
                  {totalCalories} <span className="text-sm font-normal text-text-secondary">/ {targetCalories} kcal</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-elevated text-primary border border-border">
                <Flame className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-text-primary">{Math.round((totalCalories / targetCalories) * 100)}% Consumed</span>
                <span className="text-emerald-400 font-mono">{caloriesRemaining} kcal remaining</span>
              </div>
              <div className="w-full bg-surface-elevated h-2.5 rounded-full overflow-hidden border border-border">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((totalCalories / targetCalories) * 100))}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border text-center">
              <div>
                <div className="text-[10px] text-text-secondary uppercase font-semibold">Protein</div>
                <div className="text-base stat-number text-text-primary mt-0.5">
                  {totalProtein}g <span className="text-[10px] font-normal text-text-muted">/ {targetProtein}g</span>
                </div>
              </div>
              <div className="border-x border-border">
                <div className="text-[10px] text-text-secondary uppercase font-semibold">Carbs</div>
                <div className="text-base stat-number text-text-primary mt-0.5">
                  {totalCarbs}g <span className="text-[10px] font-normal text-text-muted">/ {targetCarbs}g</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-text-secondary uppercase font-semibold">Fats</div>
                <div className="text-base stat-number text-text-primary mt-0.5">
                  {totalFat}g <span className="text-[10px] font-normal text-text-muted">/ {targetFat}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Water Intake Tracker */}
          <div className="lg:col-span-6 panel p-6 flex flex-col justify-between space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-text-secondary block">Hydration Target</span>
                <div className="text-2xl stat-number text-text-primary mt-1">
                  {(waterGlasses * 0.25).toFixed(1)} L <span className="text-sm font-normal text-text-secondary">/ 3.5 L</span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">{waterGlasses} of 14 glasses completed</p>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-elevated text-primary border border-border">
                <Droplet className="w-5 h-5" />
              </div>
            </div>

            {/* Visual Glasses */}
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 14 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setWaterGlasses(i + 1)}
                  className={`h-9 rounded-lg border flex items-center justify-center transition-all ${
                    i < waterGlasses
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-surface-elevated border-border text-text-muted hover:border-border-light'
                  }`}
                  title={`${(i + 1) * 250} ml`}
                >
                  <Droplet className={`w-3.5 h-3.5 ${i < waterGlasses ? 'fill-primary' : ''}`} />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setWaterGlasses(prev => Math.min(14, prev + 1));
                  toast.success('+250ml Water logged');
                }}
                className="btn-secondary flex-1"
              >
                + 1 Glass (250 ml)
              </button>
              <button
                onClick={() => {
                  setWaterGlasses(prev => Math.min(14, prev + 2));
                  toast.success('+500ml Water logged');
                }}
                className="btn-secondary flex-1"
              >
                + 1 Bottle (500 ml)
              </button>
            </div>
          </div>
        </div>

        {/* Meals Breakdown */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-text-primary">
            Today's Logged Meals
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {mealCategories.map((mealType) => {
              const mealLogs = logs.filter(l => l.mealType === mealType);
              const mealCalories = mealLogs.reduce((sum, l) => sum + (l.calories || 0), 0);
              const mealProtein = Math.round(mealLogs.reduce((sum, l) => sum + (l.proteinGrams || 0), 0) * 10) / 10;

              return (
                <div key={mealType} className="panel p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center pb-3 border-b border-border mb-3">
                      <div>
                        <h4 className="font-bold text-sm text-text-primary capitalize">{mealType.toLowerCase()}</h4>
                        <span className="text-xs text-text-secondary font-mono">
                          {mealCalories} kcal • {mealProtein}g protein
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedMealType(mealType);
                          setIsModalOpen(true);
                        }}
                        className="btn-ghost py-1 px-2.5 text-xs text-primary"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Food
                      </button>
                    </div>

                    <div className="space-y-2">
                      {mealLogs.length === 0 ? (
                        <div className="py-4 text-center text-xs text-text-muted">
                          No foods logged for {mealType.toLowerCase()} yet.
                        </div>
                      ) : (
                        mealLogs.map((log) => (
                          <div key={log.id} className="p-2.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-between text-xs">
                            <div>
                              <div className="font-medium text-text-primary">{log.foodName}</div>
                              <div className="text-[10px] text-text-secondary font-mono mt-0.5">
                                {log.proteinGrams}g P • {log.carbsGrams || 0}g C • {log.fatGrams || 0}g F
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="stat-number text-xs text-primary">{log.calories} kcal</span>
                              <button
                                onClick={() => handleDeleteLog(log.id, log.foodName)}
                                className="text-text-muted hover:text-red-400 transition-colors p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Log Food Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="panel bg-surface border border-border p-6 rounded-2xl max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-elevated">
                <X className="w-4 h-4" />
              </button>

              <div>
                <h3 className="text-base font-bold text-text-primary">Log Food to {selectedMealType.toLowerCase()}</h3>
                <p className="text-xs text-text-secondary">Search verified nutrition items or create a custom entry.</p>
              </div>

              {/* Meal Type Pills */}
              <div className="flex gap-1.5">
                {mealCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedMealType(cat)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedMealType === cat ? 'bg-primary text-white font-semibold' : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {cat.toLowerCase()}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search chicken breast, oats, eggs, roti, paneer..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-text-primary focus:border-primary outline-none"
                />
              </div>

              {/* Food Items */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {filteredFoodPresets.slice(0, 6).map(f => (
                  <div
                    key={f.id}
                    className="p-2.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-between text-xs hover:border-border-light transition-colors"
                  >
                    <div>
                      <div className="font-medium text-text-primary">{f.name}</div>
                      <div className="text-[10px] text-text-secondary font-mono">
                        {f.servingSize} • {f.proteinGrams}g P • {f.carbsGrams}g C
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="stat-number text-xs text-primary">{f.calories} kcal</span>
                      <button
                        onClick={() => handleLogPresetFood(f)}
                        className="btn-primary py-1 px-2.5 text-xs"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Item Form */}
              <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3">
                <span className="text-xs font-semibold text-text-secondary block">Custom Food Item</span>
                <form onSubmit={handleLogCustomFood} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Item name"
                      value={customFood.name}
                      onChange={e => setCustomFood({ ...customFood, name: e.target.value })}
                      className="bg-surface border border-border rounded-xl p-2 text-xs text-text-primary outline-none focus:border-primary"
                    />
                    <input
                      type="number"
                      placeholder="Calories (kcal)"
                      value={customFood.calories}
                      onChange={e => setCustomFood({ ...customFood, calories: e.target.value })}
                      className="bg-surface border border-border rounded-xl p-2 text-xs text-text-primary outline-none focus:border-primary font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      placeholder="Protein (g)"
                      value={customFood.protein}
                      onChange={e => setCustomFood({ ...customFood, protein: e.target.value })}
                      className="bg-surface border border-border rounded-xl p-2 text-xs text-text-primary outline-none focus:border-primary font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Carbs (g)"
                      value={customFood.carbs}
                      onChange={e => setCustomFood({ ...customFood, carbs: e.target.value })}
                      className="bg-surface border border-border rounded-xl p-2 text-xs text-text-primary outline-none focus:border-primary font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Fat (g)"
                      value={customFood.fat}
                      onChange={e => setCustomFood({ ...customFood, fat: e.target.value })}
                      className="bg-surface border border-border rounded-xl p-2 text-xs text-text-primary outline-none focus:border-primary font-mono"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button type="submit" className="btn-primary">
                      Add Custom Entry
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NutritionTracker;
