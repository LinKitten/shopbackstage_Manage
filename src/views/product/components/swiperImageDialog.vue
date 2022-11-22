<template>
  <el-dialog
    model-value="swiperImageDialogVisible"
    title="幻灯设置"
    width="40%"
    @close="handleClose"
    center
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="100px"
      style="text-align: center"
      :rules="rules"
    >
      <el-form-item label="排列序号" prop="swiperSort">
        <el-input v-model="form.swiperSort" style="width: 100px" />
      </el-form-item>

      <el-upload
        :headers="headers"
        class="avatar-uploader"
        :action="getServerUrl() + 'admin/product/uploadSwiperImage'"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm"
          >确认更换图片</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import axios, { getServerUrl } from "@/util/axios";
import { defineEmits, defineProps, watch, ref } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const tableDate = ref([]);

//接收父组件传过来的id
const prop = defineProps({
  imageDialogValue: {
    type: Object,
    default: () => {},
    requirted: true,
  },
});

//获取token
const headers = ref({
  token: window.sessionStorage.getItem("token"),
});

const rules = ref({
  swiperSort: [
    {
      required: true,
      message: "请输入排列序号",
    },
    {
      type: "number",
      message: "排序序号必须是数值类型",
      transform: (value) => Number(value),
    },
  ],
});

const form = ref({
  id: -1,
  swiperPic: "",
  swiperSort: 0,
});

const formRef = ref(null);
const imageUrl = ref("");
// 监听id的变化
watch(
  () => prop.imageDialogValue, //监听的参数
  //监听的回调方法
  () => {
    form.value = prop.imageDialogValue;
    //  让图片回显
    imageUrl.value = getServerUrl() + "/image/swiper/" + form.value.swiperPic;
    console.log("让图片回显:");
    console.log(imageUrl.value);
  },
  { deep: true, immediate: true }
);

const emits = defineEmits(["update:modelValue", "initProductList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};

//上传图片执行成功后：回显到dialog上
const handleAvatarSuccess = (res) => {
  imageUrl.value = getServerUrl() + res.data.src;
  form.value.swiperPic = res.data.title; //更新form里面的image数据
};

//上传图片前
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === "image/jpeg";
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG) {
    ElMessage.error("图片必须是jpg格式");
  }
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过2M!");
  }
  return isJPG && isLt2M;
};

const handleConfirm = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result = await axios.post("admin/product/save", form.value);
      let data = result.data;
      if (data.code == 0) {
        ElMessage.success("执行成功");
        formRef.value.resetFields(); //重置表单
        emits("initProductList"); //调用父组件的方法 更新页面
        handleClose();
      } else {
        ElMessage.error(data.msg);
      }
    }
  });
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>