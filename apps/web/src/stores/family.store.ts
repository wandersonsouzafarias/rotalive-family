import type { FamilyWithMembers } from '@rotalive/shared';
import { create } from 'zustand';

interface FamilyState {
  activeFamily: FamilyWithMembers | null;
  families: FamilyWithMembers[];
  setActiveFamily: (family: FamilyWithMembers | null) => void;
  setFamilies: (families: FamilyWithMembers[]) => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  activeFamily: null,
  families: [],
  setActiveFamily: (family) => set({ activeFamily: family }),
  setFamilies: (families) => set({ families }),
}));
