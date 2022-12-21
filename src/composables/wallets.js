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

  async function readTextFile() {
    const response = await axios.get('https://raw.githubusercontent.com/treasuryguild/treasury-system-v4/main/data/dework-wallets.txt');
    const text = response.data;
  
    const lines = text.split('\n');
    const json = {};
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.length === 0) continue;
      const id = line.substring(line.length - 6);
      json[id] = line;
      wallets.value.push(line)
      walletIds.value.push(id);
    }
  
    console.log(json);
  }

  await process()
  await readTextFile()

  return { wallets, walletIds }
}
