<script setup lang="ts">
import { SwitchButton } from "@element-plus/icons-vue";
import { computed, watch, onMounted } from "vue";
import { useRoute, useRouter} from "vue-router";
import { useTabsViewsStore } from "@/store/modules/tabsViews.ts";
import { TabsPaneContext } from "element-plus";

const route = useRoute();
const router = useRouter();
const tabsViewsStore = useTabsViewsStore();

const visitedTabsViews = computed(() => tabsViewsStore.visitedTabsViews);
const activeTabsView = computed({
  get: () => tabsViewsStore.activeTabsView,
  set: (value) => {
    tabsViewsStore.setTabsViewValue(value);
  },
});

function toLastView( activeTabPath: string) {
  let index = visitedTabsViews.value.findIndex((item) => item.path === activeTabPath);
  const nextView = visitedTabsViews.value[index + 1] || visitedTabsViews.value[index - 1];
  if (!nextView) return;
  router.push(nextView.path);
  tabsViewsStore.addVisitedTabsView(nextView);
}

const tabClick = (tabItem: TabsPaneContext) => {
  let path = tabItem.props.name as string;
  router.push(path);
};

const addView = () => {
  const { name } = route;
  if( name === 'Login' ) return
  if( name ){
    tabsViewsStore.addView( route );
  }
  return false
}
const removeView = (TabPath: string ) => {
  if( TabPath === route.path ) {
    console.log(TabPath)
    toLastView(TabPath)
  }
  tabsViewsStore.delView(TabPath)
}



onMounted(() => { addView() })
watch(route, () => { addView() })

function confirmEvent() {
  router.push("/login");
}
</script>

<template>
  <div class="main">
    <div class="tabs">
      <el-tabs v-model="activeTabsView"
               type="card" tab-position="bottom"
               @tab-click="tabClick"
               @tab-remove="removeView">
        <el-tab-pane v-for="item in visitedTabsViews"
                     :key="item.name"
                     :path="item.path"
                     :label="item.title"
                     :name="item.path"
                     :closable="!(item.meta&&item.meta.affix)">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="Setting">
      <el-popover :width="30"
                  placement="right"
                  trigger="hover">
        <template #reference>
          <el-link :underline="false">
            <img src="../../assets/img/my.jpg" alt="user">
            <span>Admin</span>
          </el-link>
        </template>
        <template #default>
          <div>
            <p>用户： admin</p>
            <p>角色： 管理员</p>
          </div>
        </template>
      </el-popover>
      <el-popconfirm title="确定退出吗？"
                     confirmButtonText="确定"
                     cancelButtonText="取消"
                     @confirm="confirmEvent"
                     :hide-icon="true">
        <template #reference>
          <el-link :underline="false">
            <el-icon size="large"> <SwitchButton/> </el-icon>
          </el-link>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  height: 100%;
  font-size: 30px;
  background-color: white;
  border-bottom: 5px solid #ebeef5;

  .tabs {
    width: calc( 85% - 2px);
    height: 100%;
    border-right: 2px solid #ebeef5;
    float: left;
  }

  .Setting {
    width: 15%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    float: right;

    .el-link {
      margin-right: 20px;
      color: #8c8c8c;
      :hover {
        color: #30bcd7;
      }
    }

    img { width: 32px; height: 32px; border-radius: 50%; margin: 0 15px;}
    p { margin-right: 0; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}

  }
}
</style>