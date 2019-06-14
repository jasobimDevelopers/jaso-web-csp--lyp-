
<template>
  <div>
    <breadcrumb>
      <el-button class="filter-item" type="text"  @click="theNewCheck">新增检查</el-button>
    </breadcrumb>

    <div class="app-container">
      <!-- 搜索切换 -->
      <div class="filter-wrapper">
        <el-form ref="filterForm" label-position="right" label-width="100px" style="display: flex;margin-top: 10px">
          <el-form-item label="关键字查找">
            <el-input v-model="lsData.keyword" @blur="searchKeyWord" clearable placeholder="请输入检查项、检查人查询" style="width: 200px;"/>
          </el-form-item>
          <el-form-item label="检查单状态">
            <el-select v-model="lsData.status" @change="searchStatus" placeholder="请选择" filterable >
              <el-option
                label="全部"
                :value="null">
              </el-option>
              <el-option
                label="未发整改"
                :value="0">
              </el-option>
              <el-option
                label="已发整改"
                :value="1">
              </el-option>
              <el-option
                label="无需整改"
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
          <el-table-column align="center" label="性质" prop="natureId">
            <template slot-scope="scope">
              <div v-for="(item, i) in scope.row.natureId" :key="i">{{ item }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="检查项" prop="checkList" width="200">
            <template slot-scope="scope">
              <div>
                <el-tooltip class="item" effect="dark" :content="scope.row.checkList" placement="top">
                  <div style="width:80px;float:left;text-align: right;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    <!--{{scope.row.checkContent.substring(0, 2)+ '...'}}-->
                    {{scope.row.checkList}}
                  </div>
                </el-tooltip>
                <el-tag v-if="scope.row.status === 0" type="danger">未发整改</el-tag>
                <el-tag v-if="scope.row.status === 1" type="warning">已发整改</el-tag>
                <el-tag v-if="scope.row.status === 2" type="success">无需整改</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="检查人" prop="createUserName"></el-table-column>
          <el-table-column align="center" label="创建时间" prop="createDate"></el-table-column>
          <el-table-column align="center" label="操作" prop="">
            <template slot-scope="scope">
              <el-button type="text" @click="details(scope.row)">查看</el-button>
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
      <!-- 新增检查 -->
      <el-dialog
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        @close="resetForm"
        width="360px"
      >
        <div slot="title" style="font-weight: bolder">
          新增检查
        </div>
        <el-form :rules="rules" ref="dialogForm" :model="addCheck" :disabled="disableEdit" label-position="top">
          <el-form-item label="检查性质：" prop="properties">
            <el-select multiple  v-model="addCheck.properties" placeholder="请选择检查性质" style="width: 100%">
              <el-option v-for="(item, i) in properties"
                         :key="i"
                         :label="item.content"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期：" prop="checkDate">
            <el-date-picker
              placeholder="请选择日期"
              v-model="addCheck.checkDate"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="检查人：" prop="checkPeople">
            <el-input label="请输入检查人" v-model="addCheck.checkPeople" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="检查项：" prop="checkItem">
            <el-cascader
              placeholder="请选择检查项"
              :options="checkItem"
              filterable
              change-on-select
              :show-all-levels="false"
              style="width: 100%"
              v-model="addCheck.checkItem"
              @change="editCheckItem"/>
          </el-form-item>
          <el-form-item label="检查结果：" prop="checkResult">
            <el-input
              v-model="addCheck.checkResult"
              type="textarea"
              :rows="3"
              placeholder="请输入检查结果">
            </el-input>
          </el-form-item>
          <el-form-item label="现场图片：" prop="fileList">
            <div class="upload-file-wrapper flex-column">
              <div class="flex-row">
                <el-button type="primary" style="margin-right: 15px;">
                  <input type="file" ref="picInput" multiple accept="image/*" @change="handleFileChange" />
                  <span>点击上传</span>
                </el-button>
                <span>{{ addCheck.fileList.length > 0 ? `${addCheck.fileList.length}个文件` : '' }}</span>
              </div>
              <div style="font-size: 12px;">只能上传jpg/png文件，且不超过500kb</div>
            </div>
          </el-form-item>
          <el-form-item label="指定人员：" prop="designatedPersonnel">
            <el-select multiple placeholder="请选择指定人员" v-model="addCheck.designatedPersonnel" style="width: 100%">
              <el-option
                v-for="item in designatedPersonnel"
                :key="item.id"
                :label="item.realName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="整体情况：" prop="overallSituation">
            <el-select placeholder="请选择整体情况"
                       v-model="addCheck.overallSituation"
                       style="width: 100%"
                       @change="editOverallSituation">
              <el-option label="通过" value="0"></el-option>
              <el-option label="口头警告" value="1"></el-option>
              <el-option label="书面整改" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button v-if="isShowRectification" @click="rectificationSheet" :disabled="handleSaveClick" type="primary" style="float: left">生成整改单</el-button>
          <el-button @click="resetForm">{{$t('btn.cancel')}}</el-button>
          <el-button type="primary" @click="handleSave" :disabled="handleSaveClick">{{$t('btn.comfirm')}}</el-button>
        </div>
      </el-dialog>
      <!-- 新增检查项子集 -->
      <el-dialog  :visible.sync="dialogSubsetFormVisible"
                  @close="closeSubset"
                  :close-on-click-modal="false"
                  width="360px">
        <div slot="title" style="font-weight: bolder">新增子集</div>
        <section style="margin-bottom: 10px">检查项名称：</section>
        <el-input v-model="addNewSubset"  style="margin-bottom: 10px"></el-input>
        <span style="color: #8492a6;">插入的位置为最终选中的层级</span>
        <div slot="footer">
          <el-button @click="closeSubset">{{$t('btn.cancel')}}</el-button>
          <el-button type="primary" @click="handleSubsetSave">{{$t('btn.comfirm')}}</el-button>
        </div>
      </el-dialog>
      <!-- 检查单详情 -->
      <el-dialog :visible.sync="dialogControlListFormVisible"
                 @close="resetControlListForm"
                 :close-on-click-modal="false"
                 :show-close="false"
                 width="380px"
      >
        <div slot="title" style="font-weight: bolder;">
          <span>安全检查单详情</span>
          <el-button type="text" style="float: right" @click="resetControlListForm">关闭</el-button>
          <el-dropdown placement="bottom-start" @command="selectCommand" style="float: right; margin-right: 10px">
            <el-button type="text">操作<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <!--<el-dropdown-item command="RewardsAndPunishments">奖惩</el-dropdown-item>-->
              <!--<el-dropdown-item command="IssuedAndCorrected">下发整改</el-dropdown-item>-->
              <!--<el-dropdown-item command="TheRectificationRecord">整改记录</el-dropdown-item>-->
              <el-dropdown-item v-for="item in commandList" :key="item.value" :command="item.value">{{item.lable}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
        <el-alert
          title="相关记录"
          type="info"
          :closable="false"
          show-icon style="margin-top: 10px">
        </el-alert>
        <el-menu :default-active="defaultActive" mode="horizontal"
                 @select="handleSelect" background-color="#FFFFFF" text-color="#303133"
                 active-text-color="#1989FA" style="margin-top: 10px">
          <el-menu-item index="0" style="width: 170px;height: 40px;line-height: 40px;text-align: center;border: 1px solid #DCDFE6;">评论</el-menu-item>
          <el-menu-item index="1" style="width: 170px;height: 40px;line-height: 40px;text-align: center;border: 1px solid #DCDFE6;border-left:none">奖惩记录</el-menu-item>
        </el-menu>
        <div v-if="!isComment">
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
        <div v-if="isComment">
          <div class="user-info flex-row" v-for="(item, index) in AwardTicketList" :key="index" style="margin-top: 10px;margin-bottom: 20px">
            <jaso-avatar :avatar="item.userIcon | setFileRoot" :size="48"></jaso-avatar>
            <div class="sub-info flex-column" style="margin-left: 10px">
              <div class="username" style="margin-top: 5px">{{ item.createUserName }}</div>
              <div class="username" style="margin-top: 5px;width: 280px;white-space:normal;word-break:break-all;word-wrap:break-word;">
                {{ item.remark }}
                <el-button type="text" @click="rewardsPunishmentsDetails(item)">点击查看</el-button>
              </div>
              <div class="date" style="color: #909399;margin-top: 5px">{{ item.createDate }}</div>
            </div>
          </div>
          <div v-if="AwardTicketList.length === 0" style="color: #909399;margin-top: 10px">暂无奖惩数据</div>
        </div>
      </el-dialog>
      <!-- 新增安全整改单 -->
      <el-dialog  :visible.sync="rectificationSheetFormVisible"
                  @close="closeRectificationSheet"
                  :close-on-click-modal="false"
                  width="360px">
        <div slot="title" style="font-weight: bolder">新增安全整改单</div>
        <el-form :rules="rectificationRules" ref="dialogRectificationSheetForm" :model="addRectification" :disabled="disableEdit" label-position="top">
          <el-form-item label="检查项：">
            <div  style="margin-top: 10px;background-color: #F5F7FA">
              <div v-if="addRectification.checkList !== ''" v-for="(item, index) in addRectification.checkList.split('；')" :key="index">
                {{item}}
              </div>
              <div v-if="addRectification.checkList === ''">暂无检查项数据</div>
            </div>
          </el-form-item>
          <el-form-item label="检查结果：">
            <div  style="margin-top: 10px;background-color: #F5F7FA">
              <div>{{addRectification.checkContent}}</div>
              <div v-if="addRectification.checkContent === ''">暂无检查结果数据</div>
            </div>
          </el-form-item>
          <el-form-item label="现场图片：">
            <el-row style="margin-left: 10px;" v-if="addRectification.pictures !== null">
              <el-col :span="8" v-for="(url,index) in addRectification.pictures" :key="index" style="margin-bottom: 10px">
                <el-card :body-style="{ padding: '0px' }" style="height: 80px;width: 80px;margin-top: 10px">
                  <img :src="url | setFileRoot" class="image" style="height: 80px;width: 80px">
                </el-card>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="情况程度：" prop="level">
            <el-select v-model="addRectification.level" style="width: 100%;">
              <el-option label="一般" :value="0" />
              <el-option label="重要" :value="1" />
              <el-option label="紧急" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="整改要求：" prop="requirements">
            <el-input placeholder="请输入整改要求" v-model="addRectification.requirements" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="整改人：" prop="rectificationPeople">
            <el-select multiple placeholder="请选择整改人" v-model="addRectification.rectificationPeople" style="width: 100%">
              <el-option
                v-for="item in designatedPersonnel"
                :key="item.id"
                :label="item.realName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="抄送人：" prop="copyPeople">
            <el-select multiple placeholder="请选择抄送人" v-model="addRectification.copyPeople" style="width: 100%">
              <el-option
                v-for="item in designatedPersonnel"
                :key="item.id"
                :label="item.realName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="完成日期：" prop="completionDate">
            <el-date-picker
              placeholder="请选择日期"
              v-model="addRectification.completionDate"
              value-format="yyyy-MM-dd"
              style="width: 100%"/>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="closeRectificationSheet">{{$t('btn.cancel')}}</el-button>
          <el-button type="primary" @click="handleRectificationSheetSave">{{$t('btn.comfirm')}}</el-button>
        </div>
      </el-dialog>
      <!-- 新增奖惩 -->
      <el-dialog :visible.sync="dialogOfAddFormVisible"
                 @close="closeAddForm"
                 :close-on-click-modal="false"
                 width="420px"
                 :show-close="false">
        <div slot="title" style="font-weight: bolder">新增奖惩</div>
        <!--:rules="rules"-->
        <el-form :rules="rewardsRules" ref="dialogOfAddForm" :model="dataList" :disabled="disableEdit" label-position="top">
          <el-form-item label="奖惩类型：">
            <el-select v-model="dataList.awardType" @change="editType" style="width: 100%">
              <el-option :key="0" label="奖励" :value="0"></el-option>
              <el-option :key="1" label="处罚" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="rewardOrPunishment.isMadeUpOf">
            <!--<section>{{rewardOrPunishment.isMadeUpOf}}</section>-->
            <div  style="margin-top: 10px;background-color: #F5F7FA">
              <div v-if="detailsList.checkList !== ''" v-for="(item, index) in detailsList.checkList.split('；')" :key="index">
                {{item}}
              </div>
              <div v-if="detailsList.checkList === ''">暂无检查项数据</div>
            </div>
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
          <el-form-item label="相关图片：" prop="fileList" v-model="dataList.fileList" >
            <div class="upload-file-wrapper flex-column">
              <div class="flex-row">
                <el-button type="primary" style="margin-right: 15px;">
                  <input type="file" ref="picInput" multiple accept="image/*" @change="handleDataListFileChange" />
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
        :visible.sync="dialogDetailsFormVisible"
        :show-close="false"
        :close-on-click-modal="false"
        width="420px"
      >
        <div slot="title" style="font-weight: bolder">
          {{ dialogTitle }}
          <div style="float: right;">
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
      <!-- 整改记录 -->
      <el-dialog :close-on-click-modal="false" :visible.sync="dialogRecordFormVisible" @close="closeRecordForm" width="380px">
        <div slot="title" style="font-weight: bolder">整改记录</div>
        <div>
          <el-row :gutter="20" style="margin-top: 10px;margin-left: -10px">
            <el-col :span="6"><div style="text-align: right;">整改要求：</div></el-col>
            <el-col :span="16"><div>{{rectificationList.rectificationContent}}</div></el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;margin-left: -10px">
            <el-col :span="6"><div style="text-align: right;">整改人：</div></el-col>
            <el-col :span="16">
              <div v-for="item in rectificationList.rectifyUser" :key="item">
                {{item}}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;margin-left: -10px">
            <el-col :span="6"><div style="text-align: right;">抄送人：</div></el-col>
            <el-col :span="16">
              <div v-for="item in rectificationList.copyUser" :key="item">
                {{item}}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;margin-left: -10px">
            <el-col :span="6"><div style="text-align: right;">完成日期：</div></el-col>
            <el-col :span="16"><div>{{rectificationList.finishedDate}}</div></el-col>
          </el-row>
          <el-alert
            title="相关记录"
            type="info"
            :closable="false"
            show-icon style="margin-top: 10px">
          </el-alert>
          <el-menu :default-active="defaultActive2" mode="horizontal"
                   @select="handleSelect2" background-color="#FFFFFF" text-color="#303133"
                   active-text-color="#1989FA" style="margin-top: 10px">
            <el-menu-item index="0" style="width: 170px;height: 40px;line-height: 40px;text-align: center;border: 1px solid #DCDFE6;">整改情况</el-menu-item>
            <el-menu-item index="1" style="width: 170px;height: 40px;line-height: 40px;text-align: center;border: 1px solid #DCDFE6;border-left:none">评论</el-menu-item>
          </el-menu>
          <div v-if="isComment2">
            <section style="margin-top: 10px;font-weight: bold">
              评论共({{totalCommentNumber2}})条
            </section>
            <div style="height: 150px; margin-top: -20px">
              <div class="user-info flex-row" style="float: left;">
                <!--<jaso-avatar :avatar="userMsg.userIconUrl | setFileRoot" :size="40"></jaso-avatar>-->
                <!--<el-input type="textarea" maxlength="300" :rows="3"  v-model="desc" @input="descInput" placeholder="发表你的看法吧" style="width: 280px;float: right;margin-left: 20px;margin-top: 30px"></el-input>-->
                <el-input type="textarea" maxlength="300" :rows="3"  v-model="desc2" @input="descInput2" placeholder="发表你的看法吧" style="width: 340px;margin-top: 30px"></el-input>
                <span style="margin-left: -55px;margin-top: 85px;z-index: 999;color: #909399">{{remnant2}}/300</span>
              </div>
              <!--<div style="width: 42px;float: left;margin-top: -20px">{{userMsg.realName}}</div>-->
              <el-button type="primary" @click="addNewComment2" :disabled="commentDisabled2" style="float:right;margin-top: 10px;">发表评论</el-button>
            </div>
            <div class="user-info flex-row" v-for="(item, index) in commentList2.data" :key="index" style="margin-top: 10px;margin-bottom: 20px">
              <jaso-avatar :avatar="item.commentUserIcon | setFileRoot" :size="48"></jaso-avatar>
              <div class="sub-info flex-column" style="margin-left: 10px">
                <div class="username" style="margin-top: 5px">{{ item.commentUserName }}</div>
                <div class="username" style="margin-top: 5px">{{ item.commentContent }}</div>
                <div class="date" style="color: #909399;margin-top: 5px">{{ item.createDate }}</div>
              </div>
            </div>
            <div class="pagination-container" v-if="totalCommentNumber2 > 0">
              <el-pagination
                small
                @pager-count="3"
                @current-change="handleCommentCurrentChange2"
                :current-page="commentList2.currentPage"
                :page-size="commentList2.numberPerPage"
                layout="total, prev, pager, next, jumper"
                :total="totalCommentNumber2">
              </el-pagination>
            </div>
          </div>
          <div v-if="!isComment2">
            <div class="user-info flex-row" v-for="(item, index) in rectificationRecord.data" :key="index" style="margin-top: 10px;margin-bottom: 10px">
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
            <div v-if="rectificationRecord.currentPage >= rectificationRecord.totalPage && rectificationList.status === 2" style="margin-top: 10px;">
              <section style="float: left;margin-top: 2px">复检评分：</section>
              <el-rate disabled show-text v-model="rectificationList.score" style="float: left;"></el-rate>
            </div>
            <!--<el-button  @click="awardTicket"  v-if="rectificationRecord.currentPage >= rectificationRecord.totalPage && rectificationList.status !== 2" type="primary" style="float: right;margin-bottom: 20px;margin-top: -5px">-->
              <!--{{rectificationList.status === 0 ? '整改回复' : '复检回复'}}-->
            <!--</el-button>-->
           <el-button @click="awardTicket"
                       v-if="rectificationRecord.currentPage >= rectificationRecord.totalPage && rectificationList.status === 0"
                       :disabled="!rectificationList.rectifyUserIds.indexOf(userMsg.id) > -1"
                       type="primary" style="float: right;margin-bottom: 20px;margin-top: -5px">
              {{rectificationList.rectifyUserIds.indexOf(userMsg.id) > -1 ? '整改回复' : '待整改人整改'}}
            </el-button>
            <el-button @click="awardTicket"
                       v-if="rectificationRecord.currentPage >= rectificationRecord.totalPage && rectificationList.status=== 1"
                       :disabled="rectificationList.createUserId !== userMsg.id "
                       type="primary" style="float: right;margin-bottom: 20px;margin-top: -5px">
              {{rectificationList.createUserId === userMsg.id ? '复检回复' : '待复检人复检'}}
            </el-button>
            <div class="pagination-container" v-if="totalSituationNumber2 > 0" style="margin-top: 40px">
              <el-pagination
                small
                @pager-count="3"
                @current-change="handleSituationCurrentChange"
                :current-page="rectificationRecord.currentPage"
                :page-size="rectificationRecord.numberPerPage"
                layout="total, prev, pager, next, jumper"
                :total="totalSituationNumber2">
              </el-pagination>
            </div>
            <div v-if="totalSituationNumber2 === 0" style="margin-top: 10px;color: #909399;">暂无整改情况</div>
          </div>
        </div>
      </el-dialog>
      <!-- 整改/复检回复 -->
      <el-dialog :visible.sync="dialogReplyFormVisible"
                 :close-on-click-modal="false"
                 @close="resetReplyForm"
                 :show-close="false"
                 width="380px">
        <div slot="title" style="font-weight: bolder;">
          <span>{{rectificationList.status === 0 ? '整改回复' : '复检回复'}}</span>
        </div>
        <hr size="0.1px" style="margin-top: -20px; margin-bottom: 20px;color: #F5F5F5;">
        <div v-if="rectificationList.status === 0">
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
                <input type="file" ref="picInput" multiple accept="image/*" @change="handleRectificationFileChange" />
                <span>点击上传</span>
              </el-button>
              <span>{{ addRectify.fileList.length > 0 ? `${addRectify.fileList.length}个文件` : '' }}</span>
            </div>
            <div style="font-size: 12px;">只能上传jpg/png文件，且不超过500kb</div>
          </div>
        </div>
        <div v-if="rectificationList.status === 1">
          <div>验收结果：</div>
          <el-select v-model="addRecheck.state" style="margin-top: 10px;margin-bottom: 10px">
            <el-option value="0" label="不通过"></el-option>
            <el-option value="1" label="通过"></el-option>
          </el-select>
          <div>评分：</div>
          <el-rate show-text v-model="addRecheck.score" style="margin-top: 10px"></el-rate>
        </div>
        <div slot="footer">
          <el-button @click="resetReplyForm">取消</el-button>
          <el-button type="primary" @click="handleRecheckSave">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getQualityCheckList, getNatureList, getCheckListsList,
  toDealWithCheckTheItem, addCheckLists, getUserTeam, addQualityCheck,
  getCommentList, addComment, getAwardTicketList, addQualityRectification,
  addAwardTicket, getReplyList, qualityCheck, qualityCheckAgain,
  getQualityRectificationList } from '@/api/quality';
import { mapGetters } from 'vuex';
// import { questionTicketTypeList } from '@/filters';
// import { showGallery } from '@/utils/utils';

export default {
  name: 'SecurityExamine',
  computed: {
    ...mapGetters({
      userMsg: 'userInfo',
      project: 'project',
    }),
  },
  data() {
    const { params: { id } } = this.$route;
    return {
      projectId: id,
      listLoading: false,
      dialogFormVisible: false,
      dialogControlListFormVisible: false,
      dialogSubsetFormVisible: false,
      listData: [],
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
      lsData: {
        status: null,
        keyword: null,
        betDate: null,
      },
      properties: [],
      checkItem: [],
      addCheck: {
        properties: [],
        checkDate: null,
        checkPeople: null,
        checkItem: [],
        checkResult: null,
        fileList: [],
        designatedPersonnel: [],
        overallSituation: null,
      },
      addCheckDataList: {
        properties: null,
        checkDate: null,
        checkPeople: null,
        checkItem: null,
        checkResult: null,
        fileList: null,
        designatedPersonnel: null,
        overallSituation: null,
      },
      listQuery: {
        pageIndex: 1,
        pageSize: 5,
        projectId: id,
        start: null,
        end: null,
        find: null,
        status: null,
        qualityType: 1,
      },
      totalNumber: 0,
      totalCommentNumber: 0,
      totalCommentNumber2: 0,
      rules: {
        checkDate: [{ required: true, message: `检查日期${this.$t('message.notEmpty')}`, trigger: 'change' }],
        checkItem: [{ required: true, message: `检查项${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        designatedPersonnel: [{ required: true, message: `指定人员${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        checkResult: [{ required: true, message: `检查结果${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        fileList: [{ required: true, message: `现场图片${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        overallSituation: [{ required: true, message: `整体情况${this.$t('message.notEmpty')}`, trigger: 'change' }],
        properties: [{ required: true, message: `检查性质${this.$t('message.notEmpty')}`, trigger: 'change' }],
      },
      rectificationRules: {
        level: [{ required: true, message: `情况程度${this.$t('message.notEmpty')}`, trigger: 'change' }],
        requirements: [{ required: true, message: `整改要求${this.$t('message.notEmpty')}`, trigger: 'change' }],
        rectificationPeople: [{ required: true, message: `整改人${this.$t('message.notEmpty')}`, trigger: 'change' }],
        copyPeople: [{ required: true, message: `抄送人${this.$t('message.notEmpty')}`, trigger: 'change' }],
        completionDate: [{ required: true, message: `完成日期${this.$t('message.notEmpty')}`, trigger: 'change' }],
      },
      rewardsRules: {
        personLiable: [{ required: true, message: `相关人${this.$t('message.notEmpty')}`, trigger: 'change' }],
        dDate: [{ required: true, message: `日期${this.$t('message.notEmpty')}`, trigger: 'change' }],
        awardNum: [{ required: true, message: `奖惩金额${this.$t('message.notEmpty')}`, trigger: 'change' }],
        remark: [{ required: true, message: `备注${this.$t('message.notEmpty')}`, trigger: 'change' }],
        fileList: [{ required: true, message: `相关图片${this.$t('message.notEmpty')}`, trigger: 'change' }],
      },
      addNewSubset: null,
      isShowRectification: false,
      isShowRectificationClick: false,
      designatedPersonnel: [],
      stringCheckItem: [],
      remnant: 0,
      remnant2: 0,
      desc: '',
      desc2: '',
      detailsList: {
        checkList: '',
        natureId: [],
        pictures: [],
      },
      rectificationList: {},
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
      commentList: [],
      commentList2: [],
      commentDisabled: false,
      commentDisabled2: false,
      isComment: false,
      isComment2: false,
      AwardTicketList: [],
      defaultActive: '0',
      defaultActive2: '0',
      rectificationSheetFormVisible: false,
      addRectification: {
        checkList: '',
        checkContent: '',
        level: null,
        pictures: [],
        requirements: null,
        completionDate: null,
        rectificationPeople: [],
        copyPeople: [],
      },
      addRectificationData: {
        projectId: id,
        natureId: '',
        noticeType: 2,
        fileList: [],
        fDate: null,
        sendUsers: null,
        copyUser: null,
        level: null,
        checkContent: null,
        checkList: null,
        rectificationContent: null,
        qualityCheckId: null,
        qualityType: 1,
      },
      handleSaveClick: false,
      commandList: [{
        lable: '奖惩',
        value: 'RewardsAndPunishments',
      }],
      dialogOfAddFormVisible: false,
      newRewardsDisabled: false,
      rewardOrPunishment: {
        isMadeUpOf: '奖励事由：',
        people: '授奖方：',
        time: '奖励日期：',
        money: '奖励金额：',
      },
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
      responsibleList: [],
      tableLine: {
        personLiable: [],
        checkList: [],
      },
      dialogDetailsFormVisible: false,
      rewardsList: {
        madeUpOf: '奖励是由：',
        people: '授奖人：',
        dateTime: '奖励日期：',
        money: '奖励金额：',
      },
      dialogTitle: '奖励单详情',
      labelPosition: 'right',
      labelPositionTop: 'top',
      dialogReplyFormVisible: false,
      dialogRecordFormVisible: false,
      rectificationRecord: [],
      totalSituationNumber: 0,
      totalSituationNumber2: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getQualityCheckList(this.listQuery).then((data) => {
        if (data) {
          data.data.forEach((res) => {
            res.createDate = res.createDate.substring(0, 10);
          });
        }
        this.listData = data.data;
        this.totalNumber = data.totalNumber;
      });
    },
    // 新增检查
    theNewCheck() {
      this.dialogFormVisible = true;
      getNatureList({ pageSize: 20, pageIndex: -1, projectId: this.listQuery.projectId, natureType: 1 }).then((data) => {
        if (data) {
          this.addCheck.checkPeople = this.userMsg.realName;
          this.properties = data.data;
        }
      });
      const params = {
        projectId: this.projectId,
        checkType: 1,
        pageSize: 20,
        pageIndex: 1,
      };
      getCheckListsList(params).then((data) => {
        const lsData = [];
        if (data) {
          data.data.forEach((res) => {
            lsData.push({ value: res.id, label: res.content, children: [] });
          });
        }
        lsData.push({ value: '000', label: '+++新增子集+++' });
        this.checkItem = lsData;
      });
      getUserTeam({ projectId: this.listQuery.projectId }).then((data) => {
        if (data) {
          this.designatedPersonnel = data.data;
        }
      });
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.getList();
    },
    handleCommentCurrentChange(val) {
      this.updateCommentList(val);
    },
    handleCommentCurrentChange2(val) {
      this.updateReplyCommentList(val);
    },
    handleSubsetSave() {
      const lsDataList = this.addCheck;
      if (this.addCheckDataList.checkItem !== null) {
        const parmts = {
          projectId: this.listQuery.projectId,
          checkType: 1,
          content: this.addNewSubset,
          pid: this.addCheckDataList.checkItem,
        };
        addCheckLists(parmts).then((data) => {
          if (data) {
            this.theNewCheck();
            this.$message({
              type: 'success',
              message: '检查项新增成功!',
            });
            this.dialogSubsetFormVisible = false;
            this.addCheck = lsDataList;
            this.addCheck.checkItem = [];
          }
        });
      } else {
        const parmts = {
          projectId: this.listQuery.projectId,
          checkType: 1,
          content: this.addNewSubset,
        };
        addCheckLists(parmts).then((data) => {
          if (data) {
            this.theNewCheck();
            this.$message({
              type: 'success',
              message: '检查项新增成功!',
            });
            this.dialogSubsetFormVisible = false;
            this.addCheck = lsDataList;
            this.addCheck.checkItem = [];
          }
        });
      }
    },
    closeSubset() {
      this.addNewSubset = null;
      this.addCheck.checkItem = [];
      this.addRectification.checkList = '';
      this.addCheckDataList.checkItem = null;
      this.dialogSubsetFormVisible = false;
    },
    closeRectificationSheet() {
      this.addRectification = {
        checkList: '',
        checkContent: '',
        level: null,
        pictures: [],
        requirements: null,
        completionDate: null,
        rectificationPeople: [],
        copyPeople: [],
      };
      this.addRectificationData = {
        projectId: this.listQuery.projectId,
        natureId: null,
        noticeType: 2,
        fileList: [],
        fDate: null,
        sendUsers: null,
        copyUser: null,
        level: null,
        checkContent: null,
        checkList: null,
        rectificationContent: null,
        qualityCheckId: null,
        qualityType: 1,
      };
      this.rectificationSheetFormVisible = false;
    },
    // 新增整改单
    handleRectificationSheetSave() {
      this.addRectificationData.fDate = this.addRectification.completionDate;
      let lsStringSendUsers = '';
      this.addRectification.rectificationPeople.forEach((res, index) => {
        if (index === this.addRectification.rectificationPeople.length - 1) {
          lsStringSendUsers += `${res}`;
        } else {
          lsStringSendUsers += `${res},`;
        }
      });
      this.addRectificationData.sendUsers = lsStringSendUsers;
      let lsStringCopyUser = '';
      this.addRectification.copyPeople.forEach((res, index) => {
        if (index === this.addRectification.copyPeople.length - 1) {
          lsStringCopyUser += `${res}`;
        } else {
          lsStringCopyUser += `${res},`;
        }
      });
      this.addRectificationData.copyUser = lsStringCopyUser;
      this.addRectificationData.qualityCheckId =
        this.addRectificationData.qualityCheckId === null
          ? this.detailsList.id
          : this.addRectificationData.qualityCheckId;
      this.addRectificationData.level = this.addRectification.level;
      this.addRectificationData.checkContent = this.addRectification.checkContent;
      this.addRectificationData.checkList = this.addRectification.checkList;
      this.addRectificationData.rectificationContent = this.addRectification.requirements;
      addQualityRectification(this.addRectificationData).then((data) => {
        if (data) {
          this.$message({
            type: 'success',
            message: '整改单新增成功！',
          });
          this.closeRectificationSheet();
          this.getList();
          this.commandList = [{
            lable: '奖惩',
            value: 'RewardsAndPunishments',
          }, {
            lable: '整改记录',
            value: 'TheRectificationRecord',
          }];
        }
      });
    },
    editOverallSituation(e) {
      if (e === '2') {
        this.isShowRectification = true;
      } else {
        this.isShowRectification = false;
      }
    },
    // 生成整改单
    rectificationSheet() {
      if (this.isShowRectification) {
        this.isShowRectificationClick = true;
        // 提交保存检查单
        this.handleSave();
      }
    },
    handleSave() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.handleSaveClick = true;
          let string = '';
          this.stringCheckItem = [...new Set(this.stringCheckItem)];
          this.addCheck.checkItem.forEach((res, key) => {
            this.stringCheckItem.forEach((res2, key2) => {
              if (res === res2) {
                string += `${key + 1}、${this.stringCheckItem[key2 + 1]}；`;
              }
            });
          });
          let lsStringProperties = '';
          this.addCheck.properties.forEach((res2, index) => {
            if (index === this.addCheck.properties.length - 1) {
              lsStringProperties += `${res2}`;
            } else {
              lsStringProperties += `${res2},`;
            }
          });
          this.addRectificationData.natureId = lsStringProperties;
          let lsStringDesignatedPersonnel = '';
          this.addCheck.designatedPersonnel.forEach((res2, index) => {
            if (index === this.addCheck.designatedPersonnel.length - 1) {
              lsStringDesignatedPersonnel += `${res2}`;
            } else {
              lsStringDesignatedPersonnel += `${res2},`;
            }
          });
          const partms = {
            projectId: this.listQuery.projectId,
            // natureId: this.addCheck.properties,
            natureId: lsStringProperties,
            noticeType: this.addCheck.overallSituation,
            pics: this.addCheck.fileList,
            // informUser: this.addCheck.designatedPersonnel,
            informUser: lsStringDesignatedPersonnel,
            checkContent: this.addCheck.checkResult,
            // checkList: this.addCheck.checkItem,
            checkList: string,
            qualityType: 1,
          };
          addQualityCheck(partms).then((data) => {
            if (data) {
              this.$message({
                type: 'success',
                message: '检查单新增成功！',
              });
              this.getList();
              this.addRectificationData.qualityCheckId = data.data.data;
              getQualityCheckList({ projectId: this.listQuery.projectId, id: data.data.data, qualityType: 1 }).then((data2) => {
                if (data2) {
                  this.addRectification.pictures = data2.data[0].pictures;
                  this.addRectification.checkList = data2.data[0].checkList;
                  this.addRectification.checkContent = data2.data[0].checkContent;
                  if (this.isShowRectification && this.isShowRectificationClick) {
                    // 打开新增整改单窗口
                    this.rectificationSheetFormVisible = true;
                  }
                  this.resetForm();
                }
              });
            }
          });
        }
      });
    },
    handleFileChange(e) {
      const files = e.target.files;
      this.addCheck.fileList = files;
      this.addRectificationData.fileList = files;
    },
    handleDataListFileChange(e) {
      const files = e.target.files;
      this.dataList.fileList = files;
    },
    handleRectificationFileChange(e) {
      const files = e.target.files;
      this.addRectify.fileList = files;
    },
    resetReplyForm() {
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
      this.dialogReplyFormVisible = false;
    },
    resetForm() {
      this.$refs.dialogForm.resetFields();
      this.dialogFormVisible = false;
      this.isShowRectification = false;
      this.handleSaveClick = false;
      this.checkItem = [];
      this.addCheck = {
        properties: [],
        checkDate: null,
        checkPeople: null,
        checkItem: [],
        checkResult: null,
        fileList: [],
        designatedPersonnel: [],
        overallSituation: null,
      };
    },
    resetControlListForm() {
      // this.$refs.dialogControlListForm.resetFields();
      this.commentList.currentPage = 1;
      this.detailsList = {
        checkList: '',
        natureId: [],
        pictures: [],
      };
      this.isComment = false;
      this.defaultActive = '0';
      this.dialogControlListFormVisible = false;
    },
    editCheckItem(e) {
      if (e[e.length - 1] === '000') {
        if (e.length > 1) {
          // 新增子集
          this.addCheckDataList.checkItem = e[e.length - 2];
        }
        this.dialogSubsetFormVisible = true;
      } else {
        const params = {
          projectId: this.projectId,
          checkType: 1,
          pageSize: 20,
          pageIndex: 1,
          pid: e[e.length - 1],
        };
        getCheckListsList(params).then((data) => {
          const lsData = [];
          if (data) {
            data.data.forEach((res) => {
              lsData.push({ value: res.id, label: res.content, children: [] });
            });
          }
          lsData.push({ value: '000', label: '+++新增子集+++' });
          toDealWithCheckTheItem(lsData, this.checkItem, e[e.length - 1], this.stringCheckItem, 1);
        });
      }
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
    searchKeyWord() {
      if (this.lsData.keyword !== null && this.lsData.keyword) {
        this.listQuery.find = this.lsData.keyword;
      } else {
        this.listQuery.find = null;
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
    // 更新整改评论列表
    updateReplyCommentList(pageIndex) {
      getCommentList({ replyType: 0, aboutId: this.rectificationList.id, pageIndex, pageSize: 5 }).then((data) => {
        if (data) {
          this.commentList2 = data;
          this.totalCommentNumber2 = data.totalNumber;
          this.commentDisabled2 = false;
        }
      });
    },
    details(item) {
      this.detailsList = item;
      this.updateCommentList(1);
      const partm = {
        ticketType: 1,
        aboutId: item.id,
      };
      getAwardTicketList(partm).then((data) => {
        if (data) {
          this.AwardTicketList = data.data;
        }
      });
      if (item.status === 0) {
        this.commandList = [{
          lable: '奖惩',
          value: 'RewardsAndPunishments',
        }, {
          lable: '下发整改',
          value: 'IssuedAndCorrected',
        }];
      } else if (item.status === 1) {
        this.commandList = [{
          lable: '奖惩',
          value: 'RewardsAndPunishments',
        }, {
          lable: '整改记录',
          value: 'TheRectificationRecord',
        }];
      } else if (item.status === 2) {
        this.commandList = [{
          lable: '奖惩',
          value: 'RewardsAndPunishments',
        }];
      }
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
    handleSelect2(e) {
      this.defaultActive2 = e;
      if (this.defaultActive2 === '1') {
        this.isComment2 = true;
      } else {
        this.isComment2 = false;
      }
    },
    descInput() {
      const txtVal = this.desc.length;
      this.remnant = txtVal;
    },
    descInput2() {
      const txtVal = this.desc2.length;
      this.remnant2 = txtVal;
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
    // 整改单发表评论
    addNewComment2() {
      if (this.remnant2 === 0) {
        this.$message({
          type: 'warning',
          message: '评论内容不得为空！',
        });
      } else {
        this.commentDisabled2 = true;
        addComment({ replyType: 0, aboutId: this.rectificationList.id, commentContent: this.desc2 }).then((data) => {
          if (data) {
            this.remnant2 = 0;
            this.desc2 = '';
            this.updateReplyCommentList(this.commentList2.currentPage);
          }
        });
      }
    },
    // 选择操作
    selectCommand(e) {
      // 奖惩
      if (e === 'RewardsAndPunishments') {
        getUserTeam({ projectId: this.listQuery.projectId }).then((data2) => {
          if (data2) {
            this.responsibleList = data2.data;
            this.dataList.personLiable = [];
            this.dataList.aboutId = this.detailsList.id;
            this.dialogOfAddFormVisible = true;
          }
        });
      }
      // 下发整改
      if (e === 'IssuedAndCorrected') {
        getUserTeam({ projectId: this.listQuery.projectId }).then((data2) => {
          if (data2) {
            this.addRectificationData.natureId = this.detailsList.naureIds;
            this.addRectification.pictures = this.detailsList.pictures;
            this.addRectification.checkList = this.detailsList.checkList;
            this.addRectification.checkContent = this.detailsList.checkContent;
            this.designatedPersonnel = data2.data;
            this.rectificationSheetFormVisible = true;
          }
        });
      }
      // 整改记录
      if (e === 'TheRectificationRecord') {
        this.updateSituationList(1);
        this.dialogRecordFormVisible = true;
      }
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
      this.$refs.dialogOfAddForm.resetFields();
      this.dialogOfAddFormVisible = false;
    },
    // 新增奖惩
    newRewardsPunishments() {
      this.$refs.dialogOfAddForm.validate((valid) => {
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
              const partm = {
                ticketType: 1,
                aboutId: this.detailsList.id,
              };
              getAwardTicketList(partm).then((data2) => {
                if (data2) {
                  this.AwardTicketList = data2.data;
                }
              });
            }
          });
        }
      });
    },
    // 奖惩详情
    rewardsPunishmentsDetails(item) {
      this.tableLine = item;
      getQualityCheckList({ projectId: this.listQuery.projectId, id: item.aboutId, qualityType: 1 }).then((data) => {
        if (data) {
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
        this.dialogDetailsFormVisible = true;
      });
    },
    awardTicket() {
      this.addRectify.qualityId = this.rectificationList.id;
      this.dialogReplyFormVisible = true;
    },
    handleSituationCurrentChange(val) {
      this.updateSituationList(val);
    },
    closeDialog() {
      this.dialogDetailsFormVisible = false;
    },
    // 更新整改情况列表
    updateSituationList(pageIndex) {
      getQualityRectificationList({ projectId: this.listQuery.projectId, qualityCheckId: this.detailsList.id }).then((data) => {
        if (data.data[0]) {
          this.rectificationList = data.data[0];
          this.updateReplyCommentList(1);
          const partm = {
            replyType: 0,
            aboutId: data.data[0].id,
            pageIndex,
            pageSize: 3,
          };
          getReplyList(partm).then((data2) => {
            if (data2) {
              this.rectificationRecord = data2;
              this.totalSituationNumber2 = data2.totalNumber;
            }
          });
        } else {
          this.$message({
            type: 'warning',
            message: '该检查单的整改单已被移除！',
          });
          this.dialogRecordFormVisible = false;
        }
      });
    },
    // 提交整改/复检回复
    handleRecheckSave() {
      if (this.rectificationList.status === 0) {
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
                this.rectificationList.status = 1;
              }
              this.updateSituationList(this.rectificationRecord.currentPage);
              this.resetReplyForm();
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
          this.addRecheck.qualityId = this.rectificationList.id;
          qualityCheckAgain(this.addRecheck).then((data) => {
            if (data) {
              this.$message({
                type: 'success',
                message: '复检回复成功！',
              });
              this.updateSituationList(this.rectificationRecord.currentPage);
              this.resetReplyForm();
            }
          });
        }
      }
    },
    closeRecordForm() {
      this.defaultActive2 = '0';
      this.isComment2 = false;
      this.rectificationList = {};
      this.commentList2 = [];
      this.rectificationRecord = [];
      this.dialogRecordFormVisible = false;
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
