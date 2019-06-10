<template>
  <div class="schedule">
    <breadcrumb>
      <div class="flex-sb">
        <div>
          <el-input placeholder="请输入计划名称" v-model="searchQuery.name" style="width: 200px;" @change="getListByName"></el-input>
        </div>
        <div class="upload-file-wrapper flex-row topWork">
          <div>
            <el-button type="text" :disabled="ganttEnable" @click="handleGanttShow">{{ ganttShow ? '返回计划表': '查看甘特图' }}</el-button>
          </div>
          <div>
            <el-button type="text" @click="dialogImportVisible = true">{{ '导入计划' }}</el-button>
          </div>
        </div>
      </div>
    </breadcrumb>
    <div v-if="ganttShow" class="app-container">
      <!-- title -->
      <div>
        <div class="table-group expand" style="float: left">
          <section class="table-cell flex-sb table-title-gantt">
            <span style="width: 350px;text-align: left;font-weight: bolder;">计划名称</span>
          </section>
          <schedule-table-left :list="list" @show="handleShow" ></schedule-table-left>
        </div>
        <div style="width: 570px;overflow-x:auto;overflow-y:hidden;float: left;">
          <!-- center -->
          <div class="table-group expand" :style="`width:${ganttMsg.width};`">
            <section class="table-cell flex-sb table-title-gantt">
              <span v-for="(item, index) in ganttMsg.monthList" :key="index" style="width: 80px;font-weight: bolder;">{{ item }}</span>
            </section>
            <schedule-gantt-table :list="list" :msg="ganttMsg" @show="handleShow" ></schedule-gantt-table>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="app-container">
      <div class="table-header flex-sb">
        <section class="table-cell flex-sb table-title">
          <span>计划名称</span>
          <span>工期（天）</span>
          <span>开始时间</span>
          <span>结束时间</span>
          <span>
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleParamInsert">插入子列</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </section>
      </div>
      <schedule-table
        :list="list"
        :msg="ganttMsg"
        :fatherObj="fatherObj"
        @show="handleShow"
        @insert="handleInsert"
        @delete="handleDelete"
        @update="handleUpdate"
        @save="handleSave"
        @cancel="handleCancel"
      ></schedule-table>
    </div>

    <!-- 导入 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogImportVisible"
      width="480px"
    >
      <div slot="title" style="font-weight: bolder">
        从Project文件导入
      </div>
      <div class="import-info">
        <section>提示：从Project文件导入必须按照标准格式，点击<a :href="downloadPath | setFileRoot" target="_blank" style="color: blue">下载标准格式文档</a>下载。或者
          <a class="file-wrapper" @click="handleImport">
            <span style="color: blue">从本地导入</span>
            <input id="mppFileId" type="file" accept=".mpp" ref="importInput" @change="handleInputData($event)" style="display: none"/>
          </a>。
        </section>
      </div>
      <!--    -->
    </el-dialog>
  </div>
</template>

<script>
import {
  getprojectProcessList,
  importProjectProcessByProjectId,
  addProjectProcess,
  updateProjectProcess,
  findProjectProcessList,
  deleteProjectProcess,
  handleGanttWidth,
  handleShowChildren,
  closeList,
  clearList,
  saveList,
  updateList,
  deleteList,
  insertList } from '@/api/schedule';
import { monthInfo } from '@/filters';
import ScheduleTable from './components/ScheduleTable';
import ScheduleTableLeft from './components/ScheduleTableLeft';
import ScheduleGanttTable from './components/ScheduleGanttTable';


