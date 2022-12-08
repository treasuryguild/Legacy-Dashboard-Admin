// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

// by convention, composable function names start with "use"
export async function useGetWallet(wallet) {
  
  const lovelace = ref(0)
  const tokens = ref([])
  const tokenAmounts = ref([])
  const nfts = ref([])
  const nftPicture = ref([])


  async function getWallet() {
    const {data} = await axios.get(`https://pool.pm/wallet/${wallet}`)
    lovelace.value = data.lovelaces/1000000
    for (let i in data.tokens) {
        if (data.tokens[i].quantity == 1) {
            nfts.value.push(data.tokens[i].metadata.name)
            nftPicture.value.push(data.tokens[i].metadata.image instanceof Array?"https://ipfs.io/ipfs/"+(data.tokens[i].metadata.image.join("")).slice(7):"https://ipfs.io/ipfs/"+(data.tokens[i].metadata.image).slice(7))
        } else {
            tokens.value.push(data.tokens[i].metadata.ticker)
            tokenAmounts.value.push((data.tokens[i].quantity/Math.pow(10,data.tokens[i].metadata.decimals)).toFixed(2))
      }
    }
    console.log(lovelace.value)
  }

  await getWallet()

  return { lovelace, tokens, tokenAmounts, nfts, nftPicture }
}
