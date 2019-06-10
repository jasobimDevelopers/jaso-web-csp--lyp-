<template>
  <div>
    <breadcrumb>
      <el-button v-if="actionStatus === 'view'" type="text" @click="dialogEditVisible=true">{{$t('btn.edit')}}</el-button>
      <!--<el-button v-else-if="!disableEdit" type="text" style="color: #f56c6c" @click="handleDelete" :disabled="disableEdit">{{$t('btn.delete')}}</el-button>-->
      <!--<el-button v-else type="text" @click="actionStatus = 'view'">返回</el-button>-->
    </breadcrumb>
    <div class="info-container">
      <div class="info-msg" style="height: 300px;margin-top: 20px;">
        <div class="msgLeft">
            <zooming-img v-if="project.picUrl !== ''" :src="project.picUrl | setFileRoot" />
        </div>
        <div class="msgRight">
          <div class="name">
            {{ project.name }}
          </div>
          <div class="desc">
            <p>
              {{ project.description }}
            </p>
          </div>
        </div>
      </div>
      <div class="info-msg">
        <div class="msgLeft">
          <div class="msgInfo"><span class="label">{{ $t('project.shortName') }}：</span><span class="Info">{{ project.shortName}}</span></div>
        </div>
        <div class="msgRight">
          <div class="msgInfo"><span class="label">{{ $t('project.buildingUnit') }}：</span><span class="Info">{{ project.buildingUnit }}</span></div>
          <div class="msgInfo"><span class="label">{{ $t('project.contact') }}：</span>
            <span class="Info">{{ project.buildingUnitUser }}</span>
            <span class="Info" v-if="project.buildingUnitUserTel !== '' && project.buildingUnitUserTel !== null">({{ project.buildingUnitUserTel }})</span>
          </div>
        </div>
      </div>
      <div class="info-msg">
        <div class="msgLeft">
          <div class="msgInfo"><span class="label">{{ $t('project.name') }}：</span><span class="Info">{{ project.name}}</span></div>
        </div>
        <div class="msgRight">
          <div class="msgInfo"></div>
          <div class="msgInfo"><span class="label">{{ $t('project.designUnit') }}：</span><span class="Info">{{ project.designUnit }}</span></div>
          <div class="msgInfo"><span class="label">{{ $t('project.contact') }}：</span>
            <span class="Info">{{ project.designUnitUser }}</span>
            <span class="Info" v-if="project.designUnitUserTel !== '' && project.designUnitUserTel !== null">({{ project.designUnitUserTel }})</span>
          </div>
        </div>
      </div>
      <div class="info-msg">
        <div class="msgLeft">
          <div class="msgInfo"><span class="label">{{ $t('project.place') }}：</span><span class="Info">{{ project.place }}</span></div>
        </div>
        <div class="msgRight">
          <div class="msgInfo"></div>
          <div class="msgInfo"></div>
          <div class="msgInfo"><span class="label">{{ $t('project.constructionUnit') }}：</span><span class="Info">{{ project.constructionUnit }}</span></div>
        </div>
      </div>
      <div class="info-msg">
        <div class="msgLeft">
          <div class="msgInfo"><span class="label">{{ $t('project.startDate') }}：</span><span class="Info">{{ project.startDate }}</span></div>
          <div class="msgInfo"></div>
        </div>
        <div class="msgRight">
          <div class="msgInfo"><span class="label">{{ $t('project.contact') }}：</span>
            <span class="Info">{{ project.constructionUnitUser }}</span>
            <span class="Info" v-if="project.constructionUnitUserTel !== '' && project.constructionUnitUserTel !== null">({{ project.constructionUnitUserTel }})</span>
          </div>
          <div class="msgInfo"></div>
          <div class="msgInfo"></div>
        </div>
      </div>
      <div class="info-msg">
        <div class="msgLeft">
          <div class="msgInfo"><span class="label">{{ $t('project.phase') }}：</span><span class="Info">{{ project.phase }}</span></div>
          <div class="msgInfo"></div>
        </div>
        <div class="msgRight">
          <div class="msgInfo"><span class="label">{{ $t('project.constructionControlUnit') }}：</span><span class="Info">{{ project.constructionControlUnit }}</span></div>
          <div class="msgInfo"><span class="label">{{ $t('project.contact') }}：</span>
            <span class="Info">{{ project.constructionControlUser }}</span>
            <span class="Info" v-if="project.constructionControlUserTel !== '' && project.constructionControlUserTel !== null">({{ project.constructionControlUserTel }})</span>
          </div>
          <div class="msgInfo"></div>
        </div>
      </div>
      <div class="info-msg">
        <div class="msgLeft">
          <div class="msgInfo"><span class="label">{{ $t('project.leader') }}：</span><span class="Info">{{ project.leader }}</span></div>
          <div class="msgInfo"></div>
        </div>
        <div class="msgRight">
          <div style="width:100px;float: left; ">
            <span class="label" style="text-indent:0em;">{{ $t('project.tender') }}：</span>
          </div>
          <div style="float: left;">
            <div v-for="(bids, i) in bidsList" :key= "i">
              <span class="Info" style="line-height: 25px">{{ bids.name }}</span><br/>
            </div>
          </div>
        </div>
      </div>
      <div class="info-msg">
        <div class="msgLeft">
          <div class="msgInfo"><span class="label">{{ $t('project.workHour') }}：</span><span class="Info">白班：{{ project.workHour !== null ? project.workHour : '10' }}小时/天；夜班：{{ project.nightWorkHour }}小时/天</span></div>
        </div>
      </div>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogEditVisible"
      width="400px"
      @close="handleCancel"
    >
      <div slot="title" style="font-weight: bolder">{{ '编辑项目信息' }}</div>
      <el-form :rules="rules" ref="dialogEditForm" :model="project">
        <el-form-item :label="$t('project.name')" prop="name">
          <el-input v-model="project.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('project.description')" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="请输入"
            v-model="project.description">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('project.shortName')" prop="shortName">
          <el-input v-model="project.shortName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('project.leader')" prop="leader">
          <el-input v-model="project.leader"></el-input>
        </el-form-item>
        <el-form-item :label="$t('project.place')" prop="place">
          <el-input v-model="project.place"></el-input>
        </el-form-item>
        <el-form-item :label="$t('project.price')" prop="price">
          <el-input type="number" v-model="project.price"></el-input>
        </el-form-item>
        <el-form-item :label="$t('project.startDate')" prop="startDate">
          <el-date-picker
            style="width: 320px;"
            v-model="project.startDateList"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="/"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDateChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('project.workHour')" prop="workHour">
          <el-input type="number" v-model="project.workHour"></el-input>
        </el-form-item>
        <el-form-item :label="$t('project.nightWorkHour')" prop="nightWorkHour">
          <el-input type="number" v-model="project.nightWorkHour"></el-input>
        </el-form-item>
        <el-form-item :label="$t('project.buildingUnit')" prop="buildingUnit">
          <el-input v-model="project.buildingUnit" :placeholder="$t('project.companyName')"></el-input>
        </el-form-item>
        <el-form-item prop="buildingUnitUser">
          <el-input v-model="project.buildingUnitUser" :placeholder="$t('project.contact')"></el-input>
        </el-form-item>
        <el-form-item prop="buildingUnitUserTel">
          <el-input v-model="project.buildingUnitUserTel" :placeholder="$t('project.contactTel')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('project.designUnit')" prop="designUnit">
          <el-input v-model="project.designUnit" :placeholder="$t('project.companyName')"></el-input>
        </el-form-item>
        <el-form-item prop="designUnitUser">
          <el-input v-model="project.designUnitUser" :placeholder="$t('project.contact')"></el-input>
        </el-form-item>
        <el-form-item prop="designUnitUserTel" >
          <el-input v-model="project.designUnitUserTel" :placeholder="$t('project.contactTel')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('project.constructionUnit')" prop="constructionUnit">
          <el-input v-model="project.constructionUnit" :placeholder="$t('project.companyName')"></el-input>
        </el-form-item>
        <el-form-item prop="constructionUnitUser">
          <el-input v-model="project.constructionUnitUser" :placeholder="$t('project.contact')"></el-input>
        </el-form-item>
        <el-form-item prop="constructionUnitUserTel">
          <el-input v-model="project.constructionUnitUserTel" :placeholder="$t('project.contactTel')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('project.constructionControlUnit')" prop="constructionControlUnit">
          <el-input v-model="project.constructionControlUnit" :placeholder="$t('project.companyName')"></el-input>
        </el-form-item>
        <el-form-item prop="constructionControlUnitUser">
          <el-input v-model="project.constructionControlUser" :placeholder="$t('project.contact')"></el-input>
        </el-form-item>
        <el-form-item prop="constructionControlUnitUserTel">
          <el-input v-model="project.constructionControlUserTel" :placeholder="$t('project.contactTel')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('project.picFile')" prop="picUrl">
          <el-tooltip class="item" effect="dark" content="点击上传图片" placement="top-end">
            <div class="upload-file-wrapper" @click="handleImgFileChange" style="margin-top: 40px;">
              <div tabindex="0" class="el-upload el-upload--text">
                <div class="el-upload-dragger">
                  <div data-v-08fcefad="" class="el-upload__text flex-center">
                    <em data-v-08fcefad="">点击上传</em>
                  </div>
                </div>
                <input type="file" name="file" class="el-upload__input" ref="fileInput" accept="image/*" @change="handleFileChange">
                <img v-if="uploadFileSrc" class="upload-file" :src="uploadFileSrc" />
                <img v-else-if="project.picUrl" class="upload-file" :src="project.picUrl | setFileRoot" />
              </div>
            </div>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="模型类型">
          <el-select v-model="model.modelType">
            <el-option :value="0" label="单体模型"></el-option>
            <el-option :value="1" label="集成模型"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模型上传">
          <div class="upload-file-wrapper flex-column">
            <div class="flex-row">
              <el-button type="primary" style="margin-right: 15px;">
                <input type="file" ref="picInput" @change="handleModelChange" />
                <span>点击上传</span>
              </el-button>
            </div>
            <span>{{model.fileName !== null ? model.fileName : ''}}</span>
            <div style="font-size: 12px;">只能上传一个模型文件。</div>
          </div>
        </el-form-item>
        <el-form-item label="模型上传进度" v-if="progress > 0">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="progress" :status="progress === 100 ? 'success' : 'text'"></el-progress>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCancel">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary"  @click="handleSave">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deleteProject, updateProject, uploadModelFile } from '@/api/projectManage';
