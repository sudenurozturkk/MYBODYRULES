export type MealPlan = {
  _id?: string;
  userId: string;
  weekStart: string; // Haftanın başlangıç tarihi (ISO string)
  day: 'Pazartesi' | 'Salı' | 'Çarşamba' | 'Perşembe' | 'Cuma' | 'Cumartesi' | 'Pazar';
  mealType: 'Kahvaltı' | 'Öğle' | 'Akşam' | 'Ara Öğün';
  food: string; // Yemek adı veya açıklaması
  source: 'kendi' | 'tarif' | 'yapayzeka';
  recipeId?: string; // Tariften geldiyse tarif ID
  createdAt: Date;
  updatedAt: Date;
};

export type MealPlanInput = {
  userId: string;
  weekStart: string;
  day: 'Pazartesi' | 'Salı' | 'Çarşamba' | 'Perşembe' | 'Cuma' | 'Cumartesi' | 'Pazar';
  mealType: 'Kahvaltı' | 'Öğle' | 'Akşam' | 'Ara Öğün';
  food: string;
  source: 'kendi' | 'tarif' | 'yapayzeka';
  recipeId?: string;
};
