<template>
  <div v-if="config">
    <div v-if="editLink">
      <EditLinkForm :configName="$route.params.config" :linkId="editLink" v-on:close="closeLinkEdit" :config="config"/>
    </div>
    <div v-if="showEditSection">
      <EditSectionForm :configName="$route.params.config" :section="editSection" v-on:close="closeSectionEdit" :config="config"/>
    </div>

    <div v-for="section in toArr(config)" class="card">
      <h5 class="card-header" @click="openEditSection(section.key)">{{section.val.title}}</h5>

      <ul class="list-group list-group-flush">
        <li v-for="links in toArr(section.snapshot.child('links'))" class="list-group-item">
          <a :href="link.val.url" v-on:click="openEditLink($event, section.key, links.key, link.key)" v-for="link in toArr(links.snapshot)">
            {{link.val.name}}
          </a>

          <button class="btn btn-success btn-sm float-right" v-on:click="openEditLink($event, section.key, links.key)">+</button>
        </li>
        <li class="list-group-item">
          <button class="btn btn-success btn-sm" v-on:click="openEditLink($event, section.key)">Add row</button>
        </li>
      </ul>

    </div>

    <div class="submit-actions">
      <button class="btn btn-primary btn-sm" @click="done()">Done</button>
      <button class="btn btn-secondary btn-sm" @click="openEditSection()">Add Section</button>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as db from './Repository';
  import Component from "vue-class-component";
  import EditLinkForm from './EditLinkForm.vue';
  import EditSectionForm from './EditSectionForm.vue';
  import {DataSnapshot} from '@firebase/database-types';
  import {LinkId} from './models';

  @Component({
    components: {
      EditLinkForm,
      EditSectionForm
    }
  })
  export default class EditConfig extends Vue {
    config: DataSnapshot = null;

    editLink: LinkId = null;
    showEditSection: boolean = false;
    editSection: string = null;

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

    async mounted() {
      await db.getConfig(this.$route.params.config, c => this.config = c);
    }

    openEditLink(event: Event, sectionIndex: string, sectionLinksIndex?: string, linkIndex?: string) {
      event.preventDefault();

      this.editLink = {
        section: sectionIndex,
        sectionLinks: sectionLinksIndex,
        link: linkIndex
      };
      this.closeSectionEdit();
    }

    openEditSection(sectionIndex?: string) {
      this.showEditSection = true;
      this.editSection = sectionIndex;
      this.closeLinkEdit();
    }

    closeLinkEdit() {
      this.editLink = null;
    }

    closeSectionEdit() {
      this.showEditSection = false;
      this.editSection = null;
    }

    done() {
      this.$router.push('/view/' + this.$route.params.config);
    }
  }
</script>

<style>
  .field {
    text-align: left;
    display: inline-block;
    border: 1px solid #333;
    vertical-align: top;
    margin-bottom: 20px;
    margin-right: 20px;
    border-radius: 5px;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
  }

  .field h2 {
    background: #fff;
    margin: 0;
    padding: 3px 8px;
    border-radius: 5px;
  }

  .card {
    display: inline-block;
  }

  .field ul {
    /*margin: 4px;*/
    /*padding-left: 20px;*/
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .field li {
    text-align: left;
    margin-bottom: 4px;
  }

  .card li a {
    margin-right: 5px;
  }

  .card li a:last-child {
    margin-right: 0;
  }

  a.old {
    color: blue;
    font-weight: bold;
  }

  .submit-actions {
    margin-top: 20px;
  }

</style>
