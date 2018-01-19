<template>
  <div v-if="config">
    <div v-for="section in toArr(config)" class="card">
      <h5 class="card-header">{{section.val.title}}</h5>

      <ul class="list-group list-group-flush">
        <li v-for="links in toArr(section.snapshot.child('links'))" class="list-group-item">
          <a :href="link.val.url" v-for="link in toArr(links.snapshot)">
            {{link.val.name}}
          </a>
        </li>
      </ul>

    </div>

    <div>
      <router-link :to="editUrl" class="btn btn-link btn-sm float-right">Edit</router-link>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import * as db from './Repository';
  import Component from "vue-class-component";
  import {DataSnapshot} from '@firebase/database-types';

  @Component
  export default class ViewConfig extends Vue {
    config: DataSnapshot = null;

    async mounted() {
      await db.getConfig(this.$route.params.config, c => this.config = c);
    }

    get editUrl() {
      return '/edit/' + this.$route.params.config;
    }

    toArr(snapshot: DataSnapshot) {
      const result = [];

      snapshot.forEach(child => {
        result.push({
          snapshot: child,
          val: child.val(),
          key: child.key
        });

        return false;
      });

      return result;
    }

  }
</script>

<style scoped>
  .card {
    display: inline-block;
  }
</style>
