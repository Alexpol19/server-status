import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js'

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1;
  var dd = this.getDate();
  var time = this.getHours() + ':' + ((this.getMinutes() < 10) ? ("0" + this.getMinutes()) : (this.getMinutes())) + ':' + ((this.getSeconds() < 10) ? ("0" + this
  .getSeconds()) : (this.getSeconds()))
  return [
      (dd>9 ? '' : '0') + dd,
      (mm>9 ? '' : '0') + mm,
      this.getFullYear(),
    ].join('/') + `  ${time}`;
};

Vue.component('loader', {
  template : `
  <div style="display: flex; justify-content: center; align-items: center;">
    <div class="spinner-border" role="status">
      <span class="sr-only"></span>
    </div>
  </div>
  `
})

new Vue({
  el: '#app',
  data() {
    return {
      firstLoading: true,
      loading: false,
      servers: [],
      systemFine: true,
      lastUpdate: undefined,
    }
  },
  methods: {
    async getServerStatuses() {
      const data = await request('/api/serverStatuses')
      if(this.firstLoading) {
        this.firstLoading = false;
      }
      this.servers = data
    },
    async getStatuses() {
      this.loading = true
      await this.getServerStatuses()
  
      for(const serv of this.servers) {
        if(!serv.isSuccess) {
          this.systemFine = false
        }
      }
      
      var date = new Date();
      
      this.lastUpdate = date.yyyymmdd();
      this.loading = false
    }
  },
  async mounted() {
    let myTimeout = (() => {
      if(!this.loading && this.systemFine) {
        this.getStatuses();
        setTimeout(() => {
          myTimeout()
        }, 60000);
      }
    });
    myTimeout();
  }
})

async function request(url, method = 'GET', data = null) {
  try {
    const headers = {}

    let body;
    if(data) {
      body = JSON.stringify(data)
      headers['Content-Type'] = 'application/json'
    }
    const resp = await fetch(url, {
      method,
      headers,
      body
    })

    return resp.json()
  } catch(e) {
    console.warn('error', e.messsage)
  }
}