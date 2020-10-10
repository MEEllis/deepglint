<template>
  <el-pagination
    :total="total"
    :current-page.sync="currentPage"
    :page-size.sync="limit"
    :layout="layout"
  >
    <template v-slot>
      <span class="page-tip"
        >当前显示{{ `${count}` }}条，共{{ `${total}` }}条</span
      >
    </template>
  </el-pagination>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Pagination extends Vue {
  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  private total!: number; //总页数

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  private limit!: number; //每页显示条目个数

  @Prop({
    type: String,
    default: "->,slot,prev,pager,next",
  })
  private layout?: string; //组件布局

  @Prop({
    type: Number,
    default: 0,
  })
  private offset!: number; //分页偏移量

  //当前页，计数1 开始
  private get currentPage(): number {
    return this.offset / this.limit + 1;
  }
  private set currentPage(val: number) {
    const offset = this.limit * (val - 1);
    this.$emit("update:offset", offset);
  }
  //当前列表显示条目数
  private get count() {
    return Math.min(this.limit, this.total - this.offset);
  }
}
</script>
