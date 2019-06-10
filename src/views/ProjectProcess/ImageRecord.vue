<!--suppress ALL -->
<template>
  <div>
    <breadcrumb>
      <div class="flex-row topWork">
        <div><el-button type="text" @click="isBuildingManagement">{{'楼栋管理'}}</el-button></div>
        <span>|</span>
        <div><el-button type="text" @click="theChartToSwitch">{{theChartText}}</el-button></div>
        <span>|</span>
        <div><el-button type="text" @click="imagePprogressContentAdded">{{ '新增进度' }}</el-button></div>
      </div>
    </breadcrumb>
    <div v-if="showBuildingDataList" style="width: 906px">
      <image-record-left
        :building-data-list="buildingDataList"
        :now-selectd="nowSelectd"
        @nowItem="nowItemData"
        @haul="triggerRowdrop2"
        @listData="SwitchBuilding" >
      </image-record-left>
      <!--这个是形象进度-->
      <image-record-right
        :floor-list-tabulated-data="floorListTabulatedData"
        :floor-list-tabulated-data2="floorListTabulatedData2"
        :building-data-list="buildingDataList"
        :building-data-values="buildingDataValues"
        :floor-list-title="floorListTitle"
        :floor-list-title2="floorListTitle2"
        :floor-list-image-progress-list="floorListImageProgressList"
        :the-chart="theChart"
        :is-more-than5="isMoreThan5"
        @mousedown="mousedown"
        @mousemove="mousemove"
        @mouseoutorup="mouseoutorup"
      >
      </image-record-right>
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
        <div id="haulSection"  @click="triggerRowdrop" >
          <!--<div id="haulSection" >-->
          <div  v-for="(item, index) in buildingDataList"
                :key="item.id"
                class="leftBuildingManagement">
            <!--style="-moz-user-select:none;"  unselectable="on" onselectstart="return false;"-->
            <span v-if="!item.isEdit" style="width: 300px;display: block;float: left;">
              {{item.name}}
              </span>
            <span v-if="!item.isEdit">
              <i @click="oldeditImageRecordBuilding(item)" class="el-icon-edit-outline"></i>
                <span style="width: 20px;height: 10px;"></span>
              <i @click="deleteImageRecordBuilding(item)" class="el-icon-delete"></i>
              </span>
            <el-input v-if="item.isEdit" style="width: 230px" v-model.trim="item.name"></el-input>
            <span v-if="item.isEdit">
              <el-button type="primary" size="mini" @click="editImageRecordBuilding(item, index)">更新</el-button>
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
            <el-form-item label="楼栋类别:" prop="type">
              <el-select v-model="addBuildingList.type">
                <el-option v-for="(item, index) in floorListBuildingCategory"
                           :value="item.type"
                           :key="index"
                           :label="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="插入位置:" v-if="buildingDataList.length !== 0">-->
            <!--&lt;!&ndash;<el-radio-group v-model="addBuildingList.indexs" size="mini">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-radio  v-for="(item, index) in buildingDataList" :key="index" :label="index" style="margin-left: 20px;margin-bottom:5px;margin-top:5px;">&ndash;&gt;-->
            <!--&lt;!&ndash;[{{item.name}}]前&ndash;&gt;-->
            <!--&lt;!&ndash;</el-radio>&ndash;&gt;-->
            <!--&lt;!&ndash;&lt;!&ndash;<el-radio :label="buildingDataList.length+1" style="margin-left: 20px;margin-bottom: 10px">&ndash;&gt;&ndash;&gt;-->
            <!--&lt;!&ndash;&lt;!&ndash;插入最后&ndash;&gt;&ndash;&gt;-->
            <!--&lt;!&ndash;&lt;!&ndash;</el-radio>&ndash;&gt;&ndash;&gt;-->
            <!--&lt;!&ndash;</el-radio-group>&ndash;&gt;-->
            <!--<el-input-number v-model="addBuildingList.indexs"></el-input-number>-->
            <!--</el-form-item>-->
          </el-form>
          <div slot="footer" style="margin-top: -20px;">
            <el-button @click="closeBuildingDataForm">{{$t('btn.cancel')}}</el-button>
            <el-button type="primary" @click="addImageRecordBuilding" >{{$t('btn.save')}}</el-button>
          </div>
          <!--<span>楼栋名称:</span><el-input></el-input>-->
          <!--<el-button type="primary">保存</el-button>-->
        </el-dialog>
      </el-dialog>
      <el-dialog
        :visible.sync="newProgressDialog"
        :close-on-click-modal="false"
        width="450px"
        :show-close="true"
        @close="closeImagePprogressContentAdded"
      >
        <div slot="title" style="font-weight: bolder">
          新增进度
          <el-date-picker
            v-model="addDateTime"
            type="month"
            format="yyyy/MM"
            :editable="false"
            size="mini"
            style="width: 150px;margin-left: 20px"
            placeholder="选择月">
          </el-date-picker>
        </div>
        <hr size="1px" style="color: #DCDFE6;margin-top: -20px;margin-bottom: 10px;" >
        <div style="background-color: #F5F7FB;height: 40px;line-height: 40px">
          <i style="width: 4px;height: 16px;background-color: #409EFF;float: left;line-height: 16px;margin: 12px 5px;"></i>
          <span style="margin-right: 2px;">栋号:</span>
          <el-select v-model="buildingDataValue"
                     @change="addImageRecordFloorBuildingId"
                     placeholder="请选择"
                     size="mini">
            <el-option
              v-for="item in buildingDataList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div :style="`height:${floorListImageProgressList.length * 40 + 60}px;`" v-if="isShowImageProgress">
          <div v-for="(item, index) in floorListImageProgressList" :key="index" style="float:left;border-bottom: 1px solid #E5E5E5;width: 410px;height: 40px;display: flex;align-items: center;justify-content:space-between">
            <!--<el-checkbox-group v-model="checkList" style="width: 150px;">-->
            <el-checkbox :label="item.unitPart" v-model="item.ischecked" style="width: 150px"></el-checkbox>
            <!--</el-checkbox-group>-->
            <span style="color: #909399;width: 100px">{{item.projectPart}}</span>
            <el-input-number v-if="item.isPercentage" :max="100" :min="0" size="mini" v-model="item.num"></el-input-number>
            <el-input-number v-if="!item.isPercentage" size="mini" v-model="item.num"></el-input-number>
            <span style="margin-right: 10px;margin-left: 5px">{{item.isPercentage === true ? "%" : "层"}}</span>
          </div>
          <div style="float: right;padding-top: 20px">
            <el-button @click="closeImagePprogressContentAdded">取消</el-button>
            <el-button @click="addImageRecordList">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getImageRecordBuildingInfoList, addImageRecordBuildingInfo,
  deleteImageRecordBuildingInfo, updateImageRecordBuildingInfo,
  getImageRecordList, ImageProgress, BuildingCategory, addImageRecord,
  getImageRecordListByBuildingId } from '@/api/imageRecord';
