<script setup>
import { useStore } from '../store/index'
import CheckTransactions from '../components/CheckTransactions.vue'
import CreateFromScratch from '../components/CreateFromScratch.vue'
import UpdateWallets from '../components/UpdateWallets.vue'

const store = useStore()
</script>
<template>
    <div>
        Dashboard
        {{ store.name }}
        {{ store.number }}
        <Suspense>
            <UpdateWallets />
        </Suspense>
    </div>
</template>