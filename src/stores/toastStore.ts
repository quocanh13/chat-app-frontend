import { create } from "zustand";
import { type Toast, type ToastType } from "../shared/types";

interface AddToastInput{
    type?: ToastType,
    message?: string,
    closeTime?: number | null
}

interface ToastStore {
    toasts: Toast[],
    currentId: number,
    addToast: (input: AddToastInput) => void,
    deleteToast: (id: number) => void
}

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    currentId: 0,
    addToast(input) {
        const closeTime = input.closeTime == undefined ? 5000 : input.closeTime
        set((state) => ({
            currentId: state.currentId + 1,
            toasts: [
                ...state.toasts,
                {
                    id: state.currentId,
                    type: input.type,
                    message: input.message,
                    closeTime,
                },
            ],
        }));
    },

    deleteToast(id: number) {
        set((state)=>({
            toasts: state.toasts.filter((t) => t.id != id)
        }))
    },
}))