export default {
  name: 'schedule',
  components: {
    ScheduleTable,
    ScheduleTableLeft,
    ScheduleGanttTable,
  },
  data() {
    const { params: { id } } = this.$route;
    return {
      listQuery: {
        projectId: id,
      },
      list: [],
      dialogImportVisible: false,
      downloadPath: 'files/projectProcess/processMode.mpp',
      showMsg: false,
      ganttShow: false,
      ganttMsg: {
        denominator: 1, // 底数，分母
        monthList: [],
        width: '570px',
      },
      monthInfo,
      fatherObj: null,
      ganttEnable: false,
      searchQuery: {
        name: '',
        projectId: id,
      },
    };
  },
  created() {
    this.handleList();
  },
  methods: {
    handleList() {
      getprojectProcessList(this.listQuery).then((res) => {
        if (res) {
          const { data } = res;
          this.handleListData(data);
        }
      });
    },
    handleListData(data) {
      if (data && data.length > 0) {
        const listTemp = [];
        let startDate = new Date(data[0].startDate);
        let endDate = new Date(data[0].endDate);
        data.forEach((item) => {
          const itemStartDate = new Date(item.startDate);
          const itemEndDate = new Date(item.endDate);
          if (itemStartDate.getTime() < startDate.getTime()) startDate = itemStartDate;
          if (itemEndDate.getTime() > endDate.getTime()) endDate = itemEndDate;
          listTemp.push({
            startTime: itemStartDate,
            endTime: itemEndDate,
            children: [],
            show: false,
            edit: false,
            ...item,
          });
        });
        const dateList = [];
        for (let begin = new Date(startDate.getTime()); begin.getTime() < endDate.getTime(); begin.setMonth(begin.getMonth() + 1)) {
          const month = begin.getMonth();
          if (month < 9) {
            dateList.push(`${begin.getFullYear()}-0${month + 1}`);
          } else {
            dateList.push(`${begin.getFullYear()}-${month + 1}`);
          }
        }
        endDate.setMonth(endDate.getMonth() + 1);
        endDate = new Date(`${endDate.getFullYear()}-${endDate.getMonth() + 1}-01 00:00:01`);
        startDate = new Date(`${startDate.getFullYear()}-${startDate.getMonth() + 1}-01 00:00:01`);
        const denominatorTemp = (endDate.getTime() - startDate.getTime()) / 80 / dateList.length;
        listTemp.forEach((item) => {
          item.endTime = ((item.endTime.getTime() - item.startTime.getTime()) / denominatorTemp);
          item.startTime = ((item.startTime.getTime() - startDate.getTime()) / denominatorTemp);
        });
        this.list = listTemp;
        this.ganttMsg = {
          denominator: denominatorTemp,
          monthList: dateList,
          width: `${80 * dateList.length}px`,
          start: startDate,
          end: endDate,
        };
      }
    },
    handleGanteRule() {
      // 只有最外层变动时会导致 --所有的都需要处理；1: 最外层新增 2：内层更改 ；处理所有;最外层删除时，也会导致这个情况
    },
    handleImport() {
      this.$refs.importInput.click();
    },
    handleInputData(e) {
      importProjectProcessByProjectId({ projectId: this.listQuery.projectId, file: e.target.files[0] }).then((res) => {
        this.dialogImportVisible = false;
        if (res) {
          this.handleList();
          this.$message({
            type: 'success',
            message: this.$t('message.operationSuccess'),
          });
        }
      });
      this.$refs.importInput.value = '';
    },
    handleGanttShow() {
      this.ganttShow = !this.ganttShow;
    },
    handleShow(param) {
      if (param.show) {
        closeList(this.list, param);
      } else {
        getprojectProcessList({ id: param.id, ...this.listQuery }).then((res) => {
          if (res) {
            const { data } = res;
            const list = [];
            data.forEach((item) => {
              const endTimeTemp = (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / this.ganttMsg.denominator;
              const startTimeTemp = (new Date(item.startDate).getTime() - this.ganttMsg.start.getTime()) / this.ganttMsg.denominator;
              list.push({
                startTime: startTimeTemp,
                endTime: endTimeTemp,
                children: [],
                show: false,
                edit: false,
                ...item,
              });
            });
            handleShowChildren(list, this.list, param);
          }
        });
      }
    },
    handleParamInsert() {
      this.ganttEnable = true;
      // 应该同时兼顾 甘特图
      const obj = {
        level: 1,
        id: -new Date().getTime(),
        edit: true,
        pid: null,
        show: false,
        children: [],
        taskName: '',
        durationDate: null,
        startDate: null,
        endDate: null,
      };
      this.list.push(obj);
    },
    handleInsert(param) {
      this.ganttEnable = true;
      insertList(this.list, param);
    },
    handleDelete(param) {
      deleteProjectProcess({ id: param.id }).then((res) => {
        if (res) {
          deleteList(this.list, param);
          this.$message({
            type: 'success',
            message: this.$t('message.operationSuccess'),
          });
        }
      });
    },
    handleUpdate(param) {
      this.ganttEnable = true;
      updateList(this.list, param);
    },
    handleSave(param) {
      if (param.pid === null) {
        let remark = false;
        let start = new Date(param.startDate);
        let end = new Date(param.endDate);

        if (!this.ganttMsg.start || start.getTime() > this.ganttMsg.start.getTime()) {
          remark = true;
          start = this.ganttMsg.start;
        }
        if (!this.ganttMsg.end || end.getTime() < this.ganttMsg.end.getTime()) {
          remark = true;
          end = this.ganttMsg.end;
        }

        if (remark) {
          const dateList = [];
          for (let begin = new Date(start.getTime()); begin.getTime() < end.getTime(); begin.setMonth(begin.getMonth() + 1)) {
            const month = begin.getMonth();
            if (month < 9) {
              dateList.push(`${begin.getFullYear()}-0${month + 1}`);
            } else {
              dateList.push(`${begin.getFullYear()}-${month + 1}`);
            }
          }

          end.setMonth(end.getMonth() + 1);
          const denominatorTemp = (end.getTime() - start.getTime()) / 80 / dateList.length;
          this.ganttMsg = {
            monthList: dateList,
            denominator: denominatorTemp,
            width: `${80 * dateList.length}px`,
            start: new Date(`${start.getFullYear()}-${start.getMonth() + 1}-01 00:00:01`),
            end: new Date(`${end.getFullYear()}-${end.getMonth() + 1}-01 00:00:01`),
          };
          handleGanttWidth(this.list, denominatorTemp, this.ganttMsg.start);
        }
      } else {
        param.startTime = (new Date(param.startDate).getTime() - this.ganttMsg.start.getTime()) / this.ganttMsg.denominator;
        param.endTime = (new Date(param.endDate).getTime() - new Date(param.startDate).getTime()) / this.ganttMsg.denominator;
      }

      const subMsg = {
        taskName: param.taskName,
        startTime: param.startDate.substring(0, 10),
        endTime: param.endDate.substring(0, 10),
      };

      if (param.id > 0) {
        updateProjectProcess({ id: param.id, ...subMsg }).then((res) => {
          if (res) {
            if (param.level === 1) {
              this.handleList();
            } else {
              saveList(this.list, param, param.id);
            }
          }
        });
      } else {
        if (param.pid !== null) {
          subMsg.parentId = param.pid;
        }
        addProjectProcess({ projectId: this.listQuery.projectId, level: param.level, ...subMsg }).then((res) => {
          if (res) {
            if (param.level === 1) {
              this.handleList();
            } else {
              saveList(this.list, param, res.data.data.id);
            }
          }
        });
      }

      this.ganttEnable = false;
    },
    handleCancel(param) {
      this.ganttEnable = false;
      clearList(this.list, param);
    },
    getListByName(param) {
      if (param) {
        findProjectProcessList(this.searchQuery).then((res) => {
          if (res) {
            const { data } = res;
            this.handleListData(data);
          }
        });
      } else {
        this.handleList();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.schedule{
  .table-header {
    color: #909399;
    font-weight: bold;
  }
  .table-cell {
    height: 48px;
    color: #909399;
    text-align: center;
    border-bottom: 1px solid #ebeef5;
    font-size: 13px;
    span {
      i {
        margin-right: 8px;
        color: #409EFF;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  .table-title{
    span {
      text-align: left;
      width: 175px;
    }
    span:nth-child(1){
      width: 360px;
    }
    span:nth-child(2){
      width: 110px;
    }
    span:nth-child(5){
      width: 90px;
    }
  }
  .topWork{
    margin-left: 20px;
    div{
      padding: 0 10px 0 10px;
      border-left: 1px groove #f0f2f5;
    }
    div:nth-child(1){
      border: none;
    }
  }
}
</style>
