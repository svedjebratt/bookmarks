<template>
  <div class="row">
    <div class="col-4 offset-4">
      <div class="card">
        <div class="card-header">
          Set name of config
        </div>

        <div class="card-body">
          <form action="" @submit.prevent="createNewConfig">

            <div class="form-group">
              <label for="template">Template</label>
              <select name="" id="template" v-model="template" class="form-control">
                <option value="">Empty</option>
                <option :value="name" v-for="name in configs">{{name}}</option>
              </select>
            </div>

            <div class="form-group">
              <input type="text" class="form-control" v-model="configName"/>
              <div class="form-text" v-show="!isValid">Config already exist</div>
            </div>

            <button type="submit" class="btn btn-primary btn-block" :disabled="!isValid || !configName">OK</button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as db from './Repository';
  import Component from "vue-class-component";
  import {database} from 'firebase';

  @Component
  export default class CreateConfig extends Vue {
    configs: string[] = [];
    configName: string = '';
    template: string = '';

    async mounted() {
      this.configs = await db.getAvailableConfigs();
    }

    get isValid() {
      return this.configs.every(c => c != this.configName);
    }

    createNewConfig() {
      database().ref().push({name: this.configName});

      if (this.template) {
        db.getConfig(this.template, templateConfig => {
          db.getConfig(this.configName, snapshot => {
            snapshot.ref.set(templateConfig.val());
          });
        });
      }

      this.$router.push('/edit/' + this.configName);
    }
  }
</script>
