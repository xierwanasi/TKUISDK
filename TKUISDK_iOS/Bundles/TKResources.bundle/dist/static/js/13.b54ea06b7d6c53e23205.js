webpackJsonp([13],{LvAI:function(s,e){s.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAkCAYAAACNBsqdAAADcUlEQVRIS63WT4gTVxwH8O/vJf7BP6VQWSr1INhD0UMLtYdSvGi1q7A6ztL4r7QF0W5mJqHooVVoCVKxXhSzM5nkYEUP/gkms4t2tVovetJSigd78CJYEFbjQSlqOpn5lRfdMDO7m0yyzvHx3off+73f+70hvKbPsh2DgQ9r47d35XK5Br0O1yw4+4hwkJkJhNHa+JOtM4Ytu3qIGd8HAySg2DMso7NsZxiAHkH/YB/re4LL5XLiUS35CwNfhlJJuO67zway2S+edg2Xy+XZ47XkGQLUcKR0qf7CHdyzJ/VcjncFl0oX5rleowrwZyGUcP7ReGNHLpf6b2I8NpzPj72RSNYvMnhVpJJO9i1q7EylUl4k150LzjSrbyFBl8G8MjibiUxjSMkSEUeVjhGXSpXFrkdXAawIL+ZDhja4f7qw2sK27Sz1mH8HsKyVOxmdz/t1Xf253V6nhYdL59+jhrgKwpIA4JMQGX1IKXRK4JSwZTkfMPFvAPoCQIMYO3VdPdUJnbLczGL1Y/YwRoQ3A0CdGNt1Xa3GQSfBZtFZA59HACwIAM+YhJpJK3IHsb9WKgqFykYfdA7A3MDqJwJiQNOUG7HFVxObsFV0trHPJwHMCgA1AerXtM1/dos2U2EWnN0Ay1NOBIAHSSHWDg0pf/eCvoKrsh6/CwGMuwTxqa4r//QMy4VmobIPoIPBpsTg+5SktcZu9W4veOvwLLvyjezdkZQ8TFCiP53e9Fe3eOiCDFuVLSToFBizg5UBnzcaxuD1bvBJN8+yqv1MqACY14IYzwXx55o2+GtcfMorPWxXPoFPFyO3zxUQX2uacjoOPm0Tyher7wsflwG8HYB8AFlDU+VZtP3atk3LGn2XyZO9eOmEIps6M340tM0/tZM7NnrbvvCOx40rAC8PQkw4mkmrewFMej2aF6TTlpp1Lp8mgUsAPorMP9G3qLEr+t7FhuXEw4dHF85f6MnOtzqEExzfnbstm91QD47HinhiQT4/NieRrJ9lsBLG6Rr5rqLrqX9bZxEnFcE58i/oYS15HMBXkbW34GODYaiPu0pFGGEyiyNH4PO3EfwOe4l1mcymB12lIro7y3Z+YOYD4XG6R+yumxEsweYPN/MxACKQ3yszhl/iozuYvRMvXyC6KTCrt9/YqQ7cskYGQJwGuylZHf8DUPw9r8COJTgAAAAASUVORK5CYII="},X4j3:function(s,e){},Y6XX:function(s,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),t("eqfM");var o=t("/QYm"),a=t("//Fk"),r=t.n(a),n=(t("nOaS"),t("pIDD")),i=t("K7J5"),d=t("R/2u"),c=t("cgj9"),h=t("VAqh"),w=t("7+uW"),l=t("TIfe");w.default.use(n.a);var p={name:"mobile_changepwd",components:{Header:i.a},data:function(){return{codeStatue:!1,code:this.$t("password.sendCode"),time:59,codeid:"",codeNumber:"",password:"",newPassword:"",title:this.$t("password.title.one"),text:this.$t("password.text.one"),confirmText:this.$t("password.confirmText.one"),isLoading:!1,indexActive:"",phone:"",newuser:0,isMatch:!1,publickey:"",from:"",showPassword:!1,showRepassword:!1,locale:"CN"}},created:function(){var s=this.$store.state.loginInfo;this.area=s.area,this.phone=s.phoneNum,this.locale=s.locale,""==this.phone&&this.$router.push("/login"),s.isNew&&(this.title=this.$t("password.title.two"),this.text=this.$t("password.text.two")+"+"+this.area+" "+this.phone+"+"+this.area+" "+this.phone+"。"+this.$t("password.text.three"))},mounted:function(){},beforeRouteEnter:function(s,e,t){t(function(s){s.from=e.name})},methods:{checkToken:function(){var s=this,e={token:Object(l.a)()};return new r.a(function(t,o){try{d.a.post(c.a.checktoken,e,function(e){if(1==e.code)return s.phone=e.data.account,s.locale=e.data.locale,s.$store.dispatch("SAVELOGININFO",{isNew:!1,phoneNum:s.phone}),t(e.data)})}catch(s){return console.error("checkTokenErr",s),o(s)}})},sendCode:function(){var s=this;this.codeStatue||new Captcha("2027340696",function(e){0===e.ret&&s.handleSendCode(e)},{}).show()},handleSendCode:function(s){var e=this,t="set"===this.from?"2":this.$store.state.loginInfo.isNew?"1":"2",a={mobile:this.phone,event:1==t?"register":"resetpwd",locale:this.locale,randstr:s.randstr,ticket:s.ticket,appid:"2027340696"};"2"==t&&(this.text=this.$t("password.text.four")+"+"+this.area+" "+this.phone+" 。"+this.$t("password.text.three")),d.a.post(c.a.sendMeg,a,function(s){1==s.code?(e.code=e.time+"s",e.codeStatue=!0,e.codeid=setInterval(function(){e.time<=59&&(e.time--,e.code=e.time+"s"),e.time<0&&(e.time=59,e.code=e.$t("password.reSendCode"),e.codeStatue=!1,clearInterval(e.codeid))},1e3)):Object(o.a)(s.msg)})},handleCheckTokenBeforeBackLogin:function(){var s=this;"login"==this.from?this.handleBackLogin():this.checkToken().then(function(){s.handleBackLogin()})},handleBackLogin:function(){var s=this;if(this.isMatch=/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,16}$/.test(this.password),!this.codeNumber)return this.$toast(this.$t("password.errorText.one")),!1;if(!this.password)return this.$toast(this.$t("password.errorText.two")),!1;if(!this.isMatch)return this.$toast(this.$t("password.errorText.three")),!1;if(!this.newPassword)return this.$toast(this.$t("password.errorText.five")),!1;if(this.newPassword!==this.password)return this.$toast(this.$t("password.errorText.four")),!1;var e=void 0,t={mobile:this.phone.replace(/^\s+|\s+$/g,""),smscode:this.codeNumber.replace(/^\s+|\s+$/g,""),password:this.password.replace(/^\s+|\s+$/g,""),confirm_pwd:this.newPassword.replace(/^\s+|\s+$/g,""),locale:this.locale};this.$store.state.loginInfo.isNew?(e=c.a.login,t.step="register"):e=c.a.resetpwd,this.confirmText=this.$t("password.confirmText.two"),this.isLoading=!0,d.a.post(e,t,function(t){if(1==t.code){if(e==c.a.login){Object(o.a)(s.$t("password.toast.one"));var a=s.$store.state.loginInfo;a.isNew=!1,s.$store.dispatch("SAVELOGININFO",a)}else Object(o.a)(s.$t("password.toast.two"));if("set"==s.from)s.$router.go(-1);else{var r={step:"login",mobile:s.phone,password:s.password,locale:s.locale};h.a.funcLogin(r)}}else Object(o.a)(t.msg);s.confirmText=s.$t("password.confirmText.one"),s.isLoading=!1}),this.isLoading=!1},handleBack:function(){clearInterval(this.codeid),this.$router.go("-1")},handleFocus:function(s){this.indexActive=s},handleBlur:function(s){this.indexActive="";var e=/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,16}$/;"code"===s.code?this.codeNumber||this.$toast("验证码不能为空"):"pwd"===s.pwd?(this.isMatch=e.test(this.password),this.password?this.isMatch||this.$toast("密码格式不正确"):this.$toast("密码不能为空")):"newPwd"===s.pwd&&(this.isMatch=e.test(this.password),this.newPassword?this.isMatch?this.newPassword!==this.password&&this.$toast("两次密码不一致"):this.$toast("密码格式不正确"):this.$toast("密码不能为空"))},getKey:function(){var s=this;d.a.post(c.a.getPublicKey,{},function(e){var t=e.code,a=e.key,r=e.info;0===t?s.publickey=a:o.a.file(r)}).catch(function(s){throw s})},handleShowPassword:function(s){1==s?this.showPassword=!this.showPassword:this.showRepassword=!this.showRepassword}}},u={render:function(){var s=this,e=s.$createElement,o=s._self._c||e;return o("div",{staticClass:"container"},[o("div",{staticClass:"changepwd-back"},[o("span",{on:{click:s.handleBack}},[o("img",{attrs:{src:t("LvAI"),alt:"arrow"}})])]),s._v(" "),o("div",{staticClass:"pwd-title"},[o("div",{staticClass:"title"},[s._v(s._s(s.title))]),s._v(" "),o("span",{staticClass:"text"},[s._v(s._s(s.text))])]),s._v(" "),o("div",{staticClass:"container-box"},[o("form",{staticClass:"changepwd-container"},[o("div",{class:["input",0===s.indexActive?"active":""]},[o("input",{directives:[{name:"model",rawName:"v-model",value:s.codeNumber,expression:"codeNumber"}],attrs:{type:"phone",placeholder:this.$t("password.code")},domProps:{value:s.codeNumber},on:{focus:function(e){return s.handleFocus(0)},input:function(e){e.target.composing||(s.codeNumber=e.target.value)}}}),s._v(" "),o("span",{class:["code",s.codeStatue?"codeSend":""],on:{click:s.sendCode}},[s._v(s._s(s.code))])]),s._v(" "),o("div",{class:["input",1===s.indexActive?"active":""]},["checkbox"==(s.showPassword?"text":"password")?o("input",{directives:[{name:"model",rawName:"v-model",value:s.password,expression:"password"}],attrs:{placeholder:this.$t("password.newPasswordPH"),maxlength:"20",type:"checkbox"},domProps:{checked:Array.isArray(s.password)?s._i(s.password,null)>-1:s.password},on:{focus:function(e){return s.handleFocus(1)},change:function(e){var t=s.password,o=e.target,a=!!o.checked;if(Array.isArray(t)){var r=s._i(t,null);o.checked?r<0&&(s.password=t.concat([null])):r>-1&&(s.password=t.slice(0,r).concat(t.slice(r+1)))}else s.password=a}}}):"radio"==(s.showPassword?"text":"password")?o("input",{directives:[{name:"model",rawName:"v-model",value:s.password,expression:"password"}],attrs:{placeholder:this.$t("password.newPasswordPH"),maxlength:"20",type:"radio"},domProps:{checked:s._q(s.password,null)},on:{focus:function(e){return s.handleFocus(1)},change:function(e){s.password=null}}}):o("input",{directives:[{name:"model",rawName:"v-model",value:s.password,expression:"password"}],attrs:{placeholder:this.$t("password.newPasswordPH"),maxlength:"20",type:s.showPassword?"text":"password"},domProps:{value:s.password},on:{focus:function(e){return s.handleFocus(1)},input:function(e){e.target.composing||(s.password=e.target.value)}}}),s._v(" "),o("span",{class:s.showPassword?"icon-pwdshow":"icon-pwd",on:{click:function(e){return s.handleShowPassword(1)}}})]),s._v(" "),o("div",{class:["input",2===s.indexActive?"active":""]},["checkbox"==(s.showRepassword?"text":"password")?o("input",{directives:[{name:"model",rawName:"v-model",value:s.newPassword,expression:"newPassword"}],attrs:{placeholder:this.$t("password.rePasswordPH"),maxlength:"20",type:"checkbox"},domProps:{checked:Array.isArray(s.newPassword)?s._i(s.newPassword,null)>-1:s.newPassword},on:{focus:function(e){return s.handleFocus(2)},change:function(e){var t=s.newPassword,o=e.target,a=!!o.checked;if(Array.isArray(t)){var r=s._i(t,null);o.checked?r<0&&(s.newPassword=t.concat([null])):r>-1&&(s.newPassword=t.slice(0,r).concat(t.slice(r+1)))}else s.newPassword=a}}}):"radio"==(s.showRepassword?"text":"password")?o("input",{directives:[{name:"model",rawName:"v-model",value:s.newPassword,expression:"newPassword"}],attrs:{placeholder:this.$t("password.rePasswordPH"),maxlength:"20",type:"radio"},domProps:{checked:s._q(s.newPassword,null)},on:{focus:function(e){return s.handleFocus(2)},change:function(e){s.newPassword=null}}}):o("input",{directives:[{name:"model",rawName:"v-model",value:s.newPassword,expression:"newPassword"}],attrs:{placeholder:this.$t("password.rePasswordPH"),maxlength:"20",type:s.showRepassword?"text":"password"},domProps:{value:s.newPassword},on:{focus:function(e){return s.handleFocus(2)},input:function(e){e.target.composing||(s.newPassword=e.target.value)}}}),s._v(" "),o("span",{class:s.showRepassword?"icon-pwdshow":"icon-pwd",on:{click:function(e){return s.handleShowPassword(2)}}})]),s._v(" "),o("div",{class:["confirm",s.password.length<8||s.newPassword.length<8?"next":""],on:{click:s.handleCheckTokenBeforeBackLogin}},[s.isLoading?o("div",{staticClass:"loading"},[o("van-loading",{attrs:{type:"spinner",size:"24"}})],1):s._e(),s._v("\n        "+s._s(s.confirmText)+"\n      ")])])])])},staticRenderFns:[]},f=t("VU/8")(p,u,!1,function(s){t("X4j3")},"data-v-87460d70",null);e.default=f.exports}});