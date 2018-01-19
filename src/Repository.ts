import * as firebase from 'firebase';
import {DataSnapshot} from '@firebase/database-types';
import {Config, Link} from './models';

export async function getAvailableConfigs() {
  const snapshot: DataSnapshot = await firebase.database().ref().once('value');

  const names = [];
  snapshot.forEach(child => {
    names.push(child.val().name);

    return false;
  });

  // const configs = snapshot.val();
  // for (const name in configs) {
  //   if (configs.hasOwnProperty(name)) {
  //     names.push(name);
  //   }
  // }

  return names;
}

export async function getConfigOld(name: string, onData: (snapshot: DataSnapshot) => void) {
  await firebase.database().ref(`${name}`).on('value', snapshot => onData(snapshot));
}

export async function getConfig(name: string, onData: (snapshot: DataSnapshot) => void) {
  firebase.database().ref().once('value', snapshot => {
    snapshot.forEach(child => {
      if (child.val().name === name) {
        child.child('config').ref.on('value', s => onData(s));
        return true;
      }

      return false;
    });
  });
}

export async function getLink(ref: string, onData: (snapshot: Link) => void) {
  await firebase.database().ref(`${ref}`).on('value', snapshot => onData(snapshot.val()));
}

export function updateLink(ref: string, link: Link) {
  firebase.database().ref(`${ref}`).set(link);
}

export function addLink(ref: string, link: Link) {
  firebase.database().ref(`${ref}`).push().set(link);
}

export function addLinkNewRow(ref: string, link: Link) {
  firebase.database().ref(`${ref}`).push().push().set(link);
}

export function getRootReference() {
  return firebase.database().ref();
}

export function getReference(ref: string) {
  return firebase.database().ref(ref);
}
