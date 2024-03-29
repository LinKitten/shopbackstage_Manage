<template>
    <el-card>
        <el-row :gutter="20" class="header">
            <el-col :span="7">
                <el-input placeholder="请输入商品名称..." clearable v-model="queryForm.query"></el-input>
            </el-col>
            <el-button type="primary" :icon="Search" @click="initProductList">搜索</el-button>
            <el-button type="primary" :icon="DocumentAdd" @click="handleDialogValue()">添加商品</el-button>
        </el-row>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="name" label="商品名称" width="200" fixed />
            <el-table-column prop="image" label="商品图片" width="200" align="center">
                <template v-slot="scope">
                    <img :src="getServerUrl() + '/image/product/' + scope.row.proPic" width="80" height="80" />
                </template>
            </el-table-column>
            <el-table-column prop="price" label="商品价格" width="100" />
            <el-table-column prop="stock" label="商品库存" width="100" />
            <el-table-column prop="type" label="商品所属类别" width="200" :formatter="typeNameFormatter" />
            <el-table-column prop="hot" label="是否为热卖推荐商品" width="100" align="center">
                <template v-slot="{ row }">
                    <el-switch v-model="row.hot" @change="hotChangeHandle(row)" />
                </template>
            </el-table-column>
            <el-table-column prop="swiper" label="首页幻灯" width="100" align="center">
                <template v-slot="{ row }">
                    <el-switch v-model="row.swiper" @change="swiperChangeHandle(row)" />
                </template>
            </el-table-column>
            <el-table-column prop="swiperSort" label="幻灯图片" width="150">
                <template v-slot="scope">
                    <img :src="getServerUrl() + '/image/swiper/' + scope.row.swiperPic" width="150" height="75" />
                </template>
            </el-table-column>
            <el-table-column prop="swiperSort" label="幻灯排序" width="100" align="center" />
            <el-table-column prop="description" label="商品描述" width="400" />

            <el-table-column prop="action" label="操作" width="300" fixed="right">
                <template v-slot="scope">
                    <el-row :gutter="20" class="use">
                        <el-button type="success" @click="handleImageDialogValue(scope.row)">更换图片</el-button>
                        <el-button type="primary" :icon="Edit" @click="handleDialogValue(scope.row.id)"></el-button>
                        <el-button type="danger" :icon="Delete" @click="handleDelete(scope.row.id)"></el-button>
                    </el-row>
                    <el-row :gutter="20" class="use">
                        <el-button type="primary" @click="handleSwiperDialogValue(scope.row)">幻灯设置</el-button>
                        <el-button type="primary" :icon="Edit" @click="handleProductSwiperImageDialogValue(scope.row)">轮播图设置
                        </el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:currentPage="queryForm.pageNum" v-model:page-size="queryForm.pageSize"
            :page-sizes="[10, 20, 30, 40, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>
    <Dialog v-model="dialogVisible" :dialogVisible="dialogVisible" :id="id" :dialogTitle="dialogTitle"
        @initProductList="initProductList"></Dialog>
    <ImageDialog v-model="imageDialogVisible" :imageDialogValue="imageDialogValue" @initProductList="initProductList"></ImageDialog>
    <SwiperImageDialog v-model="swiperImageDialogVisible"  :imageDialogValue="imageDialogValue" @initProductList="initProductList"></SwiperImageDialog>

    <ProductSwiperImageDialog v-model="productSwiperImageDialogVisible"  :imageDialogValue="imageDialogValue"></ProductSwiperImageDialog>

</template>
  
<script setup>
import { Search, Delete, Edit, DocumentAdd } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import axios, { getServerUrl } from "@/util/axios";
import Dialog from "./components/dialog.vue";

import ImageDialog from "./components/imageDialog.vue";
import SwiperImageDialog from "./components/swiperImageDialog.vue"
import ProductSwiperImageDialog from "./components/productSwiperImageDialog.vue"


const queryForm = ref({
    query: "",
    pageNum: 1,
    pageSize: 10,
});

const total = ref(0);

const tableData = ref([]);

const id = ref(-1);

const dialogTitle = ref("");

//用于是否显示dialog
const dialogVisible = ref(false);

const imageDialogValue = ref({});

const imageDialogVisible = ref(false);

const swiperImageDialogVisible = ref(false);

const productSwiperImageDialogVisible = ref(false);


const initProductList = async () => {
    const res = await axios.post("admin/product/list", queryForm.value);
    tableData.value = res.data.productList;
    total.value = res.data.total;
};

initProductList();

//更改图片
const handleImageDialogValue = (row) => {
    imageDialogVisible.value = true;
    imageDialogValue.value = JSON.parse(JSON.stringify(row));
};

//更改图片
const handleSwiperDialogValue = (row) => {
    swiperImageDialogVisible.value = true;
    imageDialogValue.value = JSON.parse(JSON.stringify(row));
};
//更改产品轮播图片
const handleProductSwiperImageDialogValue = (row) => {
    productSwiperImageDialogVisible.value = true;
    imageDialogValue.value = JSON.parse(JSON.stringify(row));
};

const handleDialogValue = (productId) => {
    if (productId) {
        //如果有id，则是修改
        id.value = productId;
        dialogTitle.value = "商品修改";
    } else {
        id.value = -1;
        dialogTitle.value = "商品添加";
    }
    dialogVisible.value = true; //控制dialog是否显示
};

const handleSizeChange = (pageSize) => {
    queryForm.value.pageNum = 1;
    queryForm.value.pageSize = pageSize;
    initProductList();
};

const handleCurrentChange = (pageNum) => {
    queryForm.value.pageNum = pageNum;
    initProductList();
};

const typeNameFormatter = (row) => {
    return row.type.name;
};

const handleDelete = (id) => {
    ElMessageBox.confirm("确定要删除这条记录吗？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(async () => {
            let res = await axios.get("admin/product/delete/" + id);
            if (res.data.code == 0) {
                ElMessage({
                    type: "success",
                    message: "删除成功",
                });
                initProductList(); //刷新
            } else {
                ElMessage({
                    type: "error",
                    message: res.data.msg,
                });
            }
        })
        .catch(() => { });
};

//热卖选项变化便请求后端
const hotChangeHandle = async (row) => {
    let res = await axios.get(
        "admin/product/updateHot/" + row.id + "/state/" + row.hot
    );
    if (res.data.code == 0) {
        ElMessage({
            type: "success",
            message: "执行成功",
        });
    } else {
        ElMessage({
            type: "error",
            message: res.data.msg,
        });
        console.log(res.data.msg);
        initProductList(); //刷新
    }
};

const swiperChangeHandle = async (row) => {
    let res = await axios.get(
        "admin/product/updateSwiper/" + row.id + "/state/" + row.swiper
    );
    if (res.data.code == 0) {
        ElMessage({
            type: "success",
            message: "执行成功！",
        });
    } else {
        ElMessage({
            type: "error",
            message: res.data.msg,
        });
        initProductList();
    }
};
</script>
  
<style lang="scss" scoped>
.header,
.use {
    padding-bottom: 16px;
    box-sizing: border-box;
}

.el-pagination {
    padding-top: 15px;
    box-sizing: border-box;
}
</style>