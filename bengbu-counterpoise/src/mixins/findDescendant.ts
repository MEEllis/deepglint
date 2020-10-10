import Vue from 'vue';
import Component from 'vue-class-component';

export function findDescendant(component: Vue, filter: (component: Vue) => boolean): Vue | undefined {
  if (filter(component)) {
    return component;
  }
  // wotan-disable-next-line
  if (component.$children && component.$children.length) {
    for (const child of component.$children) {
      const c = findDescendant(child, filter);
      if (c) {
        return c;
      }
    }
  }
  return undefined;
}

@Component
export default class FindDescendant extends Vue {
  protected findDescendant(filter: (component: Vue) => boolean) {
    return findDescendant(this, filter);
  }

  protected findDescendantByName(name: string) {
    // wotan-disable-next-line
    return this.findDescendant(c => c.$options && c.$options.name === name);
  }
}
