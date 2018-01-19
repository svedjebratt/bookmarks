<template>
  <div class="card">
    <h5 class="card-header">Edit section</h5>

    <div class="card-body">
      <form action="" v-on:submit.prevent="saveSection">
        <div class="form-group">
          <label for="linkName">Title</label>
          <input type="text" id="linkName" v-model="title" class="form-control"/>
        </div>

        <div>
          <input type="submit" value="Save" class="btn btn-primary" :disabled="!title"/>
          <input type="button" value="Cancel" class="btn btn-secondary" v-on:click="cancel()"/>
          <input v-show="section" type="button" value="Delete" class="btn btn-danger float-right" @click="removeSection()"/>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import {Emit, Prop, Watch} from "vue-property-decorator";
  import * as db from './Repository';
  import Component from "vue-class-component";
  import {DataSnapshot} from '@firebase/database-types';

  @Component
  export default class EditSectionForm extends Vue {
    @Prop() section: string;
    @Prop() configName: string;
    @Prop() config: DataSnapshot;
    title: string = '';

    mounted() {
      this.sectionUpdated();
    }

    @Watch('section')
    sectionUpdated() {
      if (this.section) {
        // db.getReference(`${this.configName}/${this.section}`)
        //   .once('value', snapshot => this.title = snapshot.val().title);
        this.config
          .child(this.section)
          .child('title')
          .ref.once('value', snapshot => this.title = snapshot.val());
      } else {
        this.title = '';
      }
    }

    @Emit('close')
    saveSection() {
      if (this.section) {
        // db.getReference(`${this.configName}/${this.section}`)
        //   .set({title: this.title});
        this.config
          .child(this.section)
          .child('title')
          .ref.set(this.title);
      } else {
        // db.getReference(this.configName)
        //   .push({title: this.title});
        this.config.ref.push({title: this.title});
      }
    }

    @Emit('close')
    removeSection() {
      // db.getReference(`${this.configName}/${this.section}`).remove();
      this.config
        .child(this.section)
        .ref.remove();
    }

    cancel() {
      this.$emit('close');
    }
  }
</script>

<style scoped>
  .card {
    display: block;
  }
</style>
