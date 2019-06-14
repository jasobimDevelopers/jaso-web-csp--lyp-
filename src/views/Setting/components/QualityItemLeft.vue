<template>
  <div class="QualityItemLeft">
    <div v-for="(item, index) in list" :key="index" class="table-group expand">
      <section class="table-cell flex-sb table-title">
        <span>
          <span :style="`padding-left:${item.level * 10}px`" class="iconStyle">
            <i class="el-icon-circle-plus" v-if="!item.show" @click="handleShow(item)"></i>
            <i class="el-icon-remove" v-if="item.show" @click="handleShow(item)"></i>
          </span>
          {{ item.content }}
        </span>
        <span>
          <el-button type="text" @click="newSubset(item)">{{'新增子集'}}</el-button>
          <el-button type="text" @click="editSubset(item)">{{'编辑'}}</el-button>
          <el-button type="text" @click="delSubset(item)">{{'删除'}}</el-button>
        </span>
      </section>
      <div v-if="item.show && item.children.length > 0" class="table-children">
        <quality-item-left :list="item.children" @show="handleShow"></quality-item-left>
      </div>
    </div>
    <el-dialog
      :visible.sync="subsetItemDialogFormVisible"
      :close-on-click-modal="false"
      @close="resetSubsetForm"
      width="360px">
      <div slot="title" style="font-weight: bolder">{{subsetItemAddOrEdit}}</div>
      <el-form ref="subsetItemDialogForm">
        <el-form-item label="检查项名称:">
          <el-input v-model="subsetItemContent"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetSubsetForm">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary" @click="subsetItemHandleSave">{{$t('btn.comfirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addCheckLists, deleteCheckLists, updateCheckLists } from '@/api/quality';

export default {
  name: 'qualityItemLeft',
  props: {
    list: {
      type: Array,
      required: true,
    },
    msg: {
      type: Object,
      required: false,
    },
  },
  data() {
    const { params: { id } } = this.$route;
    return {
      projectId: id,
      subsetItemAddOrEdit: '新增',
      subsetItemDialogFormVisible: false,
      subsetItemContent: null,
      subsetItemId: null,
      subsetItemPid: null,
      subsetItemLevel: null,
    };
  },
  mounted() {
  },
  created() {
  },
  methods: {
    handleShow(param) {
      this.$emit('show', param);
    },
    newSubset(item) {
      this.subsetItemDialogFormVisible = true;
      this.subsetItemAddOrEdit = '新增';
      this.subsetItemId = item.id;
      this.subsetItemLevel = item.level;
    },
    editSubset(item) {
      this.subsetItemDialogFormVisible = true;
      this.subsetItemAddOrEdit = '编辑';
      this.subsetItemContent = item.content;
      this.subsetItemId = item.id;
      this.subsetItemPid = item.pid;
      this.subsetItemLevel = item.level;
    },
    delSubset(item) {
      this.$confirm('确定删除该检查项?', this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        deleteCheckLists({
          id: item.id,
        }).then(() => {
          if (item.pid === null) {
            this.$emit('getList');
          } else {
            this.$nextTick(() => {
              const partm = {};
              partm.id = item.pid;
              partm.level = item.level - 1;
              this.$emit('show', partm);
            });
          }
          this.$message({
            type: 'success',
            message: '删除成功！',
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    resetSubsetForm() {
      this.$refs.subsetItemDialogForm.resetFields();
      this.subsetItemContent = null;
      // this.subsetItemId = null;
      // this.subsetItemPid = null;
      // this.subsetItemLevel = null;
      this.subsetItemDialogFormVisible = false;
    },
    subsetItemHandleSave() {
      if (this.subsetItemAddOrEdit === '新增') {
        const partm = {
          pid: this.subsetItemId,
          checkType: 0,
          content: this.subsetItemContent,
          projectId: this.projectId,
        };
        addCheckLists(partm).then((data) => {
          if (data) {
            this.$nextTick(() => {
              const parm = {};
              parm.id = this.subsetItemId;
              parm.level = this.subsetItemLevel;
              this.$emit('show', parm);
            });
            this.$message({
              type: 'success',
              message: '新增成功！',
            });
            this.resetSubsetForm();
          }
        });
      } else {
        updateCheckLists({ id: this.subsetItemId, content: this.subsetItemContent }).then((data) => {
          if (data) {
            if (this.subsetItemPid !== null) {
              this.$nextTick(() => {
                const parm = {};
                parm.id = this.subsetItemPid;
                parm.level = this.subsetItemLevel - 1;
                this.$emit('show', parm);
              });
            } else {
              this.$emit('getList');
            }
            this.$message({
              type: 'success',
              message: '检查项修改成功!',
            });
            this.resetSubsetForm();
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .QualityItemLeft{
    .table-header {
      color: #909399;
      font-weight: bold;
    }
    .table-cell {
      height: 48px;
      color: #909399;
      text-align: center;
      border-bottom: 1px solid #ebeef5;
      font-size: 13px;
      span {
        i {
          margin-right: 8px;
          color: #409EFF;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    .table-title{
      span {
        text-align: left;
        width: 190px;
      }
      span:nth-child(1){
        width: 350px;
      }
    }
    .iconStyle{
      i {
        font-size: 14px;
      }
    }
  }
</style>