import { projectStateList } from '@/filters';
import { getBidsListByProject } from '@/api/bids';

export default {
  name: 'ProjectInformation',
  data() {
    return {
      project: {
        id: null,
        name: '',
        num: '',
        shortName: '',
        leader: '',
        place: '',
        buildingUnit: '',
        designUnit: '',
        startDate: '',
        phase: '',
        teamList: '',
        modelPart: '',
        version: '',
        state: '',
        description: '',
        modelFile: '',
        modelName: '',
        picFile: '',
        picUrl: '',
        price: '',
        designUnitUser: '',
        nightWorkHour: '6',
        buildingUnitUser: '',
        buildingUnitUserTel: '',
        constructionUnit: '',
        designUnitUserTel: '',
        constructionUnitUser: '',
        constructionUnitUserTel: '',
        constructionControlUnit: '',
        constructionControlUser: '',
        constructionControlUserTel: '',
        modelType: 0,
      },
      // 模型
      model: {
        modelType: 0,
        file: null,
        fileName: '',
      },
      // 进度条
      progress: 0,
      // status
      actionStatus: 'view',
      // filters
      projectStateList,
      bidsList: [],
      dialogEditVisible: false,
      uploadFileSrc: null,
      rules: {
        name: [{ required: true, message: `${this.$t('project.name')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        num: [{ required: true, message: `${this.$t('project.num')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        constructionUnit: [{ required: true, message: `${this.$t('project.constructionUnit')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        leader: [{ required: true, message: `${this.$t('project.leader')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        place: [{ required: true, message: `${this.$t('project.place')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        buildingUnit: [{ required: true, message: `${this.$t('project.buildingUnit')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        designUnit: [{ required: true, message: `${this.$t('project.designUnit')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        startDate: [{ required: true, message: `${this.$t('project.startDate')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        phase: [{ required: true, message: `${this.$t('project.phase')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        modelPart: [{ required: true, message: `${this.$t('project.modelPart')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        version: [{ required: true, message: `${this.$t('project.version')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        state: [{ required: true, message: `${this.$t('project.state')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        description: [{ required: true, message: `${this.$t('project.description')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        constructionControlUnit: [{ required: true, message: `${this.$t('project.constructionControlUnit')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        workHour: [{ required: true, message: `${this.$t('project.workHour')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        nightWorkHour: [{ required: true, message: `${this.$t('project.nightWorkHour')}${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getInfo();
    this.handleBidsList();
  },
  methods: {
    getInfo() {
      const { params: { id } } = this.$route;
      // this.$store.dispatch('getBuildingInfo', { id })
      this.$store.dispatch('getProject', { id }).then((res) => {
        res.modelPart = res.modelPart ? res.modelPart.join(',') : null;
        res.teamList = res.teamList ? res.teamList.join(',') : null;
        this.project = { ...this.project, ...res };
        if (this.project.startDate && this.project.startDate !== '' && this.project.startDate.indexOf('/') > 0) {
          this.project.startDateList = this.project.startDate.split('/');
        }
        this.model.modelType = this.project.modelType;
      });
    },
    handleBidsList() {
      const { params: { id } } = this.$route;
      getBidsListByProject({ projectId: id }).then((res) => {
        this.bidsList = res.data;
      });
    },
    handleModelChange(e) {
      const file = e.target.files[0];
      this.model.file = file;
      this.model.fileName = file.name;
    },
    handleDelete() {
      const { params: { id } } = this.$route;
      this.$confirm(this.$t('message.deleteProject'), this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        // delete
        deleteProject({
          projectId: id,
        }).then(() => {
          this.$message({
            type: 'success',
            message: this.$t('message.deleteOk'),
          });

          this.$router.replace('/projectList');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    handleCancel() {
      this.$refs.dialogEditForm.resetFields();
      this.$refs.dialogEditForm.$el.reset();
      this.uploadFileSrc = null;
      this.model = {
        modelType: this.project.modelType,
        file: null,
        fileName: '',
      };
      this.dialogEditVisible = false;
    },
    handleSave() {
      this.project.startDateList = null;
      this.$refs.dialogEditForm.validate((valid) => {
        if (valid) {
          updateProject(this.project).then(() => {
            if (this.model.file !== null) {
              const myConfig = {
                onUploadProgress: (progressEvent) => {
                  if (progressEvent.lengthComputable) {
                    this.progress = Number(((progressEvent.loaded / progressEvent.total) * 100).toFixed(2));
                  }
                },
              };
              uploadModelFile({
                modelFile: this.model.file,
                projectId: this.project.id,
                modeType: this.model.modelType,
              }, myConfig).then((data) => {
                if (data && this.progress === 100) {
                  this.$message({
                    type: 'success',
                    message: this.$t('message.operationSuccess'),
                  });
                  // this.actionStatus = 'view';
                  this.dialogEditVisible = false;
                  this.getInfo();
                }
              });
            } else {
              this.$message({
                type: 'success',
                message: this.$t('message.operationSuccess'),
              });
              // this.actionStatus = 'view';
              this.dialogEditVisible = false;
              this.getInfo();
            }
          });
        }
      });
    },
    handleDateChange(val) {
      if (val !== null && val !== []) {
        let temp = val[0];
        temp += '/';
        temp += val[1];
        this.project.startDate = temp;
      } else {
        this.project.startDate = '';
      }
    },
    handleImgFileChange() {
      this.$refs.fileInput.click();
    },
    handleFileChange(e) {
      const files = e.target.files;
      const file = files[0];
      const self = this;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        self.uploadFileSrc = this.result;
        self.project.picFile = file;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
  .info-container{
    img {
      width: 400px;
      height: 260px;
      object-fit: cover;
    }
    .info-msg{
      width: 94%;
      margin-left: 3%;
      font-size: 14px;
      height: 60px;
      span{
        line-height: 20px;
        text-indent:2em;
      }
      .msgInfo{
        height: 20px;
        width: 100%;
      }
      .label{
        font-weight: bold;
      }
    }
    .msgLeft{
      float: left;
      width: 50%;
    }
    .msgRight{
      float: right;
      width: 49%;
    }
    .name{
      margin-top: 20px;
      margin-bottom: 20px;
      font-weight: bolder;
      font-size: 30px;
      font-family: SimSun;
      letter-spacing: 2px;
    }
    .desc{
      text-indent:2em;
      line-height: 25px;
      width: 100%;
      height: 180px;
      p{
        width: 100%;
        text-indent:2em;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:5;
        overflow: hidden;
      }
    }
  }
</style>