import ImageRecordLeft from './components/ImageRecordLeft';
import ImageRecordRight from './components/ImageRecordRight';

export default {
  name: 'ImageRecord',
  components: {
    ImageRecordLeft,
    ImageRecordRight,
  },
  data() {
    const { params: { id } } = this.$route;
    return {
      listQuery: {
        projectId: id,
      },
      BuildingManagement: false,
      newProgressDialog: false,
      addBuildingManagement: false,
      buildingDataList: [],
      buildingDataValue: null,
      buildingDataValues: null,
      showBuildingDataList: false,
      addBuildingList: {
        name: '',
        type: 0,
        indexs: 0,
      },
      oldEditBuildName: [],
      initialListData: [],
      floorListData: [],
      floorListTitle: [],
      floorListTitle2: [],
      floorListTitleSelected: {},
      legendDataList: [],
      newdataList: [],
      floorListImageProgress: ImageProgress,
      floorListBuildingCategory: BuildingCategory,
      floorListImageProgressList: [],
      initialData: null,
      initialDiv: null,
      addDateTime: null,
      lastDateTimeData: [],
      checkList: [],
      rules: {
        name: [{ validator: this.validatePass, trigger: 'blur' }],
      },
      tableData: [],
      nowSelectd: 0,
      floorListTabulatedData: [],
      floorListTabulatedData2: [],
      isShowImageProgress: true,
      theChart: true,
      theChartText: '查看图表',
      isMoreThan5: false,
    };
  },
  created() {
    this.handleList();
  },
  methods: {
    handleList() {
      const lsdata = [];
      // 初始获得楼栋数据
      getImageRecordBuildingInfoList({ projectId: this.listQuery.projectId }).then((data) => {
        if (data) {
          data.data.forEach((res) => {
            res.isEdit = false;
            lsdata.push(res);
          });
          // if (lsdata) {
          lsdata.sort((a, b) => {
            const s = a.type - b.type;
            return s;
          });
          this.buildingDataList = lsdata;
          this.showBuildingDataList = true;
          if (this.buildingDataList.length !== 0) {
            this.buildingDataList.forEach((res, index) => {
              if (index === 0) {
                this.buildingDataValue = res.id;
                this.buildingDataValues = res;
                // this.buildingDataValue = { name: res.name, id: res.id };
                if (res.type === 0) { // xx号楼
                  this.floorListImagePro(2);
                } else if (res.type === 1) { // 人防地库
                  this.floorListImagePro(3);
                } else if (res.type === 2) { // 主楼地库
                  this.floorListImagePro(4);
                }
                this.$nextTick(() => {
                  const Button = document.getElementById(`building_${index}`);
                  Button.click();
                });
              }
            });
          }
        }
      });
      // 初始获得形象进度列表内容数据
      getImageRecordList({ projectId: this.listQuery.projectId }).then((data) => {
        if (data) {
          if (data.data) {
            if (data.data[0].contentList) {
              this.floorListData = data.data[0].contentList;
            }
          }
        }
        this.floorListDateTitle();
        this.TheDataProcessing();
      });
    },
    // 楼栋列表日期标题
    floorListDateTitle() {
      const lsTitleData = [];
      const lsTitleData2 = [];
      const lsfloorListTabulatedData = [];
      const lsfloorListTabulatedData2 = [];
      if (this.floorListData) {
        this.floorListData.sort((a, b) => {
          const flag = a.unitPart - b.unitPart; // 根据分项工程排序
          return flag;
        });
        // 右侧列表数据
        this.floorListData.forEach((res) => {
          res.newDatas = [];
          res.newDatas2 = [];
          if (res.content) {
            res.content.forEach((res2, index2) => {
              // lsfloorListTabulatedData.push(res2);
              res.newDatas.push({ Time: res.projectPartDate[index2], Num: res.content[index2] });
              res.newDatas2.push({ Time: res.projectPartDate[index2], Num: res.content[index2] });
            });
          }
          res.newDatas.sort((a, b) => {
            const flag = (new Date(a.Time).getTime() - new Date(b.Time).getTime());
            return flag;
          });
          const nowLength = res.newDatas.length;
          if (nowLength < 5) {
            this.isMoreThan5 = true;
            for (let x = 0; x < (5 - nowLength); x += 1) {
              res.newDatas2.push({ Time: null, Num: null });
            }
          } else {
            this.isMoreThan5 = false;
          }
          res.newDatas.forEach((res3) => {
            lsfloorListTabulatedData.push(res3.Num);
          });
          res.newDatas2.forEach((res3) => {
            lsfloorListTabulatedData2.push(res3.Num);
          });
        });
        // 右侧日期标题
        if (this.floorListData[0]) {
          const lsdata = this.floorListData[0].projectPartDate;
          lsdata.sort((a, b) => {
            const flag = Date.parse(a) - Date.parse(b); // 时间正序
            return flag;
          });
          lsdata.forEach((res2, index) => {
            res2 = new Date(res2);
            // const time = res2.getFullYear() + "-" + ((res2.getMonth() + 1) < 9 ? "0" + (res2.getMonth() + 1) : (res2.getMonth() + 1));
            const time = `${res2.getFullYear()}-${res2.getMonth() + 1 < 9 ? `0${res2.getMonth() + 1}` : (res2.getMonth() + 1)}`; // 选择的时间
            lsTitleData.push(time);
            lsTitleData2.push(time);
            if (index === lsdata.length - 1) {
              if (index < 5) {
                this.isMoreThan5 = true;
                for (let x = 1; x < (5 - index); x += 1) {
                  lsTitleData2.push('');
                }
              } else {
                this.isMoreThan5 = false;
              }
            }
            // lsTitleData.push("111");
          });
        }
      }
      if (this.floorListData.length === 0) {
        this.isMoreThan5 = true;
        for (let x = 0; x < 5; x += 1) {
          lsTitleData2.push(null);
          this.floorListImageProgressList.forEach(() => {
            lsfloorListTabulatedData2.push(null);
          });
        }
      }
      this.floorListTitle = lsTitleData;
      this.floorListTitle2 = lsTitleData2;
      this.floorListTabulatedData = lsfloorListTabulatedData;
      this.floorListTabulatedData2 = lsfloorListTabulatedData2;
    },
    floorListImagePro(flag) {
      const lsdata = [];
      this.floorListImageProgress.forEach((res, index) => {
        if (flag === 2) { // xx号楼
          if (index === 0) {
            res.ElectricalInstallation.forEach((res2) => {
              // lsdata.push('电气安装');
              lsdata.push({ projectPart: '电气安装', unitPart: res2, num: 0, ischecked: true, isPercentage: false });
            });
          }
          if (index === 1) {
            res.DrainageInstallation.forEach((res3) => {
              // lsdata.push('给排水安装');
              lsdata.push({ projectPart: '给排水安装', unitPart: res3, num: 0, ischecked: true, isPercentage: false });
            });
          }
          if (index === 2) {
            res.CommonItems.forEach((res3) => {
              // lsdata.push('公共项');
              lsdata.push({ projectPart: '公共项', unitPart: res3, num: 0, ischecked: true, isPercentage: false });
            });
          }
        } else if (flag === 3) { // 人防
          if (index === 3) {
            res.ElectricalInstallationOfBasement.forEach((res2) => {
              // lsdata.push('地库电气安装');
              lsdata.push({ projectPart: '地库电气安装', unitPart: res2, num: 0, ischecked: true, isPercentage: true });
            });
          }
        } else if (flag === 4) { // 主楼
          if (index === 4) {
            res.FireWaterInstallation.forEach((res2) => {
              // lsdata.push('消防水安装');
              lsdata.push({ projectPart: '消防水安装', unitPart: res2, num: 0, ischecked: true, isPercentage: true });
            });
          }
          if (index === 5) {
            res.VentilationInstallationForBasement.forEach((res2) => {
              // lsdata.push('地库通风安装');
              lsdata.push({ projectPart: '地库通风安装', unitPart: res2, num: 0, ischecked: true, isPercentage: true });
            });
          }
        }
      });
      this.$nextTick(() => {
        this.floorListImageProgressList = lsdata;
      });
    },
    // 行拖拽
    rowDrop(tbody, flag) {
      const msg = this;
      this.$Sortable.create(tbody, {
        animation: 150, // 动画参数
        onEnd({ newIndex, oldIndex }) {
          const currRow = msg.buildingDataList.splice(oldIndex, 1)[0];
          msg.buildingDataList.splice(newIndex, 0, currRow);
          msg.buildingDataList.forEach((res, index) => {
            res.isEditIndexs = true;
            if (res.type === 0) {
              msg.editImageRecordBuilding(res, index);
            } else {
              if (oldIndex === index || newIndex === index) {
                msg.$nextTick(() => {
                  // const currRow2 = msg.buildingDataList.splice(oldIndex, 1)[0];
                  // msg.buildingDataList.splice(newIndex, 0, currRow2);
                  msg.$message({
                    type: 'warning',
                    message: `${'人防地库和主楼地库默认在最后!'}`,
                  });
                });
              }
            }
            // if (msg.buildingDataList[oldIndex].type !== 0 && msg.buildingDataList[newIndex].type !== 0) {
            //   msg.$nextTick(() => {
            //     const currRow2 = msg.buildingDataList.splice(oldIndex, 1)[0];
            //     msg.buildingDataList.splice(newIndex, 0, currRow2);
            //     msg.$message({
            //       type: 'warning',
            //       message: `${'人防地库和主楼地库默认在最后!'}`,
            //     });
            //   });
            // }
          });
          msg.nowSelectd = newIndex;
          if (flag) {
            msg.showBuildingDataList = false;
            msg.BuildingManagement = false;
            msg.$nextTick(() => {
              msg.showBuildingDataList = true;
              msg.buildingDataList.forEach((res, index) => {
                if (res.id === currRow.id) {
                  msg.$nextTick(() => {
                    const Button = document.getElementById(`building_${index}`);
                    Button.click();
                  });
                }
              });
            });
          } else {
            msg.buildingDataList.forEach((res, index) => {
              if (res.id === currRow.id) {
                msg.$nextTick(() => {
                  const Button = document.getElementById(`building_${index}`);
                  Button.click();
                });
              }
            });
          }
        },
      });
      // this.buildingDataList = msg.buildingDataList;
    },
    triggerRowdrop() {
      const tbody = document.getElementById('haulSection');
      this.rowDrop(tbody, false);
      // this.$nextTick(() => {
      //   this.rowDrop(tbody, false);
      // });
    },
    triggerRowdrop2() {
      const tbody = document.getElementById('triggerHaulSection');
      this.rowDrop(tbody, true);
      // this.$nextTick(() => {
      //   this.rowDrop(tbody, true);
      // });
    },
    openBuildingManagement() {
      const Button2 = document.getElementById('haulSection');
      if (Button2) {
        Button2.click();
      }
    },
    // 楼栋管理
    isBuildingManagement() {
      this.BuildingManagement = true;
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
      if (this.buildingDataList.length !== 0) {
        let maxIndexs = 0;
        this.buildingDataList.forEach((res) => {
          if (res.indexs > maxIndexs) {
            maxIndexs = res.indexs;
          }
        });
        this.addBuildingList.indexs = maxIndexs + 1;
      } else {
        this.addBuildingList.indexs = 0;
      }
      this.$refs.buildingDataForm.validate((valid) => {
        if (valid) {
          const partms = {
            projectId: this.listQuery.projectId,
            name: this.addBuildingList.name,
            type: this.addBuildingList.type,
            indexs: this.addBuildingList.indexs,
          };
          addImageRecordBuildingInfo(partms).then((data) => {
            if (data) {
              this.handleList();
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
    // 楼栋删除
    deleteImageRecordBuilding(item) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        // center: true,
      }).then(() => {
        deleteImageRecordBuildingInfo({ id: item.id }).then((data) => {
          if (data) {
            this.buildingDataList.forEach((res, index) => {
              if (res.id === item.id) {
                this.buildingDataList.splice(index, 1);
              }
            });
            if (this.buildingDataList.length === 0) {
              this.BuildingManagement = false;
              this.$nextTick(() => {
                this.floorListTabulatedData = [];
                this.floorListTitle = [];
                this.$message({
                  type: 'warning',
                  message: `${'楼栋数据已全部删除!'}`,
                });
              });
            } else {
              this.$nextTick(() => {
                // this.floorListTabulatedData = [];
                // this.handleList();
                this.$message({
                  type: 'success',
                  message: `${'楼栋删除成功!'}`,
                });
              });
            }
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除!',
        });
      });
    },
    // 存储更新前的数据
    oldeditImageRecordBuilding(item) {
      const oldname = JSON.parse(JSON.stringify(item));
      this.oldEditBuildName.push(oldname);
      item.isEdit = true;
    },
    // 更新楼栋数据
    editImageRecordBuilding(item, index) {
      if (item.isEdit) {
        const partms = {
          id: item.id,
          name: item.name,
          indexs: index,
        };
        updateImageRecordBuildingInfo(partms).then(() => {
          item.isEdit = false;
          this.$message({
            type: 'success',
            message: `${'楼栋更新成功!'}`,
          });
        });
      }
      if (item.isEditIndexs) {
        const partms = {
          id: item.id,
          name: item.name,
          indexs: index,
        };
        updateImageRecordBuildingInfo(partms);
        item.isEditIndexs = false;
      }
    },
    // 取消更新楼栋数据
    closeeditImageRecordBuilding(item) {
      if (item.isEdit) {
        this.oldEditBuildName.forEach((res) => {
          if (res.id === item.id) {
            item.name = res.name;
          }
        });
        item.isEdit = false;
      }
    },
    // 根据楼栋获取形象进度列表内容
    SwitchBuilding(item) {
      if (item.type === 0) { // xx号楼
        this.floorListImagePro(2);
      } else if (item.type === 1) { // 人防地库
        this.floorListImagePro(3);
      } else if (item.type === 2) { // 主楼地库
        this.floorListImagePro(4);
      }
      getImageRecordListByBuildingId({ projectId: this.listQuery.projectId, buildingId: item.id }).then((data) => {
        if (data) {
          if (data.data.length === 0) {
            this.floorListData = [];
            this.floorListTitle = [];
            this.floorListTabulatedData = [];
            this.$nextTick(() => {
              this.floorListDateTitle();
              this.TheDataProcessing();
              this.lastDateTimeData = [];
              this.addDateTime = null;
            });
            if (!this.theChart) {
              this.theChart = true;
              this.$nextTick(() => {
                this.theChart = false;
                this.theChartGenerate();
              });
            }
          } else {
            this.floorListData = data.data;
            this.initialListData = JSON.parse(JSON.stringify(this.floorListData[0]));
            this.$nextTick(() => {
              this.floorListDateTitle();
              this.TheDataProcessing();
            });
            if (!this.theChart) {
              this.theChart = true;
              this.$nextTick(() => {
                this.theChart = false;
                this.theChartGenerate();
              });
            }
          }
        }
      });
    },
    // 鼠标拖动
    mousedown(e) {
      this.initialData = e.layerX;
      this.initialDiv = document.getElementById('rightDiv');
    },
    mousemove(e) {
      if (this.initialData !== null && this.initialDiv !== null) {
        this.initialDiv.scrollLeft += (e.layerX - this.initialData);
        this.initialData = e.layerX;
      }
    },
    mouseoutorup() {
      this.initialData = null;
      this.initialDiv = null;
    },
    // 新增楼栋规则校验
    validatePass(rule, value, callback) {
      if (value === '') {
        return callback(new Error('楼栋名称不能为空!'));
      }
      // else if (value.indexOf('号楼') !== -1 || value.indexOf('人防') !== -1 || value.indexOf('主楼') !== -1) {
      //   return callback();
      // }
      // return callback(new Error('楼栋名称应包含人防、主楼或如xx号楼..'));
      return callback();
    },
    // 形象进度内容新增
    imagePprogressContentAdded() {
      if (this.buildingDataList.length !== 0) {
        this.newProgressDialog = true;
        if (this.lastDateTimeData.length !== 0) {
          this.floorListImageProgressList.forEach((res, index) => {
            res.num = this.lastDateTimeData[index];
          });
        }
      }
    },
    // 图表切换
    theChartToSwitch() {
      if (this.buildingDataList.length !== 0) {
        if (this.theChart) {
          this.theChartGenerate();
          this.theChartText = '返回表单';
          this.theChart = false;
        } else {
          this.theChartText = '查看图表';
          this.theChart = true;
        }
      }
    },
    // 图表生成
    theChartGenerate() {
      this.TheDataProcessing();
      const option2 = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          type: 'scroll',
          // orient: 'vertical',
          orient: 'horizontal',
          right: 10,
          left: 100,
          top: 20,
          bottom: 20,
          // data: legendDataList,
          data: this.floorListTitle,
          selected: this.floorListTitleSelected,
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
            // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            // data: this.floorListTitle,
            name: '部位',
            nameGap: 2,
            data: this.legendDataList,
            axisLabel: {
              formatter(value) {
                return value.split('').join('\n');
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            max(value) {
              const values = Math.ceil(value.max + (value.max / 10));
              return values % 2 === 0 ? values : values + 1;
            },
            interval: 2,
            // name : this.isPercentage ? '%' : '层',
            name: this.buildingDataValues.type === 0 ? '单位: 层' : '单位: %',
          },
        ],
        dataZoom: [
          {
            show: true,
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 100,
          }, {
            type: 'slider',
            show: true,
            bottom: 0,
            left: 100,
            right: 100,
            xAxisIndex: [0],
            height: 20,
            start: 0,
            end: 100,
          },
          // {
          //   type: 'inside',
          //   yAxisIndex: [0],
          //   start: 29,
          //   end: 36
          // }
        ],
        // series : [
        //   {
        //     name:'直接访问',
        //     type:'bar',
        //     stack: '电气安装',
        //     data:[320, 332, 301, 334, 390, 330, 320]
        //   },
        //   {
        //     name:'邮件营销',
        //     type:'bar',
        //     stack: '电气安装',
        //     data:[120, 132, 101, 134, 90, 230, 210]
        //   },
        //   {
        //     name:'联盟广告',
        //     type:'bar',
        //     stack: '给排水安装',
        //     data:[220, 182, 191, 234, 290, 330, 310]
        //   },
        //   {
        //     name:'视频广告',
        //     type:'bar',
        //     stack: '给排水安装',
        //     data:[150, 232, 201, 154, 190, 330, 410]
        //   },
        //
        //   {
        //     name:'百度',
        //     type:'bar',
        //     // barWidth : 5,
        //     stack: '给排水安装',
        //     data:[620, 732, 701, 734, 1090, 1130, 1120]
        //   },
        //   {
        //     name:'谷歌',
        //     type:'bar',
        //     stack: '公共项',
        //     data:[120, 132, 101, 134, 290, 230, 220]
        //   },
        //   {
        //     name:'必应',
        //     type:'bar',
        //     stack: '公共项',
        //     data:[60, 72, 71, 74, 190, 130, 110]
        //   },
        //   {
        //     name:'其他',
        //     type:'bar',
        //     stack: '公共项',
        //     data:[62, 82, 91, 84, 109, 110, 120]
        //   }
        // ],
        series: this.newdataList,
        // series: result,
      };
      this.$nextTick(() => {
        const docm = document.getElementById('isTheCharts2');
        const myChart = this.$echarts.init(docm);
        myChart.showLoading({
          text: '正在努力的读取数据中...',
        });
        myChart.clear();
        myChart.setOption(option2);
        myChart.hideLoading();
      });
    },
    // 关闭形象进度内容新增窗口
    closeImagePprogressContentAdded() {
      this.newProgressDialog = false;
      this.buildingDataList.forEach((res, index) => {
        if (res.id === this.buildingDataValue) {
          this.$nextTick(() => {
            const Button = document.getElementById(`building_${index}`);
            Button.click();
          });
        }
      });
      this.addDateTime = null;
    },
    // 存储当前选中的楼栋信息
    nowItemData(item) {
      this.buildingDataValue = item.id;
      this.buildingDataValues = item;
    },
    // 选择的楼栋号
    addImageRecordFloorBuildingId() {
      this.buildingDataList.forEach((res, index) => {
        if (res.id === this.buildingDataValue) {
          const Button = document.getElementById(`building_${index}`);
          Button.click();
          this.isShowImageProgress = false;
          this.$nextTick(() => {
            this.isShowImageProgress = true;
          });
        }
      });
    },
    addImageRecordList() {
      if (this.floorListImageProgressList) {
        let flag = true;
        this.floorListImageProgressList.forEach((res, index) => {
          // const projectId = this.listQuery.projectId;
          // const buildingId = this.buildingDataValue.id;
          // const imageRecordDateTime = this.addDateTime.getFullYear()+'-'+(this.addDateTime.getMonth()<9?("0"+(this.addDateTime.getMonth()+1)):(this.addDateTime.getMonth()+1))+"-"+this.addDateTime.getDate();
          if (this.addDateTime === null) {
            this.$message({
              type: 'warning',
              message: `${'请选择日期!'}`,
            });
            return;
          }
          if (!res.ischecked) {
            res.num = 0;
          }
          const parmts = {
            projectId: this.listQuery.projectId,
            buildingId: this.buildingDataValue,
            projectPartDate: this.addDateTime,
            unitPart: index,
            projectPart: index,
            content: res.num,
          };
          addImageRecord(parmts).then((data) => {
            if (data) {
              if ((index + 1) >= this.floorListImageProgressList.length) {
                if (flag) {
                  this.$message({
                    type: 'success',
                    message: `${'数据新增成功!'}`,
                  });
                  flag = false;
                  this.closeImagePprogressContentAdded();
                }
              }
            }
          });
        });
      }
    },
    // 数据处理
    TheDataProcessing() {
      const floorListTitleSelected = {}; // 默认取消选中哪些日期 2
      this.floorListTitle.forEach((res, index) => {
        if (index > 1) {
          floorListTitleSelected[res] = false;
        }
      });
      this.floorListTitleSelected = floorListTitleSelected;
      const result = []; // 列表数据 1
      for (let x = 0; x < Math.ceil(this.floorListTabulatedData.length / this.floorListTitle.length); x += 1) {
        const start = x * this.floorListTitle.length;
        const end = start + this.floorListTitle.length;
        result.push(this.floorListTabulatedData.slice(start, end));
      }
      const lastResult = []; // y轴分项工程分类数据 1
      if (this.buildingDataValues) {
        if (this.buildingDataValues.type === 0) {
          lastResult.push({ data: this.floorListImageProgress[0].ElectricalInstallation, name: `${'电气安装'}`, type: `${'bar'}` });
          lastResult.push({ data: this.floorListImageProgress[1].DrainageInstallation, name: `${'给排水安装'}`, type: `${'bar'}` });
          lastResult.push({ data: this.floorListImageProgress[2].CommonItems, name: `${'公共项'}`, type: `${'bar'}` });
        } else if (this.buildingDataValues.type === 1) {
          lastResult.push({ data: this.floorListImageProgress[3].ElectricalInstallationOfBasement, name: `${'地库电气安装'}`, type: `${'bar'}` });
        } else if (this.buildingDataValues.type === 2) {
          lastResult.push({ data: this.floorListImageProgress[4].FireWaterInstallation, name: `${'消防水安装'}`, type: `${'bar'}` });
          lastResult.push({ data: this.floorListImageProgress[5].VentilationInstallationForBasement, name: `${'地库通风安装'}`, type: `${'bar'}` });
        }
      }
      const dataList = []; // 柱状图数据 series y轴数据 1
      const newdataList = []; // 柱状图数据 series y轴数据 2
      const legendDataList = [];// x轴数据 2
      const legendDataListSelected = {}; // 默认没有选中的数据 1
      let index = -1;
      lastResult.forEach((res) => {
        res.data.forEach((res2, index2) => {
          if (index2 < 3) {
            legendDataList.push(res2);
          } else {
            legendDataList.push(res2);
            legendDataListSelected[res2] = false;
          }
          dataList.push({ name: res2, stack: res.name, type: res.type, data: result[index += 1] });
        });
      });
      this.legendDataList = legendDataList;
      const lsdata = []; // 柱状图中转数据 2
      result.forEach((res) => {
        res.forEach((res2, index2) => {
          // this.floorListTitle.forEach((res3) => {
          lsdata.push({ time: this.floorListTitle[index2], num: res2 });
          // });
        });
      });
      const lastData = []; // 柱状图再中转数据 2
      lsdata.forEach((res) => {
        lastData.push({ name: res.time, type: 'bar', data: res.num });
      });
      this.floorListTitle.forEach((res) => {
        const lsdata2 = [];
        lsdata.forEach((res2) => {
          if (res === res2.time) {
            lsdata2.push(res2.num);
          }
        });
        newdataList.push({ name: res, data: lsdata2, type: 'bar', itemStyle: { normal: { label: { show: true, position: 'top', textStyle: { color: 'black', fontSize: 12 } } } } });
      });
      this.newdataList = newdataList;
      if (this.newdataList.length !== 0) {
        const lsDatas = this.newdataList[this.newdataList.length - 1];
        const newDateTime = `${new Date(lsDatas.name).getFullYear()}-${(new Date(lsDatas.name).getMonth() + 2)}`;
        this.addDateTime = new Date(newDateTime);
        this.lastDateTimeData = lsDatas.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .topWork {
    div {
      padding-left: 10px;
    }
    span {
      color: #DCDFE6;
      padding-left: 10px;
    }
  }
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
