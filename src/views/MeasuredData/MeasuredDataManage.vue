<template>
  <div>
    <breadcrumb/>
    <div>
      <el-table :data="dataList">
        <el-table-column align="center" prop="checkSite" label="检查部位"/>
        <el-table-column align="center" prop="checkLists" label="检查项">
          <template slot-scope="scope">
            <div>
              <el-tooltip class="item" effect="dark" :content="scope.row.checkLists" placement="top">
                <div style="width:100px;float:left;text-align: right;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  {{scope.row.checkLists}}
                </div>
              </el-tooltip>
              <el-tag v-if="scope.row.status === 0" type="danger">待指派</el-tag>
              <el-tag v-if="scope.row.status === 1" type="warning">进行中</el-tag>
              <el-tag v-if="scope.row.status === 2" type="success">待销项</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="rectifyUser" label="整改人"/>
        <el-table-column align="center" prop="createDate" label="创建时间"/>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="openViewData(scope.row)"
              type="text" size="small"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--查看详情-->
      <el-dialog :visible.sync="dialogControlListFormVisible"
                 @close="resetControlListForm"
                 :close-on-click-modal="false"
                 :show-close="false"
                 width="380px"
      >
        <div slot="title" style="font-weight: bolder;">
          <span>爆点详情</span>
          <el-button type="text" style="float: right" @click="resetControlListForm">关闭</el-button>
        </div>
        <hr size="0.1px" style="margin-top: -20px; margin-bottom: 20px;color: #F5F5F5;">
        <el-alert
          title="检查单概览"
          type="info"
          :closable="false"
          show-icon style="margin-top: 10px">
        </el-alert>
        <el-row :gutter="20" style="margin-top: 10px;">
          <el-col :span="6"><div style="text-align: right;">检查部位：</div></el-col>
          <el-col :span="16">{{queryData.checkSite}}</el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px;">
          <el-col :span="6"><div style="text-align: right;">检查日期：</div></el-col>
          <el-col :span="16"><div>{{queryData.checkDate}}</div></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px;">
          <el-col :span="6"><div style="text-align: right;">检查人：</div></el-col>
          <el-col :span="16"><div>{{queryData.checkUser}}</div></el-col>
        </el-row>
        <section style="margin-top: 10px;font-weight: bold">检查项</section>
        <div  style="margin-top: 10px;background-color: #F5F7FA">
          <div v-if="queryData.checkLists && queryData.checkLists !== ''">
            {{queryData.checkLists}}
          </div>
          <div v-if="!queryData.checkLists || queryData.checkLists === ''">暂无检查项数据</div>
        </div>
        <section style="margin-top: 10px;font-weight: bold">问题描述</section>
        <div style="margin-top: 10px;background-color: #F5F7FA">
          <el-button type="success" v-if="queryData.status === 0" style="margin-top: 10px;margin-left: 10px">待指派</el-button>
          <el-button type="warning" v-if="queryData.status === 1" style="margin-top: 10px;margin-left: 10px">进行中</el-button>
          <el-button type="danger"  v-if="queryData.status === 2"  style="margin-top: 10px;margin-left: 10px">待销项</el-button>
          <div style="margin-top: 10px;margin-left: 10px">
            {{queryData.detail}}
          </div>
          <el-row style="margin-left: 10px;" v-if="queryData.files !== null">
            <el-col :span="8" v-for="(url,index) in queryData.files" :key="index" style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" style="height: 80px;width: 80px;margin-top: 10px">
                <img :src="url | setFileRoot" class="image" style="height: 80px;width: 80px">
              </el-card>
            </el-col>
          </el-row>
          <section v-if="!queryData.files" style="text-align: center;margin-bottom: 10px">暂无图片</section>
        </div>
        <el-row :gutter="20" style="margin-top: 10px;">
          <el-col :span="6"><div style="text-align: right;">整改人：</div></el-col>
          <el-col :span="16">{{queryData.rectifyUser}}</el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px;">
          <el-col :span="6"><div style="text-align: right;">完成日期：</div></el-col>
          <el-col :span="16"><div>{{queryData.finishedDate}}</div></el-col>
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
          <div class="user-info flex-row" v-for="(item, index) in AwardTicketList.data" :key="index" style="margin-top: 10px;margin-bottom: 10px">
            <jaso-avatar :avatar="item.replyUserIcon | setFileRoot" :size="48"></jaso-avatar>
            <div class="sub-info flex-column" style="margin-left: 10px">
              <div class="username" style="margin-left: 10px;margin-top: 5px"><span style="color: red">整改人：</span>{{ item.replyUserName }}</div>
              <div class="username" style="margin-left: 10px;margin-top: 5px;width: 280px;white-space:normal;word-break:break-all;word-wrap:break-word;">
                <span>当前进度：</span>{{ item.schedule+'%' }}
              </div>
              <div  style="margin-left: 10px;margin-top: 5px">{{item.replyContent}}</div>
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
          <div v-if="AwardTicketList.currentPage >= AwardTicketList.totalPage && queryData.status === 2" style="margin-top: 10px;">
            <section style="float: left;margin-top: 2px">复检评分：</section>
            <el-rate disabled show-text v-model="queryData.score" style="float: left;"></el-rate>
          </div>
          <!--<el-button  @click="awardTicket"  v-if="AwardTicketList.currentPage >= AwardTicketList.totalPage && queryData.status !== 2" type="primary" style="float: right;margin-bottom: 20px;margin-top: -5px">-->
          <!--{{queryData.status === 0 ? '整改回复' : '复检回复'}}-->
          <!--</el-button>-->
          <el-button @click="awardTicket"
                     v-if="AwardTicketList.currentPage >= AwardTicketList.totalPage && queryData.status === 0"
                     :disabled="queryData.rectifyUser !== userInfo.realName "
                     type="primary" style="float: right;margin-bottom: 20px;margin-top: -5px">
            {{queryData.rectifyUser === userInfo.realName ? '整改回复' : '待整改人整改'}}
          </el-button>
          <el-button @click="awardTicket"
                     v-if="AwardTicketList.currentPage >= AwardTicketList.totalPage && queryData.status === 1"
                     :disabled="queryData.checkUser !== userInfo.realName "
                     type="primary" style="float: right;margin-bottom: 20px;margin-top: -5px">
            {{queryData.checkUser === userInfo.realName ? '复检回复' : '待复检人复检'}}
          </el-button>
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
                 @close="resetForm"
                 :close-on-click-modal="false"
                 :show-close="false"
                 width="380px">
        <div slot="title" style="font-weight: bolder;">
          <span>{{queryData.status === 0 ? '整改回复' : '复检回复'}}</span>
        </div>
        <hr size="0.1px" style="margin-top: -20px; margin-bottom: 20px;color: #F5F5F5;">
        <div v-if="queryData.status === 0">
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
        <div v-if="queryData.status === 1">
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
import { addComment, getCommentList,
  getReplyList } from '@/api/quality';
