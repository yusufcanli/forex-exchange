<template>
  <main>
    <div class="container">
      <header>
        <h1>Forex Exchange</h1>
        <h2>Check out the current price for a currency pair</h2>
      </header>
      <div class="fe-wrapper">
        <div class="fe-select">
          <Dropdown :active="baseCurrency" :items="currencies" @setCurrency="(currency: Currency) => baseCurrency = currency" />
          <Dropdown :active="quoteCurrency" :items="currencies" @setCurrency="(currency: Currency) => quoteCurrency = currency" />
        </div>
        <div class="fe-content">
          <div v-show="loading" class="loading-wrapper">
            <div class="loading-spinner"></div>
          </div>
          <div class="exchange-info">
            <div class="exchange-index">
              <div :class="`currency-flag exchange-icon currency-flag-${baseCurrency.code.toLowerCase()}`"></div>
              <div :class="`currency-flag exchange-icon currency-flag-${quoteCurrency.code.toLowerCase()}`"></div>
              <div class="exchange-source">Forex.com</div>
            </div>
            <div class="exchange-live">
              <div class="exchange-ref">{{ baseCurrency.code }}/{{ quoteCurrency.code }}</div>
              <div class="exchange-val">
                <span v-show="curBid > 0">$ {{ curBid }}</span>
                <div v-show="prevBid > 0">
                  <span v-if="prevBid < curBid" class="change up">{{ (curBid - prevBid).toFixed(7) }} ({{ rateOfChange }} %)</span>
                  <span v-if="prevBid > curBid" class="change down">{{ (prevBid - curBid).toFixed(7) }} ({{ rateOfChange }} %)</span>
                </div>
              </div>
            </div>
          </div>
          <Chart />
          <div class="exchange-timeline">
            <div class="d-flex">
              <button v-for="(tab, index) in tabs" :key="index" :class="['exchange-stamp', { 'active': activeTab === tab }]" @click="activeTab = tab">
                {{ tab }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import APIConfig from './config/api'
import { ref, watch, onMounted, computed, onBeforeMount } from 'vue'
import Dropdown from '@/components/Dropdown.vue'
import Chart from '@/components/Chart.vue'
import { useStore } from 'vuex'

interface ICurrency {
  name: String,
  code: String
}

type Currency = ICurrency

const store = useStore()
const socket = ref<WebSocket>()
const baseCurrency = ref<Currency>({
  name: 'Euro',
  code: 'EUR'
})
const quoteCurrency = ref<Currency>({
  name: 'US Dollar',
  code: 'USD'
})
const tabs = ref(['15M', '1H', '1D', '1W', '1M'])
const activeTab = ref('15M')

const loading = computed(() => {
  return store.state.loading
})
const currencies = computed(() => {
  return store.state.liveCurrencies
})
const prevBid = computed(() => {
  return store.state.prevBid
})
const curBid = computed(() => {
  return store.state.curBid
})
const rateOfChange = computed(() => {
  let change = (curBid.value - prevBid.value) / curBid.value * 100.0
  return change.toFixed(7)
})

onMounted(() => {
  let today = new Date();
  if((today.getDay() == 6 || today.getDay() == 0)) {
      store.commit('setLoading', true)
      alert('Stock Market is closed. Please check another time.')
      return
  }

  store.dispatch('getCurrencies')
  getData()

  socket.value = new WebSocket(`${APIConfig.socketURI}`)

  socket.value.onopen = () => {
    socket.value?.send(JSON.stringify({ "userKey": APIConfig.socketKey, "symbol": `${baseCurrency.value.code + '' + quoteCurrency.value.code}` }))
  }
  

  socket.value.onmessage = (event) => {
    if (event.data !== 'Connected') {
      let newBid = parseFloat(JSON.parse(event.data).bid)
      if (newBid !== store.state.curBid) {
        store.commit('setPrevBid', store.state.curBid)
        store.commit('setCurBid', newBid)
      }
    }
  }

  socket.value.onclose = (event) => {
    console.log(event)
  }

  socket.value.onerror = (event) => {
    console.log(event)
  }

})

onBeforeMount(() => {
  socket.value?.close()
})

watch([baseCurrency, quoteCurrency, activeTab], () => {
  getData()
})

const getData = () => {
  store.dispatch('getData', {
    timestamp: activeTab.value,
    baseCurrency: baseCurrency.value.code,
    quoteCurrency: quoteCurrency.value.code
  })
}

</script>