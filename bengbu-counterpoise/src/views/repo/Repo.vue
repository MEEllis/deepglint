<template>
  <el-container class="custom-wrap">
    <el-main class="custom-main">
      <!-- 右侧内容区域可以滚动 -->
      <div class="wrapper">
        <el-card>
          <el-date-picker
            v-model="refreshRepoTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
          <el-button style="margin-left:8px;" type="primary" @click="handerRefreshRepo()">同步比对库</el-button>
        </el-card>
        <div class="btn-wrap"></div>
        <el-table :data="tableData" :max-height="customTableMaxHeight" style="width: 100%">
          <el-table-column type="index" label="序号" width="70px" :index="getIndex" />
          <el-table-column prop="RepoName" label="设备名称" width="180"></el-table-column>
          <el-table-column prop="Capacity" label="人脸图片数量" width="180"></el-table-column>
          <el-table-column prop="Size" label="实际录入的人脸图片数量" width="180"></el-table-column>
          <el-table-column prop="Comment" label="备注"></el-table-column>
        </el-table>
        <pagination :total="Total" :limit.sync="pageParams.Limit" :offset.sync="pageParams.Offset"></pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { clound, netposa } from "@/service/index";
import TableContainer from "@/mixins/tableContainer";
import MPaginationTable from "@/mixins/mPaginationTable";
import Pagination from "@/components/pagination/Pagination.vue";
import { DatePickerOptions } from "element-ui/types/date-picker";
import moment from "moment";

@Component({
  components: { Pagination }
})
export default class Repo extends Mixins(TableContainer, MPaginationTable) {
  private tableData: any = [];
  private pickerOptions: DatePickerOptions = {
    shortcuts: [
      {
        text: "最近一周",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit("pick", [start, end]);
        }
      },
      {
        text: "最近一个月",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit("pick", [start, end]);
        }
      },
      {
        text: "最近三个月",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit("pick", [start, end]);
        }
      }
    ]
  };
  private refreshRepoTime: string[] | Date[] = [];

  private get customTableMaxHeight() {
    return this.tableMaxHeight - 115;
  }

  protected mounted() {
    this.search();
    const start = moment()
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss")
      .valueOf();
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    this.refreshRepoTime = [start, now];
  }

  public search() {
    const { Limit, Offset } = this.pageParams;
    clound
      .getRepoList({
        Limit,
        Offset
      })
      .then((data: any) => {
        const { Repos, Count } = data;
        this.tableData = Repos;
        this.Total = Count;
      })
      .catch(() => {
        this.tableData = [];
        this.Total = 0;
      });
  }

  // 同步设备
  private handerRefreshRepo() {
    netposa
      .setrefreshRepo({
        PageNum: 1,
        PageSize: 30000,
        StartTime: moment(this.refreshRepoTime[0]).format("YYYY-MM-DD HH:mm:ss").valueOf(),
        EndTime: moment(this.refreshRepoTime[1]).format("YYYY-MM-DD HH:mm:ss").valueOf()
      })
      .then((data: any) => {
        this.$message.success(data.msg);
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
