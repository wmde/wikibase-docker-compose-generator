<template>
  <div id="Blubber"></div>
</template>

<script>
import Factory from './components/BlubberForm'
import Utils from './components/Utils'
import Language from './components/Language'
import VueFormGenerator from "vue-form-generator";
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default
{
  name: 'Blubber',
  components: {Utils, Factory, Language, FormWizard, TabContent, "vue-form-generator": VueFormGenerator.component},
  methods:
  {

  }
}
</script>

<style>

</style>
