<template>
  <div>
    <breadcrumb>
      <div class="flex-row topWork">
        <div><el-button type="text" style="margin-right: 10px" @click="isBuildingManagement" >{{'楼栋管理'}}</el-button></div>
        <span>|</span>
        <div><el-button type="text" style="margin-left: 10px" @click="openAddMeasuredSite">{{'添加区域'}}</el-button></div>
      </div>
    </breadcrumb>
    <div v-if="showBuildingDataList" style="width: 954px">
      <!--左侧楼栋列表数据信息-->
      <measured-data-item-left
        :building-data-list="buildingDataList"
        :now-selectd="nowSelectd"
        @nowItem="nowItemData"
        @listData="SwitchBuilding"
      />
      <!--右侧对应楼栋的区域信息-->
      <measured-data-item-right
        :area-list="areaList"
        :paper-of-measured-list="paperOfMeasuredList"
        :user-list="userList"
        @openEditMeasuredSite="openEditMeasuredSite"/>
      <!--楼栋新增编辑-->
      <el-dialog
        :visible.sync="BuildingManagement"
        :close-on-click-modal="false"
        width="450px"
        @opened="openBuildingManagement"
        :show-close="true"
      >
        <div slot="title" style="font-weight: bolder">
          楼栋管理
          <el-button @click="addBuildingManagement = true" type="text" style="float:right;margin-right: 30px;">+新建</el-button>
        </div>
        <div class="leftBuildingManagementTitle"><span>名称</span></div>
        <div id="haulSection">
          <div  v-for="(item) in buildingDataList"
                :key="item.bfmId"
                class="leftBuildingManagement">
            <span v-if="!item.isEdit" style="width: 300px;display: block;float: left;">
              {{item.bName}}
              </span>
            <span v-if="!item.isEdit">
              <i @click="oldeditImageRecordBuilding(item)" class="el-icon-edit-outline"></i>
                <span style="width: 20px;height: 10px;"></span>
              <i @click="deleteImageRecordBuilding(item)" class="el-icon-delete"></i>
              </span>
            <el-input v-if="item.isEdit" style="width: 230px" v-model.trim="item.bName"></el-input>
            <span v-if="item.isEdit">
              <el-button type="primary" size="mini" @click="editImageRecordBuilding(item)">更新</el-button>
              <el-button @click="closeeditImageRecordBuilding(item)" size="mini">取消</el-button>
              </span>
          </div>
        </div>
        <el-dialog
          :visible.sync="addBuildingManagement"
          :close-on-click-modal="false"
          append-to-body
          width="450px"
          @close="closeBuildingDataForm"
        >
          <div slot="title" style="font-weight: bolder">
            新建楼栋
          </div>
          <el-form :rules="rules" ref="buildingDataForm" :model="addBuildingList" label-width="100px">
            <el-form-item label="楼栋名称:" prop="name">
              <el-input v-model.trim="addBuildingList.name" placeholder="请输入楼栋名称..."></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" style="margin-top: -20px;">
            <el-button @click="closeBuildingDataForm">{{$t('btn.cancel')}}</el-button>
            <el-button type="primary" @click="addImageRecordBuilding" >{{$t('btn.save')}}</el-button>
          </div>
        </el-dialog>
      </el-dialog>
      <!--楼栋区域操作弹窗-->
      <el-dialog
        :visible.sync="modelMeasuredSiteVisible"
        :close-on-click-modal="false"
        @close="resetMeasuredSiteForm"
        :show-close="true"  width="450px">
        <div slot="title" style="font-weight: bolder">{{modelMeasuredSiteTitle}}</div>
        <hr style="margin-top: -10px"/>
        <el-form ref="dialogForm" :model="areaQuery" style="margin-top: -20px">
          <el-form-item>
          </el-form-item>
          <el-form-item label="区域名称:" prop="siteDetail">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                      v-model.trim="areaQuery.siteDetail"
                      placeholder="请输入区域名称。可一次添加多条，如：101,102,103即可一次添加3条。(逗号需切换到英文逗号)"></el-input>
          </el-form-item>
          <el-form-item label="检查项:">
            <el-input value="设备安装" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="检查人:" prop="checkUser" v-if="modelMeasuredSiteTitle ===  `${this.buildingDataValues.bName}-编辑区域`">
            <el-select v-model="areaQuery.checkUser" style="width: 100%"
                       placeholder="检查人可不选" filterable >
              <el-option
                v-for="(item, i) in userList"
                :key="i" :label="item.realName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择图纸:" prop="paperOfMeasuredId">
            <el-select v-model="areaQuery.paperOfMeasuredId" style="width: 100%"
                       placeholder="请选择图纸" filterable >
              <el-option
                v-for="(item, i) in paperOfMeasuredList"
                :key="i" :label="item.paperName" :value="item.paperId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="resetMeasuredSiteForm">{{$t('btn.cancel')}}</el-button>
          <el-button type="primary" @click="handleMeasuredSiteSave">{{$t('btn.comfirm')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import { getBuildingOfMeasuredByProjectId,
  deleteBuildingOfMeasured, updateMeasuredSite,
  addBuildingOfMeasured, addMeasuredSite,
  updateBuildingOfMeasured, getMeasuredSiteListByBuildingId } from '@/api/measuredDataItem';
import { getPaperOfMeasuredByProjectId } from '@/api/measuredDataPaper';
import { getUserTeam } from '@/api/quality';
import MeasuredDataItemLeft from './components/MeasuredDataItemLeft';
import MeasuredDataItemRight from './components/MeasuredDataItemRight';

export default {
  name: 'MeasuredDataItem',
  components: {
    MeasuredDataItemLeft,
    MeasuredDataItemRight,
  },
  data() {
    const { params: { id } } = this.$route;
    return {
      userList: [],
      oldEditBuildName: [],
      buildingDataValue: null,
      buildingDataValues: null,
      addBuildingManagement: false,
      BuildingManagement: false,
      // 楼栋数据集
      buildingDataList: [],
      nowSelectd: 0,
      showBuildingDataList: false,
      rules: {
        name: [{ validator: this.validatePass, trigger: 'blur' }],
      },
      addBuildingList: {
        name: '',
      },
      queryList: {
        projectId: id,
      },
      // 选中的楼栋的区域数据集
      areaList: [],
      // 楼栋区域弹窗 开关控制
      modelMeasuredSiteVisible: false,
      // 楼栋区域弹窗 标题
      modelMeasuredSiteTitle: '',
      // 楼栋区域数据信息操作对象
      areaQuery: {
        id: null,
        projectId: id,
        bfmId: null,
        paperOfMeasuredId: null,
        siteDetail: '',
        checkUser: null,
      },
      // 所有图纸信息
      paperOfMeasuredList: [],
    };
  },
  created() {
    this.getList();
    this.getPaper();
    this.getUserByProjectId();
  },
  methods: {
    getList() {
      getBuildingOfMeasuredByProjectId({ projectId: this.queryList.projectId }).then((res) => {
        if (res.data && res.data.length > 0) {
          res.data.forEach((item, index) => {
            item.isEdit = false;
            item.index = index;
            if (index === 0) {
              this.$nextTick(() => {
                this.buildingDataValue = item.bfmId;
                this.buildingDataValues = item;
                this.nowSelectd = index;
                this.SwitchBuilding(item);
              });
            }
          });
          this.buildingDataList = res.data;
        }
        this.showBuildingDataList = true;
      });
    },
    getPaper() {
      // 该项目下图纸
      getPaperOfMeasuredByProjectId({ projectId: this.queryList.projectId }).then((res) => {
        if (res) {
          this.paperOfMeasuredList = res.data;
        }
      });
    },
    getUserByProjectId() {
      getUserTeam({ projectId: this.queryList.projectId }).then((data) => {
        if (data) {
          this.userList = data.data;
        }
      });
    },
    // 新增楼栋规则校验
    validatePass(rule, value, callback) {
      if (value === '') {
        return callback(new Error('楼栋名称不能为空!'));
      }
      return callback();
    },
    // 取消更新楼栋数据
    closeeditImageRecordBuilding(item) {
      if (item.isEdit) {
        this.oldEditBuildName.forEach((res) => {
          if (res.bfmId === item.bfmId) {
            item.bName = res.bName;
          }
        });
        item.isEdit = false;
      }
    },
    // 楼栋管理
    isBuildingManagement() {
      this.BuildingManagement = true;
    },
    // 存储当前选中的楼栋信息
    nowItemData(item) {
      this.buildingDataValue = item.bfmId;
      this.buildingDataValues = item;
    },
    openBuildingManagement() {
      const Button2 = document.getElementById('haulSection');
      if (Button2) {
        Button2.click();
      }
    },
    // 关闭新增楼栋数据
    closeBuildingDataForm() {
      this.$refs.buildingDataForm.resetFields();
      this.$refs.buildingDataForm.$el.reset();
      this.addBuildingList.type = 0;
      this.addBuildingManagement = false;
    },
    // 楼栋新增
    addImageRecordBuilding() {
      this.$refs.buildingDataForm.validate((valid) => {
        if (valid) {
          const partms = {
            projectId: this.queryList.projectId,
            bName: this.addBuildingList.name,
          };
          addBuildingOfMeasured(partms).then((data) => {
            if (data) {
              this.getList();
              this.closeBuildingDataForm();
              this.BuildingManagement = false;
              this.showBuildingDataList = false;
              this.$nextTick(() => {
                this.showBuildingDataList = true;
                this.$message({
                  type: 'success',
                  message: `${'楼栋新增成功!'}`,
                });
              });
            }
          });
        }
      });
    },
    // 存储更新前的数据
    oldeditImageRecordBuilding(item) {
      const oldname = JSON.parse(JSON.stringify(item));
      this.oldEditBuildName.push(oldname);
      item.isEdit = true;
    },
    // 更新楼栋数据
    editImageRecordBuilding(item) {
      if (item.isEdit) {
        const partms = {
          bfmId: item.bfmId,
          bName: item.bName,
        };
        updateBuildingOfMeasured(partms).then(() => {
          item.isEdit = false;
          this.$message({
            type: 'success',
            message: `${'楼栋更新成功!'}`,
          });
        });
      }
    },
    // 楼栋删除
    deleteImageRecordBuilding(item) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        // center: true,
      }).then(() => {
        deleteBuildingOfMeasured({ id: item.bfmId }).then((data) => {
          if (data) {
            this.buildingDataList.forEach((res, index) => {
              if (res.bfmId === item.bfmId) {
                this.buildingDataList.splice(index, 1);
                if (this.buildingDataList.length === 0) {
                  this.BuildingManagement = false;
                  this.$nextTick(() => {
                    this.$message({
                      type: 'warning',
                      message: `${'楼栋数据已全部删除!'}`,
                    });
                  });
                } else {
                  this.$nextTick(() => {
                    this.$message({
                      type: 'success',
                      message: `${'楼栋删除成功!'}`,
                    });
                  });
                }
              }
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除!',
        });
      });
    },
    // 新增打开添加区域弹窗
    openAddMeasuredSite() {
      this.modelMeasuredSiteTitle = `${this.buildingDataValues.bName}-添加区域`;
      this.areaQuery.bfmId = this.buildingDataValue;
      this.modelMeasuredSiteVisible = true;
    },
    // 编辑打开添加区域弹窗
    openEditMeasuredSite(item) {
      this.modelMeasuredSiteTitle = `${this.buildingDataValues.bName}-编辑区域`;
      this.areaQuery = {
        projectId: this.areaQuery.projectId,
        bfmId: item.bfmId,
        paperOfMeasuredId: item.paperOfMeasuredId,
        siteDetail: item.siteName,
        checkUser: item.checkUser,
        id: item.siteId,
      };
      this.modelMeasuredSiteVisible = true;
    },
    // 关闭添加区域弹窗
    resetMeasuredSiteForm() {
      this.areaQuery = {
        id: null,
        projectId: this.areaQuery.projectId,
        bfmId: null,
        paperOfMeasuredId: null,
        siteDetail: '',
        checkUser: null,
      };
      this.modelMeasuredSiteVisible = false;
    },
    // 添加,编辑区域
    handleMeasuredSiteSave() {
      if (!this.areaQuery.paperOfMeasuredId) {
        this.$message({
          type: 'error',
          message: '请选择图纸！',
        });
        return;
      }
      if (!this.areaQuery.siteDetail) {
        this.$message({
          type: 'error',
          message: '区域名称不得为空！',
        });
        return;
      }
      if (this.modelMeasuredSiteTitle === `${this.buildingDataValues.bName}-编辑区域`) {
        updateMeasuredSite({
          id: this.areaQuery.id,
          siteNewName: this.areaQuery.siteDetail,
          paperOfMeasuredId: this.areaQuery.paperOfMeasuredId,
          checkUser: this.areaQuery.checkUser,
        }).then((res) => {
          if (res) {
            this.SwitchBuilding(this.buildingDataValues);
            this.resetMeasuredSiteForm();
            this.$message({
              type: 'success',
              message: '楼栋区域编辑成功！',
            });
          }
        });
      } else {
        addMeasuredSite(this.areaQuery).then((res) => {
          if (res) {
            this.SwitchBuilding(this.buildingDataValues);
            this.resetMeasuredSiteForm();
            this.$message({
              type: 'success',
              message: '楼栋区域添加成功！',
            });
          }
        });
      }
    },
    // 根据楼栋获取楼栋区域内容
    SwitchBuilding(item) {
      getMeasuredSiteListByBuildingId({ buildingId: item.bfmId }).then((data) => {
        if (data) {
          this.areaList = data.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .leftBuildingManagementTitle{
    border-bottom: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    height: 40px;
    line-height: 40px;
    margin-top: -10px;
    color: #909399;
    span {
      margin-left: 20px;
    }
  }
  .leftBuildingManagement {
    border-bottom: 1px solid #dcdfe6;
    height: 40px;
    line-height: 40px;
    color: #303133;
    cursor: pointer;
    &:hover {
      background-color: #F2F6FC;
    }
    span {
      margin-left: 20px;
    }
    i {
      /*padding-left: 30px;*/
      &:hover{
        cursor: pointer;
      }
    }
  }
</style>
