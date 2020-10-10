import { Component, Mixins } from 'vue-property-decorator';
import FindDescendant from './findDescendant';
import { Table } from 'element-ui';

@Component
export default class TableContainer extends Mixins(FindDescendant) {
  protected tableMaxHeight = 0;

  protected mounted() {
    window.addEventListener('resize', this.updateTableMaxHeight);
    this.updateTableMaxHeight();
  }

  protected beforeDestroy() {
    window.removeEventListener('resize', this.updateTableMaxHeight);
  }

  protected updateTableMaxHeight() {
    this.$nextTick(() => {
      this._updateTableMaxHeight();
    });
  }

  protected _updateTableMaxHeight() {
    const tableRef = this.findDescendantByName(Table.name) as Table | undefined;
    if (!tableRef) {
      return;
    }
    const tableContainer = tableRef.$el.parentElement;
    if (!tableContainer) {
      return;
    }
    this.tableMaxHeight = tableContainer.clientHeight;
  }

  protected scrollToTop() {
    const tableRef = this.findDescendantByName(Table.name) as Table | undefined;
    if (tableRef) {
      (tableRef.$refs.bodyWrapper as HTMLElement).scrollTop = 0;
    }
  }
}
