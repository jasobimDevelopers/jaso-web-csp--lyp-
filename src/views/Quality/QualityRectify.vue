<template>
  <div>
    <breadcrumb>
      <!--<el-button class="filter-item" type="text" icon="el-icon-plus">按钮</el-button>-->
    </breadcrumb>

    <div class="app-container">
      <!-- 搜索切换 -->
      <div class="filter-wrapper">
        <el-form ref="filterForm" label-position="right" label-width="100px" style="display: flex;margin-top: 10px">
          <el-form-item label="关键字查找">
            <el-input v-model="lsData.keyword" @blur="searchKeyWord" clearable placeholder="请输入整改人、整改要求查询" style="width: 200px;"/>
          </el-form-item>
          <el-form-item label="整改状态">
            <el-select v-model="lsData.status" @change="searchStatus" placeholder="请选择" filterable >
              <el-option
                label="全部"
                :value="null">
              </el-option>
              <el-option
                label="待整改"
                :value="0">
              </el-option>
              <el-option
                label="待复检"
                :value="1">
              </el-option>
              <el-option
                label="通过"
                :value="2">
              </el-option>
            </el-select>
          </el-form-item>
          <!--v-model="value7"-->
          <el-form-item label="时间">
            <el-date-picker
              v-model="lsData.betDate"
              :picker-options="pickerOptions"
              @change="searchBetDate"
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
      <!-- 数据列表 -->
      <div class="app-container">
        <!-- table -->
        <el-table
          :data="listData"
          v-loading="listLoading"
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column align="center" label="项目名传" prop="projectName" width="200"></el-table-column>
          <el-table-column align="center" label="整改人" prop="createUserName"></el-table-column>
          <el-table-column align="center" label="整改要求" prop="rectificationContent" width="180"></el-table-column>
          <el-table-column align="center" label="下发日期" prop="finishedDate">
            <template slot-scope="scope">
              <!--0、待整改（默认值，提交时设置 ） 1、待复检 2、已通过-->
              <span style="float: left">{{scope.row.finishedDate}}</span>
              <el-tag type="danger" style="float: left;margin-left: 10px" v-if="scope.row.status !== 2 && new Date(scope.row.finishedDate).getTime() < new Date().getTime()" >逾期</el-tag>
              <!--<div style="float: right;width: 46px;height: 28px;"></div>-->
            </template>
          </el-table-column>
          <el-table-column align="center" label="整改状态" prop="status">
            <template slot-scope="scope">
              <!--0、待整改（默认值，提交时设置 ） 1、待复检 2、已通过-->
              <el-button type="text" v-if="scope.row.status === 0" @click="details(scope.row)">待整改</el-button>
              <el-button type="text" v-if="scope.row.status === 1" @click="details(scope.row)">待复检</el-button>
              <el-button type="text" v-if="scope.row.status === 2" @click="details(scope.row)">通过</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- /table -->

        <!-- pagination -->
        <div class="pagination-container" v-if="totalNumber > 0">
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
      <!-- 整改单详情 -->
      <el-dialog :visible.sync="dialogControlListFormVisible"
                 @close="resetControlListForm"
                 :close-on-click-modal="false"
                 :show-close="false"
                 width="380px">
        <div slot="title" style="font-weight: bolder;">
          <span>质量整改单详情</span>
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
            <div v-for="(item, index) in detailsList.nature" :key="index">
              {{ detailsList.nature.length > 1 ?  item + '；' :  item }}
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
        <section style="margin-top: 10px;font-weight: bold">检查项</section>
        <div  style="margin-top: 10px;background-color: #F5F7FA">
          <div v-if="detailsList.checkList !== '' && detailsList.checkList !== null" v-for="(item, index) in detailsList.checkList.split('；')" :key="index">
            <div v-if="detailsList.checkList.split('；').length > 1 && index !== detailsList.checkList.split('；').length - 1" style="padding-top: 5px;padding-bottom: 5px">{{item}}</div>
            <div v-if="detailsList.checkList.split('；').length === 1"  style="padding-top: 5px;padding-bottom: 5px">{{item}}</div>
          </div>
          <div v-if="detailsList.checkList === '' || detailsList.checkList === null">暂无检查项数据</div>
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
        <el-row :gutter="20" style="margin-top: 10px;margin-left: -10px">
          <el-col :span="6"><div style="text-align: right;">整改要求：</div></el-col>
          <el-col :span="16"><div>{{detailsList.rectificationContent}}</div></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px;margin-left: -10px">
          <el-col :span="6"><div style="text-align: right;">整改人：</div></el-col>
          <el-col :span="16">
            <div v-for="item in detailsList.rectifyUser" :key="item">
              {{item}}
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px;margin-left: -10px">
          <el-col :span="6"><div style="text-align: right;">抄送人：</div></el-col>
          <el-col :span="16">
            <div v-for="item in detailsList.copyUser" :key="item">
              {{item}}
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px;margin-left: -10px">
          <el-col :span="6"><div style="text-align: right;">完成日期：</div></el-col>
          <el-col :span="16"><div>{{detailsList.finishedDate}}</div></el-col>
        </el-row>
        <el-alert
          title="相关记录"
          type="info"
          :closable="false"
          show-icon style="margin-top: 10px">
        </el-alert>
        <el-menu :default-active="defaultActive" mode="horizontal"
                 @select="handleSelect" background-color="#FFFFFF" text-color="#303133"
                 active-text-color="#1989FA" style="margin-top: 10px">
          <el-menu-item index="0" style="width: 170px;height: 40px;line-height: 40px;text-align: center;border: 1px solid #DCDFE6;">整改情况</el-menu-item>
          <el-menu-item index="1" style="width: 170px;height: 40px;line-height: 40px;text-align: center;border: 1px solid #DCDFE6;border-left:none">评论</el-menu-item>
        </el-menu>
        <div v-if="isComment">
          <section style="margin-top: 10px;font-weight: bold">
            评论共({{totalCommentNumber}})条
          </section>
          <div style="height: 150px; margin-top: -20px">
            <div class="user-info flex-row" style="float: left;">
              <!--<jaso-avatar :avatar="userMsg.userIconUrl | setFileRoot" :size="40"></jaso-avatar>-->
              <!--<el-input type="textarea" maxlength="300" :rows="3"  v-model="desc" @input="descInput" placeholder="发表你的看法吧" style="width: 280px;float: right;margin-left: 20px;margin-top: 30px"></el-input>-->
              <el-input type="textarea" maxlength="300" :rows="3"  v-model="desc" @input="descInput" placeholder="发表你的看法吧" style="width: 340px;margin-top: 30px"></el-input>
              <span style="margin-left: -55px;margin-top: 85px;z-index: 999;color: #909399">{{remnant}}/300</span>
            </div>
            <!--<div style="width: 42px;float: left;margin-top: -20px">{{userMsg.realName}}</div>-->
            <el-button type="primary" @click="addNewComment" :disabled="commentDisabled" style="float:right;margin-top: 10px;">发表评论</el-button>
          </div>
          <div class="user-info flex-row" v-for="(item, index) in commentList.data" :key="index" style="margin-top: 10px;margin-bottom: 20px">
            <jaso-avatar :avatar="item.commentUserIcon | setFileRoot" :size="48"></jaso-avatar>
            <div class="sub-info flex-column" style="margin-left: 10px">
              <div class="username" style="margin-top: 5px">{{ item.commentUserName }}</div>
              <div class="username" style="margin-top: 5px">{{ item.commentContent }}</div>
              <div class="date" style="color: #909399;margin-top: 5px">{{ item.createDate }}</div>
            </div>
          </div>
          <div class="pagination-container" v-if="totalCommentNumber > 0">
            <el-pagination
              small
              @pager-count="3"
              @current-change="handleCommentCurrentChange"
              :current-page="commentList.currentPage"
              :page-size="commentList.numberPerPage"
              layout="total, prev, pager, next, jumper"
              :total="totalCommentNumber">
            </el-pagination>
          </div>
        </div>
        <div v-if="!isComment">
          <div class="user-info flex-row" v-for="(item, index) in AwardTicketList.data" :key="index"
               style="margin-top: 10px;margin-bottom: 10px">
            <jaso-avatar :avatar="item.replyUserIcon | setFileRoot" :size="48"></jaso-avatar>
            <div class="sub-info flex-column" style="margin-left: 10px">
              <div class="username" style="margin-left: 10px;margin-top: 5px"><span style="color: red">整改人：</span>{{ item.replyUserName }}
              </div>
              <div class="username"
                   style="margin-left: 10px;margin-top: 5px;width: 280px;white-space:normal;word-break:break-all;word-wrap:break-word;">
                <span>当前进度：</span>{{ item.schedule+'%' }}
              </div>
              <div style="margin-left: 10px;margin-top: 5px">{{item.replyContent}}</div>
              <el-row style="margin-left: 10px;" v-if="item.pictures !== null">
                <el-col :span="8" v-for="(url,index) in item.pictures" :key="index" style="margin-bottom: 10px">
                  <el-card :body-style="{ padding: '0px' }" style="height: 80px;width: 80px;margin-top: 10px">
                    <img :src="url | setFileRoot" class="image" style="height: 80px;width: 80px">
                  </el-card>
                </el-col>
              </el-row>
              <div class="date" style="margin-left: 10px;color: #909399;margin-top: 5px">{{ item.createDate }}</div>
            </div>
          </div>
          <div v-if="AwardTicketList.currentPage >= AwardTicketList.totalPage && detailsList.status === 2"
               style="margin-top: 10px;">
            <section style="float: left;margin-top: 2px">复检评分：</section>
            <el-rate disabled show-text v-model="detailsList.score" style="float: left;"></el-rate>
          </div>
          <el-button @click="awardTicket"
                     v-if="AwardTicketList.currentPage >= AwardTicketList.totalPage && detailsList.status === 0"
                     :disabled="!detailsList.rectifyUserIds.indexOf(userInfo.id) > -1"
                     type="primary" style="float: right;margin-bottom: 20px;margin-top: 5px">
            {{detailsList.rectifyUserIds.indexOf(userInfo.id) > -1 ? '整改回复' : '待整改人整改'}}
          </el-button>
          <el-button @click="awardTicket"
                     v-if="AwardTicketList.currentPage >= AwardTicketList.totalPage && detailsList.status === 1"
                     :disabled="detailsList.createUserId !== userInfo.id "
                     type="primary" style="float: right;margin-bottom: 20px;margin-top: -5px">
            {{detailsList.createUserId === userInfo.id ? '复检回复' : '待复检人复检'}}
          </el-button>
          <!--<el-button @click="awardTicket"-->
                     <!--v-if="AwardTicketList.currentPage >= AwardTicketList.totalPage && detailsList.status === 1"-->
                     <!--type="primary" style="float: right;margin-bottom: 20px;margin-top: -5px">-->
            <!--{{ userInfo.id === detailsList.createUserId-->
            <!--? '复检回复'-->
            <!--: ' 待检查人复检'}}-->
          <!--</el-button>-->
        </div>
        <div v-if="!isComment">
          <div class="pagination-container" v-if="totalSituationNumber > 0" style="margin-top: 40px">
            <el-pagination
              small
              @pager-count="3"
              @current-change="handleSituationCurrentChange"
              :current-page="AwardTicketList.currentPage"
              :page-size="AwardTicketList.numberPerPage"
              layout="total, prev, pager, next, jumper"
              :total="totalSituationNumber">
            </el-pagination>
          </div>
          <div v-if="totalSituationNumber === 0" style="margin-top: 10px;color: #909399;">暂无整改情况</div>
        </div>
      </el-dialog>
      <!-- 整改/复检回复 -->
      <el-dialog :visible.sync="dialogFormVisible"
                 :close-on-click-modal="false"
                 @close="resetForm"
                 :show-close="false"
                 width="380px">
        <div slot="title" style="font-weight: bolder;">
          <span>{{detailsList.status === 0 ? '整改回复' : '复检回复'}}</span>
        </div>
        <hr size="0.1px" style="margin-top: -20px; margin-bottom: 20px;color: #F5F5F5;">
        <div v-if="detailsList.status === 0">
          <div>
            <span>进度：</span>
            <el-slider v-model="addRectify.schedule" style="width: 85%;"></el-slider>
            <span style="float: right;margin-top: -27px">{{addRectify.schedule+ '%'}}</span>
          </div>
          <div>整改情况：</div>
          <el-input type="textarea" v-model="addRectify.content" placeholder="请输入整改情况：" style="margin-top: 10px;margin-bottom: 10px"></el-input>
          <div>现场图片：</div>
          <div class="upload-file-wrapper flex-column" style="margin-top: 10px;margin-bottom: 10px;">
            <div class="flex-row">
              <el-button type="primary" style="margin-right: 15px;">
                <input type="file" ref="picInput" multiple accept="image/*" @change="handleFileChange" />
                <span>点击上传</span>
              </el-button>
              <span>{{ addRectify.fileList.length > 0 ? `${addRectify.fileList.length}个文件` : '' }}</span>
            </div>
            <div style="font-size: 12px;">只能上传jpg/png文件，且不超过500kb</div>
          </div>
        </div>
        <div v-if="detailsList.status === 1">
          <div>验收结果：</div>
          <el-select v-model="addRecheck.state" style="margin-top: 10px;margin-bottom: 10px">
            <el-option value="0" label="不通过"></el-option>
            <el-option value="1" label="通过"></el-option>
          </el-select>
          <div>评分：</div>
          <el-rate show-text v-model="addRecheck.score" style="margin-top: 10px"></el-rate>
        </div>
        <div slot="footer">
          <el-button @click="resetForm">取消</el-button>
          <el-button type="primary" @click="handleRecheckSave">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getQualityRectificationList, getReplyList, getCommentList,
  addComment, qualityCheck, qualityCheckAgain } from '@/api/quality';
