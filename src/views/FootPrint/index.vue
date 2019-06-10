<template>
  <div class="FootPrint">
    <el-tabs v-model="activeName"   type="card" style="margin-top: 15px;margin-bottom: 30px;" @tab-click="handleTabClick">
      <el-tab-pane label="操作记录" name="first">
        <div class="heard top" style="width: 100%;height: 40px;">
          <div class = "selectDiv1">
            <el-switch
              v-model="isStyle"
              active-text="岗位"
              inactive-text="项目"
              @change="handleProjectAndUserTypeChange"
            >
            </el-switch>
              <el-select
                :placeholder="!this.isStyle ? '请选择项目' : '请选择岗位'"
                          @change = "handleUserProjectsChange"
                          multiple
                          filterable
                          collapse-tags
                          v-model = "operationRecord.projectId"
                          class="span_select">
                <el-option
                  v-for="item in projectListForSearch"
                  :key="item.projectId"
                  :label="item.projectName"
                  :value="item.projectId">
                </el-option>
              </el-select>
          </div>
          <div class = "selectDiv">
            <el-select  placeholder="请选择真实姓名"
                        @change = "handleUserIdsChange"
                        multiple
                        filterable
                        collapse-tags
                        v-model = "operationRecord.userIds"
                        class="span_select0">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.realName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class = "selectDiv">
            <el-date-picker
              class="span_picker"
              v-model="operationRecord.searchTime"
              @change = "handleUserSearchTimeChange"
              value-format="yyyy-MM-dd"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="selectDivButton">
            <el-button type="primary" style="width: 80px;margin-left: 10px;float: left;" @click="handleGetOperationRecordListForSearch">查询</el-button>
            <el-button icon="el-icon-download" type="primary"   style="margin-left: 10px;float: left;" @click = "handleProjectExcelDownload">项目统计表</el-button>
          </div>
        </div>
        <div class="" style="width: 100%">
            <el-table
              :data="operationRecordList"
              v-loading="operationRecordLoading"
              fit
              highlight-current-row
              style="width: 100%;"
            >
              <el-table-column align="center" label="序号" prop="index" ></el-table-column>
              <el-table-column align="center" label="真实姓名" prop="userName" ></el-table-column>
              <el-table-column align="center" label="项目名" prop="projectName" ></el-table-column>
              <el-table-column align="center" label="功能区域" prop="projectPart" ></el-table-column>
              <el-table-column align="center" label="操作内容" prop="actionTypeName" ></el-table-column>
              <el-table-column align="center" label="操作系统" prop="systemType" ></el-table-column>
              <el-table-column align="center" label="操作时间" prop="actionDate" ></el-table-column>
              <el-table-column align="center" :label="$t('table.operation')" width="100">
                <template slot-scope="scope">
                  <div class="operation-btns">
                    <el-button type="primary" size="small"  @click="handleShow(scope.row)">详情</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页部分-->
            <div class="pagination-container">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="operationRecordQuery.pageIndex"
                :page-sizes="[5, 10, 20, 40]"
                :page-size="operationRecordQuery.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalNumber">
              </el-pagination>
            </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="项目分析" name="second">
        <div class="second_top">
          <div class="second_top_div">
            <span>项目名称</span>
            <el-select  v-model="projectListQuery.projectName"
                        @change="handleProjectIdsChange"
                        multiple
                        collapse-tags
                        class="span_select1">
              <el-option
                v-for="item in projectList"
                :key="item.projectId"
                :label="item.projectName"
                :value="item.projectId">
              </el-option>
            </el-select>
          </div>
          <div class="second_top_div">
            <el-button icon="el-icon-download" type="text"   class="topButton" style="margin-top: 10px;" @click="exportUserLogEcharts">项目分析统计表</el-button>
          </div>
        </div>
        <div>
          <div class="main_div">
            <div class="main_div_top">
              <div>
                <span>记录次数</span>
              </div>
              <div class="main_div_top_right">
                <el-select v-model = "dialogLeftQuery.searchYear" class="top_select" @change="projectSearchYearChange">
                  <el-option
                    v-for="item in yearList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <el-select v-model = "projectSearchType" class="top_select" @change="projectSearchTypeChange">
                  <el-option value = '0' label="月"></el-option>
                  <el-option value = '1' label="季度"></el-option>
                </el-select>
              </div>
            </div>
            <div id="project_echarts_left"> </div>
          </div>
          <div class="main_div">
            <div class="main_div_top">
              <span>各功能区域占比</span>
              <div class="main_div_top_right">
                <el-date-picker
                  style="width: 300px;margin-top: 10px;"
                  v-model="projectListQuery.searchTime"
                  @change = "handleProjectSearchTimeChange"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </div>
            </div>
            <div id="project_echarts_right"> </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      width="1300px"
    >
      <div slot="title" class="clearFix">
        <span class="topSpan">{{ queryUser }}个人分析</span>
        <!--<el-button icon="el-icon-download" type="primary"  class="topButton" style="margin-top: -5px; margin-right: 40px;" @click = "exportPersonLogList">个人统计表</el-button>-->
        <el-button icon="el-icon-download" type="text"  class="topButton"  @click="exportPersonLogList" >个人统计表</el-button>
      </div>
      <div class="dialogMain">
        <div class="main_div">
          <div>
            <div class="main_div_top_left">
              <span style="font-weight: bold">{{ "记录次数" }}</span>
            </div>
            <div class="main_div_top_right">
              <el-select v-model = "projectDialogLeftQuery.searchYear" class="top_select" @change="handleModelYearChange">
                <el-option
                  v-for="item in yearList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <el-select v-model = "userSearchType" class="top_select" @change="handleModelSearchTypeChange">
                <el-option value = '0' label="月"></el-option>
                <el-option value = '1' label="季度"></el-option>
              </el-select>
            </div>
          </div>
          <div class="" id ="eCharts_left"> </div>
        </div>
        <div class="main_div">
          <div class="">
            <div class="main_div_top_left">
              <span style="font-weight: bold">{{ "各功能区域占比" }}</span>
            </div>
            <div class="main_div_top_right">
              <el-date-picker
                style="width: 240px"
                v-model="operationRecord.searchTime"
                @change = "handleUserPieSearchTimeChange"
                value-format="yyyy-MM-dd"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </div>
          <div class="" id = "eCharts_right"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserLogList, countUserLogByBar, countUserLogByPart, getUserByProjectIds, countUserLogProjectByMonth, countUserLogProjectByPart, exportUserLogList, exportPersonLogList, exportUserLogEcharts } from '@/api/footPrint';
