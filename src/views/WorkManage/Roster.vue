<template>
  <div>
    <breadcrumb>
      <el-breadcrumb separator-class="el-icon-minus">
        <el-button type="text" v-if="!disableEdit" :disabled="disableEdit" @click="handleAdd">添加工人</el-button>
      </el-breadcrumb>
    </breadcrumb>
    <div class="app-container">
      <el-tabs v-model="activeName"   type="card" style="margin-top: 15px;" @tab-click="handleTabClick">
        <el-tab-pane label="自有工人" name="first">
          <el-table
            :data="mechanicList"
            v-loading="mechanicListLoading"
            fit
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column align="center" label="姓名" prop="realName" ></el-table-column>
            <el-table-column align="center" label="性别" prop="sexName" ></el-table-column>
            <el-table-column align="center" label="身份证号" prop="idCard"  width="180"></el-table-column>
            <el-table-column align="center" label="手机号" prop="tel"  width="140"></el-table-column>
            <el-table-column align="center" label="岗位" prop="workName"></el-table-column>
            <el-table-column align="center" label="日工资" prop="daySalary" ></el-table-column>
            <el-table-column align="center" :label="$t('table.operation')">
              <template slot-scope="scope">
                <div class="operation-btns">
                  <i class="el-icon-edit-outline" @click="handleEdit(scope.row)"></i>
                  <i class="el-icon-delete" v-if="!disableEdit" @click="handleDelete({ id: scope.row.id })"></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--自有工人分页部分-->
          <div class="pagination-container">
          <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="mechanicQuery.pageIndex"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="mechanicQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber">
          </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="班组技工" name="second">
          <el-table
            :data="groupMechanicList"
            v-loading="groupMechanicListLoading"
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column align="center" label="姓名" prop="name" ></el-table-column>
            <el-table-column align="center" label="性别" prop="sex" ></el-table-column>
            <el-table-column align="center" label="身份证号" prop="idCard"  width="180"></el-table-column>
            <el-table-column align="center" label="手机号" prop="tel"  width="140"></el-table-column>
            <!--<el-table-column align="center" label="班组" prop="team"></el-table-column>-->
            <el-table-column align="center" label="工种/岗位" prop="workTemp" width="220"></el-table-column>
            <el-table-column align="center" label="日工资" prop="salary" ></el-table-column>
            <el-table-column align="center" :label="$t('table.operation')" width="100">
              <template slot-scope="scope">
                <div class="operation-btns">
                  <i class="el-icon-edit-outline" @click="handleGroupEdit(scope.row)"></i>
                  <i class="el-icon-delete" v-if="!disableEdit" @click="handleGroupDelete({ id: scope.row.id })"></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 班组技工分页部分-->
          <div class="pagination-container">
            <el-pagination
            @size-change="handleGroupSizeChange"
            @current-change="handleGroupCurrentChange"
            :current-page="groupMechanicQuery.pageIndex"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="groupMechanicQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="groupTotalNumber">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!--班组新增-->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="dialogTeamFormVisible"
        width="420px"
        @close="resetGroupForm"
      >
        <div slot="title" style="font-weight: bolder;">
          {{'添加班组' }}
        </div>
        <hr noshade size="1px" style="margin-top: -10px; margin-bottom: 10px;color: rgba(220,223,230,1);" >
        <el-form :rules="teamRules" ref="dialogTeamForm" :model="newTeam" :disabled="disableEdit" label-position="left">
          <el-form-item label="班组名：" prop="name">
            <el-input v-model="newTeam.name" placeholder="请输入班组名"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="handleTeamCancel">{{$t('btn.cancel')}}</el-button>
          <el-button type="primary" :disabled="disableEdit" @click="handleTeamSave">{{$t('btn.comfirm')}}</el-button>
        </div>
      </el-dialog>

      <!-- dialog -->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        @close="resetForm"
        width="420px"
      >
        <div slot="title" style="font-weight: bolder;">
          {{ this.actionStatus === 'add' ? '添加工人' : '编辑工人' }}
        </div>
        <hr noshade size="1px" style="margin-top: -10px; margin-bottom: 10px;color: rgba(220,223,230,1);" >
        <el-form :rules="rules" ref="dialogForm" :model="mechanic" :disabled="disableEdit" label-position="left">
          <el-form-item label="工种：" prop="workType" :inline="true">
            <el-radio v-model="mechanic.workType" label= '0' @change="workTypeChange">自有技工</el-radio>
            <el-radio v-model="mechanic.workType" label= '1' @change="workTypeChange">班组技工</el-radio>
          </el-form-item>
          <div v-if = groupIdIsShow>
            <el-form-item label="所属班组：" prop="teamId">
              <el-select  placeholder="请选择" v-model = "mechanic.teamId" style="width: 100%;" @change="handleTeamIdChange">
                <el-option
                  v-for="item in teamIdList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
                <el-option value = "000" label="新增班组">
                  <i class="el-icon-circle-plus-outline" style="color: blue"></i>
                  <span style="margin-left: 10px;color: blue" >新增班组</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div v-if = teamLeaderIsShow>
            <el-form-item label="工种：" prop="workTeam">
              <el-input v-model="mechanic.workTeam" placeholder="请输入工种" disabled></el-input>
            </el-form-item>
          </div>
          <el-form-item label="岗位：" prop="workTypeId">
            <el-select placeholder="请选择" v-model="mechanic.workTypeId"  style="width: 100%;">
              <el-option
                v-for="item in workerTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名：" prop="realName">
            <el-input v-model="mechanic.realName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex" :inline="true">
            <el-radio v-model="mechanic.sex" label= '0' @change="sexChange">男</el-radio>
            <el-radio v-model="mechanic.sex" label= '1' @change="sexChange">女</el-radio>
          </el-form-item>
          <el-form-item label="日工资(元/工日)：" prop="daySalary">
            <el-input-number v-model="mechanic.daySalary" :min="1" label="请输入日工资" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="手机号：" prop="tel">
            <el-input v-model="mechanic.tel" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="身份证号：" prop="idCard">
            <el-input v-model="mechanic.idCard" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item label="身份证正面：" prop="fileZ">
            <div class="upload-file-wrapper" @click="handleFileZ">
              <div tabindex="0" class="el-upload el-upload--text">
                <div class="el-upload-dragger">
                  <div data-v-08fcefad="" class="el-upload__text flex-center">
                    <em data-v-08fcefad="">点击上传</em>
                  </div>
                </div>
                <input type="file" name="fileZ" class="el-upload__input" ref="fileInputZ" accept="image/*" @change="handleFileChangeZ">
                <img v-if="uploadFileSrcZ" class="upload-file" :src="uploadFileSrcZ" />
                <img v-else-if="mechanic.idCardImgZ" class="upload-file" :src="mechanic.idCardImgZ | setFileRoot" />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="身份证反面：" prop="fileF">
            <div class="upload-file-wrapper" @click="handleFileF">
              <div tabindex="0" class="el-upload el-upload--text">
                <div class="el-upload-dragger">
                  <div data-v-08fcefad="" class="el-upload__text flex-center">
                    <em data-v-08fcefad="">点击上传</em>
                  </div>
                </div>
                <input type="file" name="fileF" class="el-upload__input" ref="fileInputF" accept="image/*" @change="handleFileChangeF">
                <img v-if="uploadFileSrcF" class="upload-file" :src="uploadFileSrcF" />
                <img v-else-if="mechanic.idCardImgF" class="upload-file" :src="mechanic.idCardImgF | setFileRoot" />
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogFormVisible = false">{{$t('btn.cancel')}}</el-button>
          <el-button type="primary" :disabled="disableEdit" @click="handleSave">{{$t('btn.comfirm')}}</el-button>
        </div>
      </el-dialog>
      <!-- /dialog -->
    </div>
  </div>
