<template>
  <div class="contractLofting">
    <breadcrumb>
      <div class="flex-sb">
        <div>
          <el-input placeholder="请输入名称" v-model="searchQuery.name" style="width: 200px;" @change="getListByName"></el-input>
        </div>
        <div class="upload-file-wrapper flex-row">
          <el-button type="text" style="width: 100px" @click="dialogImportVisible = true">{{ '文件上传' }}</el-button>
        </div>
      </div>
    </breadcrumb>
    <div class="app-container">
      <contract-lofting-table
      :list="titleList"
      :title="title"
      @show="handleShow"
      @childrenShow="handleChildrenShow"
      @grandsonShow="handleGrandsonShow"
      @edit="handleEdit"
      @childrenEdit="handleChildrenEdit"
      @grandsonEdit="handleGrandsonEdit"
      @greatGrandsonEdit="handleGreatGrandsonEdit"
      @clear="handleCancel"
      @childrenClear="handleChildrenCancel"
      @grandsonClear="handleGrandsonCancel"
      @greatGrandsonClear="handleGreatGrandsonCancel"
      @insert="handleInsert"
      @childrenInsert="handleChildrenInsert"
      @grandsonInsert="handleGrandsonInsert"
      @parentInsert = "handleParentInsert"
      @save="handleSave"
      @childrenSave="handleChildrenSave"
      @grandsonSave="handleGrandsonSave"
      @greatGrandsonSave="handleGreatGrandsonSave"
      @colUpdate="handleColUpdate"
      @remove="handleRemove"
      @childrenRemove="handleChildrenRemove"
      @grandsonRemove="handleGrandsonRemove"
      @greatGrandsonRemove="handleGreatGrandsonRemove"
      ></contract-lofting-table>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogImportVisible"
      width="480px"
    >
      <div slot="title" style="font-weight: bolder">
        从Excel文件导入
      </div>
      <div class="import-info">
        <section>提示：从Excel文件导入必须按照标准格式，点击<a :href="downloadPath | setFileRoot" target="_blank" style="color: blue">下载标准格式文档</a>下载。或者
          <a class="file-wrapper" @click="handleImport">
            <span style="color: blue">从本地导入</span>
            <input type="file" accept=".xls,.xlsx,.csv" ref="importInput" @change="handleInputData($event)" style="display: none"/>
          </a>。
        </section>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogTableVisible"
      @close="handleColDiaLogClose"
    >
      <div slot="title" style="font-weight: bolder">
        <span>{{ '合同放样量列管理' }}</span>
        <el-button @click="handleOpenColAddVis" type="text"  style="float: right;margin-right: 40px;">{{ '新增' }}</el-button>
      </div>
      <hr noshade size="1px" style="margin-top: -10px; margin-bottom: 10px;color: rgba(220,223,230,1);" >
      <div style="padding-top: 20px;">
        <el-form :inline="true" label-position="right" label-width="90px">
          <el-form-item v-for="(item, index) in titleEdit" :label="`第${index + 1}列：`" :key="index">
            <el-input v-model="item.partName" placeholder="请输入列名" style="width: 255px;">
              <i slot="suffix" class="el-input__icon el-icon-delete editIcon" @click="handleColRemove(item)"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="handleColDiaLogClose">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary"  @click="handleSaveColChange">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogTableVisible"
      @close="handleColAddDiaLogClose"
      width="400px"
    >
      <div slot="title" style="font-weight: bolder">
        <span>{{ '新增合同放样量列名' }}</span>
      </div>
      <hr noshade size="1px" style="margin-top: -10px; margin-bottom: 10px;color: rgba(220,223,230,1);" >
      <div style="padding-top: 20px;">
        <el-form :inline="true" label-position="right" :rules="colRules" ref="addDialogForm" :model="colObject">
          <el-form-item label="列名：" prop="name">
            <el-input v-model="colObject.name" placeholder="请输入列名"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="handleColAddDiaLogClose">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary"  @click="handleSaveColAddChange">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDefaultList,
  getContractLoftingList,
  getProjectPartContractLoftingList,
  addContractLofting, updateContractLofting,
  deleteContractLofting,
  deleteProjectPartContractLoftingByName,
  addProjectPartContractLofting,
  importContractLoftingByProjectId,
  updateProjectPartContractLofting,
} from '@/api/contractLofting';
import TableTreeNodeOfContractLofting from './components/TableTreeNodeOfContractLofting';
import ContractLoftingTable from './components/ContractLoftingTable';

