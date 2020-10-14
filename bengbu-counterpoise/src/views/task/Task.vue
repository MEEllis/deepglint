<template>
  <el-container class="custom-wrap">
    <el-main class="custom-main">
      <!-- 右侧内容区域可以滚动 -->
      <div class="wrapper">
        <div class="btn-wrap">
          <el-button type="primary" @click="handerDialogVisible(true)"
            >添加任务</el-button
          >
        </div>
        <el-table
          :data="tableData"
          :max-height="customTableMaxHeight"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="70px"
            :index="getIndex"
          />
          <el-table-column
            prop="TaskName"
            label="任务名称"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="RenderURI"
            label="渲染流"
            width="180"
          ></el-table-column>
          <el-table-column prop="Progress" label="进度"></el-table-column>
          <el-table-column label="视频类型" width="170">
            <template slot-scope="scope"
              >{{ taskType[scope.row.Type] }}
            </template>
          </el-table-column>
          <el-table-column label="任务状态" width="170">
            <template slot-scope="scope"
              >{{ taskState[scope.row.State] }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleStatus(scope.row, 'START')"
                >启动</el-button
              >
              <el-button type="text" @click="handleStatus(scope.row, 'STOP')"
                >停止</el-button
              >
              <el-button type="text" @click="handleStatus(scope.row, 'DELETE')"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="Total"
          :limit.sync="pageParams.Limit"
          :offset.sync="pageParams.Offset"
        ></pagination>
      </div>
    </el-main>
    <el-dialog
      :title="(formModel.GroupID ? '修改' : '添加') + '任务'"
      :visible.sync="dialogVisible"
      width="35%"
      center
    >
      <el-form ref="form" :model="formModel" label-width="80px">
        <el-form-item label="选择设备">
          <el-select v-model="formModel.DeviceID" placeholder="请选择">
            <el-option-group
              v-for="group in deviceGroupOptions"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="formModel.TaskName"></el-input>
        </el-form-item>
        <el-form-item label="视频流URL">
          <el-input v-model="formModel.SourceUrl"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="formModel.Type" placeholder="请选择">
            <el-option
              v-for="item in taskTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handerDialogVisible(false)">取 消</el-button>
        <el-button type="primary" @click="handSave()">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { clound } from "@/service/index";
import TableContainer from "@/mixins/tableContainer";
import MPaginationTable from "@/mixins/mPaginationTable";
import Pagination from "@/components/pagination/Pagination.vue";
const formDefaultModel = {
  DeviceID: "",
  TaskName: "",
  Type: "", //类型：live代表直播流，vod代表历史流，sdk代表抓拍机SDK接入方式
  SourceUrl: "", //视频流URL
  DetectType: []
};
const taskState = {
  QUEUEING: "排队中", //等待调度和拉起
  RUNNING: "运行中", //正常状态
  STOPPED: "已停止", //一般是前端操作停止任务
  EXITED: "已完成", //任务退出且正常退出
  FAILED: "任务失败", //表示任务退出但不是正常退出。具体失败原因请查看Msg字段
  RETRYING: "重试中" //表示任务运行过程中异常出错，准备重试中。常见情况是任务出错或者引擎挂了重新调度
};
const taskType = {
  live: "直播流",
  vod: "历史流"
};

@Component({
  components: { Pagination }
})
export default class Task extends Mixins(TableContainer, MPaginationTable) {
  private tableData: any = [];
  private dialogVisible = false;
  private formModel = { ...formDefaultModel };
  private taskState = taskState;
  private taskType = taskType;

  private taskTypeOptions = [
    {
      value: "live",
      label: "直播流"
    },
    {
      value: "vod",
      label: "历史流"
    }
  ];
  private deviceGroupOptions: any = [];

  private get customTableMaxHeight() {
    return this.tableMaxHeight - 32;
  }

  protected mounted() {
    this.search();
    clound
      .getDevicegroupList({
        Limit: 30000,
        Offset: 0
      })
      .then((data: any) => {
        const { DeviceGroups } = data;
        const groupOptions = [];
        if (Array.isArray(DeviceGroups)) {
          for (let i = 0; i < DeviceGroups.length; i++) {
            const { GroupName, GroupType, Devices } = DeviceGroups[i];
            const options = [];
            if (Array.isArray(Devices)) {
              for (let j = 0; j < Devices.length; j++) {
                const Device = Devices[j];
                const { DeviceType, DeviceName, DeviceID } = Device;
                //只有DeviceType为video时才能创建视频分析任务
                if (DeviceType === "video") {
                  options.push({
                    value: DeviceID,
                    label: DeviceName
                  });
                }
              }
            }
            groupOptions.push({
              label: GroupName === "" ? GroupType : GroupName,
              options
            });
          }
          this.deviceGroupOptions = groupOptions;
        }
      })
      .catch(() => {});
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

  private saveSuccess(mes: string) {
    this.handerDialogVisible(false);
    this.search();
    this.$message(mes);
    this.formModel = { ...formDefaultModel };
  }

  private handerDialogVisible(visible: boolean) {
    this.dialogVisible = visible;
  }

  private handSave() {
    const { DeviceID, TaskName, Type, SourceUrl, DetectType } = this.formModel;

    clound.setDeviceTask({ DeviceID, TaskName, Type, SourceUrl }).then(() => {
      this.saveSuccess("添加成功");
    });
  }

  private handleEdit(row: any) {
    this.handerDialogVisible(true);
    this.formModel = {
      DeviceID: row.DeviceID,
      TaskName: row.TaskName,
      Type: row.Type,
      SourceUrl: row.RenderURI,
      DetectType: row.DetectType
    };
  }

  private handleStatus(row: any, Status: string) {
    clound.setDeviceTaskStatus({ TaskID: row.TaskID, Status }).then(() => {
      this.search();
      this.$message("操作成功");
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
