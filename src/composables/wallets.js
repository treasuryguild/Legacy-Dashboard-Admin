import { ref } from 'vue'
import axios from 'axios'

export async function useWallets() {

  const wallets = ref([])
  const walletIds = ref([])
  const orgEl = 'treasuryguild'
  const repoEl = 'treasury-system-v4'

  async function process() {
    const {data} = await axios.get(`https://raw.githubusercontent.com/treasuryguild/treasury-system-v4/main/data/wallets.json`);
    console.log(data)
    for (let i in data) {
      if (data[i] == "no__id") {
        wallets.value.push(data[i])
        walletIds.value.push("no__id");
      } else if ( data[i] == "addr1vxm9rssxy335nxtph8x4jndrnxj7eyg0e66uv0u7k4dzyjsg6fr38" ) {
        wallets.value.push(data[i])
        walletIds.value.push("IOG");
      } else {
        wallets.value.push(data[i])
        walletIds.value.push(data[i].substr(data[i].length - 6));
      }
    }
  }

  await process()

  return { wallets, walletIds }
}