// import { questionTicketTypeList } from '@/filters';
// import { showGallery } from '@/utils/utils';

export default {
  name: 'QualityRectify',
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
  },
  data() {
    const { params: { id } } = this.$route;
    return {
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 5,
        projectId: id,
        start: null,
        end: null,
        find: null,
        status: null,
        qualityType: 0,
      },
      lsData: {
        keyword: null,
        status: null,
        betDate: null,
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
      listData: null,
      totalNumber: 0,
      dialogFormVisible: false,
      dialogControlListFormVisible: false,
      detailsList: {
        checkList: '',
        nature: [],
        pictures: [],
      },
      defaultActive: '0',
      isComment: false,
      AwardTicketList: [],
      totalCommentNumber: 0,
      totalSituationNumber: 0,
      remnant: 0,
      desc: '',
      commentDisabled: false,
      commentList: [],
      addRectify: {
        qualityId: null,
        schedule: 0,
        content: null,
        fileList: [],
      },
      addRecheck: {
        state: '0',
        qualityId: null,
        score: 0,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getQualityRectificationList(this.listQuery).then((data) => {
        if (data) {
          data.data.forEach((res) => {
            res.finishedDate = res.finishedDate.substring(0, 10);
          });
        }
        this.listData = data.data;
        this.totalNumber = data.totalNumber;
        this.listLoading = false;
      });
    },
    searchKeyWord() {
      if (this.lsData.keyword !== null && this.lsData.keyword) {
        this.listQuery.find = this.lsData.keyword;
      } else {
        this.listQuery.find = null;
      }
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    searchStatus(e) {
      if (e === null) {
        this.listQuery.status = null;
      } else {
        this.listQuery.status = e;
      }
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    searchBetDate() {
      if (this.lsData.betDate !== null && this.lsData.betDate) {
        this.listQuery.start = `${this.lsData.betDate[0].getFullYear()}-${this.lsData.betDate[0].getMonth() + 1}-${this.lsData.betDate[0].getDate()} 00:00:00`;
        this.listQuery.end = `${this.lsData.betDate[1].getFullYear()}-${this.lsData.betDate[1].getMonth() + 1}-${this.lsData.betDate[1].getDate()} 23:59:59`;
      } else {
        this.listQuery.start = null;
        this.listQuery.end = null;
      }
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.getList();
    },
    awardTicket() {
      this.addRectify.qualityId = this.detailsList.id;
      this.dialogFormVisible = true;
    },
    handleFileChange(e) {
      const files = e.target.files;
      this.addRectify.fileList = files;
    },
    // 提交整改/复检回复
    handleRecheckSave() {
      if (this.detailsList.status === 0) {
        if (this.addRectify.content === null || this.addRectify.content === ''
            || this.addRectify.schedule < 1) {
          if (this.addRectify.schedule < 1) {
            this.$message({
              type: 'error',
              message: '进度不得为零！',
            });
          } else {
            this.$message({
              type: 'error',
              message: '整改情况不得为空！',
            });
          }
        } else {
          qualityCheck(this.addRectify).then((data) => {
            if (data) {
              this.$message({
                type: 'success',
                message: '整改回复成功！',
              });
              this.getList();
              if (this.addRectify.schedule === 100) {
                this.detailsList.status = 1;
              }
              this.updateSituationList(this.AwardTicketList.currentPage);
              this.resetForm();
            }
          });
        }
      } else {
        // 复检回复
        if (this.addRecheck.score === 0) {
          this.$message({
            type: 'error',
            message: '请进行评分！',
          });
        } else {
          qualityCheckAgain(this.addRecheck).then((data) => {
            if (data) {
              this.$message({
                type: 'success',
                message: '复检回复成功！',
              });
              this.updateSituationList(this.AwardTicketList.currentPage);
              this.resetForm();
            }
          });
        }
      }
    },
    resetForm() {
      this.addRecheck = {
        state: '0',
        qualityId: null,
        score: 0,
      };
      this.addRectify = {
        sliderValue: 0,
        condition: null,
        fileList: [],
      };
      this.dialogFormVisible = false;
    },
    resetControlListForm() {
      // this.$refs.dialogControlListForm.resetFields();
      this.commentList.currentPage = 1;
      this.detailsList = {
        checkList: '',
        nature: [],
        pictures: [],
      };
      this.isComment = false;
      this.defaultActive = '0';
      this.dialogControlListFormVisible = false;
    },
    // 更新评论列表
    updateCommentList(pageIndex) {
      getCommentList({ replyType: 1, aboutId: this.detailsList.id, pageIndex, pageSize: 5 }).then((data) => {
        if (data) {
          this.commentList = data;
          this.totalCommentNumber = data.totalNumber;
          this.commentDisabled = false;
        }
      });
    },
    // 更新整改情况列表
    updateSituationList(pageIndex) {
      const partm = {
        replyType: 0,
        aboutId: this.detailsList.id,
        pageIndex,
        pageSize: 3,
      };
      getReplyList(partm).then((data) => {
        if (data) {
          this.AwardTicketList = data;
          this.totalSituationNumber = data.totalNumber;
        }
      });
    },
    details(item) {
      this.detailsList = item;
      this.addRecheck.qualityId = item.id;
      this.updateCommentList(1);
      this.updateSituationList(1);
      this.dialogControlListFormVisible = true;
    },
    handleSelect(e) {
      this.defaultActive = e;
      if (this.defaultActive === '1') {
        this.isComment = true;
      } else {
        this.isComment = false;
      }
    },
    descInput() {
      const txtVal = this.desc.length;
      this.remnant = txtVal;
    },
    // 发表评论
    addNewComment() {
      if (this.remnant === 0) {
        this.$message({
          type: 'warning',
          message: '评论内容不得为空！',
        });
      } else {
        this.commentDisabled = true;
        addComment({ replyType: 1, aboutId: this.detailsList.id, commentContent: this.desc }).then((data) => {
          if (data) {
            this.remnant = 0;
            this.desc = '';
            this.updateCommentList(this.commentList.currentPage);
          }
        });
      }
    },
    handleSituationCurrentChange(val) {
      this.updateSituationList(val);
    },
    handleCommentCurrentChange(val) {
      this.updateCommentList(val);
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
