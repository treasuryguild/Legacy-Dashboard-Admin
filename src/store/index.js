import { defineStore } from 'pinia';

export const useStore = defineStore('test', {
    state: () => ({
        name: 'Pinia',
        number: 1,
        group: '',
        project: '',
        wallet: ''
    }),
    actions: {
        changeName(value) {
            this.name = value;
        },
        changeNumber(value) {
            this.number = value;
        },
        changeGroup(value) {
            this.group = value;
        },
        changeProject(value) {
            this.project = value;
        },
        changeWallet(value) {
            this.wallet = value;
        }
    }
})