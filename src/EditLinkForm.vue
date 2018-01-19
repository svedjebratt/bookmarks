<template>
  <div class="card">
    <h5 class="card-header">Edit link</h5>

    <div class="card-body">
      <form action="" v-on:submit.prevent="saveLink">
        <div class="form-group">
            <label for="linkName">Title</label>
            <input type="text" id="linkName" v-model="title" class="form-control"/>
        </div>

        <div class="form-group">
          <label for="linkUrl">Url</label>
          <input type="text" id="linkUrl" v-model="url" class="form-control"/>
        </div>

        <div>
          <input type="submit" value="Save" class="btn btn-primary" :disabled="!title || !url"/>
          <input type="button" value="Cancel" class="btn btn-secondary" v-on:click="cancel()"/>
          <input v-show="this.linkId.link" type="button" value="Delete" class="btn btn-danger float-right" @click="removeLink()"/>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import * as db from './Repository';
  import Component from "vue-class-component";
  import {Emit, Prop, Watch} from "vue-property-decorator";
  import {Config, LinkId} from "./models";
  import {DataSnapshot} from '@firebase/database-types';

  @Component
  export default class EditLinkForm extends Vue {
    // @Prop() linkRef: string;
    @Prop() linkId: LinkId;
    @Prop() configName: string;
    @Prop(Function) onClose: () => void;
    @Prop() config: DataSnapshot;
    // config: Config = null;

    title: string = '';
    url: string = '';

    mounted() {
      this.linkUpdated();
    }

    dbRef() {
      const linkId = this.linkId;
      return `${this.configName}/${linkId.section}/links${linkId.sectionLinks ? '/' + linkId.sectionLinks : ''}${linkId.link ? '/' + linkId.link : ''}`;
    }

    @Watch('linkId')
    linkUpdated() {
      // if (!this.isAdd) {
      //   db.getLink(this.linkRef, link => {
      //     this.title = link.name;
      //     this.url = link.url;
      //   });
      // }

      if (this.linkId.link) {
        // db.getReference(this.dbRef()).once('value', snapshot => {
        //   this.title = snapshot.val().name;
        //   this.url = snapshot.val().url;
        // });
        const saved = this.config
          .child(this.linkId.section)
          .child('links')
          .child(this.linkId.sectionLinks)
          .child(this.linkId.link)
          .val();
        this.title = saved.name;
        this.url = saved.url;
          // .ref
          // .once('value', snapshot => {
          //   this.title = snapshot.val().name;
          //   this.url = snapshot.val().url;
          // })
      } else {
        this.title = '';
        this.url = '';
      }
    }

    cancel() {
      this.$emit('close');
    }

    @Emit('close')
    saveLink() {
      const link = {
        url: this.url,
        name: this.title
      };

      // const reference = db.getReference(this.dbRef());

      if (this.linkId.link) {
        // reference.set(link);
        this.config.ref.child(this.linkId.section).child('links').child(this.linkId.sectionLinks).child(this.linkId.link).set(link);
      } else if (this.linkId.sectionLinks) {
          // reference.push().set(link);
        this.config.ref.child(this.linkId.section).child('links').child(this.linkId.sectionLinks).push(link);
      } else {
        // reference.push().push().set(link);
        this.config.ref.child(this.linkId.section).child('links').push().push(link);
      }
    }

    @Emit('close')
    removeLink() {
      // db.getReference(this.dbRef()).remove();
      this.config
        .child(this.linkId.section)
        .child('links')
        .child(this.linkId.sectionLinks)
        .child(this.linkId.link)
        .ref.remove();
    }

  }
</script>

<style scoped>
  .card {
    display: block;
  }
</style>
