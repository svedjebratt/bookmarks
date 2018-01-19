<template>
  <div class="row">
    <div class="col-4 offset-4">
      <div class="card">
        <div class="card-header">
          Choose config
        </div>

        <div class="card-body">
          <form action="" v-on:submit="openConfig">

            <div class="form-group">
              <select name="configName" id="configName" v-model="config" class="form-control">
                <option value="">Create new</option>
                <option v-for="item in configs" :value="item">{{item}}</option>
              </select>
            </div>

            <button type="submit" class="btn btn-success btn-block">OK</button>

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

  @Component
  export default class Index extends Vue {
    configs: string[] = [];
    config: string = '';

    async mounted() {
      this.configs = await db.getAvailableConfigs();
    }

    openConfig(e: Event) {
      e.preventDefault();

      if (this.config) {
        this.$router.push(`/view/${this.config}`);
      } else {
        this.$router.push('/create');
      }

    }
  }
</script>
