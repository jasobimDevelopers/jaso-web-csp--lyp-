<template>
  <div class="OutputValue">
    <breadcrumb>
      <el-breadcrumb separator-class="el-icon-minus">
        <el-breadcrumb-item>
          <el-button type="text" style="color: #606266; font-weight: normal" @click="handleShowMsg">详情</el-button>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="!disableEdit">
          <el-button type="text" :disabled="disableEdit" @click="handleAdd">新增产值</el-button>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </breadcrumb>
    <div class="app-container" style="margin-top: 20px">
      <el-table
        :data="list"
        v-loading="listLoading"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="left" label="时间" prop="date" width="120"></el-table-column>
        <el-table-column align="left" label="本月产值" >
          <el-table-column align="left" label="本月经营收入" prop="operatingIncomeNum"></el-table-column>
          <el-table-column align="left" label="本月甲供材" prop="armourNum"></el-table-column>
        </el-table-column>
        <el-table-column align="left" label="累计产值" >
          <el-table-column align="left" label="经营收入" prop="allOperatingIncomeNum"></el-table-column>
          <el-table-column align="left" label="甲供材" prop="allOpeArmourNum"></el-table-column>
        </el-table-column>
        <el-table-column align="left" label="上传时间" prop="createDate" width="100"></el-table-column>
        <el-table-column align="left" :label="$t('table.operation')" width="100">
          <template slot-scope="scope">
            <div class="operation-btns">
              <i class="el-icon-edit-outline" @click="handleEdit(scope.row)"></i>
              <i class="el-icon-delete" v-if="!disableEdit" @click="handleDelete({ id: scope.row.id })"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.pageIndex"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber">
        </el-pagination>
      </div>
    </div>
    <!-- dialog -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      @close="resetForm"
      width="360px"
    >
      <div slot="title" style="font-weight: bolder">
        {{ this.actionStatus === 'add' ? '新增产值' : '编辑产值' }}
      </div>
      <hr noshade size="0.1px" style="margin-top: -10px; margin-bottom: 10px;color: #dcdfe6;" >
      <el-form :rules="rules" ref="dialogForm" :model="output" :disabled="disableEdit" label-position="top">
        <el-form-item v-if="this.actionStatus === 'add'" label="时间：" prop="date">
          <el-date-picker
            type="month"
            placeholder="请选择时间"
            v-model="output.date"
            style="width: 80%;"
            value-format="yyyy-MM"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="经营收入(万元)：" prop="operatingIncomeNum">
          <el-input-number v-model="output.operatingIncomeNum" :min="0" label="请输入" style="width: 80%;"></el-input-number>
        </el-form-item>
        <el-form-item label="甲供材：" prop="armourNum">
          <el-input-number v-model="output.armourNum" :min="0" label="请输入" style="width: 80%;"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCancel">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary" :disabled="disableEdit" @click="handleSave">{{$t('btn.comfirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogMsgVisible"
      @close="resetMsgForm"
      width="1000px"
    >
      <div slot="title" style="font-weight: bolder">
        产值统计详情
        <el-button type="text" @click="handleMsgExport" style="float: right;margin: 0 40px 10px 0;">{{$t('btn.export')}}</el-button>
      </div>
      <hr noshade size="0.1px" style="margin-top: -10px; margin-bottom: 10px;color: #dcdfe6;" >
      <div class="dialogMid">
        <i class="el-icon-info" style="float: left;line-height: 36px; margin-left: 10px;color: #409EFF;"></i>
        <span  class="dialogMidSpan">基本信息概览</span>
        <el-button type="text"  @click="handleEditEnable"  class="svgStyle" style="margin-right: 20px;">
          {{ msgEditEnable ? $t('btn.edit'):$t('btn.save') }}
        </el-button>
      </div>
      <div style="margin: 20px;"></div>
      <el-form :rules="msgRules" ref="dialogMsgForm" :model="projectOutputValue" label-width="120px" :disabled="disableEdit" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称：" prop="name" >
              <el-input v-model="projectOutputValue.name" disabled style="width: 240px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目负责人：" prop="leader">
              <el-input v-model="projectOutputValue.leader" disabled  style="width: 240px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同价：" prop="contractPrice">
              <el-input v-model="projectOutputValue.contractPrice" :disabled="msgEditEnable" style="width: 240px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="甲供材：" prop="armour">
              <el-input v-model="projectOutputValue.armour" :disabled="msgEditEnable" style="width: 240px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同产值：" prop="contractOutputValue">
              <el-input v-model="projectOutputValue.contractOutputValue" :disabled="msgEditEnable" style="width: 240px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签证变更：" prop="visaChange">
              <el-input v-model="projectOutputValue.visaChange" :disabled="msgEditEnable" style="width: 240px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="工期对比(%)：" prop="periodComparison">
              <el-input v-model="projectOutputValue.periodComparison" :disabled="msgEditEnable" style="width: 240px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialogMid">
        <i class="el-icon-info" style="float: left;line-height: 36px; margin-left: 10px;color: #409EFF;"></i>
        <span class="dialogMidSpan" >产值情况</span>
        <el-button type="text"  @click="handleMsgShowChange('line')" class="svgStyle">
          <svg-icon icon-class="line" size="18" ></svg-icon>
        </el-button>
        <el-button type="text"  @click="handleMsgShowChange('bar')" class="svgStyle">
          <svg-icon icon-class="bar" size="18" ></svg-icon>
        </el-button>
        <el-button type="text"  @click="handleMsgShowChange('table')" class="svgStyle">
          <svg-icon icon-class="table" size="18" ></svg-icon>
        </el-button>
      </div>
      <el-row style="margin-top: 20px;">
        <el-col :span="24">
          <div class="block">
            <span class="demonstration"> {{ '日期区间：' }}</span>
            <el-date-picker
              v-model="showListQuery.dateStart"
              type="month"
              placeholder="起始日期"
              value-format="yyyy-MM"
            >
            </el-date-picker>
            <span style="padding: 10px 10px 10px 10px;">至</span>
            <el-date-picker
              v-model="showListQuery.dateFinished"
              type="month"
              placeholder="结束日期"
              value-format="yyyy-MM"
            >
            </el-date-picker>
            <el-button type="primary" @click="handleTimeChangeSearch" style="margin-left: 20px;">查询</el-button>
          </div>
        </el-col>
      </el-row>
      <div  v-if="msgChartsType === 'table'">
        <el-table
          :data="listForShowView"
          fit
          highlight-current-row
          style="margin-top: 20px;"
          v-loading="showListLoading"
        >
          <el-table-column align="left" label="时间" prop="date" width="120"></el-table-column>
          <el-table-column align="left" label="本月产值" >
            <el-table-column align="left" label="本月经营收入" prop="operatingIncomeNum"></el-table-column>
            <el-table-column align="left" label="本月甲供材" prop="armourNum"></el-table-column>
          </el-table-column>
          <el-table-column align="left" label="当年产值" >
            <el-table-column align="left" label="上月累计经营收入（当年）" prop="lastMonthOperatingIncomeNum"></el-table-column>
            <el-table-column align="left" label="本月累计经营收入（当年）">
              <template slot-scope="scope">
                <span>{{ scope.row.month === 1 ? scope.row.operatingIncomeNum : (scope.row.lastMonthOperatingIncomeNum + scope.row.operatingIncomeNum) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="上月累计甲供材（当年）" prop="lastMonthArmourNum"></el-table-column>
            <el-table-column align="left" label="本月累计甲供材（当年）">
              <template slot-scope="scope">
                <span>{{ scope.row.month === 1 ? scope.row.armourNum : (scope.row.lastMonthArmourNum + scope.row.armourNum) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="left" label="累计产值" >
            <el-table-column align="left" label="经营收入" prop="allOperatingIncomeNum"></el-table-column>
            <el-table-column align="left" label="甲供材" prop="allOpeArmourNum"></el-table-column>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            @size-change="handleShowSizeChange"
            @current-change="handleShowCurrentChange"
            :current-page="showListQuery.pageIndex"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="showListQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="showTotalNumber">
          </el-pagination>
        </div>
      </div>
      <div id="echarts" v-else style="width: 100%;height: 600px;margin-top: 20px;"></div>
      <div slot="footer" style="width: 100%;">
        <el-button @click="resetMsgForm">{{$t('btn.cancel')}}</el-button>
        <!--<el-button type="primary" @click="handleMsgExport">{{$t('btn.export')}}</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { setFileRootForDownload } from '@/filters';
import { getValueOutputList, deleteValueOutput, addValueOutput, updateValueOutput, getProjectOutputValueByProjectId, updateProjectOutputValue, exportOutputValue } from '@/api/output';

export default {
  name: 'outputValue',
  data() {
    const { params: { id } } = this.$route;
    return {
      listLoading: false,
      showListLoading: false,
      listQuery: {
        pageIndex: 1,
        projectId: id,
        pageSize: 10,
        dateStart: null,
        dateFinished: null,
      },
      showListQuery: {
        pageIndex: 1,
        projectId: id,
        pageSize: 10,
        dateStart: null,
        dateFinished: null,
      },
      list: [],
      listForShowView: [],
      showList: [],
      actionStatus: 'add',
      dialogFormVisible: false,
      dialogMsgVisible: false,
      msgEditEnable: true,
      msgChartsType: 'table',
      project: null,
      projectOutputValue: {
        contractPrice: null,
        contractOutputValue: null,
        periodComparison: null,
        armour: null,
        visaChange: null,
        id: -1,
      },
      output: {
        projectId: id,
        year: null,
        month: null,
        armourNum: null,
        operatingIncomeNum: null,
        id: null,
        date: null,
      },
      searchData: [],
      totalNumber: null,
      totalPage: null,
      showTotalNumber: null,
      rules: {
        date: [{ required: true, message: `时间${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        operatingIncomeNum: [{ required: true, message: `经营收入${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        armourNum: [{ required: true, message: `甲供材${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
      msgRules: {
        contractPrice: [{ required: true, message: `合同价${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        armour: [{ required: true, message: `甲供材${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        contractOutputValue: [{ required: true, message: `合同产值${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        visaChange: [{ required: true, message: `签证变更${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        periodComparison: [{ required: true, message: `工期对比${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
    };
  },
  computed: {
    ...mapGetters({
      projectMsg: 'project',
    }),
  },
  created() {
    this.project = this.projectMsg;
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;

      getValueOutputList(this.listQuery).then((res) => {
        const { data, totalNumber } = res;
        this.totalNumber = totalNumber;
        if (data) {
          data.forEach((item) => {
            item.date = `${item.year}-${item.month}`;
            item.createDate = item.createDate.substring(0, item.createDate.length - 3);
          });
        }
        this.list = data;
      });
      this.listLoading = false;
    },
    getShowList() {
      this.showListLoading = true;
      getValueOutputList(this.showListQuery).then((res) => {
        const { data, totalNumber } = res;
        this.showTotalNumber = totalNumber;
        if (data) {
          data.forEach((item) => {
            item.date = `${item.year}-${item.month}`;
            item.createDate = item.createDate.substring(0, item.createDate.length - 3);
          });
        }
        this.listForShowView = data;
      });
      this.showListLoading = false;
    },
    getProjectOutputValue() {
      this.$set(this.projectOutputValue, 'name', this.projectMsg.name);
      this.$set(this.projectOutputValue, 'leader', this.projectMsg.leader);
      this.$set(this.projectOutputValue, 'id', -1);
      this.$set(this.projectOutputValue, 'projectId', this.projectMsg.id);
      getProjectOutputValueByProjectId({ projectId: this.projectMsg.id }).then((res) => {
        const { data } = res;
        if (data !== null) {
          this.$set(this.projectOutputValue, 'contractPrice', data.contractPrice);
          this.$set(this.projectOutputValue, 'contractOutputValue', data.contractOutputValue);
          // if (data.periodComparison.indexOf(encodeURI('%')) > 0) {
          //   this.$set(this.projectOutputValue, 'periodComparison', decodeURI(data.periodComparison));
          // } else {
          //   this.$set(this.projectOutputValue, 'periodComparison', data.periodComparison);
          // }
          this.$set(this.projectOutputValue, 'periodComparison', data.periodComparison);
          this.$set(this.projectOutputValue, 'armour', data.armour);
          this.$set(this.projectOutputValue, 'visaChange', data.visaChange);
          this.$set(this.projectOutputValue, 'id', data.id);
        }
      });
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.actionStatus = 'add';
    },
    handleCancel() {
      this.dialogFormVisible = false;
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.$el.reset();
    },
    handleSave() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          if (this.actionStatus === 'add') {
            const dateTemp = this.output.date.split('-');
            const addParam = {
              year: dateTemp[0],
              month: dateTemp[1],
              projectId: this.output.projectId,
              armourNum: this.output.armourNum,
              operatingIncomeNum: this.output.operatingIncomeNum,
            };
            addValueOutput(addParam).then((res) => {
              if (res) {
                const { callStatus, errorCode } = res.data;
                if (callStatus === 'FAILED') {
                  this.$message({
                    type: 'error',
                    message: errorCode,
                  });
                } else {
                  this.$message({
                    type: 'success',
                    message: this.$t('message.operationSuccess'),
                  });
                  this.$set(this.listQuery, 'pageIndex', 1);
                  this.$set(this.listQuery, 'dateStart', null);
                  this.$set(this.listQuery, 'dateFinished', null);
                  this.getList();
                }
              }
            });
          } else {
            const editParam = {
              id: this.output.id,
              armourNum: this.output.armourNum,
              operatingIncomeNum: this.output.operatingIncomeNum,
            };
            updateValueOutput(editParam).then((res) => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: this.$t('message.operationSuccess'),
                });
              }
            });
            this.getList();
          }
        }
      });
      this.dialogFormVisible = false;
    },
    handleEdit(param) {
      this.dialogFormVisible = true;
      this.actionStatus = 'edit';
      this.$set(this.output, 'id', param.id);
      this.$set(this.output, 'operatingIncomeNum', param.operatingIncomeNum);
      this.$set(this.output, 'armourNum', param.armourNum);
    },
    handleDelete(params) {
      this.$confirm(this.$t('message.deleteOutput'), this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        // delete user
        deleteValueOutput(params).then(() => {
          this.$message({
            type: 'success',
            message: this.$t('message.deleteOk'),
          });

          this.getList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    resetForm() {
      this.dialogFormVisible = false;
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.$el.reset();
    },
    resetMsgForm() {
      this.dialogMsgVisible = false;
      this.$refs.dialogMsgForm.resetFields();
      this.$refs.dialogMsgForm.$el.reset();
    },
    handleMsgExport() {
      exportOutputValue({ projectId: this.project.id }).then((res) => {
        window.open(setFileRootForDownload(res.data));
      });
    },
    handleShowMsg() {
      this.listForShowView = JSON.parse(JSON.stringify(this.list));
      this.showTotalNumber = JSON.parse(JSON.stringify(this.totalNumber));
      this.getProjectOutputValue();
      this.dialogMsgVisible = true;
      this.msgEditEnable = true;
    },
    handleEditEnable() {
      if (this.msgEditEnable) {
        this.msgEditEnable = false;
      } else {
        // 验证表单
        this.$refs.dialogMsgForm.validate((valid) => {
          if (valid) {
            const param = {
              contractPrice: this.projectOutputValue.contractPrice,
              contractOutputValue: this.projectOutputValue.contractOutputValue,
              armour: this.projectOutputValue.armour,
              periodComparison: this.projectOutputValue.periodComparison,
              visaChange: this.projectOutputValue.visaChange,
              projectId: this.projectOutputValue.projectId,
              id: this.projectOutputValue.id,
            };
            // if (this.projectOutputValue.periodComparison.indexOf('%') > 0) {
            //   param.periodComparison = encodeURI(this.projectOutputValue.periodComparison);
            // } else {
            //   param.periodComparison = this.projectOutputValue.periodComparison;
            // }
            updateProjectOutputValue(param).then((res) => {
              if (res) {
                const { callStatus, errorCode } = res.data;
                if (callStatus === 'FAILED') {
                  this.$message({
                    type: 'error',
                    message: errorCode,
                  });
                } else {
                  this.$message({
                    type: 'success',
                    message: this.$t('message.operationSuccess'),
                  });
                }
              }
            });
            this.msgEditEnable = true;
            // 提交内容
          }
        });
      }
    },
    handleMsgShowChange(val) {
      this.msgChartsType = val;
      if (this.msgChartsType !== 'table') {
        this.setEchart();
      }
    },
    handleTimeChangeSearch() {
      if (this.showListQuery.dateStart > this.showListQuery.dateFinished) {
        this.$message({
          type: 'error',
          message: '起始日期晚于结束日期',
        });
      } else {
        this.$set(this.showListQuery, 'pageIndex', 1);
        this.$set(this.showListQuery, 'pageSize', 10);
        getValueOutputList(this.showListQuery).then((res) => {
          const { data, totalNumber } = res;
          this.showTotalNumber = totalNumber;
          if (data) {
            data.forEach((item) => {
              item.date = `${item.year}-${item.month}`;
              item.createDate = item.createDate.substring(0, item.createDate.length - 3);
            });
          }
          this.listForShowView = data;
          this.setEchart();
        });
      }
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.getList();
    },
    handleShowSizeChange(val) {
      this.$set(this.showListQuery, 'pageSize', val);
      this.getShowList();
    },
    handleShowCurrentChange(val) {
      this.$set(this.showListQuery, 'pageIndex', val);
      this.getShowList();
    },
    setEchart() {
      if (this.listForShowView) {
        const xAxisList = [];
        const finishedList = [];
        const materialSupplyList = [];
        let finishedMax = 10;
        let materialSupplyMax = 10;
        // 比对极值,
        this.listForShowView.forEach((item) => {
          xAxisList.push(item.date);
          if (item.operatingIncomeNum !== undefined && item.operatingIncomeNum) {
            finishedList.push(item.operatingIncomeNum);
            if (finishedMax < item.operatingIncomeNum) {
              finishedMax = item.operatingIncomeNum;
            }
          }
          if (item.armourNum !== undefined) {
            materialSupplyList.push(item.armourNum);
            if (materialSupplyMax < item.armourNum) {
              materialSupplyMax = item.armourNum;
            }
          } else {
            materialSupplyList.push(0);
          }
        });
        finishedMax = Math.ceil((finishedMax * 1.1) / 5) * 5;
        materialSupplyMax = Math.ceil((materialSupplyMax * 1.1) / 5) * 5;
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
            data: ['本月经营收入', '本月甲供材'],
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
              data: xAxisList,
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              name: '经营收入(万元)',
              min: 0,
              max: finishedMax,
              interval: finishedMax / 5,
            },
            {
              type: 'value',
              name: '甲供材(万元)',
              min: 0,
              max: materialSupplyMax,
              interval: materialSupplyMax / 5,
            },
          ],
          series: [
            {
              name: '本月经营收入',
              type: this.msgChartsType,
              // barWidth: '60%',
              data: finishedList,
              itemStyle: {
                normal: {
                  color: '#409EFF',
                },
              },
              markPoint: {
                data: [
                  { type: 'max', name: '本月经营收入最大值' },
                  { type: 'min', name: '本月经营收入最小值' },
                ],
              },
              markLine: {
                data: [
                  { type: 'average', name: '本月经营收入平均值' },
                ],
              },
            },
            {
              name: '本月甲供材',
              type: this.msgChartsType,
              yAxisIndex: 1,
              // barWidth: '60%',
              data: materialSupplyList,
              itemStyle: {
                normal: {
                  color: '#E6A23C',
                },
              },
              markPoint: {
                data: [
                  { type: 'max', name: '本月甲供材最大值' },
                  { type: 'min', name: '本月甲供材最小值' },
                ],
              },
              markLine: {
                data: [
                  { type: 'average', name: '本月经营收入平均值' },
                ],
              },
            },
          ],
        });
        if (xAxisList && xAxisList.length > 12) {
          const grid = {
            top: '12%',
            left: '1%',
            right: '10%',
            containLabel: true,
          };
          const startValue = Math.ceil(((xAxisList.length - 12) * 100) / xAxisList.length);
          const dataZoom = [
            {
              show: true,
              start: startValue,
              end: 100,
            },
            {
              type: 'inside',
              start: startValue,
              end: 100,
            },
            {
              show: true,
              yAxisIndex: 0,
              filterMode: 'empty',
              width: 30,
              height: '80%',
              showDataShadow: false,
              left: '93%',
            },
          ];
          this.$set(option, 'grid', grid);
          this.$set(option, 'dataZoom', dataZoom);
        }
        this.$nextTick(function () {
          const myChart = this.$echarts.init(document.getElementById('echarts'));
          myChart.showLoading({
            text: '正在努力的读取数据中...',
          });
          myChart.setOption(option);
          myChart.hideLoading();
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .dialogMid {
    background-color: #F5F5F5;
    height: 36px;
    width: 100%;
    margin-top: 10px;
  }
  .dialogMidSpan {
    color: #909399;
    font-size: 13px;
    line-height: 36px;
    margin-left: 10px;
    float: left;
  }
  .svgStyle {
    float: right;
    margin: 10px 10px 0 0;
    cursor: pointer;
  }
</style>
