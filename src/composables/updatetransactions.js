// 
import { useStore } from '../store/index';
import { supabase } from '../supabase'
import { ref } from 'vue'
import { useGetTxs } from './gettransactions'
import { useOldWallets } from './oldwallets'

// by convention, composable function names start with "use"
export async function useGetAllTransactions() {
  
    const store = useStore()
    const status = ref('')
    const orgEl = 'treasuryguild'
    const repoEl = 'treasury-system-v4'
    const projectJ = ref('')
    const fundJ = ref('')
    const poolJ = ref('')
    const loadDash = ref(false)
    const loading = ref(true)
    const loading2 = ref(true)
    const groupname = ref('')
    const groupid = ref('')
    const transactionId = ref('')
    const transaction_date = ref('')
    const project_id = ref('')
    const transaction_json_url = ref('')
    const md_version = ref('')
    const total_ada = ref('')
    const total_gmbl = ref('')
    const total_agix = ref('')
  
    const contributions = ref([])
    const task_creator = ref('')
    const task_name = ref('')
    const task_label = ref('')
    const task_description = ref('')
    const task_type = ref('')
    const exchange_rate = ref(0)
    const contributor_id = ref('')
    const contribution_id = ref('')
    const ada = ref('')
    const gmbl = ref('')
    const agix = ref('')
    const created_at = ref('')
  
    const walletx = ref([])
    const contributor_idx = ref([])
    const updated_atx = ref([])
    const transaction_idx = ref([])
    const { oldWallets, oldWalletIds } = await useOldWallets()
    const result = ref("")

    async function changeToOldWallet(name) {
      result.value = "" //use this function to assign old names to addresses
      console.log("testing function",name)
      
      for (let i in oldWallets.value) {
        if (name == oldWalletIds.value[i]) {
          result.value = oldWallets.value[i].substring(oldWallets.value[i].length - 6)
          console.log("went through if",result.value)
          break;
        }
      }
      if (result.value === "") {
        result.value = "no__id"
        console.log("went through else",result.value)
      }
      
      return result.value
    }

    async function checkWallets() {
    
        try {
          loading.value = true
    
          let { data, error, status } = await supabase
            .from('contributors')
            .select(`contributor_id, wallet, updated_at`)
            
          if (error && status !== 406) throw error
    
          if (data) {
            for (let j in data) {
                contributor_idx.value.push(data[j].contributor_id)
                walletx.value.push(data[j].wallet)
                updated_atx.value.push(new Date(data[j].updated_at).valueOf())
            }
          }
        } catch (error) {
          alert(error.message)
        } finally {
          loading.value = false
        }
      }

      async function checkTxs() {
    
        try {
          loading.value = true
    
          let { data, error, status } = await supabase
            .from('transactions')
            .select(`transaction_id`)
            
          if (error && status !== 406) throw error
    
          if (data) {
            for (let j in data) {
              transaction_idx.value.push(data[j].transaction_id)
            }
          }
        } catch (error) {
          alert(error.message)
        } finally {
          loading.value = false
        }
      }
    
      async function getGroupId() {
        
        try {
          loading.value = true
    
          let { data, error, status } = await supabase
            .from('groups')
            .select(`group_id, group_name`)
            .eq('group_name', store.group)
            .single()
            
          if (error && status !== 406) throw error
          console.log(data)
          if (data) {
              groupid.value = data.group_id
              groupname.value = data.group_name
          }
        } catch (error) {
          alert(error.message)
        } finally {
          loading.value = false
        }
      }
    
      async function getProject() {
    
        try {
          loading.value = true
    
          let { data, error, status } = await supabase
            .from('projects')
            .select(`project_id, project_name, updated_at, group_id, project_type, wallet`)
            .eq('project_name', store.project)
            .single()
            
          if (error && status !== 406) throw error
          console.log(groupname.value, data.project_type, data.project_name)
    
          if (data) {
            if (data.project_type == 'Treasury Wallet') {
              projectJ.value = groupname.value.replace(/\s/g, '-')
              fundJ.value = 'TreasuryWallet'
              poolJ.value = data.project_name.replace(/\s/g, '-')
            } else {
            
              projectJ.value = groupname.value.replace(/\s/g, '-')
              fundJ.value = ("Fund" + parseInt(data.project_type.replace( /^\D+/g, '')))
              poolJ.value = data.project_name.replace(/\s/g, '-')
            }
            project_id.value = data.project_id
          }
        } catch (error) {
          alert(error.message)
        } finally {
          loading.value = false
        }
      }

      function getTaskType(name, label, description) {
        var tasktypes = {
          "Operations":["Operations","PM Meeting","Video Meeting","Marketing Call","Weekly call - Treasury Guild Team","Weekly Call - Swarm & Treasury Guild","Setting up","set up","Schedule","setup","Organiz","gdrive","miro","Community Suggestion","Management","Transactions","Install"],
          "Swarm Session":["Swarm Session","Join Saturday Swarm Session"],
          "Insight fest":["Insight fest"],
          "Content Creation":["Content Creation","article","Poetry","create","creating","Promotion","videocreation","Translat","Clip & Edit"],
          "ATH Participation":["ATH Participation","join us at After Town Hall"],
          "Onboarding":["Onboarding","Onboard"],
          "Timestamping":["Timestamping","timestamp"],
          "Documentation":["Documentation","How to","Report","mapping","Walkthrough"],
          "Community Communication":["Community Communication","weekly call","Hosts","coordinat","Ambassador Town Hall","weekly meeting","community council","meeting","session","Facilitate","Announce"],
          "Governance":["Governance","voting"],
          "Tool Development":["Tool Development","MVP","Discord Server","Integrate","Add csv features","metadata"],
          "Ideation":["Ideation","Suggest"],
          "Fixed costs":["Fixed costs","Comm Org Tools","Zoom","GitBook"]
        }
        var finalResult = "";
        for (let i in tasktypes) {
          if (tasktypes[i].some(s => name.includes(s))) {
            finalResult = i
          }
          if (tasktypes[i].some(s => label.includes(s))) {
            finalResult = i
          }
          if (tasktypes[i].some(s => description.includes(s))) {
            finalResult = i
          }
        }
        return finalResult;
      }

      async function updateTransactions() {
         
        const { transactions, transactionsUrls, transactionDates } =  await useGetTxs(orgEl, repoEl, projectJ.value, fundJ.value, poolJ.value)
          console.log(Date.now(), transactions.value[0])
          for (let i in transactions.value) {
            if (transactions.value[i].txid && (!transaction_idx.value.includes(transactions.value[i].txid))) { //only updates txs with new tx ids
            transactionId.value = transactions.value[i].txid
            transaction_json_url.value = transactionsUrls.value[i]
            transaction_date.value = transactionDates.value[i]
            
              if (transactions.value[i].exchangeRate) {
                md_version.value = '0.02'
                exchange_rate.value = parseFloat(transactions.value[i].exchangeRate)
                total_ada.value = transactions.value[i].ada
                total_gmbl.value = transactions.value[i].gmbl
                total_agix.value = transactions.value[i].agix
              } else if (transactions.value[i].mdVersion) {
                md_version.value = transactions.value[i].mdVersion[0] ? transactions.value[i].mdVersion[0] : "1.0"
                console.log(parseFloat(((transactions.value[i].msg[transactions.value[i].msg.length - 2]).match(/[+-]?\d+(\.\d+)?/g))[0]))
                exchange_rate.value = (parseFloat(((transactions.value[i].msg[transactions.value[i].msg.length - 2]).match(/[+-]?\d+(\.\d+)?/g))[0]))
                total_ada.value = transactions.value[i].msg.some(str => str.includes("USD") && str.includes("ADA"))?((transactions.value[i].msg[transactions.value[i].msg.findIndex(str => str.includes("USD") && str.includes("ADA"))]).match(/[+-]?\d+(\.\d+)?/g).map(parseFloat))[1]:(((transactions.value[i].msg[transactions.value[i].msg.findIndex(str => str.includes("Recipients"))]).match(/[+-]?\d+(\.\d+)?/g).map(parseFloat))[0]*1.344798).toFixed(2)
                total_gmbl.value = transactions.value[i].msg.some(str => str.includes("USD") && str.includes("GMBL" || "gimbal"))?(((transactions.value[i].msg[transactions.value[i].msg.findIndex(str => str.includes("USD") && str.includes("GMBL" || "gimbal"))]).match(/[+-]?\d+(\.\d+)?/g).map(parseFloat))[1]):0
                total_agix.value = transactions.value[i].msg.some(str => str.includes("USD") && str.includes("AGIX"))?(((transactions.value[i].msg[transactions.value[i].msg.findIndex(str => str.includes("USD") && str.includes("AGIX"))]).match(/[+-]?\d+(\.\d+)?/g).map(parseFloat))[1]):0
              } else { 
                exchange_rate.value = 0.00
                md_version.value = '0.01'
                total_ada.value = transactions.value[i].ada
                total_gmbl.value = transactions.value[i].gmbl
                total_agix.value = transactions.value[i].agix
              }
    
            try {
          loading.value = true
    
          const updates = {
            transaction_id: transactionId.value,
            project_id: project_id.value,
            md_version: md_version.value,
            tx_json_url: transaction_json_url.value,
            transaction_date: transaction_date.value,
            exchange_rate: exchange_rate.value,
            updated_at: new Date(),
            total_ada: total_ada.value,
            total_gmbl: total_gmbl.value,
            total_agix: total_agix.value
          }
    
          let { data, error } = await supabase
            .from('transactions')
            .upsert(updates)
            .select(`created_at`)
            .single()
    
          if (error) throw error
          if (data) {
                    created_at.value = data.created_at
                    console.log('Testing if data returns when sending data', created_at.value)
                  }
          
        } catch (error) {
          alert(error.message)
        } finally {
          loading.value = false
        }
    
            if ( transactions.value[i].mdVersion ) {
              
              exchange_rate.value = parseFloat(transactions.value[i].msg[transactions.value[i].msg.length - 2])
              contributions.value = transactions.value[i].contributions
    
              for (let k in transactions.value[i].contributions) {
                task_creator.value = transactions.value[i].contributions[k].taskCreator
                task_name.value = transactions.value[i].contributions[k].name?transactions.value[i].contributions[k].name.join(' '):''
                task_label.value = transactions.value[i].contributions[k].label?transactions.value[i].contributions[k].label:''
                task_description.value = transactions.value[i].contributions[k].description?transactions.value[i].contributions[k].description.join(' '):''
                task_type.value = getTaskType(task_name.value,task_label.value,task_description.value)
                try {
                  loading.value = true
            
                  const updates = {
                    transaction_id: transactionId.value,
                    task_creator: task_creator.value,
                    task_name: task_name.value,
                    task_label: task_label.value,
                    task_description: task_description.value,
                    task_type: task_type.value
                  }
            
                  let { data, error } = await supabase
                    .from('contributions')
                    .upsert(updates)
                    .select(`contribution_id`)
                    .single()
    
                  if (error) throw error
                  if (data) {
                    contribution_id.value = data.contribution_id
                  }
                } catch (error) {
                  alert(error.message)
                } finally {
                  loading.value = false
                }
    
                for (let m in transactions.value[i].contributions[k].contributors) {
                  contributor_id.value = m
                  ada.value = transactions.value[i].contributions[k].contributors[m].ADA?transactions.value[i].contributions[k].contributors[m].ADA:(transactions.value[i].contributions[k].contributors[m].ada?transactions.value[i].contributions[k].contributors[m].ada:1.344798)
                  gmbl.value = transactions.value[i].contributions[k].contributors[m].GMBL?transactions.value[i].contributions[k].contributors[m].GMBL:(transactions.value[i].contributions[k].contributors[m].gimbal?transactions.value[i].contributions[k].contributors[m].gimbal:0)
                  agix.value = transactions.value[i].contributions[k].contributors[m].AGIX?transactions.value[i].contributions[k].contributors[m].AGIX:0
                  if (!contributor_idx.value.includes(contributor_id.value)) {
                    console.log(contributor_id.value)
                    if (oldWalletIds.value.includes(contributor_id.value)) {
                      const oldwallet = await changeToOldWallet(contributor_id.value)
                      console.log("changed", oldwallet)
                      contributor_id.value = oldwallet
                    } else {
                      contributor_id.value = "no__id"
                    }
                  }
    
                  try {
                  loading.value = true
            
                  const updates = {
                    transaction_id: transactionId.value,
                    contribution_id: contribution_id.value,
                    contributor_id: contributor_id.value,
                    ada: ada.value,
                    gmbl: gmbl.value,
                    agix: agix.value,
                  }
            
                  let { error } = await supabase.from('distributions').upsert(updates)
            
                  if (error) throw error
                } catch (error) {
                  alert(error.message)
                } finally {
                  loading.value = false
                }
    
                }
              }
               
              
            } else {
    
              task_creator.value = transactions.value[i].project
              task_name.value = ''
              task_label.value = transactions.value[i].budget
              task_description.value = transactions.value[i].description
              task_type.value = getTaskType(task_name.value,task_label.value,task_description.value)
              exchange_rate.value = parseFloat(transactions.value[i].exchangeRate)
              contributor_id.value = transactions.value[i].name
              ada.value = transactions.value[i].ada ? transactions.value[i].ada : 0
              gmbl.value = transactions.value[i].gmbl ? transactions.value[i].gmbl : 0
              agix.value = transactions.value[i].agix ? transactions.value[i].agix : 0
              if (!contributor_idx.value.includes(contributor_id.value)) {
                console.log(contributor_id.value)
                if (oldWalletIds.value.includes(contributor_id.value)) {
                  const oldwallet = await changeToOldWallet(contributor_id.value)
                  console.log("changed", oldwallet)
                  contributor_id.value = oldwallet
                } else {
                  contributor_id.value = "no__id"
                }
              }
    
              try {
                  loading.value = true
            
                  const updates = {
                    transaction_id: transactionId.value,
                    task_creator: task_creator.value,
                    task_name: task_name.value,
                    task_label: task_label.value,
                    task_description: task_description.value,
                    task_type: task_type.value
                  }
            
                  let { data, error } = await supabase
                    .from('contributions')
                    .upsert(updates)
                    .select(`contribution_id`)
                    .single()
    
                  if (error) throw error
                  if (data) {
                    contribution_id.value = data.contribution_id
                  }
                } catch (error) {
                  alert(error.message)
                } finally {
                  loading.value = false
                }
    
                try {
                  loading.value = true
            
                  const updates2 = {
                    transaction_id: transactionId.value,
                    contribution_id: contribution_id.value,
                    contributor_id: contributor_id.value,
                    ada: ada.value,
                    gmbl: gmbl.value,
                    agix: agix.value,
                  }
            
                  let { error } = await supabase.from('distributions').upsert(updates2)
            
                  if (error) throw error
                } catch (error) {
                  alert(error.message)
                } finally {
                  loading.value = false
                }
              
              console.log('not md',md_version.value)
            }
          }
        }
      }

  await checkWallets();
  await checkTxs();
  console.log(contributor_idx.value)
  await getGroupId();
  console.log('group_id done')
  await getProject();
  console.log('get_project done')
  await updateTransactions();
  console.log('update_transactions done')
  status.value = 'done'
  
  return { status }
}
