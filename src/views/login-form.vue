<template>
  <dx-validation-group>
    <div class="login-header">
      <div class="title">{{ title }}</div>
      <div>账户登录</div>
    </div>

    <div class="dx-field">
      <dx-text-box placeholder="用户名" width="100%" :value.sync="login">
        <dx-validator>
          <dx-required-rule message="用户名不能为空！" />
        </dx-validator>
      </dx-text-box>
    </div>

    <div class="dx-field">
      <dx-text-box
        placeholder="密码"
        width="100%"
        mode="password"
        :value.sync="password"
      >
        <dx-validator>
          <dx-required-rule message="密码不能为空！" />
        </dx-validator>
      </dx-text-box>
    </div>

    <div class="dx-field">
      <dx-check-box :value.sync="rememberUser" text="记住我" />
    </div>

    <div class="dx-field">
      <dx-button
        type="default"
        text="登录"
        width="100%"
        @click="onLoginClick"
      />
    </div>

    <div class="dx-field">
      <router-link to="/recovery"><a>忘记密码 ?</a></router-link>
    </div>

    <div class="dx-field">
      <dx-button type="normal" text="创建账户" width="100%" />
    </div>
  </dx-validation-group>
</template>

<script>
import DxButton from "devextreme-vue/button";
import DxCheckBox from "devextreme-vue/check-box";
import DxTextBox from "devextreme-vue/text-box";
import DxValidationGroup from "devextreme-vue/validation-group";
import DxValidator, { DxRequiredRule } from "devextreme-vue/validator";

import auth from "../auth";

export default {
  data() {
    return {
      title: this.$appInfo.title,
      login: "",
      password: "",
      rememberUser: false
    };
  },
  methods: {
    onLoginClick(e) {
      if (!e.validationGroup.validate().isValid) {
        return;
      }

      this.logIn();
      this.$router.push(this.$route.query.redirect || "/home");

      e.validationGroup.reset();
    },
      logIn(){
            if(this.password == '123456'){
                this.$store.commit('set_user_info', JSON.stringify({
                    id: 1,
                    name: 'Goldenstand'
                }));
                this.$router.push({path:'/home'});
            } else {
                return;
            }

      }
  },
  components: {
    DxButton,
    DxCheckBox,
    DxTextBox,
    DxValidator,
    DxRequiredRule,
    DxValidationGroup
  }
};
</script>

<style lang="scss">
@import "../themes/generated/variables.base.scss";

.login-header {
  text-align: center;
  margin-bottom: 40px;

  .title {
    color: $base-accent;
    font-weight: bold;
    font-size: 30px;
    margin: 0;
  }
}
</style>
