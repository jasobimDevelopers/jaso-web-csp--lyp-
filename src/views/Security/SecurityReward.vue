<template>
  <div>
    <breadcrumb>
      <el-button class="filter-item" type="text" @click="openDialogOfAddFormVisible">新增奖惩</el-button>
    </breadcrumb>

    <div class="app-container">
      <!-- 搜索 -->
      <div class="filter-wrapper">
        <el-form ref="filterForm" label-position="right" label-width="100px" style="display: flex;margin-top: 10px">
          <el-form-item label="关键字查找">
            <el-input v-model="searchData.find" @blur="searchByFind" clearable placeholder="请输入检查项、检查人查询" style="width: 200px;"/>
          </el-form-item>
          <el-form-item label="奖惩类型">
            <el-select v-model="searchData.awardType" @change="searchByType" filterable >
              <el-option
                label="全部"
                :value="null">
              </el-option>
              <el-option
                label="奖励"
                :value="0">
              </el-option>
              <el-option
                label="处罚"
                :value="1">
              </el-option>
            </el-select>
          </el-form-item>
          <!--v-model="value7"-->
          <el-form-item label="时间">
            <el-date-picker
              v-model="searchData.time"
              :picker-options="pickerOptions"
              @change="searchByTime"
              style="width: 300px"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <!-- 奖惩列表 -->
        <el-table :data="tableList"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%">
          <el-table-column align="center" label="项目名称" prop="projectName">
          </el-table-column>
          <el-table-column align="center" label="签发人" prop="createUserName">
          </el-table-column>
          <el-table-column align="center" label="奖惩事由" prop="remark">
            <template slot-scope="scope">
              <div v-for="item in reasonsOptions" :key="item.id" v-if="item.id === scope.row.aboutId">
                <el-tooltip class="item" effect="dark" :content="item.checkList" placement="top">
                  <div style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    {{item.checkList}}
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下发日期" prop="awardDate">
          </el-table-column>
          <el-table-column align="center" label="合计金额" prop="awardNum">
          </el-table-column>
          <el-table-column align="center" label="奖惩类型" prop="awardType">
            <template slot-scope="scope">
              <el-button type="text" @click="rewardsPunishmentsDetails(scope.row)" style="color: #FFBC57" v-if="scope.row.awardType === 0"> 奖励</el-button>
              <el-button type="text" @click="rewardsPunishmentsDetails(scope.row)" style="color: #F56C6C" v-if="scope.row.awardType === 1">处罚</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- pagination -->
        <div class="pagination-container" v-if="totalNumber > 0">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listData.pageIndex"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="listData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNumber">
          </el-pagination>
        </div>
        <!-- 新增奖惩 -->
        <el-dialog :visible.sync="dialogOfAddFormVisible"
                   @close="closeAddForm"
                   :close-on-click-modal="false"
                   width="420px"
                   :show-close="false">
          <div slot="title" style="font-weight: bolder">新增奖惩</div>
          <el-form  ref="dialogForm" :rules="rules" :model="dataList" label-position="top">
            <el-form-item label="奖惩类型：">
              <el-select v-model="dataList.awardType" @change="editType" style="width: 100%">
                <el-option :key="0" label="奖励" :value="0"></el-option>
                <el-option :key="1" label="处罚" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="rewardOrPunishment.isMadeUpOf"  prop="aboutId">
              <!--<section>{{rewardOrPunishment.isMadeUpOf}}</section>-->
              <el-select filterable  v-model="dataList.aboutId" style="width: 100%" placeholder="请选择奖惩事由">
                <el-option v-for="item in reasonsOptions"
                           :key="item.id"
                           :label="item.checkList"
                           :value="item.id" >
                  <span style="float: left;">{{ item.checkList }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px;">{{ item.projectName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 5px;margin-left: 5px">{{ item.createUserName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="rewardOrPunishment.people" prop="personLiable">
              <el-select filterable multiple :placeholder="'选择'+ rewardOrPunishment.people.substring(0,3)"  v-model="dataList.personLiable" style="width: 100%">
                <el-option v-for="item in responsibleList"
                           :key="item.id"
                           :label="item.realName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="rewardOrPunishment.time" prop="dDate">
              <el-date-picker
                v-model="dataList.dDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="rewardOrPunishment.money" prop="awardNum">
              <el-input-number style="width: 100%"   v-model="dataList.awardNum"></el-input-number>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input type="textarea"  v-model="dataList.remark"></el-input>
            </el-form-item>
            <el-form-item label="相关图片：" v-model="dataList.fileList" prop="fileList">
              <div class="upload-file-wrapper flex-column">
                <div class="flex-row">
                  <el-button type="primary" style="margin-right: 15px;">
                    <input type="file" ref="picInput" multiple accept="image/*" @change="handleFileChange" />
                    <span>点击上传</span>
                  </el-button>
                  <span>{{ dataList.fileList.length > 0 ? `${dataList.fileList.length}个文件` : '' }}</span>
                </div>
                <div style="font-size: 12px;">只能上传jpg/png文件，且不超过500kb</div>
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="closeAddForm">取消</el-button>
            <el-button type="primary" @click="newRewardsPunishments" :disabled="newRewardsDisabled">保存</el-button>
          </div>
        </el-dialog>
        <!-- 奖惩详情 -->
        <el-dialog
          :visible.sync="dialogFormVisible"
          :show-close="false"
          @close="closeDialog"
          width="420px"
        >
          <div slot="title" style="font-weight: bolder">
            {{ dialogTitle }}
            <div style="float: right;">
              <el-button type="text" @click="openDialog">查看检查</el-button>
              <el-button type="text" @click="closeDialog">关闭</el-button>
            </div>
          </div>
          <div>
            <el-form :label-position="labelPosition" label-width="85px">
              <el-form-item :label="rewardsList.madeUpOf" :label-position="labelPositionTop">
                <!--<el-input type="textarea" :value="tableLine.checkList" disabled/>-->
                <div style="background-color: #D8DCE6">
                  <section v-for="item in tableLine.checkList" :key="item" style="margin-left: 10px">
                    {{item}}
                  </section>
                </div>
              </el-form-item>
              <el-form-item :label="rewardsList.people">
                <section v-for="item in tableLine.personLiable" :key="item">
                  {{item}}
                </section>
              </el-form-item>
              <el-form-item :label="rewardsList.dateTime"><section>{{tableLine.createDate }}</section></el-form-item>
              <el-form-item :label="rewardsList.money"><section>{{tableLine.awardNum + '元' }}</section></el-form-item>
              <el-form-item label="备注："><section>{{tableLine.remark === null ? '无' : tableLine.remark }}</section></el-form-item>
              <el-form-item label="签发人："><section>{{tableLine.createUserName }}</section></el-form-item>
              <el-form-item label="相关图片：">
                <el-row style="margin-left: 10px;" v-if="tableLine.pictures !== null">
                  <el-col :span="8" v-for="(url,index) in tableLine.pictures" :key="index" style="margin-bottom: 10px">
                    <el-card :body-style="{ padding: '0px' }" style="height: 80px;width: 80px;margin-top: 10px">
                      <img :src="url | setFileRoot" class="image" style="height: 80px;width: 80px">
                    </el-card>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
        <!-- 检查单详情 -->
        <el-dialog :visible.sync="dialogControlListFormVisible"
                   @close="resetControlListForm"
                   :show-close="false"
                   width="380px"
        >
          <div slot="title" style="font-weight: bolder;">
            <span>质量检查单详情</span>
            <el-button type="text" style="float: right" @click="resetControlListForm">关闭</el-button>
          </div>
          <hr size="0.1px" style="margin-top: -20px; margin-bottom: 20px;color: #F5F5F5;">
          <el-alert
            title="检查单概览"
            type="info"
            :closable="false"
            show-icon style="margin-top: 10px">
          </el-alert>
          <el-row :gutter="20" style="margin-top: 10px;margin-left: -30px">
            <el-col :span="6"><div style="text-align: right;">性质：</div></el-col>
            <el-col :span="16">
              <div v-for="(item, index) in detailsList.natureId" :key="index">
                {{ detailsList.natureId.length > 1 ?  item + '；' :  item }}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;margin-left: -30px">
            <el-col :span="6"><div style="text-align: right;">日期：</div></el-col>
            <el-col :span="16"><div>{{detailsList.createDate}}</div></el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;margin-left: -30px">
            <el-col :span="6"><div style="text-align: right;">检查人：</div></el-col>
            <el-col :span="16"><div>{{detailsList.createUserName}}</div></el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;margin-left: -30px">
            <el-col :span="6"><div style="text-align: right;">通知人：</div></el-col>
            <el-col :span="16">
              <div v-for="item in detailsList.informUser" :key="item">
                {{item}}
              </div>
            </el-col>
          </el-row>
          <section style="margin-top: 10px;font-weight: bold">检查项</section>
          <div  style="margin-top: 10px;background-color: #F5F7FA">
            <div v-if="detailsList.checkList !== ''" v-for="(item, index) in detailsList.checkList.split('；')" :key="index">
              <div v-if="detailsList.checkList.split('；').length > 1 && index !== detailsList.checkList.split('；').length - 1" style="padding-top: 5px;padding-bottom: 5px">{{item}}</div>
              <div v-if="detailsList.checkList.split('；').length === 1"  style="padding-top: 5px;padding-bottom: 5px">{{item}}</div>
            </div>
            <div v-if="detailsList.checkList === ''">暂无检查项数据</div>
          </div>
          <section style="margin-top: 10px;font-weight: bold">检查结果</section>
          <div style="margin-top: 10px;background-color: #F5F7FA">
            <el-button type="success" v-if="detailsList.noticeType === 0" style="margin-top: 10px;margin-left: 10px">通过</el-button>
            <el-button type="warning" v-if="detailsList.noticeType === 1" style="margin-top: 10px;margin-left: 10px">口头警告</el-button>
            <el-button type="danger"  v-if="detailsList.noticeType === 2"  style="margin-top: 10px;margin-left: 10px">书面整改</el-button>
            <div style="margin-top: 10px;margin-left: 10px">
              {{detailsList.checkContent}}
            </div>
            <el-row style="margin-left: 10px;" v-if="detailsList.pictures !== null">
              <el-col :span="8" v-for="(url,index) in detailsList.pictures" :key="index" style="margin-bottom: 10px">
                <el-card :body-style="{ padding: '0px' }" style="height: 80px;width: 80px;margin-top: 10px">
                  <img :src="url | setFileRoot" class="image" style="height: 80px;width: 80px">
                </el-card>
              </el-col>
            </el-row>
            <section v-if="detailsList.pictures === null" style="text-align: center;margin-bottom: 10px">暂无图片</section>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { getAwardTicketList, getQualityCheckPartList, getQualityCheckList,
  getUserTeam, addAwardTicket } from '@/api/quality';
import { mapGetters } from 'vuex';
// import { questionTicketTypeList } from '@/filters';
// import { showGallery } from '@/utils/utils';

export default {
  name: 'SecurityReward',
  computed: {
    ...mapGetters({
      userMsg: 'userInfo',
      project: 'project',
    }),
  },
  data() {
    const { params: { id } } = this.$route;
    return {
      listQuery: {
        pageIndex: -1,
        pageSize: 5,
        projectId: id,
      },
      tableList: [],
      detailsList: {
        checkList: '',
        natureId: [],
        pictures: [],
      },
      tableLine: {
        personLiable: [],
        checkList: [],
      },
      dialogTitle: '奖励单详情',
      dialogFormVisible: false,
      dialogOfAddFormVisible: false,
      dialogControlListFormVisible: false,
      dataList: {
        projectId: id,
        awardType: 0,
        ticketType: 1,
        aboutId: null,
        personLiable: [],
        dDate: null,
        awardNum: 0,
        remark: null,
        fileList: [],
      },
      rules: {
        aboutId: [{ required: true, message: `奖惩事由${this.$t('message.notEmpty')}`, trigger: 'change' }],
        personLiable: [{ required: true, message: `相关人${this.$t('message.notEmpty')}`, trigger: 'change' }],
        dDate: [{ required: true, message: `日期${this.$t('message.notEmpty')}`, trigger: 'change' }],
        awardNum: [{ required: true, message: `奖惩金额${this.$t('message.notEmpty')}`, trigger: 'change' }],
        remark: [{ required: true, message: `备注${this.$t('message.notEmpty')}`, trigger: 'change' }],
        fileList: [{ required: true, message: `相关图片${this.$t('message.notEmpty')}`, trigger: 'change' }],
      },
      responsibleList: [],
      searchData: {
        find: null,
        awardType: null,
        time: null,
      },
      pickerOptions: {
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
      },
      totalNumber: 0,
      listData: {
        pageIndex: 1,
        pageSize: 5,
        projectId: id,
        start: null,
        end: null,
        find: null,
        awardType: null,
        ticketType: 1,
      },
      labelPosition: 'right',
      labelPositionTop: 'top',
      rewardOrPunishment: {
        isMadeUpOf: '奖励事由：',
        people: '授奖方：',
        time: '奖励日期：',
        money: '奖励金额：',
      },
      reasonsOptions: [],
      newRewardsDisabled: false,
      rewardsList: {
        madeUpOf: '奖励是由：',
        people: '授奖人：',
        dateTime: '奖励日期：',
        money: '奖励金额：',
      },
    };
  },
  created() {
    this.getList();
    this.getReasonsOptions();
  },
  methods: {
    getList() {
      getAwardTicketList(this.listData).then((data) => {
        if (data) {
          data.data.forEach((res) => {
            res.projectName = this.project.name;
          });
        }
        this.tableList = data.data;
        this.totalNumber = data.totalNumber;
      });
    },
    handleSizeChange(val) {
      this.listData.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listData.pageIndex = val;
      this.getList();
    },
    searchByFind() {
      if (this.searchData.find === null || this.searchData.find === '') {
        this.listData.find = null;
      } else {
        this.listData.find = this.searchData.find;
      }
      this.getList();
    },
    searchByType(e) {
      if (e === null) {
        this.listData.awardType = null;
      } else {
        this.listData.awardType = e;
      }
      this.getList();
    },
    searchByTime() {
      if (this.searchData.time !== null && this.searchData.time) {
        this.listData.start = `${this.searchData.time[0].getFullYear()}-${this.searchData.time[0].getMonth() + 1}-${this.searchData.time[0].getDate()} 00:00:00`;
        this.listData.end = `${this.searchData.time[1].getFullYear()}-${this.searchData.time[1].getMonth() + 1}-${this.searchData.time[1].getDate()} 23:59:59`;
        // this.listData.start = this.searchData.time[0];
        // this.listData.end = this.searchData.time[1];
      } else {
        this.listData.start = null;
        this.listData.end = null;
      }
      this.getList();
    },
    // 奖惩详情
    rewardsPunishmentsDetails(item) {
      this.tableLine = item;
      getQualityCheckList({ projectId: this.listQuery.projectId, id: item.aboutId, qualityType: 1 }).then((data) => {
        if (data.data[0]) {
          this.detailsList = data.data[0];
          this.tableLine.checkList = data.data[0].checkList.split('；');
        } else {
          this.tableLine.checkList = ['暂无处罚是由'];
        }
        if (item.awardType === 0) {
          // 奖励
          this.dialogTitle = '奖励单详情';
          this.rewardsList = {
            madeUpOf: '奖励是由：',
            people: '授奖人：',
            dateTime: '奖励日期：',
            money: '奖励金额：',
          };
        } else {
          // 处罚
          this.dialogTitle = '处罚单详情';
          this.rewardsList = {
            madeUpOf: '处罚是由：',
            people: '责任人：',
            dateTime: '处罚日期：',
            money: '处罚金额：',
          };
        }
        this.dialogFormVisible = true;
      });
    },
    closeDialog() {
      this.tableLine = {
        personLiable: [],
        checkList: [],
      };
      this.dialogFormVisible = false;
    },
    openDialog() {
      this.dialogControlListFormVisible = true;
    },
    getReasonsOptions() {
      getQualityCheckPartList(this.listQuery).then((data) => {
        if (data) {
          this.reasonsOptions = data.data;
        }
      });
    },
    openDialogOfAddFormVisible() {
      getUserTeam({ projectId: this.listQuery.projectId }).then((data2) => {
        if (data2) {
          this.responsibleList = data2.data;
          this.dataList.personLiable = [];
          this.dialogOfAddFormVisible = true;
        }
      });
    },
    // 新增奖惩
    newRewardsPunishments() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.newRewardsDisabled = true;
          addAwardTicket(this.dataList).then((data) => {
            if (data) {
              this.$message({
                type: 'success',
                message: this.dataList.awardType === 0 ? '奖励新增成功！' : '处罚新增成功！',
              });
              this.closeAddForm();
              this.newRewardsDisabled = false;
              this.getList();
            }
          });
        }
      });
    },
    closeAddForm() {
      this.dataList = {
        projectId: this.listQuery.projectId,
        awardType: 0,
        ticketType: 1,
        aboutId: null,
        personLiable: [],
        dDate: null,
        awardNum: 0,
        remark: null,
        fileList: [],
      };
      this.$refs.dialogForm.resetFields();
      this.dialogOfAddFormVisible = false;
    },
    handleFileChange(e) {
      const files = e.target.files;
      this.dataList.fileList = files;
    },
    editType(value) {
      if (value === 0) {
        this.rewardOrPunishment = {
          isMadeUpOf: '奖励事由：',
          people: '授奖方：',
          time: '奖励日期：',
          money: '奖励金额：',
        };
      } else {
        this.rewardOrPunishment = {
          isMadeUpOf: '处罚事由：',
          people: '责任人：',
          time: '处罚日期：',
          money: '处罚金额：',
        };
      }
    },
    resetControlListForm() {
      this.dialogControlListFormVisible = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .question-level {
    &-0 {
      color: #67C23A;
    }

    &-1 {
      color: #E6A23C;
    }

    &-2 {
      color: #F56C6C;
    }
  }

  .question-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
</style>
