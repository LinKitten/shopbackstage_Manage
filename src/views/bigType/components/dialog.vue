<template>
  <el-dialog model-value="dialogVisible" :title="dialogTitle" width="40%" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="大类名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="大类描述" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="4" />
      </el-form-item>

      <!-- 
        <el-form-item>
        <el-button type="primary" @click="onSubmit">确认修改</el-button>
      </el-form-item> 
    -->
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
import { ElMessage } from 'element-plus';

const tableDate = ref([]);

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
    requirted: true
  },
  dialogVisible: {
    type: Boolean,
    default: false,
    require: true,
  }

});

const form = ref({
  id: -1,
  name: "",
  remark: "",

});

// 定义规则
const rules = ref({
  name: [
    {
      required: true, message: "请输入商品大类名称",
    },
  ],
  remark: [
    {
      required: true, message: "请输入商品大类描述",
    },
  ],

});

const formRef = ref(null);

const initFormData = async (id) => {
  const res = await axios.get("admin/bigType/" + id);
  form.value = res.data.bigType
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
      formRef.value.resetFields();
      form.value = {
        id: -1,
        name: "",
        remark: "",
      }
    }
  }
);



const emits = defineEmits(["update:modelValue", "initBigTypeList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};

const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {

      let result = await axios.post("admin/bigType/save", form.value);
      let data = result.data;
      if (data.code == 0) {
        ElMessage.success("执行成功");
        formRef.value.resetFields();
        emits("initBigTypeList");//调用父组件的方法 更新页面
        handleClose();
      } else {
        ElMessage.error(data.msg);
      }

    } else {
      console.log("fail");
      return false;
    }
  });
}
</script>

<style>

</style>