import { defineStore } from 'pinia'


export const useModalStore = defineStore('modal', {
    state: () => ({
        isOpen: false
    }),
    actions: {
        show(condition: boolean) {
            this.isOpen = condition;
        }
    },
});