</template>

<script>
import { getMechanicList, addMechanic, updateMechanic, deleteMechanic, getDepartmentList, getWorkTypeList, getTeamIdList, addDepartment, updateDepartment, deleteDepartment, addTeam } from '@/api/mechanic';
import { validateIDCard, validatePhone } from '@/utils/validate';

export default {
  name: 'Roster',
  data() {
    const { params: { id } } = this.$route;

    const checkPhone = (rule, value, callback) => {
      if (!validatePhone(value)) {
        callback(new Error(`${this.$t('user.tel')}${this.$t('message.notCorrect')}`));
      } else {
        callback();
      }
    };

    const checkIDCard = (rule, value, callback) => {
      if (!validateIDCard(value)) {
        callback(new Error(`身份证${this.$t('message.notCorrect')}`));
      } else {
        callback();
      }
    };

    return {
      mechanicQuery: {
        pageIndex: 1,
        pageSize: 20,
        projectId: id,
      },
      groupMechanicQuery: {
        pageIndex: 1,
        pageSize: 20,
        projectId: id,
      },
      mechanicListQuery: {
        pageIndex: -1,
        pageSize: 10,
        projectId: id,
        type: 0,
      },
      mechanic: {
        projectId: id,
        id: null,
        tel: '',
        workName: '',
        daySalary: null,
        remark: '',
        realName: '',
        idCard: '',
        fileZ: null,
        fileF: null,
        idCardImgZ: null,
        idCardImgF: null,
        sex: '0',
        workTypeId: null,
        workType: '0',
        workTeam: '班组工人',
        teamId: '',
      },
      newTeam: {
        projectId: id,
        name: '',
      },
      // upload file
      uploadFileSrcZ: null,
      uploadFileSrcF: null,
      // window
      activeName: 'first',
      workTypeList: null,
      workTypeName: [],
      mechanicListLoading: false,
      groupMechanicListLoading: false,
      // 自有工人
      mechanicList: null,
      // 班组技工
      groupMechanicList: null,
      workerTypeList: null,
      // action status
      actionStatus: 'add',
      // dialog
      dialogFormVisible: false,
      // 所属班组是否显示
      groupIdIsShow: false,
      // 所属班组长是否显示
      teamLeaderIsShow: false,
      // 班组新增信息框
      dialogTeamFormVisible: false,
      // 分页信息
      totalNumber: 0,
      totalPage: 1,
      groupTotalNumber: 0,
      groupTotalPage: 1,
      teamIdList: [],
      teamLeaderList: [],
      teamAddNumber: 0,
      rules: {
        realName: [{ required: true, message: `姓名${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        tel: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        idCard: [{ required: true, validator: checkIDCard, trigger: 'blur' }],
        workName: [{ required: true, message: `工种${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        daySalary: [{ required: true, message: `日工资${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        workTypeId: [{ required: true, message: `工种/岗位${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        teamId: [{ required: true, message: `所属岗位${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
      teamRules: {
        name: [{ required: true, message: `班组名称${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
    };
  },
  created() {
    // 默认获取自有工人数据
    this.getMechanicList();
    // 获取岗位
    this.getWorkerTypeList();
    // 所属班组数据
    this.getTeamList();
  },
  methods: {
    // 获取自有工人
    getMechanicList() {
      this.mechanicListLoading = true;
      getMechanicList(this.mechanicQuery).then((res) => {
        const { data, totalNumber, totalPage } = res;
        for (const key in data) {
          if (key && data[key].sex === 1) {
            // delete data[key].sex;
            data[key].sexName = '女';
          } else {
            // delete data[key].sex;
            data[key].sexName = '男';
          }
        }
        this.mechanicList = data;
        this.totalNumber = totalNumber;
        this.totalPage = totalPage;
        this.mechanicListLoading = false;
      });
    },
    // 获取班组技工
    getGroupMechanicList() {
      this.groupMechanicListLoading = true;
      getDepartmentList(this.groupMechanicQuery).then((res) => {
        const { data, totalNumber, totalPage } = res;
        // 处理data 拼接工种岗位
        for (const key in data) {
          if (key && data[key]) {
            let workTemp = '';
            if (data[key].userTeamType === 0) {
              workTemp = '班组长/';
            } else {
              workTemp = '班组工人/';
            }
            workTemp += data[key].workTypeName;
            data[key].workTemp = workTemp;
          }
        }
        this.groupMechanicList = data;
        this.groupTotalNumber = totalNumber;
        this.groupTotalPage = totalPage;
        this.groupMechanicListLoading = false;
      });
    },
    getWorkerTypeList() {
      getWorkTypeList(this.mechanicListQuery).then((res) => {
        const { data } = res;
        this.workerTypeList = data;
      });
    },
    getTeamList() {
      getTeamIdList().then((res) => {
        const { data } = res;
        const options = [];
        for (const key in data) {
          if (key && key != null && data[key] != null) {
            options.push({ value: data[key].id.toString(), label: data[key].name });
          }
        }
        this.teamIdList = options;
      });
    },
    handleFileZ() {
      this.$refs.fileInputZ.click();
    },
    handleFileF() {
      this.$refs.fileInputF.click();
    },
    handleFileChangeZ(e) {
      const files = e.target.files;
      const file = files[0];
      const self = this;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        self.uploadFileSrcZ = this.result;
        self.mechanic.fileZ = file;
      };
    },
    handleFileChangeF(e) {
      const files = e.target.files;
      const file = files[0];
      const self = this;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        self.uploadFileSrcF = this.result;
        self.mechanic.fileF = file;
      };
    },
    handleDelete(params) {
      this.$confirm('此操作将永久删除该自有工人, 是否继续?', this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        deleteMechanic(params).then(() => {
          this.getMechanicList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    // 删除班组技工
    handleGroupDelete(params) {
      this.$confirm('此操作将永久删除该班组技工, 是否继续?', this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        deleteDepartment(params).then(() => {
          this.getGroupMechanicList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    handleAdd() {
      this.actionStatus = 'add';
      this.groupIdIsShow = false;
      this.teamLeaderIsShow = false;
      this.dialogFormVisible = true;
    },
    handleEdit(item) {
      this.actionStatus = 'edit';
      if (item.sex && item.sex != null && item.sex === 1) { item.sex = '1'; } else { item.sex = '0'; }
      for (const key in this.workerTypeList) {
        if (key) {
          if (this.workerTypeList[key].name === item.workName) {
            item.workTypeId = this.workerTypeList[key].id;
            break;
          }
        }
      }
      this.mechanic = { ...item, createDate: null, createUser: null };
      this.dialogFormVisible = true;
      this.mechanic.teamId = '';
      this.mechanic.workType = '0';
      this.groupIdIsShow = false;
      this.teamLeaderIsShow = false;
    },
    handleGroupEdit(item) {
      this.actionStatus = 'edit';
      const mechanicTemp = {
        projectId: item.projectId,
        tel: item.tel,
        daySalary: item.salary,
        realName: item.name,
        idCard: item.idCard,
        teamId: item.team,
        id: item.id,
        idCardImgZ: item.idCardImgZ,
        idCardImgF: item.idCardImgF,
      };
      let sexTemp = '0';
      if (item.sex && item.sex !== null && item.sex === '女') {
        sexTemp = '1';
      }
      mechanicTemp.sex = sexTemp;
      mechanicTemp.workType = '1';
      if (item.userTeamType === 0) {
        mechanicTemp.workTeam = '班组长';
      } else {
        mechanicTemp.workTeam = '班组工人';
      }
      for (const key in this.workerTypeList) {
        if (key) {
          if (this.workerTypeList[key].name === item.workTypeName) {
            mechanicTemp.workTypeId = this.workerTypeList[key].id;
            break;
          }
        }
      }
      this.mechanic = { ...mechanicTemp, createDate: null, createUser: null };
      this.dialogFormVisible = true;
      this.groupIdIsShow = true;
      this.teamLeaderIsShow = true;
    },
    handleSave() {
      const msg = this;
      msg.$refs.dialogForm.validate((valid) => {
        if (valid) {
          if (msg.mechanic.workType === '1') {
            let sexTemp = 0;
            if (msg.mechanic.sex === '1') {
              sexTemp = 1;
            }
            if (msg.mechanic.teamId.includes('a')) {
              for (const key in msg.teamIdList) {
                if (key) {
                  if (msg.teamIdList[key].value === msg.mechanic.teamId) {
                    msg.newTeam.name = msg.teamIdList[key].label;
                    msg.newTeam.teamUserName = msg.mechanic.realName;
                    addTeam(msg.newTeam).then((res) => {
                      msg.mechanic.teamId = res.data.data.id;
                      const params = {
                        name: msg.mechanic.realName,
                        projectId: msg.mechanic.projectId,
                        sex: sexTemp,
                        userTeamType: msg.mechanic.workTeam === '班组长' ? 0 : 1,
                        workTypeId: msg.mechanic.workTypeId,
                        idCard: msg.mechanic.idCard,
                        tel: msg.mechanic.tel,
                        salary: msg.mechanic.daySalary,
                        imgZs: msg.mechanic.fileZ,
                        imgFs: msg.mechanic.fileF,
                        teamId: msg.mechanic.teamId,
                      };
                      if (msg.actionStatus === 'add') {
                        addDepartment(params).then(() => {
                          msg.activeName = 'second';
                          msg.getGroupMechanicList();
                          msg.getTeamList();
                          msg.dialogFormVisible = false;
                        });
                      } else {
                        params.id = msg.mechanic.id;
                        updateDepartment(params).then(() => {
                          msg.activeName = 'second';
                          msg.getGroupMechanicList();
                          msg.getTeamList();
                          msg.dialogFormVisible = false;
                        });
                      }
                    });
                    break;
                  }
                }
              }
            } else {
              const params = {
                name: msg.mechanic.realName,
                projectId: msg.mechanic.projectId,
                sex: sexTemp,
                userTeamType: msg.mechanic.workTeam === '班组长' ? 0 : 1,
                workTypeId: msg.mechanic.workTypeId,
                idCard: msg.mechanic.idCard,
                tel: msg.mechanic.tel,
                salary: msg.mechanic.daySalary,
                imgZs: msg.mechanic.fileZ,
                imgFs: msg.mechanic.fileF,
                teamId: msg.mechanic.teamId,
              };
              if (msg.actionStatus === 'add') {
                addDepartment(params).then(() => {
                  msg.activeName = 'second';
                  msg.getGroupMechanicList();
                  msg.dialogFormVisible = false;
                });
              } else {
                params.id = msg.mechanic.id;
                updateDepartment(params).then(() => {
                  msg.activeName = 'second';
                  msg.getGroupMechanicList();
                  msg.dialogFormVisible = false;
                });
              }
            }
          } else {
            let workNameTemp = '';
            const workListTemp = msg.workerTypeList;
            for (const key in workListTemp) {
              if (key != null && msg.workerTypeList[key].id === msg.mechanic.workTypeId) {
                workNameTemp = msg.workerTypeList[key].name;
              }
            }
            let sexTemp = 0;
            if (msg.mechanic.sex === '1') {
              sexTemp = 1;
            }
            const params = {
              projectId: msg.mechanic.projectId,
              tel: msg.mechanic.tel,
              workName: workNameTemp,
              daySalary: msg.mechanic.daySalary,
              idCard: msg.mechanic.idCard,
              realName: msg.mechanic.realName,
              file: null,
              sex: sexTemp,
              idCardImgZs: msg.mechanic.fileZ,
              idCardImgFs: msg.mechanic.fileF,
            };
            if (msg.actionStatus === 'add') {
              addMechanic(params).then(() => {
                msg.activeName = 'first';
                msg.getMechanicList();
                msg.dialogFormVisible = false;
              });
            } else {
              params.id = msg.mechanic.id;
              updateMechanic(params).then(() => {
                msg.activeName = 'first';
                msg.getMechanicList();
                msg.dialogFormVisible = false;
              });
            }
          }
        }
      });
    },
    resetForm() {
      this.uploadFileSrcZ = null;
      this.uploadFileSrcF = null;
      this.$refs.fileInputZ.value = null;
      this.$refs.fileInputF.value = null;
      // res clear
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.$el.reset();
      this.mechanic.sex = '0';
      this.mechanic.workType = '0';
      this.mechanic.workTeam = '班组工人';
    },
    resetGroupForm() {
      this.$refs.dialogTeamForm.resetFields();
      this.$refs.dialogTeamForm.$el.reset();
    },
    handleTabClick(tab) {
      switch (tab.index) {
        case '0': {
          this.getMechanicList();
          break;
        }
        case '1': {
          this.getGroupMechanicList();
          break;
        }
        default:
      }
    },
    // groupIdChange
    handleWorkTypeNameChange(val) {
      if (val[0] === '1' || val[0] === 1) {
        this.groupIdIsShow = true;
        if (val[1] === '1' || val[1] === 1) {
          this.teamLeaderIsShow = true;
        } else {
          this.teamLeaderIsShow = false;
        }
      } else {
        this.mechanic.teamId = '';
        this.teamLeaderIsShow = false;
        this.groupIdIsShow = false;
      }
    },
    // onPageChange
    handleSizeChange(val) {
      this.mechanicQuery.pageSize = val;
      this.getMechanicList();
    },
    handleCurrentChange(val) {
      this.mechanicQuery.pageIndex = val;
      this.getMechanicList();
    },
    handleGroupSizeChange(val) {
      this.groupMechanicQuery.pageSize = val;
      this.getGroupMechanicList();
    },
    handleGroupCurrentChange(val) {
      this.groupMechanicQuery.pageIndex = val;
      this.getGroupMechanicList();
    },
    sexChange(val) {
      this.mechanic.sex = val;
    },
    workTypeChange(val) {
      this.mechanic.workType = val;
      if (val === '0') {
        this.groupIdIsShow = false;
        this.teamLeaderIsShow = false;
      } else {
        this.groupIdIsShow = true;
        this.teamLeaderIsShow = true;
      }
    },
    handleTeamIdChange(val) {
      if (val === '000') {
        this.mechanic.teamId = '';
        this.dialogTeamFormVisible = true;
      } else {
        this.dialogTeamFormVisible = false;
        if (val.includes('a')) {
          this.mechanic.workTeam = '班组长';
          this.dialogTeamFormVisible = false;
        } else {
          this.mechanic.workTeam = '班组工人';
        }
      }
    },
    handleTeamCancel() {
      this.dialogTeamFormVisible = false;
      this.$refs.dialogTeamForm.$el.reset();
    },
    handleTeamSave() {
      let teamTempValue = 'a';
      teamTempValue += this.teamAddNumber;
      this.teamAddNumber += 1;
      const temp = {
        value: teamTempValue,
        label: this.newTeam.name,
      };
      this.newTeam.name = '';
      this.mechanic.teamId = teamTempValue;
      this.teamIdList.push(temp);
      this.dialogTeamFormVisible = false;
      this.mechanic.workTeam = '班组长';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
