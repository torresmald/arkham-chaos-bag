import { defineStore } from 'pinia'
import type { Token } from '../../types/token'

const BAG_STORAGE_KEY = 'arkham-chaos-bag'
const SEALED_STORAGE_KEY = 'arkham-chaos-sealed'

export const useChaosBagStore = defineStore('chaosBag', {
  state: () => ({
    bag: [] as Token[],
    lastDraw: null as Token | null,
    sealedTokens: [] as Token[],
    isDrawing: false
  }),

  actions: {
    reset() {
      this.bag = []
      this.sealedTokens = []
      this.lastDraw = null
      this.isDrawing = false
      this.saveToStorage()
    },
    loadFromStorage() {
      const data = localStorage.getItem(BAG_STORAGE_KEY)
      if (data) {
        this.bag = JSON.parse(data)
      }
      const sealedData = localStorage.getItem(SEALED_STORAGE_KEY)
      if (sealedData) {
        this.sealedTokens = JSON.parse(sealedData)
      }
    },

    saveToStorage() {
      localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(this.bag))
      localStorage.setItem(SEALED_STORAGE_KEY, JSON.stringify(this.sealedTokens))
    },

    addToken(token: Token) {
      this.bag.push(token)
      this.saveToStorage()
    },

    removeToken(token: Token) {
      const index = this.bag.indexOf(token)
      if (index !== -1) {
        this.bag.splice(index, 1)
        this.saveToStorage()
      }
    },

    async drawToken(): Promise<Token | null> {
      if (this.bag.length === 0 || this.isDrawing) return null

      this.isDrawing = true
      const index = Math.floor(Math.random() * this.bag.length)
      const tokenDraw: Token = this.bag[index]
      this.lastDraw = tokenDraw
      await new Promise(r => setTimeout(r, 3000))
      // SI EL TOKEN ES MALDITA O BENEDICIDA, REMOVERLA DE LA BOLSA
      if (tokenDraw.type === 'blessed' || tokenDraw.type === 'cursed' || tokenDraw.type === 'frost') {
        this.removeToken(tokenDraw)
      }
      this.isDrawing = false

      return tokenDraw
    },

    sealToken(token: Token) {
      const bagIndex = this.bag.indexOf(token)
      if (bagIndex === -1) return
      const [sealedToken] = this.bag.splice(bagIndex, 1)
      this.sealedTokens.push(sealedToken)
      this.saveToStorage()
    },

    returnSealedToken(token: Token) {
      const sealedIndex = this.sealedTokens.indexOf(token)
      if (sealedIndex === -1) return
      const [returnedToken] = this.sealedTokens.splice(sealedIndex, 1)
      this.bag.push(returnedToken)
      this.saveToStorage()
    },
  }
})