import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'

Vue.component('loader', {
  template: `
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  `
})

new Vue({
  el: '#app',
  data() {
    return {
      loading: false,
      form: {
        name: '',
        value: ''
      },
      contacts: []
    }
  },
  computed: {
    canCreate() {
      return this.form.name.trim() && this.form.value.trim();
    }
  },
  methods: {
    async createContact() {
      const {...contact} = this.form;

      const res = await request('/api/contacts', 'POST', contact);
  
      this.contacts.push(res);
      this.form.name = this.form.value = '';
    },
    async markContact(id) {
      let c = this.contacts.find(c => c.id === id);
      const updated = await request(`/api/contacts/${id}`, 'PUT', {
        ...c,
        marked: !c.marked
      });
      c.marked = updated.marked;
    },
    async removeContact(id) {
      await request(`/api/contacts/${id}`, 'DELETE');
      this.contacts = this.contacts.filter(c => c.id !== id);
    },
    
  },
  async mounted() {
    this.loading = true;
    this.contacts = await request('/api/contacts');
    this.loading = false;
  }
})

async function request(url, method='GET', data=null) {
  try {
    const headers = {};
    let body;

    if(data) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }
    const res = await fetch(url, {
      method,
      headers,
      body
    });
    return await res.json();
  } catch(e) {
    console.warn('Error:', e.message);
  }
}
