// mouse.js
import { ref } from 'vue'
import axios from 'axios'

// by convention, composable function names start with "use"
export async function useGetTxs(orgEl, repoEl, projectJ, fundJ, poolJ) {
  
  const transactions = ref([])
  const transactionsUrls = ref([])
  const transactionDates = ref([])
  const transactionIds = ref([])

  async function downloadFromDownloadURLs(url) {
    const {data} = await axios.get(url);
    const downloadedData = [];
    for (let key of Object.keys(data).reverse()) {
      let downloadUrl = data[key].download_url;
      let txDate = data[key].name.substring(0,13);
      const downloadResponse = await axios.get(downloadUrl);
      downloadedData.push(downloadResponse.data);
      transactionsUrls.value.push(downloadUrl)
      transactionDates.value.push(txDate)
      if (poolJ == "Swarm-Treasury-Wallet") {
        if (key == data.length - 3) { // this only checks the first 4 files in each folder
        break;
      }
      }
    }
    return downloadedData;
  }
  
  async function loadData(orgEl, repoEl, projectJ, fundJ, poolJ) {
    let prefixUrl = `https://api.github.com/repos/${orgEl}/${repoEl}/contents/Transactions/${projectJ}/${fundJ}/${poolJ}`;
    const {data} = await axios.get(prefixUrl);
    const bi = [];
    for (let dataKey in data) {
      const budget = data[dataKey].name.replace(/\s/g, '-');
      const url = `${prefixUrl}/${budget}`;
      for (const downloadedData of await downloadFromDownloadURLs(url)) {
        transactions.value.push(downloadedData);
        transactionIds.value.push(downloadedData.txid)
      }
    } 
  }

  await loadData(orgEl, repoEl, projectJ, fundJ, poolJ)
  console.log('composable txs',transactions.value)
  return { transactions, transactionsUrls, transactionDates, transactionIds }
}
