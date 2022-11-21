<template>
  <el-card class="box-card">
    <!-- 用户搜索框 -->
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input placeholder="请输入商品大类名称......" v-model="queryForm.query" clearable></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initBigTypeList">搜索</el-button>
      <el-button type="primary" :icon="DocumentAdd" @click="handleDialogValue()">添加商品大类</el-button>
    </el-row>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="#ID" width="80" />
      <el-table-column prop="name" label="商品大类名称" width="200" />
      <el-table-column prop="image" label="商品大类图片" width="200">
        <template v-slot="scope">
          <img :src="getServerUrl() + '/image/bigType/' + scope.row.image" width="80" height="80" />
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="商品大类描述" />
      <el-table-column prop="action" label="操作" width="300" fixed="right">
        <template v-slot="scope">
          <el-button type="success" @click="handleImageDialogValue(scope.row)">更换商品图片</el-button>
          <el-button type="primary" :icon="Edit" @click="handleDialogValue(scope.row.id)">
          </el-button>
          <el-button type="danger" :icon="Delete" @click="handleDelete(scope.row.id)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="queryForm.pageNum" v-model:page-size="queryForm.pageSize"
      :page-sizes="[10, 20, 30, 40, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </el-card>
  <Dialog v-model="dialogVisible" :dialogVisible="dialogVisible" :id="id" :dialogTitle="dialogTitle" @initBigTypeList="initBigTypeList"></Dialog>
  <ImageDialog v-model="imageDialogVisible" :imageDialogValue="imageDialogValue" @initBigTypeList="initBigTypeList">
  </ImageDialog>
</template>

<script setup>
import { Search, Delete, Edit, DocumentAdd } from "@element-plus/icons-vue";
import { ref } from "vue";
import axios, { getServerUrl } from "@/util/axios";
import Dialog from "./components/dialog.vue";
import ImageDialog from "./components/imageDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";

const queryForm = ref({
  query: "",
  pageNum: 1, //当前页
  pageSize: 10, //每页大小
});

const total = ref(0); //默认总记录

const tableData = ref([]);

const id = ref(-1);

const dialogTitle = ref("");

const dialogVisible = ref(false);

const imageDialogValue = ref({});

const imageDialogVisible = ref(false);

const initBigTypeList = async () => {
  const res = await axios.post("admin/bigType/list", queryForm.value);
  tableData.value = res.data.bigTypeList;
  total.value = res.data.total;
};

initBigTypeList();

const handleSizeChange = (pageSize) => {
  queryForm.value.pageNum = 1;
  queryForm.value.pageSize = pageSize;
  initBigTypeList();
};

const handleCurrentChange = (pageNum) => {
  queryForm.value.pageNum = pageNum;
  initBigTypeList();
};

const handleDialogValue = (bigTypeId) => {
  if (bigTypeId) {
    //如果有id，则是修改
    id.value = bigTypeId;
    dialogTitle.value = "商品大类修改";
  } else {
    id.value = -1;
    dialogTitle.value = "商品大类添加";
  }
  dialogVisible.value = true; //控制dialog是否显示
};

//更改图片
const handleImageDialogValue = (row) => {
  imageDialogVisible.value = true;
  imageDialogValue.value = JSON.parse(JSON.stringify(row));
};

const handleDelete = (id) => {
  ElMessageBox.confirm("确定要删除这条记录吗？", "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let res = await axios.get("admin/bigType/delete/" + id);
      if (res.data.code == 0) {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        initBigTypeList(); //刷新
      } else {
        ElMessage({
          type: "error",
          message: res.data.msg,
        });
      }
    })
    .catch(() => { });
};
</script>

<style lang="scss" scoped>
.header {
  padding-bottom: 16px;
  box-sizing: border-box;
}

.el-pagination {
  padding-top: 15px;
  box-sizing: border-box;
}
</style>