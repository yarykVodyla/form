<template>
    <div>
        <Forms  :lang = "$parent.lang" :butt1="$parent.butt1" :butt2="$parent.butt2"
                :lp = "$parent.lp" :lp_url="$parent.lp_url" :t_geo="$parent.t_geo"
                :pixel_id = "$parent.pixel_id" :token="$parent.token" :langland="$parent.langland"
                :f_type="$parent.f_type"
                :inp_email="$parent.f_email"
                :inp_name="$parent.f_name"
                :ajx="$parent.ajx"
                :uri="$parent.uri"
                :geo="$parent.geo"
                :subid="$parent.subid"
                :validate="$parent.validate"
                :target_geo="$parent.target_geo"
                :add_id="$parent.add_id"
                :interlayer="$parent.interlayer"
                :termsCheck="$parent.termsCheck"
                @formsPolicyClick="appPolicyClick($event)"
        />

    </div>
</template>

<script>
import Forms from './components/Forms.vue'

export default {
    name: 'App',
    components: {
        Forms
    },
    methods: {
        appPolicyClick(data) {
            eventBus.$emit('policyClick', data)
        }
    }
}
</script>

<style lang="scss">
#app {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
