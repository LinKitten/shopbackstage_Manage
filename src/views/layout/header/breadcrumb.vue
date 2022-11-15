<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
      <span class="no-redirect" v-if="index == breadcrumbList.length - 1">{{
        item.name
      }}</span>
      <span class="redirect" v-else @click="handleRedirect(item.path)">{{
        item.name
      }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template> 

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
console.log(route.matched);

const breadcrumbList = ref([]);


const initBreadcrumbList = ()=>{
  breadcrumbList.value = route.matched;
}

//监听路由变化，改变breadcrumbList的value
watch(route, () => {
  initBreadcrumbList()
}, {
  deep: true, //开启深度监听
  immediate: true, //立即执行
});

const handleRedirect = (path) => {
  router.push(path);
};
</script>

<style lang="scss" scoped>
.no-redirect {
  cursor: text;
}
.redirect {
  color: #666;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    color: #304156;
  }
}
</style>