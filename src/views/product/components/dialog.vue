<template>
  <el-dialog
    model-value="dialogVisible"
    :title="dialogTitle"
    width="50%"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="form.name" style="width: 400px" />
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input v-model="form.price" style="width: 100px" />
      </el-form-item>
      <el-form-item label="商品库存" prop="stock">
        <el-input v-model="form.stock" style="width: 100px" />
      </el-form-item>

      <!-- 下拉框 -->
      <el-form-item label="商品类别">
        <el-select
          v-model="bigTypeId"
          class="m-2"
          placeholder="请选择商品大类"
          @change="handleBigTypeChange"
        >
          <el-option
            v-for="item in bigTypeSelectOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        &nbsp;&nbsp;
        <el-select
          v-model="form.type.id"
          class="m-2"
          placeholder="请选择商品小类"
        >
          <el-option
            v-for="item in smallTypeSelectOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="小类描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="4" />
      </el-form-item>
      <!-- 富文本框 -->
      <el-form-item label="商品介绍"> </el-form-item>
      <QuillEditor
        v-model:content="form.productIntroImgs"
        contentType="html"
        toolbar="full"
        theme="snow"
        style="height: 200px"
      />
      <el-form-item label="商品参数"> </el-form-item>
      <QuillEditor
        v-model:content="form.productParaImgs"
        contentType="html"
        toolbar="full"
        theme="snow"
        style="height: 200px"
      />
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import axios from "@/util/axios";
import { defineEmits, defineProps, watch, ref } from "vue";
import { ElMessage } from "element-plus";

//接收父组件传过来的id
const prop = defineProps({
  id: {
    type: Number,
    default: -1,
    requirted: true,
  },
  dialogTitle: {
    type: String,
    default: "",
    requirted: true,
  },
  dialogVisible: {
    type: Boolean,
    default: false,
    require: true,
  },
});

const form = ref({
  id: -1,
  name: "",
  price: null,
  stock: null,
  type: {
    id: "",
  },
  description: "",
  productIntroImgs:'', //商品介绍
  productParaImgs:'' //商品参数
});

const bigTypeId = ref("");

const bigTypeSelectOptions = ref([]);

const smallTypeSelectOptions = ref([]);

const initBigTypeSelectList = async () => {
  const res = await axios.get("admin/bigType/listAll");
  bigTypeSelectOptions.value = res.data.bigTypeList;
};
const initSmallTypeSelectList = async (bigTypeId) => {
  form.value.type.id = "";
  const res = await axios.get("admin/smallType/listAll/" + bigTypeId);
  smallTypeSelectOptions.value = res.data.smallTypeList;
};

initBigTypeSelectList();

// 定义规则
const rules = ref({
  name: [
    {
      required: true,
      message: "请输入商品小类名称！",
    },
  ],
  price: [
    { required: true, message: "请输入商品价格!" },
    {
      type: "number",
      message: "商品价格是数值类型！",
      transform: (value) => Number(value),
    },
  ],
  stock: [
    { required: true, message: "请输入商品库存!" },
    {
      type: "number",
      message: "商品库存是数值类型！",
      transform: (value) => Number(value),
    },
  ],
  description: [
    {
      required: true,
      message: "请输入商品小类描述！",
    },
  ],
});

const formRef = ref(null);

const initFormData = async (id) => {
  const res = await axios.get("admin/product/" + id);
  form.value = res.data.product;
};

const handleBigTypeChange = async (bigTypeId) => {
  console.log("bigTypeId=" + bigTypeId);
  initSmallTypeSelectList(bigTypeId);
};

// 监听id的变化
watch(
  () => prop.dialogVisible, //监听的参数
  //监听的回调方法
  () => {
    let id = prop.id;
    if (id != -1) {
      initFormData(id);
    } else {
      //重置
      form.value = {
        id: -1,
        name: "",
        price: null,
        stock: null,
        type: {
          id: "",
        },
        description: "",
        productIntroImgs:'', //商品介绍
        productParaImgs:'' //商品参数
      };
    }
  }
);

const emits = defineEmits(["update:modelValue", "initProductList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};

const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      //添加验证
      if (form.value.type.id == "") {
        ElMessage.error("请选择商类别");
        return;
      }
      let result = await axios.post("admin/product/save", form.value);
      let data = result.data;
      if (data.code == 0) {
        ElMessage.success("执行成功");
        formRef.value.resetFields();
        emits("initProductList"); //调用父组件的方法 更新页面
        handleClose();
      } else {
        ElMessage.error(data.msg);
      }
    } else {
      console.log("fail");
      return false;
    }
  });
};
</script>

<style>
</style>