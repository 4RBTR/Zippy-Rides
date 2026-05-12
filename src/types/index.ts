/** Standardized response returned by all Server Actions */
export type ActionResponse<T = void> = {
  success: boolean;
  error?: string;
  data?: T;
};

/** Vehicle with all relations loaded */
export type VehicleWithParts = {
  id: string;
  userId: string;
  name: string;
  type: "MOTOR" | "MOBIL";
  currentMileage: number;
  imageUrl: string | null;
  annualTaxDate: Date | null;
  fiveYearTaxDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  partIntervals: PartIntervalWithReplacements[];
  journals: JournalEntry[];
};

export type PartIntervalWithReplacements = {
  id: string;
  vehicleId: string;
  partName: string;
  intervalKm: number;
  createdAt: Date;
  replacements: PartReplacementEntry[];
};

export type PartReplacementEntry = {
  id: string;
  partIntervalId: string;
  replacedAtKm: number;
  cost: number;
  receiptImageUrl: string | null;
  replacedAt: Date;
};

export type JournalEntry = {
  id: string;
  vehicleId: string;
  type: "SYMPTOM" | "MODIFICATION" | "GENERAL";
  title: string;
  description: string | null;
  createdAt: Date;
};

/** Data for the expense analytics charts */
export type MonthlyExpense = {
  month: string;
  total: number;
  vehicleName: string;
};
