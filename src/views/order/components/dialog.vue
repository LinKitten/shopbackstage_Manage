<template>
  <el-dialog
    model-value="dialogVisible"
    title="订单商品详情"
    width="40%"
    @close="handleClose"
  >
    <el-table :data="tableDate" stripe style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column prop="goodsPic" label="商品图片" width="200">
        <template v-slot="scope">
          <img
          :src="getServerUrl() + '/image/product/' + scope.row.goodsPic"
            width="80"
            height="80"
          /> 
        </template>
</el-table-column>
<el-table-column prop="goodsName" label="商品名称" />
<el-table-column prop="goodsPrice" label="商品价格" width="100"/>
<el-table-column prop="goodsNumber" label="商品数量" width="100"/>
    
    </el-table>
  </el-dialog>
</template>

<script setup>
import axios, {getServerUrl} from "@/util/axios";
import { defineEmits, defineProps, watch,ref } from "vue";


const tableDate = ref([]);

//接收父组件传过来的id
const prop = defineProps({
  id: {
    type: Number,
    default: -1,
    requirted: true,
  },
});

// 监听id的变化
watch(
  () => prop.id, //监听的参数
  //监听的回调方法
  () => {
    let id = prop.id;
    if (id != -1) {
      initOrderdetailData(id);
    }
  }
);

const initOrderdetailData = async (id) => {
  const res = await axios.get("admin/orderDetail/list/" + id);
  console.log(res.data.list);
  tableDate.value = res.data.list;
};

const emits = defineEmits(["update:modelValue"]);

const handleClose = () => {
  emits("update:modelValue", false);
};
</script>

<style>
</style>