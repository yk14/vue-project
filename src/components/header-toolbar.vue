<template>
  <header class="header-component">
    <dx-toolbar class="header-toolbar">
      <dx-item
        v-if="title"
        location="before"
        css-class="header-title dx-toolbar-label"
      >
        <!-- eslint-disable vue/no-unused-vars -->
        <div style="padding-left: 20px;" slot-scope="_" >{{ title }}</div>
        <!-- eslint-enable -->
      </dx-item>
        <dx-item location="before">
            <!-- eslint-disable vue/no-unused-vars -->
            <div slot-scope="_">
            <dx-button
                    styling-mode="contained"
                    style="margin-left: 20px;background-color: #F5F5F5;"
                    :type="modeButtonType"
                    :text="modeButtonText"
                    @click.native="changeMode($event)"
            />
            <dx-button
                    styling-mode="contained"
                    style="margin-left: 20px;background-color: #F5F5F5;"
                    type="normal"
                    text="文件管理"
                    @click.native="fileManagement($event)"
            />
            </div>

        </dx-item>

      <dx-item
        location="after"
        locate-in-menu="auto"
        menu-item-template="menuUserItem"
      >
        <!-- eslint-disable vue/no-unused-vars -->
        <div slot-scope="_">
        <!-- eslint-enable -->
          <dx-button
            class="user-button authorization"
            :width="170"
            height="100%"
            styling-mode="text"
          >
            <user-panel :menu-items="userMenuItems" menu-mode="context" />
          </dx-button>
        </div>
      </dx-item>
      <!-- eslint-disable vue/no-unused-vars -->
      <user-panel
        :menu-items="userMenuItems"
        menu-mode="list"
        slot-scope="_"
        slot="menuUserItem"
      />
      <!-- eslint-enable -->
    </dx-toolbar>
  </header>
</template>

<script>
import DxButton from "devextreme-vue/button";
import DxToolbar, { DxItem } from "devextreme-vue/toolbar";
import UserPanel from "./user-panel";
import fileUpload from "../views/fileUpload";

export default {
  props: {
    menuToggleEnabled: Boolean,
    title: String,
    toggleMenuFunc: Function,
    logOutFunc: Function
  },
  data() {
    return {
        columns: [],
        popupVisible: false,
      userMenuItems: [
        {
          text: "设置",
          icon: "user"
        },
        {
          text: "登出",
          icon: "runner",
          onClick: this.onLogoutClick
        }
      ],
        mode: 2,//1：报表 2：配置
        modeButtonType: 'normal',
        modeButtonText: '报表模式'
    };
  },
    created() {
      this.mode = Number(this.$store.state.mode);
      this.modeButtonType = this.mode == 1 ? 'normal' : 'normal';
      this.modeButtonText = this.mode == 1 ? '报表模式' : '配置模式';
    },
    computed: {
      modecom(){
          return this.$store.state.mode;
      }
    },
    watch: {
        modecom(){
          this.mode = Number(this.$store.state.mode);
      }
    },
  methods: {
      //进入报表管理
      fileManagement(e){
        this.$router.push(fileUpload);
      },
      //切换模式
      changeMode(e) {
          this.mode = this.mode == 2 ? 1 : 2;
          this.modeButtonType = this.mode == 1 ? 'normal' : 'normal';
          this.modeButtonText = this.mode == 1 ? '报表模式' : '配置模式';
          this.$store.commit('set_mode', this.mode);
      },
    onLogoutClick() {
      this.logOut();
      this.$router.push({
        path: "/login-form",
        query: { redirect: this.$route.path }
      });
    },
      logOut(){
          this.$store.commit('user_info', JSON.stringify({}));
          this.$h5store.lsClear();
          this.$h5store.ssClear();
      }
  },
  components: {
    DxButton,
    DxToolbar,
    DxItem,
    UserPanel
  }
};
</script>

<style lang="scss">
@import "../themes/generated/variables.base.scss";
@import "../dx-styles.scss";

.header-component {
  flex: 0 0 auto;
  z-index: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  .dx-toolbar .dx-toolbar-item.menu-button > .dx-toolbar-item-content .dx-icon {
    color: $base-accent;
  }
}

.dx-toolbar.header-toolbar .dx-toolbar-items-container .dx-toolbar-after {
  padding: 0 40px;

  .screen-x-small & {
    padding: 0 20px;
  }
}

.dx-toolbar .dx-toolbar-item.dx-toolbar-button.menu-button {
  width: $side-panel-min-width;
  text-align: center;
  padding: 0;
}

.header-title .dx-item-content {
  padding: 0;
  margin: 0;
}

.dx-theme-generic {
  .dx-toolbar {
    padding: 10px 0;
  }

  .user-button > .dx-button-content {
    padding: 3px;
  }
}
</style>
