import { create } from "zustand";

interface GroupStore{
    currentGroupId: number | null,
    setCurrentGroupId: (id: number | null) => void,
}

export const useGroupStore = create<GroupStore>((set) => ({
    currentGroupId : null,
    setCurrentGroupId(id) { set({currentGroupId: id}) },
}))