import { defineClientConfig } from '@vuepress/client'
import Result from './components/Result.vue'
import Apply from './components/Apply.vue'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component('Result', Result)
    app.component('Apply', Apply)
  },
  rootComponents: [],
})