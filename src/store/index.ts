import { createStore } from 'vuex'
import APIConfig from '@/config/api'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
interface ISettings {
    timestamp: string,
    baseCurrency: string,
    quoteCurrency: string
}

export default createStore({
    state: {
        chartData: [],
        BaseCurrency: {
            name: 'Euro',
            code: 'EUR'
        },
        QuoteCurrency: {
            name: 'US Dollar',
            code: 'USD'
        },
        minutesAgo: dayjs().utc().subtract(15, 'minute').format('YYYY-MM-DD HH:mm'),
        hourAgo: dayjs().utc().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
        loading: false,
        liveCurrencies: [],
        prevBid: 0,
        curBid: 0
    },
    getters: {
        chartData(state) {
            return state.chartData
        }
    },
    mutations: {
        setChartData(state, payload) {
            state.chartData = payload
        },

        setBaseCurrency(state, payload) {
            state.BaseCurrency = payload
        },

        setQuoteCurrency(state, payload) {
            state.QuoteCurrency = payload
        },

        setLoading(state, payload) {
            state.loading = payload
        },

        setLiveCurrencies(state, payload) {
            state.liveCurrencies = payload
        },

        setCurBid(state, payload) {
            state.curBid = payload
        },

        setPrevBid(state, payload) {
            state.prevBid = payload
        }
    },
    actions: {
        getCurrencies({ commit }) {
            commit('setLoading', true)
            const currencyAPI = APIConfig.currencyAPI()
            fetch(currencyAPI)
                .then(response => response.json())
                .then(response => {
                    commit('setLiveCurrencies', response.available_currencies)
                    commit('setLoading', false)
                })
                .catch(error => console.log(error))
        },
        getData({ commit }, settings: ISettings) {
            commit('setLoading', true)
            let { timestamp, baseCurrency, quoteCurrency } = settings
            let start_date = dayjs().utc().subtract(15, 'minute').format('YYYY-MM-DD HH:mm')
            let end_date = dayjs().utc().format('YYYY-MM-DD HH:mm')
            let interval = 'minute'

            switch (timestamp) {
                case '1H':
                    start_date = dayjs().utc().subtract(1, 'hour').format('YYYY-MM-DD HH:mm')
                    break;
                case '1D':
                    start_date = dayjs().utc().subtract(1, 'day').format('YYYY-MM-DD HH:mm')
                    interval = 'hourly'
                    break;
                case '1W':
                    start_date = dayjs().utc().subtract(1, 'week').format('YYYY-MM-DD HH:mm')
                    interval = 'hourly'
                    break;
                case '1M':
                    start_date = dayjs().utc().subtract(1, 'month').format('YYYY-MM-DD HH:mm')
                    interval = 'daily'
                    break;
            }

            const timeseriesAPI = APIConfig.timeseriesAPI({
                start_date, end_date, interval, baseCurrency, quoteCurrency
            })

            fetch(timeseriesAPI)
                .then((response: any) => {
                    if (!response.ok) throw new Error(response.status);
                    return response.json();
                })
                .then(response => {
                    if(response.error) throw new Error(response.message)
                    let payload = response
                    commit('setLoading', false)
                    commit('setChartData', payload)
                    commit('setCurBid', payload.quotes[payload.quotes.length - 1].close)
                    commit('setPrevBid', payload.quotes[payload.quotes.length - 2].close)
                    commit('setLoading', false)
                })
                .catch(error => {
                    alert(error)
                    console.log(error)
                })
        }
    },
})