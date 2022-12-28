interface IParams {
    baseCurrency: string,
    quoteCurrency: string,
    start_date: string,
    end_date: string,
    interval: string
}

const APIConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    socketKey: import.meta.env.VITE_SOCKET_KEY,
    socketURI: 'wss://marketdata.tradermade.com/feedadv',
    currencyAPI () {
        return `https://marketdata.tradermade.com/api/v1/live_currencies_list?api_key=${this.apiKey}`
    },
    timeseriesAPI (params: IParams) {
        let { baseCurrency, quoteCurrency, start_date, end_date, interval } = params
        return `https://marketdata.tradermade.com/api/v1/timeseries?currency=${baseCurrency + quoteCurrency}&start_date=${start_date}&end_date=${end_date}&format=records&interval=${interval}&api_key=${this.apiKey}`
    }
}

export default APIConfig