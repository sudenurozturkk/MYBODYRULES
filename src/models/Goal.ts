export type Goal = {
  _id?: string;
  userId: string;
  title: string;
  description: string;
  type: 'weight' | 'fitness' | 'nutrition' | 'lifestyle';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  milestones: any[];
  createdAt: Date;
  updatedAt: Date;
};

export type GoalInput = {
  userId: string;
  title: string;
  description: string;
  type: 'weight' | 'fitness' | 'nutrition' | 'lifestyle';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  milestones?: any[];
};
