import { create } from 'zustand';

interface BearState {
  bears: number;
  increaseBear: () => void;
}
const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increaseBear: () => set((state) => ({ bears: state.bears + 1 })),
}));

export default useBearStore;