export default {
  name: 'ContractLofting',
  components: {
    ContractLoftingTable,
    TableTreeNodeOfContractLofting,
  },
  data() {
    const { params: { id } } = this.$route;
    return {
      listQuery: {
        // pageSize: 10,
        pageIndex: -1,
        projectId: id,
      },
      titleListQuery: {
        projectId: id,
      },
      listLoading: false,
      title: [],
      titleList: [],
      list: [],
      titleTemp: [],
      dialogTableVisible: false,
      colDialogTableVisible: false,
      addDialogTableVisible: false,
      dialogImportVisible: false,
      downloadPath: 'files/contractLofting/contractLofting.xlsx',
      colObject: {
        name: null,
        projectId: id,
        contractLoftingId: null,
        value: null,
        pName: null,
      },
      colRules: {
        name: [{ required: true, message: `列名${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
      titleEdit: [],
      searchQuery: {
        name: '',
      },
    };
  },
  beforeCreate() {
  },
  created() {
    this.getListTop();
  },
  methods: {
    getListTop() {
      getContractLoftingList(this.listQuery).then((res) => {
        if (res) {
          const listTemp = res.data;
          if (listTemp && listTemp.length > 0) {
            getDefaultList(this.titleListQuery).then((centerRes) => {
              if (centerRes) {
                const centerData = centerRes.data;
                if (centerData && centerData.length > 0) {
                  const titleListTemp = [];
                  const titleNameListTemp = [];
                  for (const key in listTemp) {
                    if (key) {
                      titleListTemp.push({ index: Number(key), show: false, edit: false, children: [], titleList: [], ...listTemp[key] });
                      for (const cat in centerData) {
                        if (cat) {
                          if (centerData[cat].name === listTemp[key].name) {
                            titleListTemp[key].titleList.push(centerData[cat]);
                            if (Number(key) === 0) {
                              titleNameListTemp.push(centerData[cat]);
                            }
                          }
                        }
                      }
                    }
                  }
                  this.title = titleNameListTemp;
                  this.titleEdit = JSON.parse(JSON.stringify(titleNameListTemp));
                  this.titleList = titleListTemp;
                }
              }
            });
          }
        }
      });
    },
    handleImport() {
      this.$refs.importInput.click();
    },
    handleInputData(e) {
      importContractLoftingByProjectId({ projectId: this.listQuery.projectId, files: e.target.files[0] }).then((res) => {
        this.dialogImportVisible = false;
        if (res) {
          this.getListTop();
          this.$message({
            type: 'success',
            message: this.$t('message.operationSuccess'),
          });
        }
      });
    },
    handleShow(val) {
      if (val.show) {
        const tilteListTemp = JSON.parse(JSON.stringify(this.titleList));
        for (const key in tilteListTemp) {
          if (key) {
            if (tilteListTemp[key].id === val.id) {
              tilteListTemp[key].show = false;
              break;
            }
          }
        }
        this.titleList = tilteListTemp;
      } else {
        getContractLoftingList({ id: val.id, ...this.listQuery }).then((res) => {
          if (res) {
            const tilteListTemp = JSON.parse(JSON.stringify(this.titleList));
            for (const key in tilteListTemp) {
              if (key) {
                if (tilteListTemp[key].id === val.id) {
                  const { data } = res;
                  const children = [];
                  data.forEach((item) => {
                    children.push({ edit: false, show: false, children: [], titleList: [], ...item });
                  });
                  getProjectPartContractLoftingList({ contractLoftingId: val.id, ...this.titleListQuery }).then((loftRes) => {
                    if (loftRes) {
                      const loftDate = loftRes.data;
                      for (const joy in loftDate) {
                        if (joy) {
                          for (const cat in children) {
                            if (cat) {
                              if (loftDate[joy].loftingId === children[cat].id) {
                                children[cat].titleList.push(loftDate[joy]);
                              }
                            }
                          }
                        }
                      }
                    }
                    tilteListTemp[key].show = true;
                    tilteListTemp[key].children = children;
                    this.titleList = tilteListTemp;
                  });
                  break;
                }
              }
            }
          }
        });
      }
    },
    handleChildrenShow(val) {
      const msg = this;
      if (val.show) {
        for (const key in msg.titleList) {
          if (key) {
            if (msg.titleList[key].id === val.pid) {
              for (const tom in msg.titleList[key].children) {
                if (msg.titleList[key].children[tom].id === val.id) {
                  msg.titleList[key].children[tom].show = false;
                  break;
                }
              }
              break;
            }
          }
        }
      } else {
        for (const key in msg.titleList) {
          if (key && msg.titleList[key].id === val.pid) {
            for (const tom in msg.titleList[key].children) {
              if (tom && msg.titleList[key].children[tom].id === val.id) {
                msg.titleList[key].children[tom].show = true;
                const children = [];
                getContractLoftingList({ id: val.id, ...this.listQuery }).then((res) => {
                  if (res) {
                    res.data.forEach((item) => {
                      children.push({ gid: val.pid, edit: false, show: false, children: [], titleList: [], ...item });
                    });
                    getProjectPartContractLoftingList({ contractLoftingId: val.id, ...this.titleListQuery }).then((loftRes) => {
                      if (loftRes) {
                        // 外小，内大
                        children.forEach((cat) => {
                          loftRes.data.forEach((dog) => {
                            if (dog.loftingId === cat.id) {
                              cat.titleList.push(dog);
                            }
                          });
                        });
                        msg.titleList[key].children[tom].children = children;
                      }
                    });
                  }
                });
                // msg.titleList.children[tom].children =
                break;
              }
            }
            break;
          }
        }
      }
    },
    handleGrandsonShow(val) {
      const msg = this;
      if (val.show) {
        for (const key in msg.titleList) {
          if (key && msg.titleList[key].id === val.gid) {
            for (const tom in msg.titleList[key].children) {
              if (tom && msg.titleList[key].children[tom].id === val.pid) {
                for (const dog in msg.titleList[key].children[tom].children) {
                  if (dog && msg.titleList[key].children[tom].children[dog].id === val.id) {
                    msg.titleList[key].children[tom].children[dog].show = false;
                  }
                }
              }
            }
          }
        }
      } else {
        for (const key in msg.titleList) {
          if (key && msg.titleList[key].id === val.gid) {
            for (const tom in msg.titleList[key].children) {
              if (tom && msg.titleList[key].children[tom].id === val.pid) {
                for (const dog in msg.titleList[key].children[tom].children) {
                  if (dog && msg.titleList[key].children[tom].children[dog].id === val.id) {
                    msg.titleList[key].children[tom].children[dog].show = true;
                    const children = [];
                    getContractLoftingList({ id: val.id, ...this.listQuery }).then((res) => {
                      if (res) {
                        res.data.forEach((item) => {
                          children.push({ ggid: val.gid, gid: val.pid, edit: false, show: false, children: [], titleList: [], ...item });
                        });
                        getProjectPartContractLoftingList({ contractLoftingId: val.id, ...this.titleListQuery }).then((loftRes) => {
                          if (loftRes) {
                            // 外小，内大
                            children.forEach((cat) => {
                              loftRes.data.forEach((tiger) => {
                                if (tiger.loftingId === cat.id) {
                                  cat.titleList.push(tiger);
                                }
                              });
                            });
                            msg.titleList[key].children[tom].children[dog].children = children;
                          }
                        });
                      }
                    });
                  }
                }
              }
            }
          }
        }
      }
    },
    handleEdit(val) {
      for (const key in this.titleList) {
        if (key && this.titleList[key].id === val.id) {
          this.titleList[key].edit = true;
          break;
        }
      }
    },
    handleChildrenEdit(val) {
      for (const key in this.titleList) {
        if (key && this.titleList[key].id === val.pid) {
          for (const cat in this.titleList[key].children) {
            if (cat && this.titleList[key].children[cat].id === val.id) {
              this.titleList[key].children[cat].edit = true;
              break;
            }
          }
          break;
        }
      }
    },
    handleGrandsonEdit(val) {
      for (const key in this.titleList) {
        if (key && this.titleList[key].id === val.gid) {
          for (const cat in this.titleList[key].children) {
            if (cat && this.titleList[key].children[cat].id === val.pid) {
              for (const dog in this.titleList[key].children[cat].children) {
                if (dog && this.titleList[key].children[cat].children[dog].id === val.id) {
                  this.titleList[key].children[cat].children[dog].edit = true;
                  break;
                }
              }
              break;
            }
          }
          break;
        }
      }
    },
    handleGreatGrandsonEdit(val) {
      for (const key in this.titleList) {
        if (key && this.titleList[key].id === val.ggid) {
          for (const cat in this.titleList[key].children) {
            if (cat && this.titleList[key].children[cat].id === val.gid) {
              for (const dog in this.titleList[key].children[cat].children) {
                if (dog && this.titleList[key].children[cat].children[dog].id === val.pid) {
                  for (const tiger in this.titleList[key].children[cat].children[dog].children) {
                    if (tiger && this.titleList[key].children[cat].children[dog].children[tiger].id === val.id) {
                      this.titleList[key].children[cat].children[dog].children[tiger].edit = true;
                      break;
                    }
                  }
                  break;
                }
              }
              break;
            }
          }
          break;
        }
      }
    },
    handleCancel(val) {
      if (val.id > 0) {
        for (const key in this.titleList) {
          if (key && this.titleList[key].id === val.id) {
            this.titleList[key].edit = false;
            break;
          }
        }
      } else {
        for (const key in this.titleList) {
          if (key && this.titleList[key].id === val.id) {
            this.titleList.splice(Number(key), 1);
            break;
          }
        }
      }
    },
    handleChildrenCancel(val) {
      if (val.id > 0) {
        for (const key in this.titleList) {
          if (key && this.titleList[key].id === val.pid) {
            for (const cat in this.titleList[key].children) {
              if (cat && this.titleList[key].children[cat].id === val.id) {
                this.titleList[key].children[cat].edit = false;
                break;
              }
            }
            break;
          }
        }
      } else {
        for (const key in this.titleList) {
          if (key && this.titleList[key].id === val.pid) {
            for (const cat in this.titleList[key].children) {
              if (cat && this.titleList[key].children[cat].id === val.id) {
                this.titleList[key].children.splice(Number(cat), 1);
                break;
              }
            }
            break;
          }
        }
      }
    },
    handleGrandsonCancel(val) {
      if (val.id > 0) {
        for (const key in this.titleList) {
          if (key && this.titleList[key].id === val.gid) {
            for (const cat in this.titleList[key].children) {
              if (cat && this.titleList[key].children[cat].id === val.pid) {
                for (const dog in this.titleList[key].children[cat].children) {
                  if (dog && this.titleList[key].children[cat].children[dog].id === val.id) {
                    this.titleList[key].children[cat].children[dog].edit = false;
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
        }
      } else {
        for (const key in this.titleList) {
          if (key && this.titleList[key].id === val.gid) {
            for (const cat in this.titleList[key].children) {
              if (cat && this.titleList[key].children[cat].id === val.pid) {
                for (const dog in this.titleList[key].children[cat].children) {
                  if (dog && this.titleList[key].children[cat].children[dog].id === val.id) {
                    this.titleList[key].children[cat].children.splice(Number(dog), 1);
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
        }
      }
    },
    handleGreatGrandsonCancel(val) {
      if (val.id > 0) {
        for (const key in this.titleList) {
          if (key && this.titleList[key].id === val.ggid) {
            for (const cat in this.titleList[key].children) {
              if (cat && this.titleList[key].children[cat].id === val.gid) {
                for (const dog in this.titleList[key].children[cat].children) {
                  if (dog && this.titleList[key].children[cat].children[dog].id === val.pid) {
                    for (const tiger in this.titleList[key].children[cat].children[dog].children) {
                      if (tiger && this.titleList[key].children[cat].children[dog].children[tiger].id === val.id) {
                        this.titleList[key].children[cat].children[dog].children[tiger].edit = false;
                        break;
                      }
                    }
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
        }
      } else {
        for (const key in this.titleList) {
          if (key && this.titleList[key].id === val.ggid) {
            for (const cat in this.titleList[key].children) {
              if (cat && this.titleList[key].children[cat].id === val.gid) {
                for (const dog in this.titleList[key].children[cat].children) {
                  if (dog && this.titleList[key].children[cat].children[dog].id === val.pid) {
                    for (const tiger in this.titleList[key].children[cat].children[dog].children) {
                      if (tiger && this.titleList[key].children[cat].children[dog].children[tiger].id === val.id) {
                        this.titleList[key].children[cat].children[dog].children.splice(Number(tiger), 1);
                        break;
                      }
                    }
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
        }
      }
    },
    handleParentInsert() {
      const titleListTemp = [];
      for (const tom in this.title) {
        if (tom) {
          titleListTemp.push({ value: null, name: '', id: null, loftingId: null, partName: this.title[tom].partName });
        }
      }
      const temp = {
        createDate: null,
        createUser: null,
        id: 0 - Date.now(),
        limitCoefficient: null,
        limitNum: null,
        name: '',
        projectId: this.listQuery.projectId,
        projectPartId: null,
        projectPartValue: null,
        remark: '',
        sum: null,
        unit: '',
      };
      this.titleList.push({ edit: true, show: true, children: [], titleList: titleListTemp, ...temp });
    },
    handleInsert(val) {
      for (const key in this.titleList) {
        if (key && this.titleList[key].id === val.id) {
          const titleListTemp = [];
          for (const tom in this.title) {
            if (tom) {
              titleListTemp.push({ value: null, name: '', id: null, loftingId: null, partName: this.title[tom].partName });
            }
          }
          this.titleList[key].show = true;
          const temp = {
            createDate: null,
            createUser: null,
            id: 0 - Date.now(),
            limitCoefficient: null,
            limitNum: null,
            name: '',
            pid: val.id,
            projectId: this.listQuery.projectId,
            projectPartId: null,
            projectPartValue: null,
            remark: '',
            sum: null,
            unit: '',
          };
          this.titleList[key].children.push({ edit: true, show: false, children: [], titleList: titleListTemp, ...temp });
          break;
        }
      }
    },
    handleChildrenInsert(val) {
      for (const key in this.titleList) {
        if (key && this.titleList[key].id === val.pid) {
          for (const cat in this.titleList[key].children) {
            if (cat && this.titleList[key].children[cat].id === val.id) {
              const titleListTemp = [];
              for (const tom in this.title) {
                if (tom) {
                  titleListTemp.push({ value: null, name: '', id: null, loftingId: null, partName: this.title[tom].partName });
                }
              }
              this.titleList[key].children[cat].show = true;
              const temp = {
                createDate: null,
                createUser: null,
                id: 0 - Date.now(),
                limitCoefficient: null,
                limitNum: null,
                name: '',
                pid: val.id,
                gid: val.pid,
                projectId: this.listQuery.projectId,
                projectPartId: null,
                projectPartValue: null,
                remark: '',
                sum: null,
                unit: '',
              };
              this.titleList[key].children[cat].children.push({ edit: true, show: false, children: [], titleList: titleListTemp, ...temp });
              break;
            }
          }
          break;
        }
      }
      this.val = val;
    },
    handleGrandsonInsert(val) {
      for (const key in this.titleList) {
        if (key && this.titleList[key].id === val.gid) {
          for (const cat in this.titleList[key].children) {
            if (cat && this.titleList[key].children[cat].id === val.pid) {
              for (const dog in this.titleList[key].children[cat].children) {
                if (dog && this.titleList[key].children[cat].children[dog].id === val.id) {
                  const titleListTemp = [];
                  for (const tom in this.title) {
                    if (tom) {
                      titleListTemp.push({ value: null, name: '', id: null, loftingId: null, partName: this.title[tom].partName });
                    }
                  }
                  this.titleList[key].children[cat].children[dog].show = true;
                  const temp = {
                    createDate: null,
                    createUser: null,
                    id: 0 - Date.now(),
                    limitCoefficient: null,
                    limitNum: null,
                    name: '',
                    pid: val.id,
                    gid: val.pid,
                    ggid: val.gid,
                    projectId: this.listQuery.projectId,
                    projectPartId: null,
                    projectPartValue: null,
                    remark: '',
                    sum: null,
                    unit: '',
                  };
                  this.titleList[key].children[cat].children[dog].children.push({ edit: true, show: false, children: [], titleList: titleListTemp, ...temp });
                  break;
                }
              }
              break;
            }
          }
          break;
        }
      }
    },
    handleRemove(val) {
      this.$confirm('此操作将永久删除该行, 是否继续?', this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        deleteContractLofting({ id: val.id, projectId: val.projectId }).then(() => {
          for (const key in this.titleList) {
            if (key && this.titleList[key].id === val.id) {
              this.titleList.splice(Number(key), 1);
              this.$message({
                type: 'success',
                message: this.$t('message.operationSuccess'),
              });
              break;
            }
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    handleChildrenRemove(val) {
      this.$confirm('此操作将永久删除该行, 是否继续?', this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        deleteContractLofting({ id: val.id, projectId: val.projectId }).then((res) => {
          if (res) {
            for (const key in this.titleList) {
              if (key && this.titleList[key].id === val.pid) {
                for (const cat in this.titleList[key].children) {
                  if (cat && this.titleList[key].children[cat].id === val.id) {
                    this.titleList[key].children.splice(Number(cat), 1);
                    this.$message({
                      type: 'success',
                      message: this.$t('message.operationSuccess'),
                    });
                    break;
                  }
                }
                break;
              }
            }
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    handleGrandsonRemove(val) {
      this.$confirm('此操作将永久删除该行, 是否继续?', this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        deleteContractLofting({ id: val.id, projectId: val.projectId }).then((res) => {
          if (res) {
            for (const key in this.titleList) {
              if (key && this.titleList[key].id === val.gid) {
                for (const cat in this.titleList[key].children) {
                  if (cat && this.titleList[key].children[cat].id === val.pid) {
                    for (const dog in this.titleList[key].children[cat].children) {
                      if (dog && this.titleList[key].children[cat].children[dog].id === val.id) {
                        this.titleList[key].children[cat].children.splice(Number(dog), 1);
                        this.$message({
                          type: 'success',
                          message: this.$t('message.operationSuccess'),
                        });
                        break;
                      }
                    }
                    break;
                  }
                }
                break;
              }
            }
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    handleGreatGrandsonRemove(val) {
      this.$confirm('此操作将永久删除该行, 是否继续?', this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        deleteContractLofting({ id: val.id, projectId: val.projectId }).then((res) => {
          if (res) {
            for (const key in this.titleList) {
              if (key && this.titleList[key].id === val.ggid) {
                for (const cat in this.titleList[key].children) {
                  if (cat && this.titleList[key].children[cat].id === val.gid) {
                    for (const dog in this.titleList[key].children[cat].children) {
                      if (dog && this.titleList[key].children[cat].children[dog].id === val.pid) {
                        for (const tiger in this.titleList[key].children[cat].children[dog].children) {
                          if (tiger && this.titleList[key].children[cat].children[dog].children[tiger].id === val.id) {
                            this.titleList[key].children[cat].children[dog].children.splice(Number(tiger), 1);
                            this.$message({
                              type: 'success',
                              message: this.$t('message.operationSuccess'),
                            });
                            break;
                          }
                        }
                        break;
                      }
                    }
                    break;
                  }
                }
                break;
              }
            }
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    handleSave(val) {
      let valueListTemp = '';
      val.titleList.forEach((item) => {
        valueListTemp += `${item.value === null ? 0 : item.value},`;
      });
      if (valueListTemp.indexOf(',') > 0) valueListTemp = valueListTemp.substring(0, valueListTemp.length - 1);
      if (val.id > 0) {
        updateContractLofting({
          projectId: val.projectId,
          name: val.name,
          sum: val.sum === null ? null : Number(val.sum),
          limitCoefficient: val.limitCoefficient === null ? null : Number(val.limitCoefficient),
          limitNum: val.limitNum === null ? null : Number(val.limitNum),
          pid: null,
          unit: val.unit,
          id: val.id,
          valueList: valueListTemp,
        }).then((res) => {
          if (res) {
            this.$message({
              type: 'success',
              message: this.$t('message.operationSuccess'),
            });
            for (const key in this.titleList) {
              if (key && this.titleList[key].id === val.id) {
                this.titleList[key].edit = false;
                // this.titleList[key].id = res.data.data.id;
                break;
              }
            }
          }
          this.getListTop();
        });
      } else {
        addContractLofting({
          projectId: val.projectId,
          name: val.name,
          sum: val.sum === null ? null : Number(val.sum),
          limitCoefficient: val.limitCoefficient === null ? null : Number(val.limitCoefficient),
          limitNum: val.limitNum === null ? null : Number(val.limitNum),
          pid: null,
          unit: val.unit,
          valueList: valueListTemp,
        }).then((res) => {
          if (res) {
            // 获取id，进行存储
            this.$message({
              type: 'success',
              message: this.$t('message.operationSuccess'),
            });
            for (const key in this.titleList) {
              if (key && this.titleList[key].id === val.id) {
                this.titleList[key].edit = false;
                this.titleList[key].id = res.data.data.id;
                break;
              }
            }
          }
        });
      }
    },
    handleChildrenSave(val) {
      let valueListTemp = '';
      val.titleList.forEach((item) => {
        valueListTemp += `${item.value === null ? 0 : item.value},`;
      });
      if (valueListTemp.indexOf(',') > 0) valueListTemp = valueListTemp.substring(0, valueListTemp.length - 1);
      if (val.id > 0) {
        updateContractLofting({
          projectId: val.projectId,
          name: val.name,
          sum: val.sum === null ? null : Number(val.sum),
          limitCoefficient: val.limitCoefficient === null ? null : Number(val.limitCoefficient),
          limitNum: val.limitNum === null ? null : Number(val.limitNum),
          pid: val.pid,
          unit: val.unit,
          valueList: valueListTemp,
        }).then((res) => {
          if (res) {
            this.$message({
              type: 'success',
              message: this.$t('message.operationSuccess'),
            });
            for (const key in this.titleList) {
              if (key && this.titleList[key].id === val.pid) {
                for (const tom in this.titleList[key].children) {
                  if (tom && this.titleList[key].children[tom].id === val.id) {
                    this.titleList[key].children[tom].edit = false;
                    break;
                  }
                }
                break;
              }
            }
          }
        });
      } else {
        addContractLofting({
          projectId: val.projectId,
          name: val.name,
          sum: val.sum,
          limitCoefficient: val.limitCoefficient,
          limitNum: val.limitNum,
          pid: val.pid,
          unit: val.unit,
          valueList: valueListTemp,
        }).then((res) => {
          if (res) {
            this.$message({
              type: 'success',
              message: this.$t('message.operationSuccess'),
            });
            for (const key in this.titleList) {
              if (key && this.titleList[key].id === val.pid) {
                for (const tom in this.titleList[key].children) {
                  if (tom && this.titleList[key].children[tom].id === val.id) {
                    this.titleList[key].children[tom].edit = false;
                    this.titleList[key].children[tom].id = res.data.data.id;
                    break;
                  }
                }
                break;
              }
            }
          }
        });
      }
    },
    handleGrandsonSave(val) {
      let valueListTemp = '';
      val.titleList.forEach((item) => {
        valueListTemp += `${item.value === null ? 0 : item.value},`;
      });
      if (valueListTemp.indexOf(',') > 0) valueListTemp = valueListTemp.substring(0, valueListTemp.length - 1);
      if (val.id > 0) {
        updateContractLofting({
          projectId: val.projectId,
          name: val.name,
          sum: val.sum,
          limitCoefficient: val.limitCoefficient,
          limitNum: val.limitNum,
          pid: val.pid,
          unit: val.unit,
          valueList: valueListTemp,
        }).then((res) => {
          if (res) {
            this.$message({
              type: 'success',
              message: this.$t('message.operationSuccess'),
            });
          }
          for (const key in this.titleList) {
            if (key && this.titleList[key].id === val.gid) {
              for (const tom in this.titleList[key].children) {
                if (tom && this.titleList[key].children[tom].id === val.pid) {
                  for (const cat in this.titleList[key].children[tom].children) {
                    if (cat && this.titleList[key].children[tom].children[cat].id === val.id) {
                      this.titleList[key].children[tom].children[cat].edit = false;
                      break;
                    }
                  }
                  break;
                }
              }
              break;
            }
          }
        });
      } else {
        addContractLofting({
          projectId: val.projectId,
          name: val.name,
          sum: val.sum,
          limitCoefficient: val.limitCoefficient,
          limitNum: val.limitNum,
          pid: val.pid,
          unit: val.unit,
          valueList: valueListTemp,
        }).then((res) => {
          if (res) {
            this.$message({
              type: 'success',
              message: this.$t('message.operationSuccess'),
            });
            for (const key in this.titleList) {
              if (key && this.titleList[key].id === val.gid) {
                for (const tom in this.titleList[key].children) {
                  if (tom && this.titleList[key].children[tom].id === val.pid) {
                    for (const cat in this.titleList[key].children[tom].children) {
                      if (cat && this.titleList[key].children[tom].children[cat].id === val.id) {
                        this.titleList[key].children[tom].children[cat].edit = false;
                        this.titleList[key].children[tom].children[cat].id = res.data.data.id;
                        break;
                      }
                    }
                    break;
                  }
                }
                break;
              }
            }
          }
        });
      }
    },
    handleGreatGrandsonSave(val) {
      let valueListTemp = '';
      val.titleList.forEach((item) => {
        valueListTemp += `${item.value === null ? 0 : item.value},`;
      });
      if (valueListTemp.indexOf(',') > 0) valueListTemp = valueListTemp.substring(0, valueListTemp.length - 1);
      if (val.id > 0) {
        updateContractLofting({
          projectId: val.projectId,
          name: val.name,
          sum: val.sum,
          limitCoefficient: val.limitCoefficient,
          limitNum: val.limitNum,
          pid: val.pid,
          unit: val.unit,
          valueList: valueListTemp,
        }).then((res) => {
          if (res) {
            this.$message({
              type: 'success',
              message: this.$t('message.operationSuccess'),
            });
          }
          for (const key in this.titleList) {
            if (key && this.titleList[key].id === val.ggid) {
              for (const tom in this.titleList[key].children) {
                if (tom && this.titleList[key].children[tom].id === val.gid) {
                  for (const cat in this.titleList[key].children[tom].children) {
                    if (cat && this.titleList[key].children[tom].children[cat].id === val.pid) {
                      for (const dog in this.titleList[key].children[tom].children[cat].children) {
                        if (dog && this.titleList[key].children[tom].children[cat].children[dog].id === val.id) {
                          this.titleList[key].children[tom].children[cat].children[dog].edit = false;
                          break;
                        }
                      }
                      break;
                    }
                  }
                  break;
                }
              }
              break;
            }
          }
        });
      } else {
        addContractLofting({
          projectId: val.projectId,
          name: val.name,
          sum: val.sum === null ? null : Number(val.sum),
          limitCoefficient: val.limitCoefficient,
          limitNum: val.limitNum,
          pid: val.pid,
          unit: val.unit,
          valueList: valueListTemp,
        }).then((res) => {
          if (res) {
            this.$message({
              type: 'success',
              message: this.$t('message.operationSuccess'),
            });
            for (const key in this.titleList) {
              if (key && this.titleList[key].id === val.ggid) {
                for (const tom in this.titleList[key].children) {
                  if (tom && this.titleList[key].children[tom].id === val.gid) {
                    for (const cat in this.titleList[key].children[tom].children) {
                      if (cat && this.titleList[key].children[tom].children[cat].id === val.pid) {
                        for (const dog in this.titleList[key].children[tom].children[cat].children) {
                          if (dog && this.titleList[key].children[tom].children[cat].children[dog].id === val.id) {
                            this.titleList[key].children[tom].children[cat].children[dog].edit = false;
                            this.titleList[key].children[tom].children[cat].children[dog].id = res.data.data.id;
                            break;
                          }
                        }
                        break;
                      }
                    }
                    break;
                  }
                }
                break;
              }
            }
          }
        });
      }
    },
    handleColUpdate() {
      this.dialogTableVisible = true;
    },
    handleColDiaLogClose() {
      this.dialogTableVisible = false;
    },
    handleSaveColChange() {
      for (const key in this.title) {
        if (key) {
          for (const tom in this.titleEdit) {
            if (tom && this.title[key].id === this.titleEdit[tom].id) {
              if (this.title[key].partName !== this.titleEdit[tom].partName) {
                updateProjectPartContractLofting({
                  projectId: this.listQuery.projectId,
                  name: this.titleEdit[tom].partName,
                  contractLoftingId: this.titleEdit[tom].loftingId,
                }).then({ });
              }
              break;
            }
          }
        }
      }
      this.$message({
        type: 'success',
        message: this.$t('message.operationSuccess'),
      });
      // 数据重整
      this.getListTop();
      this.dialogTableVisible = false;
    },
    handleColAddDiaLogClose() {
      this.addDialogTableVisible = false;
      this.$refs.addDialogForm.resetFields();
      this.$refs.addDialogForm.$el.reset();
    },
    handleSaveColAddChange() {
      this.$refs.addDialogForm.validate((valid) => {
        if (valid) {
          addProjectPartContractLofting({ ...this.colObject }).then((res) => {
            if (res) {
              // 数据重整
              this.getListTop();
              this.$message({
                type: 'success',
                message: this.$t('message.operationSuccess'),
              });
            }
          });
          this.addDialogTableVisible = false;
        }
      });
    },
    handleOpenColAddVis() {
      this.colObject = { name: null, projectId: this.listQuery.projectId };
      this.addDialogTableVisible = true;
    },
    handleColRemove(item) {
      this.$confirm('此操作将永久删除该列, 是否继续?', this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        // delete user
        const { partName } = item;
        deleteProjectPartContractLoftingByName({ projectId: this.listQuery.projectId, name: partName }).then(() => {
          this.$message({
            type: 'success',
            message: this.$t('message.deleteOk'),
          });
          // 数据重整
          this.getListTop();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    getListByName(param) {
      if (param) {
        getContractLoftingList({ name: param, ...this.listQuery }).then((res) => {
          if (res) {
            const tilteListTemp = JSON.parse(JSON.stringify(this.titleList));
            for (const key in tilteListTemp) {
              if (key) {
                const { data } = res;
                const children = [];
                data.forEach((item) => {
                  children.push({ edit: false, show: false, children: [], titleList: [], ...item });
                });
                getProjectPartContractLoftingList({ name: param, ...this.titleListQuery }).then((loftRes) => {
                  if (loftRes) {
                    const loftDate = loftRes.data;
                    for (const joy in loftDate) {
                      if (joy) {
                        for (const cat in children) {
                          if (cat) {
                            if (loftDate[joy].loftingId === children[cat].id) {
                              children[cat].titleList.push(loftDate[joy]);
                            }
                          }
                        }
                      }
                    }
                  }
                  this.titleList = children;
                });
              }
            }
          }
        });
      } else {
        this.getListTop();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.contractLofting{
  .editIcon:hover{
    color: #dd6161;
    /*color:#409eff;*/
  }
}
</style>
