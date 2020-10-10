<template>
  <el-container class="custom-wrap">
    <el-main class="custom-main">
      <!-- 右侧内容区域可以滚动 -->
      <div class="wrapper">
        <el-table :data="tableData" :max-height="customTableMaxHeight" style="width: 100%">
          <el-table-column type="index" label="序号" width="70px" :index="getIndex" />
          <el-table-column prop="TaskName" label="任务名称" width="180"></el-table-column>
          <el-table-column prop="Progress" label="进度" ></el-table-column>
        </el-table>
        <pagination :total="Total" :limit.sync="pageParams.Limit" :offset.sync="pageParams.Offset"></pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { clound } from "@/service/index";
import TableContainer from "@/mixins/tableContainer";
import MPaginationTable from "@/mixins/mPaginationTable";
import Pagination from "@/components/pagination/Pagination.vue";

@Component({
  components: { Pagination }
})
export default class Task extends Mixins(TableContainer, MPaginationTable) {
  private tableData: any = [];

  private get customTableMaxHeight() {
    return this.tableMaxHeight - 32;
  }

  protected mounted() {
    this.search();
  }

  public search() {
    const { Limit, Offset } = this.pageParams;
    clound
      .getDeviceTaskList({
        Limit,
        Offset
      })
      .then((data: any) => {
        const { Tasks, Count } = data;
        this.tableData = Tasks;
        this.Total = Count;
      })
      .catch(() => {
        this.tableData = [];
        this.Total = 0;
      });
  }

}
</script>
<style lang="scss" scoped>
.custom-wrap {
  height: calc(100% - 71px);

  .btn-wrap {
    display: flex;
    margin-bottom: 15px;
  }

  .custom-main {
    background-color: #fff;
    padding: 0;
    .wrapper {
      // 右侧内容区域可以滚动
      overflow-y: auto;
      height: 100%;
      display: flex;
      flex-direction: column;
      border-radius: 3px;
    }
  }
}
</style>