import { getProjectList } from '@/api/bids';
import { monthInfo, seasonInfo, functionType, footPrintsActionType, setFileRootForDownload, footPrintsRoleList } from '@/filters';

export default {
  name: 'FootPrint',
  data() {
    return {
      operationRecordQuery: {
        pageIndex: 1,
        pageSize: 10,
        projectIds: null,
        userIds: null,
        dateStart: null,
        dateFinished: null,
      },
      operationRecordQueryTemp: {
        pageIndex: 1,
        pageSize: 10,
        projectIds: null,
        userIds: null,
        dateStart: null,
        dateFinished: null,
      },
      userAnalysisQuery: {
        projectIdList: null,
      },
      userCountQuery: {
        userId: null,
        year: new Date().getFullYear(),
      },
      userCountPieQuery: {
        userId: null,
        startTime: null,
        finishedTime: null,
      },
      projectCountQuery: {
        projectIdList: null,
        startTime: null,
        finishedTime: null,
      },
      projectListQuery: { },
      dialogLeftQuery: {
        searchYear: new Date().getFullYear(),
      },
      projectBarCountQuery: {
        projectIdList: null,
        year: new Date().getFullYear(),
      },
      projectPieCountQuery: {
        projectIdList: null,
        startTime: null,
        finishedTime: null,
      },
      dialogRightQuery: { },
      exportPersonLogListQuery: { },
      exportUserLogEchartsQuery: {},
      operationRecord: {
        searchTime: [],
        userIds: [],
        projectIds: null,
      },
      projectDialogLeftQuery: {
        searchYear: new Date().getFullYear(),
      },
      getUserByProjectIdsQuery: {
        projectIds: null,
      },
      operationRecordLoading: false,
      projectAnalysisLoading: false,
      operationRecordList: null,
      projectCountData: null,
      totalNumber: 0,
      totalPage: 1,
      activeName: 'first',
      projectList: null,
      projectListForSearch: [],
      userList: null,
      yearList: null,
      dialogFormVisible: false,
      pickerOptions: null,
      userSearchType: '0',
      userBarCountData: [],
      projectBarCountData: null,
      projectSearchType: '0',
      queryUser: null,
      myChart: {},
      userIds: [],
      monthInfo,
      seasonInfo,
      functionType,
      footPrintsActionType,
      footPrintsRoleList,
      isStyle: false,
      roleList: [],
      firstButtonName: '项目名称',
    };
  },
  mounted() {

  },
  created() {
    this.handleGetOperationRecordList();
    this.handleProjectList();
    this.handlePickerOptions();
    this.handleYearList();
  },
  methods: {
    handleGetOperationRecordList() {
      this.operationRecordLoading = true;
      const msg = this;
      getUserLogList(msg.operationRecordQuery).then((res) => {
        const { data, totalNumber, totalPage } = res;
        const result = [];
        for (const key in data) {
          if (key) {
            const temp = data[key];
            temp.actionTypeName = footPrintsActionType[temp.actionType];
            temp.index = Number(key) + 1 + (msg.operationRecordQuery.pageSize * (msg.operationRecordQuery.pageIndex - 1));
            result.push(temp);
          }
        }
        msg.operationRecordList = result;
        msg.totalNumber = totalNumber;
        msg.totalPage = totalPage;
      });
      this.operationRecordLoading = false;
    },
    handleGetOperationRecordListForSearch() {
      const query = this.operationRecordQueryTemp;
      if (query.userIds && query.userIds !== null && query.userIds.length > 0) {
        delete query.projectIds;
        delete query.userTypes;
      }
      this.operationRecordQuery = query;
      this.handleGetOperationRecordList();
    },
    handleTabClick(tab) {
      switch (tab.index) {
        case '0': {
          this.handleGetOperationRecordList();
          break;
        }
        case '1': {
          this.handleProjectEcharts();
          break;
        }
        default:
      }
    },
    handleProjectList() {
      const msg = this;
      getProjectList(msg.projectListQuery).then((res) => {
        msg.projectList = res.data;
        msg.projectListForSearch = res.data;
      });
    },
    handleYearList() {
      const date = new Date().getFullYear();
      const yearList = [];
      for (let i = 0; i < 10;) {
        yearList.push(date - i);
        i += 1;
      }
      this.yearList = yearList;
    },
    handleSizeChange(val) {
      this.operationRecordQuery.pageSize = val;
      this.operationRecordQueryTemp.pageSize = val;
      this.handleGetOperationRecordList();
    },
    handleCurrentChange(val) {
      this.operationRecordQuery.pageIndex = val;
      this.operationRecordQueryTemp.pageIndex = val;
      this.handleGetOperationRecordList();
    },
    handleUserProjectsChange(val) {
      const msg = this;
      msg.operationRecord.userIds = [];
      msg.operationRecordQueryTemp.userIds = null;
      if (val && val === null && val === []) {
        msg.userList = [];
        msg.operationRecordQueryTemp.projectIds = null;
        msg.getUserByProjectIdsQuery.projectIds = null;
      } else {
        let projectId = '';
        for (const key in val) {
          if (key) {
            projectId += val[key];
            projectId += ',';
          }
        }
        projectId = projectId.substring(0, (projectId.length - 1));
        if (!msg.isStyle) {
          msg.operationRecordQueryTemp.projectIds = projectId;
          msg.getUserByProjectIdsQuery.projectIds = projectId;
          msg.operationRecordQueryTemp.userTypes = null;
          msg.getUserByProjectIdsQuery.flag = null;
        } else {
          msg.operationRecordQueryTemp.userTypes = projectId;
          msg.getUserByProjectIdsQuery.flag = projectId;
          msg.operationRecordQueryTemp.projectIds = null;
          msg.getUserByProjectIdsQuery.projectIds = null;
        }
        getUserByProjectIds(this.getUserByProjectIdsQuery).then((res) => {
          msg.userList = res.data;
        });
      }
    },
    handleUserIdsChange(val) {
      this.userIds = val;
      let userId = '';
      for (const key in val) {
        if (key) {
          userId += val[key];
          userId += ',';
        }
      }
      if (userId !== '') {
        this.operationRecordQueryTemp.userIds = userId.substring(0, (userId.length - 1));
      } else {
        this.operationRecordQueryTemp.userIds = null;
      }
    },
    handleUserSearchTimeChange(val) {
      if (val !== null) {
        this.operationRecordQueryTemp.dateStart = val[0];
        this.operationRecordQueryTemp.dateFinished = val[1];
      } else {
        this.operationRecordQueryTemp.dateStart = null;
        this.operationRecordQueryTemp.dateFinished = null;
      }
    },
    handleShow(params) {
      this.queryUser = params.userName;
      this.userCountQuery.userId = params.userId;
      this.userCountPieQuery.userId = params.userId;
      this.dialogFormVisible = true;
      this.handleUserEchartsBarData();
      this.handleUserEchartsPie(true);
    },
    handlePickerOptions() {
      const options = {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 7));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 30));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 90));
            picker.$emit('pick', [start, end]);
          },
        }],
      };
      this.pickerOptions = options;
    },
    resetForm() {
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.$el.reset();
    },
    handleProjectBar() {
      const msg = this;
      countUserLogProjectByMonth(msg.projectBarCountQuery).then((res) => {
        const { data } = res;
        msg.projectBarCountData = data;
        const searchType = this.projectSearchType;
        this.handleUserEchartsBar(data, searchType, false);
      });
    },
    handleProjectCount() {
      const msg = this;
      countUserLogProjectByPart(msg.projectCountQuery).then((res) => {
        const { data } = res;
        msg.projectCountData = data;
      });
    },
    handleUserEchartsBarData() {
      countUserLogByBar(this.userCountQuery).then((res) => {
        const { data } = res;
        this.userBarCountData = data;
        const searchType = this.userSearchType;
        this.handleUserEchartsBar(data, searchType, true);
      });
    },
    // 生成表格
    handleUserEchartsBar(data, searchType, isUser) {
      const barData = [];
      const lineData = [];
      let barName = '浏览次数(总计：';
      let lineName = '真实数据(总计：';
      let info = this.monthInfo;
      let lineSum = 0;
      let barSum = 0;
      let barMax = 0;
      let lineMax = 0;
      if (searchType === '0') {
        for (const key in data) {
          if (key) {
            barSum += data[key].num;
            barData[key] = data[key].num;
            lineSum += data[key].realNum;
            lineData[key] = data[key].realNum;
            if (data[key].num > barMax) {
              barMax = data[key].num;
            }
            if (data[key].realNum > lineMax) {
              lineMax = data[key].realNum;
            }
          }
        }
      } else {
        info = this.seasonInfo;
        let barTemp = 0;
        let lineTemp = 0;
        let remarkTemp = 0;
        for (const key in data) {
          if (key) {
            barTemp += data[key].num;
            lineTemp += data[key].realNum;
            barSum += data[key].num;
            lineSum += data[key].realNum;
            if (remarkTemp === 2 || remarkTemp === 5 || remarkTemp === 8 || remarkTemp === 11) {
              const barValueTemp = barTemp;
              const lineValueTemp = lineTemp;
              barData.push(barValueTemp);
              lineData.push(lineValueTemp);
              barTemp = 0;
              lineTemp = 0;
              if (barValueTemp > barMax) {
                barMax = barValueTemp;
              }
              if (lineValueTemp > lineMax) {
                lineMax = lineValueTemp;
              }
            }
            remarkTemp += 1;
          }
        }
      }
      barName += barSum.toString();
      barName += ')';
      if (barMax < 20) {
        barMax = 20;
      }
      barSum = Math.ceil((barMax * 1.1) / 5) * 5;
      lineName += lineSum.toString();
      lineName += ')';
      if (lineMax < 20) {
        lineMax = 20;
      }
      lineSum = Math.ceil((lineMax * 1.1) / 5) * 5;
      this.$nextTick(function () {
        if (isUser) {
          const myChart = this.$echarts.init(document.getElementById('eCharts_left'));
          myChart.showLoading({
            text: '正在努力的读取数据中...',
          });
          myChart.setOption(this.setBarEchart(info, lineData, barData, lineName, barName, lineSum, barSum));
          myChart.hideLoading();
        } else {
          const myChart = this.$echarts.init(document.getElementById('project_echarts_left'));
          myChart.showLoading({
            text: '正在努力的读取数据中...',
          });
          myChart.setOption(this.setBarEchart(info, lineData, barData, lineName, barName, lineSum, barSum));
          myChart.hideLoading();
        }
      });
    },
    handleUserEchartsPie(IsUser) {
      const msg = this;
      const pieData = [];
      if (IsUser) {
        countUserLogByPart(msg.userCountPieQuery).then((res) => {
          const { data } = res;
          for (const key in data) {
            if (key) {
              pieData[key] = data[key].nums;
            }
          }
          this.$nextTick(function () {
            const myChart = this.$echarts.init(document.getElementById('eCharts_right'));
            myChart.showLoading({
              text: '正在努力的读取数据中...',
            });
            myChart.setOption(this.setPieCharts(pieData));
            myChart.hideLoading();
          });
        });
      } else {
        countUserLogProjectByPart(msg.projectPieCountQuery).then((res) => {
          const { data } = res;
          for (const key in data) {
            if (key) {
              pieData[key] = data[key].nums;
            }
          }
          this.$nextTick(function () {
            const myChart = this.$echarts.init(document.getElementById('project_echarts_right'));
            myChart.showLoading({
              text: '正在努力的读取数据中...',
            });
            myChart.setOption(this.setPieCharts(pieData));
            myChart.hideLoading();
          });
        });
      }
    },
    handleProjectEcharts() {
      this.handleProjectBar();
      this.handleUserEchartsPie(false);
    },
    setBarEchart(info, lineData, barData, lineName, barName, lineSum, barSum) {
      const option = ({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            crossStyle: {
              color: '#999',
            },
          },
        },
        legend: {
          data: [barName, lineName],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: info,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '浏览次数（次）',
            min: 0,
            max: barSum,
            interval: barSum / 5,
          },
          {
            type: 'value',
            name: '真实数据（个）',
            min: 0,
            max: lineSum,
            interval: lineSum / 5,
          },
        ],
        series: [
          {
            name: barName,
            type: 'bar',
            barWidth: '60%',
            data: barData,
            itemStyle: {
              normal: {
                color: '#409EFF',
              },
            },
          },
          {
            name: lineName,
            type: 'line',
            yAxisIndex: 1,
            barWidth: '60%',
            data: lineData,
            itemStyle: {
              normal: {
                color: '#E6A23C',
              },
            },
          },
        ],
      });

      return option;
    },
    setPieCharts(pieData) {
      const nameList = this.functionType;
      const seriesDataList = [];
      const selectedList = {};
      for (const key in nameList) {
        if (key) {
          seriesDataList.push({
            name: nameList[key],
            value: pieData[key],
          });

          selectedList[nameList[key]] = key < 6;
        }
      }
      const data = {
        legendData: nameList,
        seriesData: seriesDataList,
        selected: selectedList,
      };
      const option = {
        title: {
          x: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: data.legendData,
          selected: data.selected,
        },
        series: [
          {
            name: '功能区域',
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: data.seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      return option;
    },
    handleModelYearChange(val) {
      this.userCountQuery.year = val;
      this.handleUserEchartsBarData();
    },
    handleModelSearchTypeChange(val) {
      this.userSearchType = val;
      const data = this.userBarCountData;
      this.handleUserEchartsBar(data, val, true);
    },
    handleUserPieSearchTimeChange(val) {
      if (val === null) {
        this.userCountPieQuery.startTime = null;
        this.userCountPieQuery.finishedTime = null;
      } else {
        this.userCountPieQuery.startTime = val[0];
        this.userCountPieQuery.finishedTime = val[1];
      }
      this.handleUserEchartsPie(true);
    },
    handleProjectIdsChange(val) {
      let projectId = '';
      for (const key in val) {
        if (key) {
          projectId += val[key];
          projectId += ',';
        }
      }
      if (projectId !== '') {
        projectId = projectId.substring(0, (projectId.length - 1));
        this.projectPieCountQuery.projectIdList = projectId;
        this.projectBarCountQuery.projectIdList = projectId;
      } else {
        this.projectPieCountQuery.projectIdList = null;
        this.projectBarCountQuery.projectIdList = null;
      }
      this.handleUserEchartsPie(false);
      this.handleProjectBar();
    },
    handleProjectSearchTimeChange(val) {
      if (val === null) {
        this.projectPieCountQuery.startTime = null;
        this.projectPieCountQuery.finishedTime = null;
      } else {
        this.projectPieCountQuery.startTime = val[0];
        this.projectPieCountQuery.finishedTime = val[1];
      }
      this.handleUserEchartsPie(false);
    },
    projectSearchYearChange(val) {
      this.projectBarCountQuery.year = val;
      this.handleProjectBar();
    },
    projectSearchTypeChange(val) {
      this.projectSearchType = val;
      const data = this.projectBarCountData;
      this.handleUserEchartsBar(data, val, false);
    },
    handleProjectExcelDownload() {
      exportUserLogList(this.operationRecordQuery).then((res) => {
        window.open(setFileRootForDownload(res.data));
      });
    },
    exportUserLogEcharts() {
      this.exportUserLogEchartsQuery = {
        projectIds: this.projectBarCountQuery.projectIdList,
        year: this.projectBarCountQuery.year,
        startTime: this.projectPieCountQuery.startTime,
        finishedTime: this.projectPieCountQuery.finishedTime,
      };
      exportUserLogEcharts(this.exportUserLogEchartsQuery).then((res) => {
        window.open(setFileRootForDownload(res.data));
      });
    },
    exportPersonLogList() {
      this.exportPersonLogListQuery = {
        userId: this.userCountQuery.userId,
        year: this.userCountQuery.year,
        projectIds: this.operationRecordQuery.projectIds,
        startTime: this.userCountPieQuery.startTime,
        finishedTime: this.userCountPieQuery.finishedTime,
      };
      exportPersonLogList(this.exportPersonLogListQuery).then((res) => {
        window.open(setFileRootForDownload(res.data));
      });
    },
    handleProjectAndUserTypeChange() {
      this.operationRecord.projectId = [];
      this.operationRecord.userIds = [];
      this.userList = [];
      if (!this.isStyle) {
        this.handleProjectList();
      } else {
        const listTemp = [];
        for (const key in footPrintsRoleList) {
          if (key) {
            const temp = { projectId: Number(key), projectName: this.footPrintsRoleList[key] };
            listTemp.push(temp);
          }
        }
        this.projectListForSearch = listTemp;
      }
    },
  },
};
</script>

<style scoped>
  .FootPrint{
    background-color: #FFFFFF;
    overflow: auto;
    margin-bottom: 40px;
  }
  .selectDiv {
    float: left;
    margin-bottom: 10px;
    text-align: center;
    margin-left: 10px;
  }
  .selectDiv1{
    width: 32%;
    margin-left: 30px;
    float: left;
    margin-bottom: 10px;
    text-align: center;
  }
  .selectDiv span{
    margin-right: 10px;
  }
  .selectDivButton{
    margin-left: 20px;
    float: left;
    text-align: right;
  }
 .topSpan{
    float: left;
  }
  .topButton{
    float: right;
    margin-right: 50px;
  }
  .span_picker{
    width: 240px;
  }
  .span_select{
    width: 252px;
    margin-left: 10px;
  }
  .span_select0{
    width: 200px;
  }
  .span_select1{
    width: 300px;
    margin-left: 10px;
  }
  .clearFix{
    height: 30px;
    border-bottom: 1px solid #ABABAD;
  }
  .clearFix:before,
  .clearFix:after {
    display: table;
    content: "";
  }
  .clearFix:after {
    clear: both
  }
  .main_div {
    width: 49%;
    float: left;
    height: 500px;
  }
  .main_div_top{
    width: 100%;
    text-align: center;
    margin-top: 20px;
  }
  .main_div_top_left{
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
  }
  .main_div_top_left span{
    line-height: 25px;
  }
  .main_div_top_right{
    width: 100%;
    margin-bottom: 10px;
    text-align: center;
  }
  #eCharts_left,#project_echarts_left{
    width: 100%;
    height: 400px;
    text-align: center;
  }
  #eCharts_right,#project_echarts_right {
    width: 100%;
    height: 400px;
    text-align: center;
  }
  .dialogMain{
    height: 500px;
  }
  .second_top_div{
    width: 50%;
    float: left;
    height:40px;
  }
  .second_top_div span{
    margin-right: 10px;
    margin-left: 30px;
  }
  .main_div_top span{
    font-weight: bold;
    text-align: center;
  }
  .top_select{
    width: 80px;
    margin-top: 10px;
  }
</style>
