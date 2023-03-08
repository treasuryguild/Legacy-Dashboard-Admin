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
    const tx_id = ref('')
    const tx_type = ref('')
    const transaction_date = ref('')
    const project_id = ref('')
    const transaction_json_url = ref('')
    const md_version = ref('')
    const recipients = ref('')
    const total_ada = ref('')
    const total_gmbl = ref('')
    const total_agix = ref('')
    const total_copi = ref('')
    const total_ntx = ref('')
  
    const contributions = ref([])
    const task_creator = ref('')
    const task_name = ref('')
    const task_label = ref('')
    const task_label_array = ref([])
    const task_description = ref('')
    const task_type = ref('')
    const exchange_rate = ref(0)
    const contributor_id = ref('')
    const contribution_id = ref('')
    const ada = ref('')
    const gmbl = ref('')
    const agix = ref('')
    const copi = ref('')
    const ntx = ref('')
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
            .eq('project_id', project_id.value)
            
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
          "Operations":["Operations","PM Meeting","Video Meeting","Marketing Call","Weekly call - Treasury Guild Team","Weekly Call - Swarm & Treasury Guild","Setting up","set up","Schedule","setup","Organiz","gdrive","miro","Community Suggestion","Management","Transactions","Install","treasury","administration-of-budget","administration of budget","general admin", "remuneration", "salary", "payments", "leftover","test wallet","Other","budget administration","operational","research","preparation","move to exchange"],
          "Swarm Session":["Swarm Session","Join Saturday Swarm Session"],
          "Insight fest":["Insight fest"],
          "Content Creation":["Content Creation","article","Poetry","create","creating","Promotion","videocreation","Translat","Clip & Edit","translat","videos","content shared","Town Hall Slides"],
          "ATH Participation":["ATH Participation","join us at After Town Hall"],
          "Onboarding":["Onboarding","Onboard","Mentorship","workshop"],
          "Timestamping":["Timestamping","timestamp"],
          "Documentation":["Documentation","How to","Report","mapping","Walkthrough"],
          "Community Communication":["Community Communication","weekly call","Hosts","coordinat","Ambassador Town Hall","weekly meeting","community council","meeting","session","Facilitate","Announce","attendees"],
          "Governance":["Governance","voting"],
          "Tool Development":["Tool Development","MVP","Discord Server","Integrate","Add csv features","metadata"],
          "Ideation":["Ideation","Suggest"],
          "Voting":["voting registration","voting"],
          "Staking":["Staking to pool","Stake to pool", "Staked to pool","stake to stake pool", "Payment for staking funds","Transaction fee for staking", "Staking fees", "Staking to", "Staking fee", "pool fees", "staking pool fees"],
          "Donation":["sent donation", "send donation", "donation sent"],
          "Incentive Budget":["new lead","verified cross-chain lead","verified lead", "generated lead", "confirmed collaboration", "lead collaboration", "support participation","Funded-proposer","Toolmakers-and-maintainers","Stake-Pool-Operators","General-ADA-Holder","Community-Advisors","Funded proposer","Toolmakers and maintainers","Stake Pool Operators","General ADA Holder","Community Advisors","Swarm bounties - CC Logo","funds to pay for CC Bounties","incentives"],
          "Fixed costs":["Fixed costs","Comm Org Tools","Zoom","GitBook", "comm-org-tools", "expenses", "costs"],
          "Internal transfer":["Internal wallet transfer","Internal transfer"],
          "Rewards Withdrawal":["Rewards-Withdrawal","Internal wallet transfer and staking rewards","staking rewards", "Stake rewards", "Stake Pool Rewards","Withdrawal staking reward funds"],
          "Incoming":["Incoming","IOG", "received donation", "donation received"]
        }
        /*var finalResult = "";
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
        }*/

        let finalResult = "";
        for (let i in tasktypes) {
          tasktypes[i].forEach(partialWord => {
            let regex = new RegExp(partialWord.toLowerCase());
            if (regex.test(description.toLowerCase())) {
              finalResult = i;
            }
            if (regex.test(name.toLowerCase())) {
              finalResult = i;
            }
            if (regex.test(label.toLowerCase())) {
              finalResult = i;
            }    
          });
        }

        return finalResult;
      }

      async function updateTransactions() {
         
        const { transactions, transactionsUrls, transactionDates, transactionIds } =  await useGetTxs(orgEl, repoEl, projectJ.value, fundJ.value, poolJ.value)
          console.log(Date.now(), transactions.value[0])
          for (let i in transactions.value) {
            let taskName = ''
            let taskLabel = ''
            let taskLabelArray = []
            let taskDescription = ''
            let taskType = ''
            
            
            if (transactions.value[i].txid && (!transaction_idx.value.includes(transactionIds.value[i]))) { //only updates txs with new date ids
            transactionId.value = transactions.value[i].txid
            transaction_json_url.value = transactionsUrls.value[i]
            transaction_date.value = transactionDates.value[i] 
            
              if (transactions.value[i].exchangeRate) {
                taskName = ''
                taskLabel = transactions.value[i].budget
                taskDescription = transactions.value[i].description
                taskType = getTaskType(taskName,taskLabel,taskDescription)
                recipients.value = 1
                md_version.value = '0.02'
                exchange_rate.value = parseFloat(transactions.value[i].exchangeRate)?parseFloat(transactions.value[i].exchangeRate):0
                tx_type.value = (transactions.value[i].budget.includes("Incoming")?"Incoming":(taskType == "Staking" || taskType == "Voting" || taskType == "Rewards Withdrawal" || taskType == "Internal transfer" ? taskType : "Outgoing"))
                total_ada.value = transactions.value[i].ada
                total_gmbl.value = transactions.value[i].gmbl
                total_agix.value = transactions.value[i].agix
                total_copi.value = transactions.value[i].copi
                total_ntx.value = transactions.value[i].ntx
              } else if (transactions.value[i].mdVersion) {
                taskName = transactions.value[i].contributions[0].name?transactions.value[i].contributions[0].name.join(' '):''
                if (Array.isArray(transactions.value[i].contributions[0].label)) {
                  taskLabelArray = (transactions.value[i].contributions[0].label.join(' ')).split(", ")
                  taskLabel = taskLabelArray.includes("Operations")?"Operations":taskLabelArray[0]
                } else {
                  taskLabel = transactions.value[i].contributions[0].label?transactions.value[i].contributions[0].label:''
                } 
                taskDescription = transactions.value[i].contributions[0].description?transactions.value[i].contributions[0].description.join(' '):''
                taskType = getTaskType(taskName,taskLabel,taskDescription)
                md_version.value = transactions.value[i].mdVersion[0] ? transactions.value[i].mdVersion[0] : "1.0"
                tx_type.value = transactions.value[i].contributions[0].label.includes("Incoming") ? "Incoming" : (taskType == "Staking" || taskType == "Voting" || taskType == "Rewards Withdrawal" || taskType == "Internal transfer" ? taskType : "Outgoing")
                console.log(parseFloat(((transactions.value[i].msg[transactions.value[i].msg.length - 2]).match(/[+-]?\d+(\.\d+)?/g))[0]))
                exchange_rate.value = (parseFloat(((transactions.value[i].msg[transactions.value[i].msg.length - 2]).match(/[+-]?\d+(\.\d+)?/g))[0]))
                recipients.value = (parseInt(((transactions.value[i].msg[transactions.value[i].msg.findIndex(str => str.includes("Recipients"))]).match(/[+-]?\d+(\.\d+)?/g))[0]))
                total_ada.value = transactions.value[i].msg.some(str => str.includes("USD") && str.includes("ADA"))?((transactions.value[i].msg[transactions.value[i].msg.findIndex(str => str.includes("USD") && str.includes("ADA"))]).match(/[+-]?\d+(\.\d+)?/g).map(parseFloat))[1]:(((transactions.value[i].msg[transactions.value[i].msg.findIndex(str => str.includes("Recipients"))]).match(/[+-]?\d+(\.\d+)?/g).map(parseFloat))[0]*1.344798).toFixed(6)
                total_gmbl.value = transactions.value[i].msg.some(str => str.includes("USD") && str.includes("GMBL" || "gimbal"))?(((transactions.value[i].msg[transactions.value[i].msg.findIndex(str => str.includes("USD") && str.includes("GMBL" || "gimbal"))]).match(/[+-]?\d+(\.\d+)?/g).map(parseFloat))[1]):0
                total_agix.value = transactions.value[i].msg.some(str => str.includes("USD") && str.includes("AGIX"))?(((transactions.value[i].msg[transactions.value[i].msg.findIndex(str => str.includes("USD") && str.includes("AGIX"))]).match(/[+-]?\d+(\.\d+)?/g).map(parseFloat))[1]):0
                total_copi.value = transactions.value[i].msg.some(str => str.includes("USD") && str.includes("COPI"))?(((transactions.value[i].msg[transactions.value[i].msg.findIndex(str => str.includes("USD") && str.includes("COPI"))]).match(/[+-]?\d+(\.\d+)?/g).map(parseFloat))[1]):0
                total_ntx.value = transactions.value[i].msg.some(str => str.includes("USD") && str.includes("NTX"))?(((transactions.value[i].msg[transactions.value[i].msg.findIndex(str => str.includes("USD") && str.includes("NTX"))]).match(/[+-]?\d+(\.\d+)?/g).map(parseFloat))[1]):0
              } else { 
                taskName = ''
                taskLabel = transactions.value[i].budget
                taskDescription = transactions.value[i].description
                taskType = getTaskType(taskName,taskLabel,taskDescription)
                recipients.value = 1
                exchange_rate.value = 0.00
                md_version.value = '0.01'
                tx_type.value = (transactions.value[i].budget.includes("Incoming")?"Incoming":(taskType == "Staking" || taskType == "Voting" || taskType == "Rewards Withdrawal" || taskType == "Internal transfer" ? taskType : "Outgoing"))
                total_ada.value = transactions.value[i].ada
                total_gmbl.value = transactions.value[i].gmbl
                total_agix.value = transactions.value[i].agix
                total_copi.value = transactions.value[i].copi
                total_ntx.value = transactions.value[i].ntx
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
            recipients: recipients.value,
            tx_type: tx_type.value,
            total_ada: total_ada.value,
            total_gmbl: total_gmbl.value,
            total_agix: total_agix.value,
            total_copi: total_copi.value,
            total_ntx: total_ntx.value
          }
    
          let { data, error } = await supabase
            .from('transactions')
            .upsert(updates)
            .select(`tx_id`)
            .single()
    
          if (error) throw error
          if (data) {
                    tx_id.value = data.tx_id
                    console.log('Testing if data returns when sending data', tx_id.value)
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
                if (Array.isArray(transactions.value[i].contributions[k].label)) {
                  task_label_array.value = (transactions.value[i].contributions[k].label.join(' '))
                  task_label.value = task_label_array.value.includes("Operations")?"Operations":((task_label_array.value).split(","))[0]
                } else {
                  task_label_array.value = transactions.value[i].contributions[k].label?transactions.value[i].contributions[k].label:''
                  task_label.value = transactions.value[i].contributions[k].label?transactions.value[i].contributions[k].label:''
                } 
                task_description.value = transactions.value[i].contributions[k].description?transactions.value[i].contributions[k].description.join(' '):''
                task_type.value = getTaskType(task_name.value,task_label.value,task_description.value)
                try {
                  loading.value = true
            
                  const updates = {
                    tx_id: tx_id.value,
                    project_id: project_id.value,
                    task_creator: task_creator.value,
                    task_name: task_name.value,
                    task_label: task_label_array.value,
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
                  copi.value = transactions.value[i].contributions[k].contributors[m].COPI?transactions.value[i].contributions[k].contributors[m].COPI:0
                  ntx.value = transactions.value[i].contributions[k].contributors[m].NTX?transactions.value[i].contributions[k].contributors[m].NTX:0
                  if (!contributor_idx.value.includes(contributor_id.value)) {
                    //console.log(contributor_id.value)
                    if (oldWalletIds.value.includes(contributor_id.value)) {
                      const oldwallet = await changeToOldWallet(contributor_id.value)
                      //console.log("changed", oldwallet)
                      contributor_id.value = oldwallet
                    } else {
                      contributor_id.value = "no__id"
                    }
                  }
    
                  try {
                  loading.value = true
            
                  const updates = {
                    tx_id: tx_id.value,
                    project_id: project_id.value,
                    contribution_id: contribution_id.value,
                    contributor_id: contributor_id.value,
                    ada: ada.value,
                    gmbl: gmbl.value,
                    agix: agix.value,
                    copi: copi.value,
                    ntx: ntx.value,
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
              copi.value = transactions.value[i].copi ? transactions.value[i].copi : 0
              ntx.value = transactions.value[i].ntx ? transactions.value[i].ntx : 0
              if (!contributor_idx.value.includes(contributor_id.value)) {
                //console.log(contributor_id.value)
                if (oldWalletIds.value.includes(contributor_id.value)) {
                  const oldwallet = await changeToOldWallet(contributor_id.value)
                  //console.log("changed", oldwallet)
                  contributor_id.value = oldwallet
                } else {
                  contributor_id.value = "no__id"
                }
              }
    
              try {
                  loading.value = true
            
                  const updates = {
                    tx_id: tx_id.value,
                    project_id: project_id.value,
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
                    tx_id: tx_id.value,
                    project_id: project_id.value,
                    contribution_id: contribution_id.value,
                    contributor_id: contributor_id.value,
                    ada: ada.value,
                    gmbl: gmbl.value,
                    agix: agix.value,
                    copi: copi.value,
                    ntx: ntx.value,
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
  await getGroupId();
  console.log('group_id done')
  await getProject();
  console.log('get_project done')
  await checkTxs();
  console.log(contributor_idx.value)
  await updateTransactions();
  console.log('update_transactions done')
  status.value = 'done'
  
  return { status }
}
