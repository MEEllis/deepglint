<template>
  <el-container class="custom-wrap">
    <el-main class="custom-main">
      <!-- 右侧内容区域可以滚动 -->
      <div class="wrapper">
        <div class="btn-wrap">
          <el-button type="primary" @click="handerOrgDialogVisible(true)">添加组织</el-button>
        </div>
        <el-table
          ref="table"
          :max-height="customTableMaxHeight"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="70px"
            :index="getIndex"
          />
          <el-table-column type="expand" width="1">
            <template
              slot-scope="props"
              v-if="props.row.Devices && props.row.Devices.length > 0"
            >
              <div style="margin-bottom:10px;">设备列表：</div>
              <VirtualList
                style="height: 260px; overflow-y: auto;background-color: #f6fbfd;"
                :data-key="'DeviceID'"
                :data-sources="props.row.Devices"
                :data-component="itemComponent"
              >
                <div v-for="(item, index) in props.row.Devices" :key="index">
                  {{ item.DeviceName }}
                </div>
              </VirtualList>
            </template>
          </el-table-column>
          <el-table-column
            prop="GroupName"
            label="组织名称"
            width="170"
          ></el-table-column>
          <el-table-column label="设备数量" width="170">
            <template slot-scope="props">
              <span v-if="props.row.Devices && props.row.Devices.length > 0">{{
                props.row.Devices.length
              }}</span>
              <span v-else>0</span>
            </template>
          </el-table-column>
          <el-table-column prop="Comment" label="备注"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.GroupType == 'default'"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                :disabled="scope.row.GroupType == 'default'"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
              <el-button
                type="text"
                v-if="scope.row.Devices && scope.row.Devices.length > 0"
                @click="toogleExpand(scope.row)"
                >查看设备信息</el-button
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
      :title="(orgForm.GroupID ? '修改' : '添加') + '组织'"
      :visible.sync="orgDialogVisible"
      width="35%"
      center
    >
      <el-form ref="form" :model="orgForm" label-width="80px">
        <el-form-item label="组织名称">
          <input v-model="orgForm.GroupID" type="hidden" />
          <el-input v-model="orgForm.GroupName"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="orgForm.Comment"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handerOrgDialogVisible(false)">取 消</el-button>
        <el-button type="primary" @click="handSaveOrg()">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { clound } from "@/service/index";
import DeviceItem from "./DeviceItem.vue";
import TableContainer from "@/mixins/tableContainer";
import MPaginationTable from "@/mixins/mPaginationTable";
import Pagination from "@/components/pagination/Pagination.vue";
const orgDefaultForm = {
  GroupName: "",
  GroupID: "",
  Comment: ""
};

@Component({
  components: {
    Pagination
  }
})
export default class Org extends Mixins(TableContainer, MPaginationTable) {
  private tableData: any = [];

  private itemComponent = DeviceItem;

  private orgDialogVisible = false;
  private orgForm = { ...orgDefaultForm };

  private get customTableMaxHeight() {
    return this.tableMaxHeight - 32;
  }

  protected mounted() {
    this.search();
  }

  public search() {
    const { Limit, Offset } = this.pageParams;
    clound
      .getDevicegroupList({
        Limit,
        Offset
      })
      .then((data: any) => {
        const { DeviceGroups, GroupCount } = data;
        this.tableData = DeviceGroups;
        this.Total = GroupCount;
      })
      .catch(() => {
        this.tableData = [];
        this.Total = 0;
      });
  }

  private saveSuccess(mes: string) {
    this.handerOrgDialogVisible(false);
    this.search();
    this.$message(mes);
    this.orgForm = { ...orgDefaultForm };
  }

  private handerOrgDialogVisible(visible: boolean) {
    this.orgDialogVisible = visible;
  }

  private handSaveOrg() {
    const { GroupName, Comment, GroupID } = this.orgForm;
    if (GroupID) {
      clound
        .updateDevicegroup({ GroupName, Comment, GroupID })
        .then(() => {
          this.saveSuccess("修改成功");
        })
        .catch(() => {});
    } else {
      clound.addDevicegroup({ GroupName, Comment }).then(() => {
        this.saveSuccess("添加成功");
      });
    }
  }

  private handleEdit(index: Number, row: any) {
    this.handerOrgDialogVisible(true);
    this.orgForm = {
      GroupName: row.GroupName,
      GroupID: row.GroupID,
      Comment: row.Comment
    };
  }
  private handleDelete(index: Number, row: any) {
    this.$confirm("是否删除？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      const { GroupID } = row;
      if (GroupID) {
        clound.delDevicegroup({ GroupID }).then(() => {
          this.search();
          this.$message("删除成功");
        });
      }
    });
  }

  private toogleExpand(row: any) {
    const $table = this.$refs.table as any;
    $table.toggleRowExpansion(row);
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

    .scroller {
      height: 300px;
    }
    .user {
      height: 32%;
      padding: 0 12px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
