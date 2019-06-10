<template>
  <div class="buildTask">
    <breadcrumb>
      <el-button @click= "handleAddTask" type="text">新增任务单</el-button>
    </breadcrumb>
    <!--查询-->
    <header class="searchDiv">
      <div class = "searchProp" >
        <div class="searchSecondDiv">
          <span>任务单名称</span>
          <el-input class="elCss"
                    placeholder="请输入"
                    v-model="buildTaskQuery.name"
                    clearable
                    prefix-icon="el-icon-search"
                    @change = "handleNameChange"
          >
          </el-input>
        </div>
        <div class="searchSecondDiv">
          <span>任务单状态</span>
          <el-select class="elCss" filterable v-model="buildTaskQuery.status" placeholder="请选择" @change="handleStateChange">
            <el-option
              class="elCss"
              v-for="(item, i) in buildTaskStatus"
              :key="i"
              :label="item"
              :value="i-1">
            </el-option>
          </el-select>
        </div>
        <div class="searchSecondDiv">
          <span>时间</span>
          <el-date-picker
            class = "elCssBig"
            v-model="searchDate"
            type="daterange"
            align="right"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            unlink-panels
            :picker-options="pickerOptions"
            @change="handleDateChange"
          >
          </el-date-picker>
        </div>
      </div>
    </header>
    <!--任务单列表-->
    <div class="list-wrapper">
      <el-table
        :data="buildTaskList"
        v-loading="listLoading"
        fit
        highlight-current-row
        style="width: 96%;margin-left: 2%;"
      >
        <el-table-column align="center" label="序号" type="index" > </el-table-column>
        <el-table-column align="center" label="施工单号" prop="cname" ></el-table-column>
        <el-table-column align="center" label="任务单名称" prop="name" > </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-tag :type="handleColType(scope.row.status)" disable-transitions>
              {{scope.row.status === 0 || scope.row.status === null ? '未完成' : ''}}
              {{scope.row.status === 1 ? '已完成' : ''}}
              {{scope.row.status === 2 ? '待修改' : ''}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态描述" prop="approvState" ></el-table-column>
        <el-table-column align="center" label="任务单日期" prop="constructionTaskDate" ></el-table-column>
        <el-table-column align="center" label="签发人" prop="createUser" ></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createDateShow" width="150px"></el-table-column>
        <el-table-column align="center" :label="$t('table.operation')">
          <template slot-scope="scope">
            <div class="operation-btns">
              <el-button type="primary"  size="small" @click="handleShowTask(scope.row)">查看</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="buildTaskQuery.pageIndex"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="buildTaskQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber">
        </el-pagination>
      </div>
    </div>
    <!--任务单新增/ 编辑1-->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="420px"
      @close="resetForm"
    >
      <div slot="title" style="font-weight: bolder">
        {{ this.actionStatus === 'add' ? '新建施工任务单（一）' : '编辑施工任务单（一）' }}
      </div>
      <hr noshade size="1px" style="margin-top: -10px; margin-bottom: 10px;color: rgba(220,223,230,1);" >
      <el-form :rules="addFirstRules" ref="dialogForm" :model="buildTask">
        <el-form-item label="施工任务单名称：" prop="name">
          <el-input v-model="buildTask.name" placeholder="请输入" ></el-input>
        </el-form-item>
        <el-form-item label="签发人：" prop="createUser">
          <el-input v-model="buildTask.createUser" placeholder="请输入" disabled></el-input>
        </el-form-item>
        <el-form-item label="任务单日期：" prop="constructionDates">
          <el-date-picker
            v-model="buildTask.constructionDates"
            value-format="yyyy-MM-dd"
            align="right"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标段：" prop="tendersId">
          <el-select style="width: 100%" v-model="buildTask.tendersId" placeholder="请选择" filterable>
            <el-option
              v-for="(item, i) in bidsList"
              :key="i"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流程：" prop="processDataId">
          <el-select style="width: 100%" v-model="buildTask.processDataId" placeholder="请选择" filterable>
            <el-option
              v-for="(item, i) in processList"
              :key="i"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片上传：" prop="imags">
          <div class="upload-file-wrapper flex-row">
            <el-button type="primary" style="width: 100px">
              <input type="file" ref="file" @change="handleFileChange" multiple accept="image/*" />
              <span>上传</span>
            </el-button>
            <div style="marginLeft: 8px;">{{imgFileName}}</div>
            <el-button style="margin-left: 10px;" @click="handleImagsShow" >显示附件</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button  @click="handleCancel">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary"   @click="handleNextStep" >{{$t('btn.nextStep')}}</el-button>
      </div>
    </el-dialog>
    <!--图片显示 模态框-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogImgVisible"
    >
      <div slot="title" style="font-weight: bolder">
        {{ '图片列表' }}
      </div>
      <div class="block" style="text-align: center">
        <el-carousel trigger="click">
          <el-carousel-item v-for="(item, i)  in uploadFileSrc" :key="i">
            <img class="upload-file" :src="item" :key="i" style="height: 95%"/>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>

    <!--任务单新增编辑2-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogSecondVisible"
      width="420px"
      @close="resetSecondForm"
    >
      <div slot="title" style="font-weight: bolder">
        {{ this.actionStatus === 'add' ? '新建施工任务单（二）' : '编辑施工任务单（二）' }}
      </div>
      <hr noshade size="1px" style="margin-top: -10px; margin-bottom: 10px;color: rgba(220,223,230,1);" >
      <el-form :rules="addSecondRules" ref="dialogSecondForm" :model="buildTask">
        <el-form-item label="施工内容：" prop="constructContent">
          <el-input v-model="buildTask.constructContent" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="施工部位：" prop="constructPart">
          <el-input v-model="buildTask.constructPart" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="施工类型：" prop="constructType">
          <el-select style="width: 100%" v-model="buildTask.constructType" placeholder="请选择" filterable>
            <el-option
              v-for="(item, i) in buildTaskWorkType"
              :key="i"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员来源：" prop="teamType">
          <el-radio v-model="buildTask.teamTypeStr" label= '0' @change="teamTypeChange">自有技工</el-radio>
          <el-radio v-model="buildTask.teamTypeStr" label= '1' @change="teamTypeChange">班组技工</el-radio>
        </el-form-item>
        <div v-if = "buildTask.teamTypeStr === '0'">
          <el-form-item label="点工选择：" prop="tendersIdList1">
            <el-select style="width: 100%" v-model="buildTask.tendersIdList1" placeholder="请选择" @change="handleTeamUserIdsChange"  multiple   filterable >
              <el-option
                v-for="(item, i) in mechanicList"
                :key="i"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if = isGroup>
          <el-form-item label="班组长选择：" prop="teamId">
            <el-select style="width: 100%" v-model="buildTask.teamId" placeholder="请选择" @change="handleGroupChange" filterable >
              <el-option
                v-for="(item, i) in teamIdList"
                :key="i"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组员选择：" prop="tendersIdList2">
            <el-select style="width: 100%" v-model="buildTask.tendersIdList2" placeholder="请选择"  @change="handleTeamUserIdsChange"  multiple filterable >
              <el-option
                v-for="(item, i) in departmentList"
                :key="i"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="白班小时数：" prop="dayWorkHours">
          <el-input-number v-model="buildTask.dayWorkHours"  :min="0" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="夜班小时数：" prop="nightWorkHours">
          <el-input-number v-model="buildTask.nightWorkHours"  :min="0" :max="12"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-badge :value="buildTaskLength" class="item" style="float: left">
          <el-button type="primary"  @click="handleAddDetail" >{{$t('btn.ok')}}</el-button>
        </el-badge>
        <el-button type="primary"  @click="handleShowDetail" >{{$t('btn.view')}}</el-button>
        <el-button @click="handleLastStep">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary"  @click="handleSaveTask">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>

    <!--任务单条目明细-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogDetailModelVisible"
      width="1200px"
    >
      <div slot="title" style="font-weight: bolder">{{ '任务单条目详情' }}</div>
      <hr noshade size="1px" style="margin-top: -10px; margin-bottom: 10px;color: rgba(220,223,230,1);" >
      <el-table :data="detailListTemp">
        <el-table-column align="center" label="序号" type="index" ></el-table-column>
        <el-table-column align="center" label="施工内容" prop="constructContent" ></el-table-column>
        <el-table-column align="center" label="施工部位" prop="constructPart" ></el-table-column>
        <el-table-column align="center" label="施工类型" prop="constructType" ></el-table-column>
        <el-table-column align="center" label="班组长" prop="teamerName" ></el-table-column>
        <el-table-column align="center" label="人员" prop="teamUserNames"></el-table-column>
        <el-table-column align="center" label="白班/夜班" prop="dayNight"></el-table-column>
        <el-table-column align="center" label="工日" prop="dayCount" ></el-table-column>
        <el-table-column align="center" label="考勤工资" prop="dailySalary" ></el-table-column>
        <el-table-column align="center" :label="$t('table.operation')" width="160px">
          <template slot-scope="scope">
            <div class="operation-btns">
              <el-button type="primary"  size="small" @click="handleDetailEdit(scope.row)">{{$t('btn.edit')}}</el-button>
              <el-button type="primary"  size="small" @click="handleDetailRemove(scope.row.index)">{{$t('btn.delete')}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="width: 100%;background-color: #F5F5F5;height: 50px;margin-top: 5px;margin-bottom: 5px;">
        <span style="float: right;margin-right: 20px;line-height: 50px;">总工资：{{ sumDailySalary }}元</span>
      </div>
    </el-dialog>

    <!--任务单详情-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogShowVisible"
      width="984px">
      <div slot="title" style="font-weight: bolder;height: 20px">
        <span style="float: left;line-height: 100%">{{ '施工任务单详情' }}</span>
        <el-button :type = "buildTaskEdit.createUserId === user.id ? 'primary': ''" :disabled="!(buildTaskEdit.status === 2 && buildTaskEdit.createUserId === user.id) " style="float: right;margin-right: 40px;" @click = "handleBuildTaskEdit">编辑</el-button>
      </div>
      <hr noshade size="0.1px" style="margin-top: -10px; margin-bottom: 10px;color: #dcdfe6;" >
      <div class="dialogMid">
        <i class="el-icon-info" style="float: left;line-height: 36px; margin-left: 10px;color: #409EFF;"></i>
        <span  class="dialogMidSpan">任务单概览</span>
      </div>
      <div class="showMain">
        <div class="showMain-top">
          <table>
            <tr>
              <td><span>任务单编号：</span><span>{{ buildTaskEdit.cname }}</span></td>
              <td><span>签发人：</span><span>{{ buildTaskEdit.createUser }}</span></td>
            </tr>
            <tr>
              <td><span>任务单名称：</span><span>{{ buildTaskEdit.name }}</span></td>
              <td><span>标段：</span><span>{{ buildTaskEdit.tenders }}</span></td>
            </tr>
            <tr>
              <td><span>任务单日期：</span><span>{{ buildTaskEdit.constructionTaskDate }}</span></td>
              <td></td>
            </tr>
          </table>
        </div>
        <div class="dialogMid">
          <i class="el-icon-info" style="float: left;line-height: 36px; margin-left: 10px;color: #409EFF;" ></i>
          <span  class="dialogMidSpan">任务单条目</span>
        </div>
        <div class="showMain-mid">
          <el-table :data="buildTaskDetailList" v-loading = "buildTaskDetailListLoading">
            <el-table-column align="center"  label="序号" type="index" ></el-table-column>
            <el-table-column align="center"  label="施工内容" prop="constructContent" ></el-table-column>
            <el-table-column align="center"  label="施工部位" prop="constructPart" ></el-table-column>
            <el-table-column align="center"  label="施工类型" prop="constructType" ></el-table-column>
            <el-table-column align="center" label="班组长" prop="teamName" ></el-table-column>
            <el-table-column align="center" label="人员" prop="teamUserIds" ></el-table-column>
            <el-table-column align="center" label="白班/夜班" prop="dayNight" ></el-table-column>
            <el-table-column align="center" label="工日" prop="dayCount" ></el-table-column>
            <el-table-column align="center" label="考勤工资" prop="salary"></el-table-column>
          </el-table>
          <div style="width: 100%;height: 50px;margin-top: 5px;margin-bottom: 5px;">
            <span style="float: right;margin-right: 20px;line-height: 50px;">总工资：{{ sumMsgDailySalary }}元</span>
          </div>
        </div>
      </div>
      <div class="dialogMid">
        <i class="el-icon-info" style="float: left;line-height: 36px; margin-left: 10px;color: #409EFF;"></i>
        <span  class="dialogMidSpan">审核流程</span>
      </div>
      <div class="showMain-mid">
        <el-table :data="buildTaskApprovList" v-loading = "buildTaskApprovListLoading">
          <el-table-column align="center"  label="序号" type="index"></el-table-column>
          <el-table-column align="center" label="审核人" prop="approveUser"></el-table-column>
          <el-table-column align="center" label="审核岗位" prop="itemName"></el-table-column>
          <el-table-column prop="agreeFlag" label="是否同意"></el-table-column>
          <el-table-column prop="nextStepName" label="下一步状态">
            <template slot-scope="scope">
              <div v-if = "scope.row.nextStepName === 'edit'">
                <el-button @click = "handleApprov(scope.row)" type="primary" :disabled = "scope.row.approveUserId !== user.id"><i class="el-icon-edit">审核</i></el-button>
              </div>
              <div v-if = "scope.row.nextStepName !== 'edit'">
                {{ scope.row.nextStepName }}
              </div>
            </template>
          </el-table-column>
        </el-table>
          <el-table-column align="center" label="审核意见" prop="note"></el-table-column>
          <el-table-column align="center" label="审核时间" prop="approveDate" width="250"></el-table-column>
      </div>
      <div class="dialogMid">
        <i class="el-icon-info" style="float: left;line-height: 36px; margin-left: 10px;color: #409EFF;"></i>
        <span  class="dialogMidSpan">审核意见</span>
      </div>
      <div class="showMain-mid">
        <el-table :data="buildTaskEventList" v-loading="buildTaskEventListLoading">
          <el-table-column align="center"  label="序号" type="index" ></el-table-column>
          <el-table-column align="center" label="审核人" prop="approveUser" ></el-table-column>
          <el-table-column align="center" label="是否同意" prop="agreeFlag" ></el-table-column>
          <el-table-column align="center" label="审核意见" prop="note" ></el-table-column>
          <el-table-column align="center" label="审核时间" prop="approveDate" ></el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button @click="handleCancel">{{$t('btn.cancel')}}</el-button>
        <el-button @click="handleBuildTaskShowStyle">预览</el-button>
        <el-button type="primary"  @click="handleExportConstructionTask">{{$t('btn.export')}}</el-button>
      </div>
    </el-dialog>

    <!--任务单审核-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogAgreeVisible"
      width="360px"
      @close="resetAgreeForm"
    >
      <div slot="title" style="font-weight: bolder">{{ '施工任务单审核' }}</div>
      <hr noshade size="1px" style="margin-top: -10px; margin-bottom: 10px;color: rgba(220,223,230,1);" >
      <el-form :rules="agreeRules" ref="dialogAgreeForm" :model="buildTaskAgree">
        <el-form-item label="是否同意：" prop="idea">
          <el-select v-model="buildTaskAgree.idea" style="width: 100%">
            <el-option label="同意" value="0"></el-option>
            <el-option label="不同意" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见：" prop="note">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="请输入"
            v-model="buildTaskAgree.note">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleAgreeCancel">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary"  @click="handleSaveAgreeTask">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>
    <!---->
    <!--任务单导出预览-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogShowOutVisible"
      width="794px"
    >
      <div id="printDiv" style="width: 190mm;margin-left: 5mm;height: 130mm;">
        <table style="
        width:164mm;
        border-collapse:collapse;
        border-spacing:0;
        font-family: SimSun;
        margin-left: 13mm;
        padding-top: 10mm;
        @media only print { margin-left:10mm; }">
          <tr><td colspan="10" style="font-size: 16pt;font-weight: bold;text-align: center;height: 50px;letter-spacing: 5px;">上海嘉实（集团）有限公司</td></tr>
          <tr><td colspan="10" style="text-align: center;height: 40px;">{{ project.name }}零星派工任务单</td></tr>
          <tr>
            <td colspan="3">
              <span style="font-weight: bold;">任务单编号：</span>
              <span>{{ buildTaskEdit.cname }}</span>
            </td>
            <td colspan="2"></td>
            <td colspan="3">
              <span style="font-weight: bold;">签发人：</span>
              <span>{{ buildTaskEdit.createUser }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="8" style="border: 1px solid">
              <div style="float: left; width:19%; text-align: center; border-right: 1px solid; height: 30px;">
                <span style="font-weight: bold;line-height: 30px;">任务单名称：</span>
              </div>
              <div style="float: left; width: 80%; text-align: center; height: 30px;">
                <span style="line-height: 30px;">{{ buildTaskEdit.name }}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="8" style="border: 1px solid">
              <div style="float: left; width:19%; text-align: center; border-right: 1px solid; height: 30px;">
                <span style="font-weight: bold;line-height: 30px;">项目标段：</span>
              </div>
              <div style="float: left; width: 80%; text-align: center; height: 30px;">
                <span style="line-height: 30px;">{{ buildTaskEdit.tenders }}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="8" style="border: 1px solid">
              <div style="float: left; width:19%; text-align: center; border-right: 1px solid; height: 30px;">
                <span style="font-weight: bold;line-height: 30px;">任务单日期：</span>
              </div>
              <div style="float: left; width: 80%; text-align: center; height: 30px;">
                <span style="line-height: 30px;">{{ buildTaskEdit.constructionTaskDate }}</span>
              </div>
            </td>
          </tr>
          <!--<tr class="tr_tdNoBorder"><td colspan="2" style="border-left: 1px solid;"><span class="fontBold">任务单条目：</span></td><td colspan="6" style="border-right: 1px solid;"></td></tr>-->
          <tr>
            <td style="font-weight: bold;border: 1px solid;text-align: center;">序号</td>
            <td style="font-weight: bold;border: 1px solid;text-align: center;">施工内容</td>
            <td style="font-weight: bold;border: 1px solid;text-align: center;">施工部位</td>
            <td style="font-weight: bold;border: 1px solid;text-align: center;">施工类型</td>
            <td style="font-weight: bold;border: 1px solid;text-align: center;">人员</td>
            <td style="font-weight: bold;border: 1px solid;text-align: center;">白班/夜班</td>
            <td style="font-weight: bold;border: 1px solid;text-align: center;">工日</td>
            <td style="font-weight: bold;border: 1px solid;text-align: center;">考勤工资</td>
          </tr>
          <tr v-for="(item, i) in buildTaskDetailList" :key="i">
            <td style="border: 1px solid;text-align: center;">{{ i + 1 }}</td>
            <td style="border: 1px solid;text-align: center;">{{ item.constructContent }}</td>
            <td style="border: 1px solid;text-align: center;">{{ item.constructPart }}</td>
            <td style="border: 1px solid;text-align: center;">{{ item.constructType }}</td>
            <td style="border: 1px solid;text-align: center;">{{ item.teamUserIds }}</td>
            <td style="border: 1px solid;text-align: center;">{{ item.dayNight }}</td>
            <td style="border: 1px solid;text-align: center;">{{ item.dayCount }}</td>
            <td style="border: 1px solid;text-align: center;">{{ item.salary }}</td>
          </tr>
          <tr>
            <td colspan="5" style="border:1px solid;border-right: none"></td>
            <td colspan="3" style="border:1px solid;border-left: none">
              <span>总工资：{{ sumMsgDailySalary }}元</span>
            </td>
          </tr>
          <tr style="height: 30px;">
            <td colspan="8"></td>
          </tr>
        </table>
        <table style="
        width:164mm;
        border-collapse:collapse;
        border-spacing:0;
        font-family: SimSun;
        margin-left: 13mm;
        @media only print { margin-left:10mm; }">
          <tr>
            <td colspan="6" style="text-align: left;border: 1px solid;">
              <span style="margin-left: 20px;font-weight: bold;">审批流程：</span>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold;border: 1px solid;text-align: center;">序号</td>
            <td style="font-weight: bold;border: 1px solid;text-align: center;">审核时间</td>
            <td style="font-weight: bold;border: 1px solid;text-align: center;">审核人</td>
            <td style="font-weight: bold;border: 1px solid;text-align: center;">审核岗位</td>
            <td style="font-weight: bold;border: 1px solid;text-align: center;">是否同意</td>
            <td style="font-weight: bold;border: 1px solid;text-align: center;">审核意见</td>
          </tr>
          <tr v-for="(item, i) in buildTaskApprovList" :key="i">
            <td style="border: 1px solid;text-align: center;">{{ i + 1 }}</td>
            <td style="border: 1px solid;text-align: center;">{{ item.approveDate }}</td>
            <td style="border: 1px solid;text-align: center;">{{ item.approveUser }}</td>
            <td style="border: 1px solid;text-align: center;">{{ item.itemName }}</td>
            <td style="border: 1px solid;text-align: center;">{{ item.agreeFlag }}</td>
            <td style="border: 1px solid;text-align: center;">{{ item.note }}</td>
          </tr>
          <tr>
            <td colspan="6" style="text-align: left;border: 1px solid;">
              <span style="font-weight:bold;margin-left: 20px;">填单时间:</span>
              <span>{{ buildTaskEdit.createDate }}</span>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer">
        <el-button @click="handlePrint">打印</el-button>
        <el-button @click="handleShowOutCancel">{{$t('btn.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { buildTaskStatus, buildTaskWorkType, buildTaskDayNight, setFileRootForDownload } from '@/filters';
import { getConstructionTaskList, addConstructionTask, deleteConstructionTask, updateConstructionTask, getBuildTaskMsg, getBuildTaskApprovList, getBuildTaskApproEventvList, approvConstructionTask, exportConstructionTask } from '@/api/buildTask';
import { getProcessList } from '@/api/process';
import { getBidsListByProject } from '@/api/bids';
import { getMechanicList, getDepartmentList, getTeamIdList } from '@/api/mechanic';

export default {
  name: 'buildTask',
  computed: {
    ...mapGetters({
      userMsg: 'userInfo',
    }),
  },
  data() {
    const { params: { id } } = this.$route;
    return {
      buildTaskListLoading: false,
      buildTaskDetailListLoading: false,
      buildTaskApprovListLoading: false,
      buildTaskEventListLoading: false,
      buildTaskQuery: {
        pageIndex: 1,
        pageSize: 10,
        projectId: id,
        name: null,
        start: null,
        end: null,
        status: null,
      },
      bidsQuery: { projectId: id },
      processQuery: { projectId: id, typeId: 1 },
      mechanicQuery: { projectId: id, pageIndex: -1, pageSize: 20 },
      departmentQuery: { pageIndex: -1, pageSize: 20, projectId: id, teamId: null },
      buildTaskDetailListQuery: { },
      buildTaskApprovListQuery: { },
      buildTask: {
        processDataId: null,
        imags: [],
        createUser: '',
        name: '',
        constructionDates: null,
        constructContent: null,
        constructType: null,
        teamType: 0,
        teamTypeStr: '0',
        teamUserIds: null,
        dayWorkHours: 10,
        nightWorkHours: 0,
        tendersId: null,
        constructPart: null,
        projectId: id,
        pid: null,
        tendersIdList1: [],
        tendersIdList2: [],
        teamId: null,
      },
      // 保留
      buildTaskFirstPage: {
        projectId: id,
        name: '',
        createUser: '',
        constructionDates: '',
        imags: [],
        tendersId: null,
        processDataId: null,
      },
      buildTaskSecondPage: {
        constructContent: null,
        constructType: null,
        teamType: 0,
        teamTypeStr: '0',
        teamUserIds: null,
        dayWorkHours: 10,
        nightWorkHours: 0,
        constructPart: null,
        tendersIdList1: [],
        tendersIdList2: [],
        pid: null,
      },
      buildTaskAgree: {
        note: '',
        idea: '0',
        id: null,
        processDataId: null,
        currentNodeId: null,
      },
      buildTaskEdit: {
        cname: '',
        tenders: '',
      },
      teamLeaderQuery: {
        projectId: id,
      },
      teamWorkerQuery: {
        leaderId: null,
      },
      listLoading: false,
      totalNumber: 0,
      totalPage: 1,
      rules: { },
      buildTaskList: null,
      searchDate: [],
      buildTaskDetailList: null,
      buildTaskApprovList: null,
      buildTaskEventList: null,
      bidsList: null,
      processList: null,
      partWorkerList: null,
      groupWorkerList: null,
      mechanicList: [],
      departmentList: [],
      teamIdList: [],
      buildTaskStatus,
      buildTaskWorkType,
      buildTaskDayNight,
      dialogFormVisible: false,
      dialogSecondVisible: false,
      dialogAgreeVisible: false,
      dialogShowVisible: false,
      dialogImgVisible: false,
      dialogShowOutVisible: false,
      dialogDetailModelVisible: false,
      imgButtonIsDisable: true,
      actionStatus: 'add',
      isGroup: false,
      pickerOptions: null,
      uploadFileSrc: null,
      imgFileName: '',
      user: null,
      project: {
        name: '',
      },
      projectId: id,
      sumDailySalary: 0,
      // 详情工资
      sumMsgDailySalary: 0,
      // 单任务条目临时工资；在员工列表改变的时候获取
      sumSalaryTemp: 0,
      // 工资列表
      sumSalaryTempList: [],
      buildTaskLength: 0,
      detailListTemp: [],
      addFirstRules: {
        name: [{ required: true, message: `任务单名称${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        constructionDates: [{ required: true, message: `任务单日期${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        tendersId: [{ required: true, message: `标段${this.$t('message.notEmpty')}`, trigger: 'change' }],
        processDataId: [{ required: true, message: `流程${this.$t('message.notEmpty')}`, trigger: 'change' }],
      },
      addSecondRules: {
        constructContent: [{ required: true, message: `施工内容${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        constructPart: [{ required: true, message: `施工部位${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        constructType: [{ required: true, message: `施工类型${this.$t('message.notEmpty')}`, trigger: 'change' }],
        tendersIdList1: [{ required: true, message: `点工${this.$t('message.notEmpty')}`, trigger: 'change' }],
        dayWorkHours: [{ required: true, message: `白班小时数${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        nightWorkHours: [{ required: true, message: `夜班小时数${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
      agreeRules: {
        idea: [{ required: true, message: `是否同意${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        note: [{ required: true, message: `审核意见${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
    };
  },
  created() {
    this.user = this.userMsg;
    // 任务单数据
    this.getList();
    // 获取流程
    this.handleProcessList();
    // 获取标段
    this.handleBidsList();
    // 获取班组长
    this.handleTeamIdList();
    // 日期框插件
    this.handlePickerOptions();
    // 根据班组长获取组员
    this.handleDepartmentList();
    // 获取自有工人
    this.handleMechanicList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      const buildTaskQueryTemp = JSON.parse(JSON.stringify(this.buildTaskQuery));
      if (buildTaskQueryTemp.status === -1 || buildTaskQueryTemp.status === '-1') {
        buildTaskQueryTemp.status = null;
      }
      getConstructionTaskList(buildTaskQueryTemp).then((res) => {
        if (res) {
          const { data, totalNumber, totalPage } = res;
          const dataTemp = [];
          if (data && data !== undefined && data !== null && data.length > 0) {
            data.forEach((item) => {
              item.createDateShow = item.createDate.substring(0, (item.createDate.length - 3));
              item.cname = item.constructionTaskDate.replace('-', '').replace('-', '') + item.id;
              if (item.status === 1) {
                item.approvState = '审核完成';
                dataTemp.push(item);
              } else {
                if (item.approvalUser && item.approvalUser !== null && item.approvalUser !== '') {
                  let approvState = '';
                  if (item.status === 0) {
                    approvState = `待${item.approvalUser}审核`;
                  } else if (item.status === 2) {
                    approvState = `待${item.createUser}修改`;
                  }
                  item.approvState = approvState;
                  dataTemp.push(item);
                }
              }
            });
            this.buildTaskList = dataTemp;
            this.totalNumber = totalNumber;
            this.totalPage = totalPage;
            this.listLoading = false;
          } else {
            this.buildTaskList = dataTemp;
            this.totalPage = 0;
            this.totalNumber = 0;
            this.listLoading = false;
          }
        } else {
          this.listLoading = false;
        }
      });
    },
    handleMechanicList() {
      getMechanicList(this.mechanicQuery).then((res) => {
        const { data } = res;
        const mechanicListTemp = [];
        if (data && data !== undefined && data !== null && data.length > 0) {
          data.forEach((item) => {
            mechanicListTemp.push({ id: item.id, name: item.realName, salary: item.daySalary });
          });
          this.mechanicList = mechanicListTemp;
        }
      });
    },
    handleDepartmentList() {
      getDepartmentList(this.departmentQuery).then((res) => {
        const { data } = res;
        const departmentListTemp = [];
        if (data && data !== undefined && data !== null && data.length > 0) {
          data.forEach((item) => {
            departmentListTemp.push({ id: item.id, name: item.name, salary: item.salary });
          });
          this.departmentList = departmentListTemp;
        }
      });
    },
    handleTeamIdList() {
      getTeamIdList(this.bidsQuery).then((res) => {
        const { data } = res;
        const options = [];
        if (data && data !== undefined && data !== null && data.length > 0) {
          data.forEach((item) => {
            if (item.teamUserName !== null && item.teamUserName.length > 0) {
              options.push({ id: item.id, name: item.teamUserName });
            }
          });
          this.teamIdList = options;
        }
      });
    },
    handlePickerOptions() {
      const options = {
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // },
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
    handleBidsList() {
      getBidsListByProject(this.bidsQuery).then((res) => {
        this.bidsList = res.data;
      });
    },
    handleProcessList() {
      getProcessList(this.processQuery).then((res) => {
        if (res) {
          const { callStatus, data } = res;
          if (callStatus !== 'FAILED') {
            const options = [];
            if (data && data !== undefined && data !== null && data.length > 0) {
              data.forEach((item) => {
                options.push({ id: item.id, name: item.name });
              });
              this.processList = options;
            }
          }
        }
      });
    },
    handleDeleteTask() {
      deleteConstructionTask().then((res) => {
        this.res = res;
      });
    },
    handleProject() {
      const { params: { id } } = this.$route;
      this.$store.dispatch('getProject', { id }).then((res) => {
        res.modelPart = res.modelPart ? res.modelPart.join(',') : null;
        res.teamList = res.teamList ? res.teamList.join(',') : null;
        this.project = { ...this.project, ...res };
      });
    },
    handleAddTask() {
      this.actionStatus = 'add';
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      this.uploadFileSrc = null;
      this.imgFileName = '';
      this.buildTask.imags = [];
      this.buildTask.constructionDates = `${year}-${month}-${day}`;
      this.buildTask.createUser = this.userMsg.realName;
      this.buildTask.projectId = this.projectId;
      this.buildTask.teamType = '0';
      this.dialogFormVisible = true;
      this.detailListTemp = [];
      this.buildTaskLength = 0;
      this.buildTask.dayWorkHours = 10;
      this.buildTask.nightWorkHours = 0;
    },
    handleShowTask(param) {
      this.buildTaskDetailListLoading = true;
      this.buildTaskApprovListLoading = true;
      this.buildTaskEventListLoading = true;
      this.actionStatus = 'edit';
      this.dialogShowVisible = true;
      this.buildTaskEdit = param;
      this.buildTaskEdit.constructionDates = param.constructionTaskDate;
      this.buildTaskDetailListQuery.id = param.id;
      this.buildTaskEdit.id = param.id;
      this.buildTaskEdit.projectId = param.projectId;
      //  获取任务单条目
      getBuildTaskMsg(this.buildTaskDetailListQuery).then((res) => {
        const { data } = res;
        const dataTemp = [];
        let sumMsgDailySalary = 0;
        data.forEach((item) => {
          const temp = item;
          const dayCount = ((item.dayWorkHours.toFixed(2) / buildTaskDayNight[0].toFixed(2)) + (item.nightWorkHours.toFixed(2) / buildTaskDayNight[1].toFixed(2))).toFixed(2);
          temp.dayNight = `${item.dayWorkHours}/${item.nightWorkHours}`;
          temp.dayCount = dayCount;
          if (temp.salary && temp.salary !== null) {
            sumMsgDailySalary += temp.salary;
          }
          dataTemp.push(temp);
        });
        this.sumMsgDailySalary = sumMsgDailySalary;
        this.buildTaskDetailList = dataTemp;
        this.buildTaskDetailListLoading = false;
      });
      // 任务单id 以及 任务单流程
      this.buildTaskApprovListQuery.id = param.id;
      this.buildTaskApprovListQuery.processDataId = param.processDataId;
      this.buildTaskAgree.id = param.id;
      this.buildTaskAgree.processDataId = param.processDataId;
      // 获取审核流程
      this.handleShowTaskApprov();
      // 获取审核事件
      this.handleShowTaskEvent();
    },
    // 流程和Event封装复用
    handleShowTaskApprov() {
      this.buildTaskApprovListLoading = true;
      getBuildTaskApprovList(this.buildTaskApprovListQuery).then((res) => {
        const { data } = res;
        const dataTemp = [];
        let approvState = true;
        let noEdit = true;
        let index = 0;
        if (data !== null && data.length > 0) {
          data.forEach((item) => {
            if (item.itemState !== null) {
              let nextStepName = '待';
              if (item.itemState === 0) {
                if (item.nextApproveUser === null && index === data.length - 1 && item.note !== null) {
                  item.agreeFlag = '已同意';
                  nextStepName = '审核完成';
                } else {
                  item.agreeFlag = '已同意';
                  nextStepName = `${item.nextApproveUser}审核`;
                }
              } else if (item.itemState === 1) {
                item.agreeFlag = '待修改';
                nextStepName = `${item.nextApproveUser}修改`;
                noEdit = false;
              }
              item.nextStepName = nextStepName;
            } else {
              item.agreeFlag = '未审核';
              if (approvState && noEdit) {
                approvState = false;
                // 找机会更改一下
                item.nextStepName = 'edit';
              } else {
                item.nextStepName = '';
              }
            }
            dataTemp.push(item);
            index += 1;
          });
        }
        this.buildTaskApprovList = dataTemp;
        this.buildTaskApprovListLoading = false;
      });
    },
    handleShowTaskEvent() {
      this.buildTaskEventListLoading = true;
      // 获取审核事件
      getBuildTaskApproEventvList(this.buildTaskApprovListQuery).then((res) => {
        const { data } = res;
        const dataTemp = [];
        let approvState = true;
        data.forEach((item) => {
          if (item.note !== null) {
            let endFlagStr = '';
            let agreeFlag = '';
            if (approvState) {
              if (item.itemState === 0) {
                agreeFlag = '同意';
                endFlagStr = `${item.approveUser}已审核`;
              } else if (item.itemState === 1) {
                agreeFlag = '不同意';
                endFlagStr = `${item.approveUser}不同意`;
              } else {
                agreeFlag = '待审核';
                endFlagStr = `待${item.approveUser}审核`;
                approvState = false;
              }
            }
            // agreeFlag nextStepName
            item.nextStepName = endFlagStr;
            item.agreeFlag = agreeFlag;
            dataTemp.push(item);
          }
        });
        this.buildTaskEventList = dataTemp;
        this.buildTaskEventListLoading = false;
      });
    },
    handleAddDetail() {
      const msg = this;
      msg.$refs.dialogSecondForm.validate((valid) => {
        if (valid) {
          const buildTaskDetail = JSON.parse(JSON.stringify(msg.buildTask));
          const teamType = buildTaskDetail.teamType;
          // 白班/夜班
          let dayNight = '';
          dayNight += buildTaskDetail.dayWorkHours;
          dayNight += '/';
          dayNight += buildTaskDetail.nightWorkHours;
          buildTaskDetail.dayNight = dayNight;
          // 工日
          const dayCount = ((buildTaskDetail.dayWorkHours / buildTaskDayNight[0]) + (buildTaskDetail.nightWorkHours / buildTaskDayNight[1])).toFixed(2);
          buildTaskDetail.dayCount = dayCount;
          if (buildTaskDetail.index === undefined) {
            // 工资
            buildTaskDetail.dailySalary = msg.sumSalaryTemp * dayCount;
            // 总工资
            msg.sumDailySalary += buildTaskDetail.dailySalary;
            // 添加条目
            buildTaskDetail.index = msg.buildTaskLength + 1;
            msg.detailListTemp.push(buildTaskDetail);
            msg.buildTaskLength = msg.detailListTemp.length;
          } else {
            // 总工资移除原工资
            msg.sumDailySalary -= buildTaskDetail.dailySalary;
            // 计算新的工资
            buildTaskDetail.dailySalary = msg.sumSalaryTemp * dayCount;
            // 计算新的总工资
            msg.sumDailySalary += buildTaskDetail.dailySalary;
            // 编辑条目   因为序号由1 开始，需要变为下标 -1
            const list = [];
            for (const key in msg.detailListTemp) {
              if (key) {
                if (Number(key) === (buildTaskDetail.index - 1)) {
                  list.push(buildTaskDetail);
                } else {
                  list.push(msg.detailListTemp[key]);
                }
              }
            }
            msg.detailListTemp = list;
            delete msg.buildTask.index;
          }
          this.resetSecondForm();
          msg.buildTask.constructContent = null;
          msg.buildTask.constructType = null;
          msg.buildTask.constructPart = null;
          // 第二页初始信息
          // msg.isGroup = false;
          msg.buildTask.dayWorkHours = 10;
          msg.buildTask.nightWorkHours = 0;
          // msg.buildTask.teamTypeStr = '0';
          msg.buildTask.teamType = teamType;
          msg.buildTask.tendersIdList1 = [];
          msg.buildTask.tendersIdList2 = [];
        }
      });
    },
    handleShowDetail() {
      this.dialogDetailModelVisible = true;
    },
    handleSaveTask() {
      this.buildTaskQuery.pageIndex = 1;
      // 如果只有一个，直接验证表单，并提交
      const msg = this;
      if (msg.detailListTemp.length > 0) {
        const detailListTemp = JSON.parse(JSON.stringify(msg.detailListTemp));
        const detailListHandled = [];
        const buildTaskFirstPage = JSON.parse(JSON.stringify(this.buildTaskFirstPage));
        detailListTemp.forEach((item) => {
          const detail = {
            processDataId: buildTaskFirstPage.processDataId,
            imags: buildTaskFirstPage.imags,
            name: buildTaskFirstPage.name,
            constructionDates: buildTaskFirstPage.constructionDates,
            constructContent: item.constructContent,
            constructType: item.constructType,
            teamType: item.teamType,
            teamUserIds: item.teamUserIds,
            dayWorkHours: item.dayWorkHours,
            nightWorkHours: item.nightWorkHours,
            tendersId: buildTaskFirstPage.tendersId,
            constructPart: item.constructPart,
            projectId: item.projectId,
          };
          if (item.teamType === 1) {
            detail.teamId = item.teamId;
          }
          if (msg.actionStatus !== 'add') {
            detail.id = item.id;
            detail.pid = item.pid;
          }
          detailListHandled.push(detail);
        });
        if (msg.actionStatus === 'add') {
          addConstructionTask(detailListHandled[0]).then((res) => {
            const buildTaskId = res.data.data.id;
            if (detailListHandled.length > 1) {
              for (const key in detailListHandled) {
                if (key && Number(key) > 0) {
                  detailListHandled[key].pid = buildTaskId;
                  addConstructionTask(detailListHandled[key]).then(() => {
                    // 添加完成
                    if (Number(key) === (detailListHandled.length - 1)) {
                      msg.$message({
                        type: 'success',
                        message: this.$t('message.operationSuccess'),
                      });
                      this.dialogSecondVisible = false;
                      this.getList();
                    }
                  });
                }
              }
            } else {
              msg.$message({
                type: 'success',
                message: this.$t('message.operationSuccess'),
              });
              this.dialogSecondVisible = false;
              this.getList();
            }
          });
        } else {
          for (const key in detailListHandled) {
            if (key) {
              if (key === String(detailListHandled.length - 1)) {
                updateConstructionTask(detailListHandled[key]).then(() => {
                  msg.$message({
                    type: 'success',
                    message: this.$t('message.operationSuccess'),
                  });
                  this.dialogSecondVisible = false;
                  this.getList();
                });
              } else {
                updateConstructionTask(detailListHandled[key]).then(() => {});
              }
            }
          }
        }
      } else {
        msg.$refs.dialogSecondForm.validate((valid) => {
          if (valid) {
            const buildTaskFirstPage = JSON.parse(JSON.stringify(this.buildTaskFirstPage));
            const item = JSON.parse(JSON.stringify(this.buildTask));
            const detail = {
              processDataId: buildTaskFirstPage.processDataId,
              imags: buildTaskFirstPage.imags,
              name: buildTaskFirstPage.name,
              constructionDates: buildTaskFirstPage.constructionDates,
              constructContent: item.constructContent,
              constructType: item.constructType,
              teamType: item.teamType,
              teamUserIds: item.teamUserIds,
              dayWorkHours: item.dayWorkHours,
              nightWorkHours: item.nightWorkHours,
              tendersId: buildTaskFirstPage.tendersId,
              constructPart: item.constructPart,
              projectId: item.projectId,
            };
            if (msg.actionStatus === 'add') {
              addConstructionTask(detail).then(() => {
                msg.$message({
                  type: 'success',
                  message: this.$t('message.operationSuccess'),
                });
                this.dialogSecondVisible = false;
                this.getList();
              });
            } else {
              detail.id = item.id;
              detail.pid = item.pid;
              updateConstructionTask(detail).then(() => {
                msg.$message({
                  type: 'success',
                  message: this.$t('message.operationSuccess'),
                });
                this.dialogSecondVisible = false;
                this.getList();
              });
            }
          }
        });
      }
    },
    handleSaveTask1() {
      addConstructionTask().then((res) => {
        this.res = res;
      });
    },
    handleNameChange() {
      this.buildTaskQuery.pageIndex = 1;
      this.getList();
    },
    handleStateChange() {
      this.buildTaskQuery.pageIndex = 1;
      this.getList();
    },
    handleDateChange(val) {
      this.buildTaskQuery.pageIndex = 1;
      if (val && val != null) {
        this.buildTaskQuery.start = val[0];
        this.buildTaskQuery.end = val[1];
      } else {
        this.buildTaskQuery.start = null;
        this.buildTaskQuery.end = null;
      }
      this.getList();
    },
    handleSizeChange(val) {
      this.buildTaskQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.buildTaskQuery.pageIndex = val;
      this.getList();
    },
    teamTypeChange(val) {
      this.buildTask.teamTypeStr = val;
      this.buildTask.teamType = Number(val);
      this.buildTask.teamId = null;
      this.buildTask.tendersIdList1 = [];
      this.buildTask.tendersIdList2 = [];
      this.buildTask.teamerName = null;
      this.departmentList = [];
      if (val === '0' || val === 0) {
        this.isGroup = false;
        this.addSecondRules.teamId = [{ required: false, message: `班组长${this.$t('message.notEmpty')}`, trigger: 'change' }];
        this.addSecondRules.tendersIdList2 = [{ required: false, message: `班组人员${this.$t('message.notEmpty')}`, trigger: 'change' }];
        this.addSecondRules.tendersIdList1 = [{ required: true, message: `点工${this.$t('message.notEmpty')}`, trigger: 'change' }];
      } else {
        this.isGroup = true;
        this.addSecondRules.tendersIdList1 = [{ required: false, message: `点工${this.$t('message.notEmpty')}`, trigger: 'change' }];
        this.addSecondRules.teamId = [{ required: true, message: `班组长${this.$t('message.notEmpty')}`, trigger: 'change' }];
        this.addSecondRules.tendersIdList2 = [{ required: true, message: `班组人员${this.$t('message.notEmpty')}`, trigger: 'change' }];
      }
    },
    handleCancel() {
      this.dialogFormVisible = false;
      this.dialogSecondVisible = false;
      this.dialogAgreeVisible = false;
      this.dialogShowVisible = false;
    },
    handleNextStep() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          // 将 5个值临时存储
          const buildTask = JSON.parse(JSON.stringify(this.buildTask));
          this.buildTaskFirstPage = {
            name: buildTask.name,
            createUser: buildTask.createUser,
            constructionDates: buildTask.constructionDates,
            imags: buildTask.imags,
            tendersId: buildTask.tendersId,
            processDataId: buildTask.processDataId,
          };
          // 模态框显示
          this.dialogFormVisible = false;
          this.dialogSecondVisible = true;
          // 数据回显
          const buildTaskSecondPage = JSON.parse(JSON.stringify(this.buildTaskSecondPage));
          this.buildTask.constructContent = buildTaskSecondPage.constructContent;
          this.buildTask.constructType = buildTaskSecondPage.constructType;
          this.buildTask.teamType = buildTaskSecondPage.teamType;
          this.buildTask.teamTypeStr = buildTaskSecondPage.teamTypeStr;
          this.buildTask.teamUserIds = buildTaskSecondPage.teamUserIds;
          this.buildTask.dayWorkHours = buildTaskSecondPage.dayWorkHours;
          this.buildTask.nightWorkHours = buildTaskSecondPage.nightWorkHours;
          this.buildTask.constructPart = buildTaskSecondPage.constructPart;
          this.buildTask.tendersIdList1 = buildTaskSecondPage.tendersIdList1;
          this.buildTask.tendersIdList2 = buildTaskSecondPage.tendersIdList2;
          this.buildTask.teamId = buildTaskSecondPage.teamId;
          this.buildTask.pid = buildTaskSecondPage.pid;
          if (this.actionStatus === 'edit' && buildTaskSecondPage.id) {
            this.buildTask.id = buildTaskSecondPage.id;
          }
        }
      });
    },
    handleLastStep() {
      // 数据存储（避免绑定）
      const buildTask = JSON.parse(JSON.stringify(this.buildTask));
      this.buildTaskSecondPage = {
        constructContent: buildTask.constructContent,
        constructType: buildTask.constructType,
        teamType: buildTask.teamType,
        teamTypeStr: buildTask.teamTypeStr,
        teamUserIds: buildTask.teamUserIds,
        dayWorkHours: buildTask.dayWorkHours,
        nightWorkHours: buildTask.nightWorkHours,
        constructPart: buildTask.constructPart,
        tendersIdList1: buildTask.tendersIdList1,
        tendersIdList2: buildTask.tendersIdList2,
        teamId: buildTask.teamId,
        pid: null,
      };
      // 数据回显 （避免绑定）
      const buildTaskFirstPage = JSON.parse(JSON.stringify(this.buildTaskFirstPage));
      this.buildTask.name = buildTaskFirstPage.name;
      this.buildTask.createUser = buildTaskFirstPage.createUser;
      this.buildTask.constructionDates = buildTaskFirstPage.constructionDates;
      this.buildTask.imags = buildTaskFirstPage.imags;
      this.buildTask.tendersId = buildTaskFirstPage.tendersId;
      this.buildTask.processDataId = buildTaskFirstPage.processDataId;
      // 清空该页；
      this.dialogFormVisible = true;
      this.dialogSecondVisible = false;
    },
    handleFileChange(e) {
      const files = e.target.files;
      const self = this;
      self.buildTask.imags = files;
      self.buildTaskFirstPage.imags = files;
      self.imgFileName = files.length > 0 ? `${files.length}个图片` : files[0].name;
      if (files.length > 0) {
        const src = [];
        self.imgButtonIsDisable = false;
        for (const key in files) {
          if (key && key < files.length) {
            const reader = new FileReader();
            reader.readAsDataURL(files[key]);
            reader.onload = function () {
              src.push(this.result);
            };
          }
        }
        self.uploadFileSrc = src;
      }
    },
    handleGroupChange(val) {
      this.departmentQuery.teamId = this.buildTask.teamId;
      this.buildTask.tendersIdList2 = [];
      this.handleDepartmentList();
      for (const key in this.teamIdList) {
        if (key) {
          if (this.teamIdList[key].id === val) {
            this.buildTask.teamerName = this.teamIdList[key].name;
          }
        }
      }
    },
    handleTeamUserIdsChange(val) {
      // 记录人员
      if (val === null) {
        this.buildTask.teamUserIds = null;
        this.buildTask.teamuserNames = null;
      } else {
        let teamUserIds = '';
        let teamUserNames = '';
        let sumSalary = 0;
        for (const key in val) {
          if (key) {
            teamUserIds += val[key];
            if (key !== String(val.length - 1)) {
              teamUserIds += ',';
            }
            if (this.buildTask.teamType === 0) {
              for (const joy in this.mechanicList) {
                if (joy && this.mechanicList[joy].id === val[key]) {
                  teamUserNames += this.mechanicList[joy].name;
                  if (key !== String(val.length - 1)) {
                    teamUserNames += ',';
                  }
                  if (this.mechanicList[joy].salary && this.mechanicList[joy].salary !== null) {
                    sumSalary += this.mechanicList[joy].salary;
                  }
                  break;
                }
              }
            } else {
              for (const joy in this.departmentList) {
                if (joy && this.departmentList[joy].id === val[key]) {
                  teamUserNames += this.departmentList[joy].name;
                  if (key !== String(val.length - 1)) {
                    teamUserNames += ',';
                  }
                  if (this.departmentList[joy].salary && this.departmentList[joy].salary !== null) {
                    sumSalary += this.departmentList[joy].salary;
                  }
                  break;
                }
              }
            }
          }
        }
        this.buildTask.teamUserIds = teamUserIds;
        this.buildTask.teamUserNames = teamUserNames;
        this.sumSalaryTemp = sumSalary;
      }
    },
    handleImagsShow() {
      this.dialogImgVisible = true;
    },
    handleDetailEdit(params) {
      // params 数据回显 两种 如果属性改变怎么做，存储 不存储前面的内容，在最后循环添加上去
      this.buildTask.index = params.index;
      this.buildTask.dailySalary = params.dailySalary;
      this.buildTask.constructContent = params.constructContent;
      this.buildTask.constructPart = params.constructPart;
      this.buildTask.constructType = params.constructType;
      this.buildTask.teamTypeStr = params.teamTypeStr;
      this.buildTask.tendersIdList1 = params.tendersIdList1;
      this.buildTask.tendersIdList2 = params.tendersIdList2;
      this.buildTask.dayWorkHours = params.dayWorkHours;
      this.buildTask.nightWorkHours = params.nightWorkHours;
      // 关闭 条目详情模态框
      this.dialogDetailModelVisible = false;
    },
    handleDetailRemove(index) {
      // 移除并从新排序  总工资扣除
      let isShort = false;
      const listTemp = [];
      for (const key in this.detailListTemp) {
        if (key) {
          if (this.detailListTemp[key].index === index) {
            isShort = true;
            this.sumDailySalary -= this.detailListTemp[key].dailySalary;
          } else {
            if (isShort) {
              this.detailListTemp[key].index -= 1;
            }
            listTemp.push(this.detailListTemp[key]);
          }
        }
      }
      this.detailListTemp = listTemp;
      this.buildTaskLength = this.detailListTemp.length;
    },
    resetForm() {
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.$el.reset();
    },
    resetSecondForm() {
      this.$refs.dialogSecondForm.resetFields();
      this.$refs.dialogSecondForm.$el.reset();
    },
    resetAgreeForm() {
      this.$refs.dialogAgreeForm.resetFields();
      this.$refs.dialogAgreeForm.$el.reset();
    },
    handleColType(val) {
      let result = 'success';
      if (val === 1) {
        result = '';
      } else if (val === 2) {
        result = 'warning';
      }
      return result;
    },
    handleApprov(param) {
      this.buildTaskAgree.currentNodeId = param.currentNode;
      this.dialogAgreeVisible = true;
    },
    handleAgreeCancel() {
      this.dialogAgreeVisible = false;
    },
    handleSaveAgreeTask() {
      const msg = this;
      const idea = msg.buildTaskAgree.idea;
      delete msg.buildTaskAgree.idea;
      msg.buildTaskAgree.idea = Number(idea);
      msg.$refs.dialogAgreeForm.validate((valid) => {
        if (valid) {
          approvConstructionTask(msg.buildTaskAgree).then((res) => {
            const { callStatus } = res.data;
            if (callStatus === 'SUCCEED') {
              msg.$message({
                type: 'success',
                message: this.$t('message.approvDown'),
              });
              // 获取审核流程
              this.handleShowTaskApprov();
              // 获取审核事件
              this.handleShowTaskEvent();
              // 更新人物的那列表
              this.getList();
              this.dialogAgreeVisible = false;
            } else {
              msg.$message({
                type: 'error',
                message: this.$t('message.notCorrect'),
              });
            }
          });
        }
      });
    },
    handleBuildTaskEdit() {
      // 任务单新增变edit
      this.actionStatus = 'edit';
      // 任务单赋值
      const buildTask = JSON.parse(JSON.stringify(this.buildTaskEdit));
      // 获取班组长id
      this.buildTask.name = buildTask.name;
      this.buildTask.createUser = buildTask.createUser;
      this.buildTask.constructionDates = buildTask.constructionDates;
      this.buildTask.imags = buildTask.imags;
      this.buildTask.tendersId = buildTask.tendersId;
      this.buildTask.processDataId = buildTask.processDataId;
      this.buildTask.index = 1;
      // 只提出需要的内容
      this.buildTaskSecondPage = {
        constructContent: buildTask.constructContent,
        constructType: buildTask.constructType,
        teamType: buildTask.teamType,
        teamTypeStr: String(buildTask.teamType),
        teamUserIds: buildTask.teamUserIds,
        teamUserNames: this.buildTaskDetailList[0].teamUserNames,
        dayWorkHours: buildTask.dayWorkHours,
        nightWorkHours: buildTask.nightWorkHours,
        constructPart: buildTask.constructPart,
        pid: null,
        id: this.buildTaskDetailList[0].id,
      };
      // 处理标段
      for (const key in this.bidsList) {
        if (key) {
          if (this.bidsList[key].name === this.buildTaskEdit.tenders) {
            this.buildTask.tendersId = this.bidsList[key].id;
            break;
          }
        }
      }
      // 处理人员
      if (buildTask.teamType === 0) {
        this.isGroup = false;
        this.buildTaskSecondPage.tendersIdList1 = buildTask.teamUserIdList;
        this.addSecondRules.tendersIdList1 = [{ required: true, message: `点工${this.$t('message.notEmpty')}`, trigger: 'change' }];
        this.addSecondRules.teamId = [{ required: false, message: `班组长${this.$t('message.notEmpty')}`, trigger: 'change' }];
        this.addSecondRules.tendersIdList2 = [{ required: false, message: `班组人员${this.$t('message.notEmpty')}`, trigger: 'change' }];
      } else {
        this.isGroup = true;
        this.buildTaskSecondPage.teamId = buildTask.teamId;
        this.handleDepartmentList();
        this.buildTaskSecondPage.tendersIdList2 = buildTask.teamUserIdList;
        this.addSecondRules.tendersIdList1 = [{ required: false, message: `点工${this.$t('message.notEmpty')}`, trigger: 'change' }];
        this.addSecondRules.teamId = [{ required: true, message: `班组长${this.$t('message.notEmpty')}`, trigger: 'change' }];
        this.addSecondRules.tendersIdList2 = [{ required: true, message: `班组人员${this.$t('message.notEmpty')}`, trigger: 'change' }];
      }
      // 任务单条目赋值
      for (const key in this.buildTaskDetailList) {
        if (key) {
          this.buildTaskDetailList[key].dailySalary = this.buildTaskDetailList[key].salary;
          this.buildTaskDetailList[key].teamTypeStr = String(this.buildTaskDetailList[key].teamType);
          this.buildTaskDetailList[key].index = Number(key) + 1;
          this.buildTaskDetailList[key].teamUserNames = this.buildTaskDetailList[key].teamUserIds;
          let teamUserIds = '';
          for (const joy in this.buildTaskDetailList[key].teamUserIdList) {
            if (joy) {
              teamUserIds += this.buildTaskDetailList[key].teamUserIdList[joy];
              if (joy !== String(this.buildTaskDetailList[key].teamUserIdList.length - 1)) {
                teamUserIds += ',';
              }
            }
          }
          this.buildTaskDetailList[key].teamUserIds = teamUserIds;
          this.buildTaskDetailList[key].teamerName = this.buildTaskDetailList[key].teamName;
        }
      }
      this.detailListTemp = this.buildTaskDetailList;
      // 任务单条数赋值
      this.buildTaskLength = this.detailListTemp.length;
      // 工资总额赋值
      this.sumDailySalary = this.sumMsgDailySalary;
      // 任务单新增首页
      this.dialogFormVisible = true;
      // 图片处理：
      if (this.buildTaskEdit.imgs !== null && this.buildTaskEdit.imgs.length > 0) {
        this.imgFileName = `有${String(this.buildTaskEdit.imgs.length)}个图片`;
        this.uploadFileSrc = this.buildTaskEdit.imgs;
      } else {
        this.imgFileName = '';
        this.uploadFileSrc = null;
      }
    },
    handleExportConstructionTask() {
      exportConstructionTask({ id: this.buildTaskEdit.id, processDataId: this.buildTaskEdit.processDataId, projectId: this.buildTask.projectId }).then((res) => {
        window.open(setFileRootForDownload(res.data));
      });
    },
    handleBuildTaskShowStyle() {
      this.handleProject();
      this.dialogShowOutVisible = true;
    },
    handleShowOutCancel() {
      this.dialogShowOutVisible = false;
    },
    handlePrint() {
      const subOutputRankPrint = document.getElementById('printDiv');
      const newContent = subOutputRankPrint.innerHTML;
      const oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
  .buildTask{
    .searchDiv{
      margin-top: 20px;
      margin-left: 29px;

      .searchSecondDiv {
        width: 33%;
        float: left;
      }
      .searchProp {
        text-align: left;
        height: 40px;
        span{
          float: left;
          line-height: 40px;
        }
        .elCss {
          width: 180px;
          font-family: PingFangSC;
          font-weight: bolder;
          float: left;
          margin-left: 10px;
        }
        .elCssBig{
          width: 260px;
          font-family: PingFangSC;
          font-weight: bolder;
          float: left;
          margin-left: 10px;
        }
      }
    }
    .list-wrapper{
      margin-top: 1%;
    }
    .pagination-container {
      margin-left: 32px;
      margin-bottom: 26px;
    }
    .dialogMid {
      background-color: #F5F5F5;
      height: 36px;
      width: 944px;
      margin-top: 10px;
    }
    .dialogMidSpan {
      color: #909399;
      font-size: 13px;
      line-height: 36px;
      margin-left: 10px;
      float: left;
    }
    .showMain {

    }
    .showMain-top{
      table{
        width: 90%;
        margin-top: 10px;
        margin-left: 5%;
        td{
          width: 50%;
          height: 30px;
        }
      }
    }
    .showOutMsg{
      table{
        border-collapse:collapse;
        border-spacing:0;
        font-family: SimSun;
        width: 80%;
        margin-left: 10%;
        font-size: 12pt;
        tr{
          td{
            border: 1px solid;
            text-align: center;
            span{
              line-height: 30px;
            }
          }
        }

        .tr_tdNoBorder {
          td{
            border: none;
          }
        }
        .tdTop{
          font-size: 16pt;
          font-weight: bold;
          text-align: center;
          height: 50px;
          letter-spacing: 5px;
        }
        .dtTopSecond{
          text-align: center;
          height: 40px;
        }
        .fontBold{
          font-weight: bold;
        }
        .floatLeftDiv1{
          float: left;
          width:19%;
          text-align: center;
          border-right: 1px solid;
          height: 30px;
        }
        .floatLeftDiv2{
          float: left;
          width: 80%;
          text-align: center;
          height: 30px;
        }
        .approvTable{
          width: 804px;
          margin-left: -1px;
          margin-right: -1px;
          margin-top: -1px;
          tr{
            td{
              border: 1px solid;
            }
          }
        }
      }
    }
  }
</style>
