<template>
  <div class="workLog">
    <breadcrumb>
      <el-button @click= "handleAddLog" type="text">新增施工日志</el-button>
    </breadcrumb>
    <header class="searchDiv">
      <div class="searchDivMid">
        <span>创建人</span>
        <el-input class="searchDivMidInput" v-model="logQuery.userRealName" placeholder="请输入创建人" @change="handleCreateNameChange"></el-input>
      </div>
      <div class="searchDivMid">
        <span>日志日期</span>
        <el-date-picker
          v-model="dateList"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="searchDivMidDatePicker"
          value-format="yyyy-MM-dd"
          @change="handleConstructionDatesChange"
          :picker-options="dataOptions">
        </el-date-picker>
      </div>
    </header>
    <div class="list-wrapper">
      <el-table
        :data="logList"
        v-loading="logListLoading"
        fit
        highlight-current-row
        style="width: 96%;margin-left: 2%;"
      >
        <el-table-column align="center" label="序号" type="index" > </el-table-column>
        <el-table-column align="center" label="标段" prop="projectTenderName" ></el-table-column>
        <el-table-column align="center" label="日志日期" prop="constructionDate" ></el-table-column>
        <el-table-column align="center" label="天气" prop="dayWeather" ></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createDate"></el-table-column>
        <el-table-column align="center" label="创建人" prop="createUserName" ></el-table-column>
        <el-table-column align="center" :label="$t('table.operation')">
          <template slot-scope="scope">
            <div class="operation-btns">
              <el-button type="primary"  size="small" @click="handleShowLog(scope.row)">查看</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="logQuery.pageIndex"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="logQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogAddVisible"
      width="900px"
      @close="resetAddForm"
    >
      <div slot="title" style="font-weight: bolder">
        {{ actionStatus === 'add' ? '新增施工日志' : '施工日志详情' }}
      </div>
      <hr noshade size="1px" style="margin-top: -10px; margin-bottom: 10px;color: #f5f7fa" >
      <div class="dialogMid">
        <i class="el-icon-info"></i>
        <span>日志基本信息</span>
      </div>
      <el-form :rules="logInfoRules" ref="dialogLogInfoForm" :model="logInfo">
        <div class="topTableDiv">
          <table class="table1">
            <tr>
              <td>
                <el-form-item label="日期:" prop="constructDates">
                  <el-date-picker
                    v-model="logInfo.constructDates" value-format="yyyy-MM-dd" placeholder="选择日期"
                    @change="handleConstructDatesChange"
                    :disabled="actionStatus !== 'add'" align="left" type="date" style="width: 200px">
                  </el-date-picker>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="突发事件:" prop="emergencyState">
                  <el-radio v-model="logInfo.emergencyState" :disabled="actionStatus !== 'add'" label="0">无</el-radio>
                  <el-radio v-model="logInfo.emergencyState" :disabled="actionStatus !== 'add'" label="1" style="margin-left: 5px;">有</el-radio>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="地点:" prop="cityCode">
                  <el-cascader :options="cityOptions" v-model="logInfo.cityCode" placeholder="请选择城市"
                               :disabled="actionStatus !== 'add'" style="width: 200px;" @change="handleCityChange">
                  </el-cascader>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="标段:" prop="tendersId">
                  <el-select v-model="logInfo.tendersId" :disabled="actionStatus !== 'add'">
                    <el-option
                      v-for="(item, i) in bidsList"
                      :key="i"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
          </table>
          <table class="table2">
            <tr>
              <td class="td1">
                <el-form-item label="白天:" ></el-form-item>
              </td>
              <td>
                <el-form-item label="天气:" prop="dayWeather">
                  <el-input v-model="logInfo.dayWeather" :disabled="actionStatus !== 'add'" style="width: 150px"></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="温度:" prop="dayTemperature">
                  <el-input v-model="logInfo.dayTemperature" :disabled="actionStatus !== 'add'" style="width: 150px"></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="风力:" prop="dayWindForce">
                  <el-input v-model="logInfo.dayWindForce" :disabled="actionStatus !== 'add'" style="width: 150px"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="td1">
                <el-form-item label="夜间:" ></el-form-item>
              </td>
              <td>
                <el-form-item label="天气:" prop="nightWeather">
                  <el-input v-model="logInfo.nightWeather" :disabled="actionStatus !== 'add'" style="width: 150px"></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="温度:" prop="nightTemperature">
                  <el-input v-model="logInfo.nightTemperature" :disabled="actionStatus !== 'add'" style="width: 150px"></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="风力:" prop="nightWindForce">
                  <el-input v-model="logInfo.nightWindForce" :disabled="actionStatus !== 'add'" style="width: 150px"></el-input>
                </el-form-item>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
      <div class="dialogMid">
        <i class="el-icon-info"></i>
        <span>生产情况记录</span>
      </div>
      <div class="secondTableDiv">
        <el-table :data="logDetailList" v-loading="logDetailListLoading">
          <el-table-column align="center"  label="序号" type="index" ></el-table-column>
          <el-table-column align="center" label="作业人员" prop="userNameList" ></el-table-column>
          <el-table-column align="center" label="施工部位" prop="constructPartName" ></el-table-column>
          <el-table-column align="center" label="施工内容" prop="constructContent" ></el-table-column>
          <el-table-column align="center" :label="$t('table.operation')">
            <template slot-scope="scope">
              <div class="operation-btns">
                <el-button type="primary"  :disabled="actionStatus !== 'add'" size="small" @click="handleLogDetailDelete(scope.row)">{{$t('btn.delete')}}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="threeTableDiv">
        <el-form :rules="addSecondRules" ref="dialogLogDetailForm" :model="logDetail">
          <div class="threeTableDiv_select">
            <el-form-item prop="userIdListTemp">
              <el-select
                placeholder="请选择施工人员"
                v-model="logDetail.userIdListTemp"
                multiple
                filterable
                collapse-tags
                :disabled="actionStatus !== 'add'"
                @change="handleUserIdListChange">
                <el-option
                  v-for="item in workerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.type === 'A' ? '自有工人': '班组工人' }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="threeTableDiv_select">
            <el-form-item prop="constructPartId">
              <el-select
                placeholder="请选择施工部位"
                filterable
                v-model="logDetail.constructPartId"
                :disabled="actionStatus !== 'add'"
                @change="handleConstructPartChange" >
                <el-option
                  v-for="item in constructPartList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
                <el-option value = "000" label="新增施工部位">
                  <i class="el-icon-circle-plus-outline" style="color: blue"></i>
                  <span style="margin-left: 10px;color: blue" >新增施工部位</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="threeTableDiv_select">
            <el-form-item prop="constructContentTemp">
              <el-cascader
                expand-trigger="hover"
                placeholder="请选择施工内容"
                filterable
                :options="constructContentOptions"
                v-model="logDetail.constructContentTemp"
                :disabled="actionStatus !== 'add'"
                @change="handleConstructContentChange">
              </el-cascader>
            </el-form-item>
          </div>
          <div class="threeTableDiv_button">
            <el-button  type="primary"  size="small" @click="handleLogDetailAdd" :disabled="actionStatus !== 'add'">{{$t('btn.add')}}</el-button>
          </div>
        </el-form>
      </div>
      <div class="dialogMid">
        <i class="el-icon-info"></i>
        <span>技术质量安全工作记录</span>
      </div>
      <el-form :rules="stateRules" ref="dialogStateForm" :model="logInfo">
        <div class="fourDiv">
          <span>技术工作记录:</span>
          <div class="fourDiv_switchDiv">
            <el-radio v-model="logInfo.technologyDiscloseState" label="1" :disabled="actionStatus !== 'add'" @change="handleTechnologyDiscloseStateChange">有交底</el-radio>
            <el-radio v-model="logInfo.technologyDiscloseState" label="0" :disabled="actionStatus !== 'add'" @change="handleTechnologyDiscloseStateChange">无交底</el-radio>
          </div>
          <div class="fourDiv_inputDiv">
            <el-form-item prop="technologyDiscloseContent" v-if="logInfo.technologyDiscloseState === '1'">
              <el-input
                v-if="logInfo.technologyDiscloseState === '1'"
                :disabled="actionStatus !== 'add'"
                class="fourDiv_input"
                v-model="logInfo.technologyDiscloseContent"
                placeholder="请输入技术工作记录"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="fourDiv">
          <span>质量工作记录:</span>
          <div class="fourDiv_switchDiv">
            <el-radio v-model="logInfo.qualityDiscloseState" label="1" :disabled="actionStatus !== 'add'" @change="handleQualityDiscloseStateChange">有交底</el-radio>
            <el-radio v-model="logInfo.qualityDiscloseState" label="0" :disabled="actionStatus !== 'add'" @change="handleQualityDiscloseStateChange">无交底</el-radio>
          </div>
          <div class="fourDiv_inputDiv">
            <el-form-item prop="qualityDiscloseContent" v-if="logInfo.qualityDiscloseState === '1'">
              <el-input v-if="logInfo.qualityDiscloseState === '1'" :disabled="actionStatus !== 'add'" class="fourDiv_input" v-model="logInfo.qualityDiscloseContent" placeholder="请输入质量工作记录"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="fourDiv">
          <span>安全工作记录:</span>
          <div class="fourDiv_switchDiv">
            <el-radio v-model="logInfo.safetyDiscloseState" label="1" :disabled="actionStatus !== 'add'" @change="handleSafetyDiscloseStateChange">有交底</el-radio>
            <el-radio v-model="logInfo.safetyDiscloseState" label="0" :disabled="actionStatus !== 'add'" @change="handleSafetyDiscloseStateChange">无交底</el-radio>
          </div>
          <div class="fourDiv_inputDiv">
            <el-form-item prop="safetyDiscloseContent" v-if="logInfo.safetyDiscloseState === '1'">
              <el-input v-if="logInfo.safetyDiscloseState === '1'" :disabled="actionStatus !== 'add'" class="fourDiv_input" v-model="logInfo.safetyDiscloseContent" placeholder="请输入安全工作记录"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="dialogMid">
          <i class="el-icon-info"></i>
          <span>材料、构配件进场记录</span>
        </div>
        <div class="fourDiv">
          <span>材料、构配件进场记录:</span>
          <div class="fourDiv_switchDiv">
            <el-radio v-model="logInfo.materialDiscloseState" label="1" :disabled="actionStatus !== 'add'" @change="handleMaterialDiscloseStateChange">有交底</el-radio>
            <el-radio v-model="logInfo.materialDiscloseState" label="0" :disabled="actionStatus !== 'add'" @change="handleMaterialDiscloseStateChange">无交底</el-radio>
          </div>
          <div class="fourDiv_inputDiv">
            <el-form-item prop="materialDiscloseContent" v-if="logInfo.materialDiscloseState === '1'">
              <el-input v-if="logInfo.materialDiscloseState === '1'" :disabled="actionStatus !== 'add'" class="fourDiv_input" v-model="logInfo.materialDiscloseContent" placeholder="请输入材料进出场记录"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer">
        <el-button @click="handleLogCancel">{{$t('btn.cancel')}}</el-button>
        <el-button @click="handleLogShowStyle">预览</el-button>
        <el-button type="primary"  @click="handleExportConstructionLog" v-if = "actionStatus !== 'add'">{{$t('btn.export')}}</el-button>
        <el-button type="primary" :disabled="actionStatus !== 'add'" @click="handleLogSave">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogAddConstructPartVisible"
      width="400px"
      @close="resetAddConstructPartForm"
    >
      <div slot="title" style="font-weight: bolder">
        {{ '新增施工部位' }}
      </div>

      <el-form :rules="addConstructPartRules" ref="dialogAddConstructPartForm" :model="constructPart">
        <el-form-item prop="name" label="施工部位" label-position="left">
          <el-input  v-model="constructPart.name"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="handleConstructPartCancel">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary" :disabled="actionStatus !== 'add'" @click = "handleConstructPartSave">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogAddConstructContentVisible"
      width="400px"
      @close="resetAddConstructContentForm"
    >
      <div slot="title" style="font-weight: bolder">
        {{ '新增施工施工内容' }}
      </div>
      <el-form :rules="addConstructContentRules" ref="dialogAddConstructContentForm" :model="constructContent">
        <el-form-item prop="type" label="内容类别" label-position="top">
          <el-select v-model="constructContent.type" style="width: 100%">
            <el-option
              v-for="(item, i) in logConstructionPartName"
              :key="i"
              :label="item"
              :value="String(i)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="施工内容" label-position="top">
          <el-input  v-model="constructContent.name" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleConstructContentCancel">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary" :disabled="actionStatus !== 'add'" @click = "handleConstructContentSave">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogLogShowAsWordVisible"
      width="794px"
    >
      <!--page-break-before和page-breake-after为avolid。/*margin-top: 10mm;*/-->
      <!--startprint-->
      <div id="printDiv" style="width: 190mm;margin-left: 5mm;">
        <table style="
        width:164mm;
        border-collapse:collapse;
        border-spacing:0;
        font-family: SimSun;
        margin-left: 13mm;
        padding-top: 10mm;
        @media only print { margin-left:10mm; };">
          <tr><td colspan="5" style="text-align: center;height: 50px; font-size: 32px; font-weight: bold; letter-spacing: 20px;">施工日志</td></tr>
          <tr>
            <td></td>
            <td colspan="3" style=" border: none; height: 30px; font-size: 14pt; letter-spacing: 2px;text-align: center">
              日期：    {{ logInfo.year }}年    {{ logInfo.month }}月   {{ logInfo.day }}日    星期{{ logInfo.week }}
            </td>
            <td style="border: none;"></td>
          </tr>
          <tr>
            <td style="font-size: 14pt; font-weight: bold; height: 50px;letter-spacing: 5px;border: 1px solid;text-align: center"></td>
            <td style="font-size: 14pt; font-weight: bold; height: 50px;border: 1px solid;text-align: center">天气状况</td>
            <td style="font-size: 14pt; font-weight: bold; height: 50px;border: 1px solid;text-align: center">风力</td>
            <td style="font-size: 14pt; font-weight: bold; height: 50px;border: 1px solid;text-align: center">最高/最低温度</td>
            <td style="font-size: 14pt; font-weight: bold; height: 50px;border: 1px solid;text-align: center">备注</td>
          </tr>
          <tr>
            <td style="font-size: 14pt; font-weight: bold; height: 50px;letter-spacing: 5px;border: 1px solid;text-align: center">白天</td>
            <td style="font-size: 13pt;border: 1px solid;text-align: center">{{ logInfo.dayWeather }}</td>
            <td style="font-size: 13pt;border: 1px solid;text-align: center">{{ logInfo.dayWindForce }}</td>
            <td style="font-size: 13pt;border: 1px solid;text-align: center">{{ logInfo.dayTemperature }}</td>
            <td style="font-size: 13pt;border: 1px solid;text-align: center"></td>
          </tr>
          <tr>
            <td style="font-size: 14pt; font-weight: bold; height: 50px;letter-spacing: 5px;border: 1px solid;text-align: center">夜间</td>
            <td style="font-size: 13pt;border: 1px solid;text-align: center">{{ logInfo.nightWeather }}</td>
            <td style="font-size: 13pt;border: 1px solid;text-align: center">{{ logInfo.nightWindForce }}</td>
            <td style="font-size: 13pt;border: 1px solid;text-align: center">{{ logInfo.nightTemperature }}</td>
            <td style="font-size: 13pt;border: 1px solid;text-align: center"></td>
          </tr>
          <tr>
            <td style="border: 1px solid;" colspan="5">
              <table>
                <tr>
                  <td>
                    <span style="padding-left: 20px;padding-top:10px;font-size: 14pt;font-weight: bold;">生产情况记录：（部位项目、机械作业、班组工作、生产存在问题等） </span>
                  </td>
                </tr>
                <tr>
                  <td style="display:block;min-height: 190px;">
                    <span style="padding-left: 20px;font-size: 13pt;color: gray()">{{ logInfo.detailMsg }}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid;" colspan="5">
              <table>
                <tr>
                  <td>
                    <span style="padding-left: 20px;padding-top:10px;font-size: 14pt;font-weight: bold;">技术质量安全工作记录：（技术质量安全活动、技术质量安全问题、检查评定验收等）</span>
                  </td>
                </tr>
                <tr>
                  <td style="display:block;min-height: 190px;">
                    <span style="padding-left: 20px;font-size: 13pt;color: gray()">{{ logInfo.discloseMsg }}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid;" colspan="5">
              <table>
                <tr>
                  <td>
                    <span style="padding-left: 20px;padding-top:10px;font-size: 14pt;font-weight: bold;">材料、构配件进场记录</span>
                  </td>
                </tr>
                <tr>
                  <td style="display:block;min-height: 190px;">
                    <span style="padding-left: 20px;font-size: 13pt;color: gray()">{{ logInfo.outInMsg }}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="height: 40px;border: 1px solid" colspan="5">
              <div style="border-left: none;width: 25%; text-align: center;  float: left; height: 40px;">
                <span style="line-height: 40px; font-size: 14pt; font-weight: bold;">工程负责人</span>
              </div>
              <div style="border-left: none;width: 25%; text-align: center; border-left: 1px solid; float: left; height: 40px;">
                <span style="line-height: 40px; font-size: 14pt;">{{ logInfo.leader }}</span>
              </div>
              <div style="border-left: none;width: 25%; text-align: center; border-left: 1px solid; float: left; height: 40px;">
                <span style="line-height: 40px; font-size: 14pt; font-weight: bold;">记录人</span>
              </div>
              <div style="border-left: none;width: 25%; text-align: center; border-left: 1px solid; float: left; height: 40px;">
                <span style="line-height: 40px; font-size: 14pt;">{{ logInfo.createUserName }}</span>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <!--endprint-->
      <div slot="footer">
        <el-button @click="handlePrint">打印</el-button>
        <el-button @click="handleLogAsWordClose">{{$t('btn.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getMechanicList, getDepartmentList } from '@/api/mechanic';
import { logConstructionPart, logConstructionPartName, setFileRootForDownload, amapKey } from '@/filters';
import { getConstructionLogList, getConstructPartList, addConstructPart, addProductionRecords, addConstructionLog, getWeather, getCity, exportConstructionLog } from '@/api/workLog';
// import { getBidsListByProject } from '@/api/bids';

export default {
  name: 'workLog',
  computed: {
    ...mapGetters({
      userMsg: 'userInfo',
    }),
  },
  data() {
    const { params: { id } } = this.$route;
    return {
      logQuery: {
        pageSize: 20,
        pageIndex: 1,
        projectId: id,
        userRealName: null,
        start: null,
        end: null,
      },
      mechanicQuery: {
        projectId: id,
        pageIndex: -1,
        pageSize: 20,
      },
      departmentQuery: {
        projectId: id,
        pageIndex: -1,
        pageSize: 20,
        teamId: null,
      },
      bidsQuery: {
        projectId: id,
      },
      totalNumber: 0,
      totalPage: 1,
      dialogAddVisible: false,
      dialogAddConstructPartVisible: false,
      dialogAddConstructContentVisible: false,
      dialogLogShowAsWordVisible: false,
      actionStatus: 'add',
      logList: [],
      workerList: [],
      bidsList: [],
      dateList: [],
      constructPartList: [],
      logDetailListLoading: false,
      logListLoading: false,
      cityOptions: [],
      city: '320500',
      logConstructionPart,
      logConstructionPartName,
      constructContentOptions: [],
      logDetailList: [],
      logInfo: {
        projectId: id,
        constructDates: '',
        emergencyState: '0',
        dayWeather: '',
        dayTemperature: '',
        dayWindForce: '',
        nightWeather: '',
        nightTemperature: '',
        nightWindForce: '',
        technologyDiscloseState: '1',
        technologyDiscloseContent: '',
        qualityDiscloseState: '1',
        qualityDiscloseContent: '',
        safetyDiscloseState: '1',
        safetyDiscloseContent: '',
        materialDiscloseState: '1',
        materialDiscloseContent: '',
        cityCode: ['320000', '320500'],
        tendersId: null,
      },
      logDetail: {
        userNameList: '',
        userIdList: '',
        constructPartName: null,
        constructPartId: null,
        constructContent: '',
        constructionLogId: null,
        userIdListTemp: [],
        constructContentTemp: [],
      },
      projectValue: {
        projectId: id,
        city: '',
      },
      project: null,
      constructPart: {
        projectId: id,
        name: '',
      },
      constructContent: {
        type: null,
        name: '',
      },
      weatherMsg: {
        dayIndex: 0,
        weatherList: [],
        cityCode: '',
        dateList: [],
      },
      addSecondRules: {
        userIdListTemp: [{ required: true, message: `工人${this.$t('message.notEmpty')}`, trigger: 'change' }],
        constructPartId: [{ required: true, message: `施工部位${this.$t('message.notEmpty')}`, trigger: 'change' }],
        constructContentTemp: [{ required: true, message: `施工类别${this.$t('message.notEmpty')}`, trigger: 'change' }],
      },
      addConstructPartRules: {
        name: [{ required: true, message: `施工部位${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
      addConstructContentRules: {
        type: [{ required: true, message: `施工内容类别${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        name: [{ required: true, message: `施工内容${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
      stateRules: {
        technologyDiscloseContent: [{ required: true, message: `技术工作记录${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        qualityDiscloseContent: [{ required: true, message: `质量工作记录${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        safetyDiscloseContent: [{ required: true, message: `安全工作记录${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        materialDiscloseContent: [{ required: true, message: `材料进出场记录${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
      logInfoRules: {
        cityCode: [{ required: true, message: `地点${this.$t('message.notEmpty')}`, trigger: 'change' }],
        constructDates: [{ required: true, message: `日期${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        dayWeather: [{ required: true, message: `天气${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        dayTemperature: [{ required: true, message: `温度${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        dayWindForce: [{ required: true, message: `风力${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        nightWeather: [{ required: true, message: `天气${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        nightTemperature: [{ required: true, message: `温度${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        nightWindForce: [{ required: true, message: `风力${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        tendersId: [{ required: true, message: `标段${this.$t('message.notEmpty')}`, trigger: 'change' }],
      },
    };
  },
  created() {
    // 获取数据列表
    // this.getLogList();
    this.getLogListFirstTime();
    // 处理时间
    this.handleDataOptions();
    // // 处理项目信息
    // this.handleProject();
    // 获取施工部位
    this.handleConstructPartList();
    // 获取用户
    this.handleWorkerList();
    // 获取施工内容
    this.handleConstructContentOptions();
    // 城市信息
    this.handleCity();
    // 获取最近四天的信息
    this.hanldeDateOfFour();
  },
  methods: {
    // handleProject() {
    //   const { params: { id } } = this.$route;
    //   // this.$store.dispatch('getBuildingInfo', { id });
    //   this.$store.dispatch('getProject', { id }).then((res) => {
    //     res.modelPart = res.modelPart ? res.modelPart.join(',') : null;
    //     res.teamList = res.teamList ? res.teamList.join(',') : null;
    //     this.project = { ...this.project, ...res };
    //     this.bidsList = this.project.projectTender;
    //   });
    // },
    handleCity() {
      // 省 -市
      const params = {
        subdistrict: '2',
        key: amapKey,
      };
      getCity(params).then((res) => {
        if (res && res.status === '1') {
          const data = res.districts[0].districts;
          const options = [];
          data.forEach((item) => {
            const dataSecond = item.districts;
            const children1 = [];
            dataSecond.forEach((joys) => {
              const city = {
                value: joys.adcode,
                label: joys.name,
              };
              children1.push(city);
            });
            const province = {
              value: item.adcode,
              label: item.name,
              children: children1,
            };
            options.push(province);
          });
          this.cityOptions = options;
        } else {
          this.$message({
            type: 'error',
            message: '获取地理信息失败',
          });
        }
      });
    },
    handleCityChange(val) {
      if (val !== null) {
        this.projectValue = `${val[0]},${val[1]}`;
        this.weatherMsg.cityCode = val[1];
        this.handleWeather();
      } else {
        this.projectValue = '';
      }
    },
    handleConstructDatesChange() {
      let dayIndex = -10;
      if (this.logInfo.constructDates && this.logInfo.constructDates !== null) {
        for (const key in this.weatherMsg.dateList) {
          if (key) {
            if (this.logInfo.constructDates === this.weatherMsg.dateList[key]) {
              dayIndex = Number(key);
              break;
            }
          }
        }
      }
      this.weatherMsg.dayIndex = dayIndex;
      if (dayIndex < 0) {
        this.$forceUpdate();
        this.$set(this.logInfo, 'dayWeather', '');
        this.$set(this.logInfo, 'dayTemperature', '');
        this.$set(this.logInfo, 'dayWindForce', '');
        this.$set(this.logInfo, 'nightWeather', '');
        this.$set(this.logInfo, 'nightTemperature', '');
        this.$set(this.logInfo, 'nightWindForce', '');
      } else {
        this.$forceUpdate();
        const weather = this.weatherMsg.weatherList[dayIndex];
        this.$set(this.logInfo, 'dayWeather', weather.dayweather);
        this.$set(this.logInfo, 'dayTemperature', weather.daytemp);
        this.$set(this.logInfo, 'dayWindForce', weather.daypower);
        this.$set(this.logInfo, 'nightWeather', weather.nightweather);
        this.$set(this.logInfo, 'nightTemperature', weather.nighttemp);
        this.$set(this.logInfo, 'nightWindForce', weather.nightpower);
      }
      // this.logInfo = Object.assign({}, this.logInfo, {});
      // this.$forceUpdate();
      // 数据层次太多，没有触发render函数进行自动更新时，调用
    },
    hanldeDateOfFour() {
      const start = new Date();
      const startAdd1 = new Date();
      const startAdd2 = new Date();
      const startAdd3 = new Date();
      startAdd1.setTime(start.getTime() + (3600 * 1000 * 24 * 1));
      startAdd2.setTime(start.getTime() + (3600 * 1000 * 24 * 2));
      startAdd3.setTime(start.getTime() + (3600 * 1000 * 24 * 3));
      this.weatherMsg.dateList = [this.handleNow(start), this.handleNow(startAdd1), this.handleNow(startAdd2), this.handleNow(startAdd3)];
    },
    handleWeather() {
      // 处理参数
      const params = {
        city: this.weatherMsg.cityCode,
        extensions: 'all',
        key: amapKey,
      };
      if (this.weatherMsg.dayIndex >= 0) {
        // 处理天气
        getWeather(params).then((res) => {
          this.$forceUpdate();
          const { casts } = res.forecasts[0];
          this.logInfo.dayTemperature = casts[this.weatherMsg.dayIndex].daytemp;
          this.logInfo.nightTemperature = casts[this.weatherMsg.dayIndex].nighttemp;
          this.logInfo.dayWindForce = casts[this.weatherMsg.dayIndex].daypower;
          this.logInfo.nightWindForce = casts[this.weatherMsg.dayIndex].nightpower;
          this.logInfo.dayWeather = casts[this.weatherMsg.dayIndex].dayweather;
          this.logInfo.nightWeather = casts[this.weatherMsg.dayIndex].nightweather;
          this.weatherMsg.weatherList = casts;
        });
      }
    },
    getLogListFirstTime() {
      this.logListLoading = true;
      // 获取项目信息
      const { params: { id } } = this.$route;
      let bidsRes = [];
      // this.$store.dispatch('getBuildingInfo', { id });
      this.$store.dispatch('getProject', { id }).then((projectRes) => {
        projectRes.modelPart = projectRes.modelPart ? projectRes.modelPart.join(',') : null;
        projectRes.teamList = projectRes.teamList ? projectRes.teamList.join(',') : null;
        this.project = { ...this.project, ...projectRes };
        bidsRes = this.project.projectTender;
        this.bidsList = bidsRes;
        if (bidsRes) {
          getConstructionLogList(this.logQuery).then((res) => {
            if (res) {
              const { data, totalNumber, totalPage } = res;
              this.totalNumber = totalNumber;
              this.totalPage = totalPage;
              const logList = [];
              if (data && data !== undefined && data !== null && data.length > 0) {
                data.forEach((item) => {
                  item.createDate = item.createDate.substring(0, (item.createDate.length - 3));
                  item.tendersId = Number(item.projectTender);
                  if (bidsRes && bidsRes.length > 0) {
                    bidsRes.forEach((joy) => {
                      if (item.projectTender !== null && joy.id === Number(item.projectTender)) {
                        item.projectTenderName = joy.name;
                      }
                    });
                    logList.push(item);
                  }
                });
              }
              this.logList = logList;
            }
          });
          this.logListLoading = false;
        } else {
          this.$message({
            type: 'error',
            message: '获取数据失败',
          });
        }
      });
    },
    getLogList() {
      getConstructionLogList(this.logQuery).then((res) => {
        if (res) {
          const { data, totalNumber, totalPage } = res;
          this.totalNumber = totalNumber;
          this.totalPage = totalPage;
          const logList = [];
          if (data && data !== undefined && data !== null && data.length > 0) {
            data.forEach((item) => {
              item.createDate = item.createDate.substring(0, (item.createDate.length - 3));
              item.tendersId = Number(item.projectTender);
              if (this.bidsList && this.bidsList.length > 0) {
                this.bidsList.data.forEach((joy) => {
                  if (item.projectTender !== null && joy.id === Number(item.projectTender)) {
                    item.projectTenderName = joy.name;
                  }
                });

                logList.push(item);
              }
            });
          }
          this.logList = logList;
        }
      });
      this.logListLoading = false;
    },
    handleLogDetailDelete(params) {
      const detailList = [];
      this.logDetailList.forEach((item) => {
        if (item.index !== params.index) {
          item.index = detailList.length;
          detailList.push(item);
        }
      });
      this.logDetailList = detailList;
    },
    handleLogDetailAdd() {
      // 验证表单
      this.$refs.dialogLogDetailForm.validate((valid) => {
        if (valid) {
          // 信息添加
          const detail = JSON.parse(JSON.stringify(this.logDetail));
          detail.index = this.logDetailList.length;
          this.logDetailList.push(detail);
          this.$refs.dialogLogDetailForm.resetFields();
          this.$refs.dialogLogDetailForm.$el.reset();
        }
      });
    },
    handleConstructPartList() {
      getConstructPartList().then((res) => {
        const { data } = res;
        this.constructPartList = data;
      });
    },
    handleWorkerList() {
      const workerList = [];
      getMechanicList(this.mechanicQuery).then((res) => {
        const { data } = res;
        for (const key in data) {
          if (key) {
            // type ： 0,1 自有工人，班组工人    ;id = type + id  A1   B1 ;name
            workerList.push({ id: `A${data[key].id};${data[key].realName}`, name: data[key].realName, type: 'A' });
          }
        }
      });
      getDepartmentList(this.departmentQuery).then((res) => {
        const { data } = res;
        for (const key in data) {
          if (key) {
            workerList.push({ id: `B${data[key].id};${data[key].name}`, name: data[key].name, type: 'B' });
          }
        }
      });
      this.workerList = workerList;
    },
    handleConstructContentOptions() {
      const options = [];
      for (const key in logConstructionPart) {
        if (key) {
          const child = [];
          logConstructionPart[key].forEach((item) => {
            if (item) {
              const temp = {
                value: item,
                label: item,
              };
              child.push(temp);
            }
          });
          const opt = {
            label: logConstructionPartName[key],
            value: logConstructionPartName[key],
            children: child,
          };
          options.push(opt);
        }
      }
      this.constructContentOptions = options;
    },
    handleConstructContentChange(val) {
      if (val !== null) {
        if (val[1] === '其他') {
          this.logDetail.constructContentTemp = [];
          for (const key in this.logConstructionPartName) {
            if (key) {
              if (this.logConstructionPartName[key] === val[0]) {
                this.constructContent.type = key;
              }
            }
          }
          this.dialogAddConstructContentVisible = true;
        } else {
          this.logDetail.constructContent = `${val[0]}-${val[1]}`;
        }
      } else {
        this.logDetail.constructContent = '';
      }
    },
    handleNow(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      let dateTemp = `${year}-`;
      if (month < 10) {
        dateTemp += 0;
      }
      dateTemp = `${dateTemp}${month}-`;
      if (day < 10) {
        dateTemp += 0;
      }
      dateTemp = `${dateTemp}${day}`;
      return dateTemp;
    },
    handleAddLog() {
      this.actionStatus = 'add';
      // 时间
      const date = new Date();
      const logInfoTemp = {
        constructDates: this.handleNow(date),
        emergencyState: '0',
        technologyDiscloseState: '1',
        qualityDiscloseState: '1',
        safetyDiscloseState: '1',
        materialDiscloseState: '1',
        createUserName: this.userMsg.realName,
        projectId: this.logInfo.projectId,
      };
      // 标段赋值 -- 已经有了
      if (this.project.projectTender !== undefined && this.project.projectTender !== null) {
        logInfoTemp.projectTender = this.project.projectTender;
      }
      this.logInfo = logInfoTemp;
      this.weatherMsg.dayIndex = 0;
      if (this.project.cityCode && this.project.cityCode !== undefined && this.project.cityCode !== null) {
        const cityCodeTemp = this.project.cityCode.split(',');
        if (cityCodeTemp.length === 2) {
          this.logInfo.cityCode = cityCodeTemp;
          this.weatherMsg.cityCode = cityCodeTemp[1];
          this.handleWeather();
        } else {
          // 默认到苏州
          this.logInfo.cityCode = ['320000', '320500'];
          this.weatherMsg.cityCode = '320500';
          this.handleWeather();
        }
      } else {
        this.logInfo.cityCode = ['320000', '320500'];
        this.weatherMsg.cityCode = '320500';
        this.handleWeather();
      }
      this.dialogAddVisible = true;
    },
    handleUserIdListChange(val) {
      if (val !== null) {
        let userIdList = '';
        let userNameList = '';
        for (const key in val) {
          if (key) {
            if (Number(key) < (val.length - 1)) {
              userIdList = `${userIdList}${val[key]},`;
              userNameList = `${val[key].split(';')[1]},`;
            } else {
              userIdList = `${userIdList}${val[key]}`;
              userNameList = `${userNameList}${val[key].split(';')[1]}`;
            }
          }
        }
        this.logDetail.userIdList = userIdList;
        this.logDetail.userNameList = userNameList;
      } else {
        this.logDetail.userIdList = '';
        this.logDetail.userNameList = '';
      }
    },
    handleConstructPartChange(val) {
      if (val === '000') {
        this.dialogAddConstructPartVisible = true;
      } else {
        this.constructPartList.forEach((item) => {
          if (item.id === Number(val)) {
            this.logDetail.constructPartName = item.name;
          }
        });
      }
    },
    handleCreateNameChange(val) {
      this.logQuery.pageIndex = 1;
      if (val === '') {
        this.logQuery.userRealName = null;
      }
      this.getLogList();
    },
    handleConstructionDatesChange(val) {
      this.logQuery.pageIndex = 1;
      if (val !== null) {
        this.logQuery.start = val[0];
        this.logQuery.end = val[1];
      } else {
        this.logQuery.start = null;
        this.logQuery.end = null;
      }

      this.getLogList();
    },
    handleSizeChange(val) {
      this.logQuery.pageSize = val;
      this.getLogList();
    },
    handleCurrentChange(val) {
      this.logQuery.pageIndex = val;
      this.getLogList();
    },
    handleTechnologyDiscloseStateChange(val) {
      if (val === '0') {
        this.stateRules.technologyDiscloseContent = [{ required: false, message: `技术工作记录${this.$t('message.notEmpty')}`, trigger: 'blur' }];
        this.logInfo.technologyDiscloseContent = '';
      } else {
        this.stateRules.technologyDiscloseContent = [{ required: true, message: `技术工作记录${this.$t('message.notEmpty')}`, trigger: 'blur' }];
      }
    },
    handleQualityDiscloseStateChange(val) {
      if (val === '0') {
        this.stateRules.qualityDiscloseContent = [{ required: false, message: `质量工作记录${this.$t('message.notEmpty')}`, trigger: 'blur' }];
        this.logInfo.qualityDiscloseContent = '';
      } else {
        this.stateRules.qualityDiscloseContent = [{ required: true, message: `质量工作记录${this.$t('message.notEmpty')}`, trigger: 'blur' }];
      }
    },
    handleSafetyDiscloseStateChange(val) {
      if (val === '0') {
        this.stateRules.safetyDiscloseContent = [{ required: false, message: `安全工作记录${this.$t('message.notEmpty')}`, trigger: 'blur' }];
        this.logInfo.safetyDiscloseContent = '';
      } else {
        this.stateRules.safetyDiscloseContent = [{ required: true, message: `安全工作记录${this.$t('message.notEmpty')}`, trigger: 'blur' }];
      }
    },
    handleMaterialDiscloseStateChange(val) {
      if (val === '0') {
        this.stateRules.materialDiscloseContent = [{ required: false, message: `材料进出场记录${this.$t('message.notEmpty')}`, trigger: 'blur' }];
        this.logInfo.materialDiscloseContent = '';
      } else {
        this.stateRules.materialDiscloseContent = [{ required: true, message: `材料进出场记录${this.$t('message.notEmpty')}`, trigger: 'blur' }];
      }
    },
    resetAddForm() {
      // 基本信息清空
      this.$refs.dialogLogInfoForm.resetFields();
      this.$refs.dialogLogInfoForm.$el.reset();
      // 任务单条目清空
      this.$refs.dialogLogDetailForm.resetFields();
      this.$refs.dialogLogDetailForm.$el.reset();
      // 记录清空
      this.$refs.dialogStateForm.resetFields();
      this.$refs.dialogStateForm.$el.reset();
      // 数据清空
      this.logDetailList = [];
      // this.logInfo = {};
    },
    resetAddConstructPartForm() {
      this.$refs.dialogAddConstructPartForm.resetFields();
      this.$refs.dialogAddConstructPartForm.$el.reset();
    },
    resetAddConstructContentForm() {
      this.$refs.dialogAddConstructContentForm.resetFields();
      this.$refs.dialogAddConstructContentForm.$el.reset();
    },
    resetDialogLogDetailForm() {
      this.$refs.dialogLogDetailForm.resetFields();
      this.$refs.dialogLogDetailForm.$el.reset();
    },
    handleConstructContentCancel() {
      this.dialogAddConstructContentVisible = false;
      this.resetAddConstructContentForm();
    },
    handleConstructContentSave() {
      this.$refs.dialogAddConstructContentForm.validate((valid) => {
        if (valid) {
          this.constructContentOptions[this.constructContent.type].children.push({ value: this.constructContent.name, label: this.constructContent.name });
          this.logDetail.constructContent = `${logConstructionPartName[this.constructContent.type]}-${this.constructContent.name}`;
          this.dialogAddConstructContentVisible = false;
          this.logDetail.constructContentTemp = [logConstructionPartName[this.constructContent.type], this.constructContent.name];
        }
      });
    },
    handleConstructPartCancel() {
      this.dialogAddConstructPartVisible = false;
      this.resetAddConstructPartForm();
    },
    handleConstructPartSave() {
      this.$refs.dialogAddConstructPartForm.validate((valid) => {
        if (valid) {
          addConstructPart(this.constructPart).then((res) => {
            if (res) {
              this.$message({
                type: 'success',
                message: this.$t('message.operationSuccess'),
              });
              this.handleConstructPartList();
              this.dialogAddConstructPartVisible = false;
              this.logDetail.constructPart = this.constructPart.name;
            } else {
              this.$message({
                type: 'error',
                message: this.$t('message.operationSuccess'),
              });
              this.dialogAddConstructPartVisible = false;
            }
          });
        }
      });
    },
    handleLogCancel() {
      this.dialogAddVisible = false;
      // 还原信息 部分初始值保留
      this.resetAddForm();
    },
    handleLogSave() {
      const logTemp = {
        projectId: this.logInfo.projectId,
        constructDates: this.logInfo.constructDates,
        dayWindForce: this.logInfo.dayWindForce,
        dayWeather: this.logInfo.dayWeather,
        dayTemperature: this.logInfo.dayTemperature,
        nightWindForce: this.logInfo.nightWindForce,
        nightWeather: this.logInfo.nightWeather,
        nightTemperature: this.logInfo.nightTemperature,
        emergencyState: Number(this.logInfo.emergencyState),
        technologyDiscloseState: Number(this.logInfo.technologyDiscloseState),
        qualityDiscloseState: Number(this.logInfo.qualityDiscloseState),
        safetyDiscloseState: Number(this.logInfo.safetyDiscloseState),
        materialDiscloseState: Number(this.logInfo.materialDiscloseState),
        technologyDiscloseContent: this.logInfo.technologyDiscloseContent,
        qualityDiscloseContent: this.logInfo.qualityDiscloseContent,
        safetyDiscloseContent: this.logInfo.safetyDiscloseContent,
        materialDiscloseContent: this.logInfo.materialDiscloseContent,
        cityNode: `${this.logInfo.cityCode[0]},${this.logInfo.cityCode[1]}`,
        projectTender: String(this.logInfo.tendersId),
      };
      const msg = this;
      if (msg.actionStatus === 'add') {
        msg.$refs.dialogLogInfoForm.validate((valid) => {
          if (valid) {
            msg.$refs.dialogStateForm.validate((validState) => {
              if (validState) {
                addConstructionLog(logTemp).then((res) => {
                  if (res) {
                    if (msg.logDetailList === [] || msg.logDetailList.length === 0) {
                      msg.dialogAddVisible = false;
                      this.getLogList();
                      msg.$message({
                        type: 'success',
                        message: this.$t('message.operationSuccess'),
                      });
                    } else {
                      const logId = res.data.data.id;
                      for (const key in msg.logDetailList) {
                        if (key) {
                          const detailTemp = {
                            userIdList: msg.logDetailList[key].userIdList,
                            userNameList: msg.logDetailList[key].userNameList,
                            constructPartName: msg.logDetailList[key].constructPartName,
                            constructPartId: msg.logDetailList[key].constructPartId,
                            constructContent: msg.logDetailList[key].constructContent,
                            constructionLogId: logId,
                          };
                          addProductionRecords(detailTemp).then(() => {});
                          if (Number(key) === (msg.logDetailList.length - 1)) {
                            msg.dialogAddVisible = false;
                            this.getLogList();
                            msg.$message({
                              type: 'success',
                              message: this.$t('message.operationSuccess'),
                            });
                          }
                        }
                      }
                    }
                  } else {
                    msg.$message({
                      type: 'error',
                      message: '操作失败',
                    });
                  }
                });
              }
            });
          }
        });
      }
    },
    handleShowLog(params) {
      this.actionStatus = 'show';
      this.logInfo.id = params.id;
      this.logInfo.constructDates = params.constructionDate;
      this.logInfo.emergencyState = String(params.emergencyState);
      this.logInfo.dayWeather = params.dayWeather;
      this.logInfo.dayTemperature = params.dayTemperature;
      this.logInfo.dayWindForce = params.dayWindForce;
      this.logInfo.nightWeather = params.nightWeather;
      this.logInfo.nightTemperature = params.nightTemperature;
      this.logInfo.nightWindForce = params.nightWindForce;
      this.logInfo.createUserName = params.createUserName;
      if (params.projectTender && params.projectTender !== undefined) {
        this.logInfo.tendersId = Number(params.projectTender);
      }
      if (params.technologyDiscloseState && params.technologyDiscloseState !== null) {
        this.logInfo.technologyDiscloseState = String(params.technologyDiscloseState);
        this.logInfo.technologyDiscloseContent = params.technologyDiscloseContent;
      } else {
        this.logInfo.technologyDiscloseState = '0';
      }
      if (params.qualityDiscloseState && params.qualityDiscloseState !== null) {
        this.logInfo.qualityDiscloseState = String(params.qualityDiscloseState);
        this.logInfo.qualityDiscloseContent = params.qualityDiscloseContent;
      } else {
        this.logInfo.qualityDiscloseState = '0';
      }
      if (params.safetyDiscloseState && params.safetyDiscloseState !== null) {
        this.logInfo.safetyDiscloseState = String(params.safetyDiscloseState);
        this.logInfo.safetyDiscloseContent = params.safetyDiscloseContent;
      } else {
        this.logInfo.safetyDiscloseState = '0';
      }
      if (params.materialDiscloseState && params.materialDiscloseState !== null) {
        this.logInfo.materialDiscloseState = String(params.materialDiscloseState);
        this.logInfo.materialDiscloseContent = params.materialDiscloseContent;
      } else {
        this.logInfo.materialDiscloseState = '0';
      }
      if (params.cityCode !== null && params.cityCode.indexOf(',') > 0) {
        this.logInfo.cityCode = params.cityCode.split(',');
      } else {
        this.logInfo.cityCode = ['320000', '320500'];
      }

      this.logDetailList = params.productionRecordsList;
      this.dialogAddVisible = true;
    },
    handleLogAsWordClose() {
      this.dialogLogShowAsWordVisible = false;
    },
    handleLogShowStyle() {
      const msg = this;
      msg.logInfo.leader = msg.project.leader;
      // createUserName
      if (msg.logInfo.constructDates) {
        // 日期处理
        let constructDates = msg.logInfo.constructDates;
        constructDates = constructDates.replace(/-/g, '/'); // "2010/08/01";
        const date = new Date(constructDates);
        date.setDate(date.getDate());
        msg.logInfo.year = date.getFullYear();
        msg.logInfo.month = date.getMonth() + 1;
        msg.logInfo.day = date.getDate();
        const week = ['一', '二', '三', '四', '五', '六', '七'];
        msg.logInfo.week = week[date.getDay()];
      }
      if (msg.logDetailList !== null) {
        let detailMsg = '';
        msg.logDetailList.forEach((item) => {
          detailMsg = `作业人员：${item.userNameList}；施工部位：${item.constructPartName}；施工内容${item.constructContent}；`;
        });
        this.logInfo.detailMsg = detailMsg;
      }
      let discloseMsg = '';
      if (msg.logInfo.technologyDiscloseContent !== '' && msg.logInfo.technologyDiscloseContent !== undefined) {
        discloseMsg = `技术工作记录：${msg.logInfo.technologyDiscloseContent};`;
      }
      if (msg.logInfo.qualityDiscloseContent !== '' && msg.logInfo.qualityDiscloseContent !== undefined) {
        discloseMsg = `${discloseMsg}质量工作记录：${msg.logInfo.qualityDiscloseContent};`;
      }
      if (msg.logInfo.safetyDiscloseContent !== '' && msg.logInfo.safetyDiscloseContent !== undefined) {
        discloseMsg = `${discloseMsg}安全工作记录：${msg.logInfo.safetyDiscloseContent};`;
      }
      this.logInfo.discloseMsg = discloseMsg;
      if (msg.logInfo.materialDiscloseContent !== '' && msg.logInfo.materialDiscloseContent !== undefined) {
        this.logInfo.outInMsg = `材料进出场记录：${msg.logInfo.materialDiscloseContent};`;
      }
      this.dialogLogShowAsWordVisible = true;
    },
    handleExportConstructionLog() {
      exportConstructionLog({ id: this.logInfo.id }).then((res) => {
        window.open(setFileRootForDownload(res.data));
      });
    },
    handleDataOptions() {
      this.dataOptions = {
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
  .workLog {
    .searchDiv {
      height: 50px;
      margin-top: 20px;
      width: 98%;
      margin-left: 30px;
      text-align: left;
      .searchDivMid {
        width: 50%;
        height:50px;
        float: left;
        span {
          float: left;
          line-height: 40px;
          font-size: 14px;
        }
        .searchDivMidInput {
          width: 200px;
          float: left;
          margin-left: 20px;
        }
        .searchDivMidDatePicker {
          float: left;
          margin-left: 20px;
          width: 260px;
        }
      }
    }
    .pagination-container {
      margin-left: 32px;
      margin-bottom: 26px;
    }
    .topTableDiv{
      width: 100%;
      height: 310px;
      margin-top: 10px;
      border: 1px solid beige;
      .table1{
        width: 95%;
        margin-left: 5%;
        margin-top: 10px;
        margin-bottom: 10px;
        border: none;
        text-align: left;
        td{
          width: 50%;
        }
      }
      .table2 {
        width: 95%;
        margin-left: 5%;
        margin-top: 10px;
        margin-bottom: 10px;
        border: none;
        text-align: left;
        .td1{
          width: 7%;
          height: 50px;
        }
        td{
          width: 31%;
        }
      }
    }
    .dialogMid {
      background-color: #F5F5F5;
      height: 36px;
      width: 100%;
      margin-top: 10px;
      i {
        float: left;
        line-height: 36px;
        margin-left: 10px;
        color: #409EFF;
      }
      span {
        color: #909399;
        font-size: 13px;
        line-height: 36px;
        margin-left: 10px;
        float: left;
      }
    }
    .threeTableDiv {
      width: 96%;
      height: 50px;
      margin-top: 10px;
      margin-bottom: 10px;
      margin-left: 2%;
      .threeTableDiv_select {
        width: 30%;
        float: left;
      }
      .threeTableDiv_button {
        width: 8%;
        float: left;
        text-align: center;
      }
    }
    .fourDiv {
      height: 50px;
      width: 99%;
      margin-top: 20px;
      span {
        float: left;
        line-height: 30px;
        /*font-weight: bolder;*/
        width: 18%;
        margin-left: 2%;
      }
      .fourDiv_switchDiv {
        float: left;
        line-height: 30px;
        margin-left: 5px;
        width: 25%;
      }
      .fourDiv_inputDiv {
        float: left;
        width: 45%;
        margin-left: 5%;
        height: 40px;
        .fourDiv_input{
          width: 100%;
        }
      }
    }
  }
  @media all{
    .logShowMain{
      width: 100%;
      table{
        width: 80%;
        margin-left: 10%;
        border-collapse:collapse;
        border-spacing:0;
        font-family: SimSun;
        .tdTop {
          border: none;
          height: 50px;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 20px;
        }
        .tdOfNoBorder{
          border: none;
        }
        .tdSecond{
          border: none;
          height: 30px;
          font-size: 14pt;
          letter-spacing: 2px;
        }
        .tdTitle,.tdTitle1{
          font-size: 14pt;
          font-weight: bold;
          height: 50px;
        }
        .tdTitle2{
          font-size: 14pt;
        }
        .tdTitle{
          letter-spacing: 5px;
        }
        .tdMain{
          height: 260px;
          .divTopForSpan{
            width: 100%;
            height: 50px;
            text-align: left;
            span{
              line-height: 50px;
              font-size: 14pt;
            }
          }
          .divTopForSpan1{
            width: 100%;
            height: 210px;
            text-align: left;
            span{
              line-height: 30px;
              font-size: 14pt;
            }
          }
        }
        .tdBottom{
          height: 50px;
          .tdBottomDiv{
            border-left: none;
          }
          div{
            width: 25%;
            text-align: center;
            border-left: 1px solid black;
            float: left;
            height: 50px;
            span{
              line-height: 50px;
              font-size: 14pt;
              font-weight: bold;
            }
          }
        }
        td{
          border: 1px solid black;
          text-align: center;
        }
      }
    }
  }
  .logShowMain{
    width: 100%;
    table{
      width: 80%;
      margin-left: 10%;
      border-collapse:collapse;
      border-spacing:0;
      font-family: SimSun;
      .tdTop {
        border: none;
        height: 50px;
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 20px;
      }
      .tdOfNoBorder{
        border: none;
      }
      .tdSecond{
        border: none;
        height: 30px;
        font-size: 14pt;
        letter-spacing: 2px;
      }
      .tdTitle,.tdTitle1{
        font-size: 14pt;
        font-weight: bold;
        height: 50px;
      }
      .tdTitle2{
        font-size: 14pt;
      }
      .tdTitle{
        letter-spacing: 5px;
      }
      .tdMain{
        height: 260px;
        .divTopForSpan{
          width: 100%;
          height: 50px;
          text-align: left;
          span{
            line-height: 50px;
            font-size: 14pt;
          }
        }
        .divTopForSpan1{
          width: 100%;
          height: 210px;
          text-align: left;
          span{
            line-height: 30px;
            font-size: 14pt;
          }
        }
      }
      .tdBottom{
        height: 50px;
        .tdBottomDiv{
          border-left: none;
        }
        div{
          width: 25%;
          text-align: center;
          border-left: 1px solid black;
          float: left;
          height: 50px;
          span{
            line-height: 50px;
            font-size: 14pt;
            font-weight: bold;
          }
        }
      }
      td{
        border: 1px solid black;
        text-align: center;
      }
    }
  }
</style>
