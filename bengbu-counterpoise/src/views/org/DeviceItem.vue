<template>
  <!-- 显示的数据源 -->
  <div class="item">
    <div class="index">序号: {{ index + 1 }}</div>
    <div class="desc">设备名称: {{ source.DeviceName }}</div>
    <div class="">备注: {{ source.Comment }}</div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      // index of current item
      type: Number,
    },
    source: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.item {
  display: flex;

  .index,
  .desc {
    margin-right: 30px;
  }
}
</style>