import { getMeasuredProblemByProjectId, measuredProblemCheck, measuredProblemCheckAgain } from '@/api/measuredDataManage';

export default {
  name: 'MeasuredDataManage',
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
  },
  data() {
    const { params: { id } } = this.$route;
    return {
      dialogControlListFormVisible: false,
      isComment: false,
      defaultActive: '0',
      totalCommentNumber: 0,
      queryList: {
        projectId: id,
      },
      dataList: [],
      listData: null,
      totalNumber: 0,
      dialogFormVisible: false,
      queryData: {
        checkList: '',
        nature: [],
        pictures: [],
      },
      AwardTicketList: [],
      totalSituationNumber: 0,
      remnant: 0,
      desc: '',
      commentDisabled: false,
      commentList: [],
      addRectify: {
        measuredId: null,
        schedule: 0,
        content: null,
        fileList: [],
      },
      addRecheck: {
        state: '0',
        measuredId: null,
        score: 0,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getMeasuredProblemByProjectId(this.queryList).then((res) => {
        if (res) {
          this.dataList = res.data;
        }
      });
    },
    awardTicket() {
      this.addRectify.measuredId = this.queryData.id;
      this.dialogFormVisible = true;
    },
    handleSituationCurrentChange(val) {
      this.updateSituationList(val);
    },
    openViewData(item) {
      this.queryData = item;
      this.addRecheck.measuredId = item.id;
      this.updateCommentList(1);
      this.updateSituationList(1);
      this.dialogControlListFormVisible = true;
    },
    resetControlListForm() {
      this.dialogControlListFormVisible = false;
    },
    handleSelect(e) {
      this.defaultActive = e;
      this.isComment = this.defaultActive === '1';
    },
    handleCommentCurrentChange(val) {
      this.updateCommentList(val);
    },
    // 更新评论列表
    updateCommentList(pageIndex) {
      getCommentList({ replyType: 2, aboutId: this.queryData.id, pageIndex, pageSize: 5 }).then((data) => {
        if (data) {
          this.commentList = data;
          this.totalCommentNumber = data.totalNumber;
          this.commentDisabled = false;
        }
      });
    },
    descInput() {
      this.remnant = this.desc.length;
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
        addComment({ replyType: 2, aboutId: this.queryData.id, commentContent: this.desc }).then((data) => {
          if (data) {
            this.remnant = 0;
            this.desc = '';
            this.updateCommentList(this.commentList.currentPage);
          }
        });
      }
    },
    handleFileChange(e) {
      const files = e.target.files;
      this.addRectify.fileList = files;
    },
    // 更新整改情况列表
    updateSituationList(pageIndex) {
      const partm = {
        replyType: 2,
        aboutId: this.queryData.id,
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
    resetForm() {
      this.addRecheck = {
        state: '0',
        measuredId: null,
        score: 0,
      };
      this.addRectify = {
        sliderValue: 0,
        condition: null,
        fileList: [],
      };
      this.dialogFormVisible = false;
    },
    // 提交整改/复检回复
    handleRecheckSave() {
      if (this.queryData.status === 0) {
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
          measuredProblemCheck(this.addRectify).then((data) => {
            if (data) {
              this.$message({
                type: 'success',
                message: '整改回复成功！',
              });
              this.getList();
              if (this.addRectify.schedule === 100) {
                this.queryData.status = 1;
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
          measuredProblemCheckAgain(this.addRecheck).then((data) => {
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
  },
};
</script>

<style scoped>

</style>
