<template>
  <div class="footer-wrapper">
    <div class="copy-right-wrapper">
      <img class="logo" :src="logoUrl" :alt="$store.getters.imgAlt + 'footerLogo'" />
      <div class="copy-right">
        <span>有菜科技 版权所有</span>
        <span class="split">|</span>
        <span>
          <a class="link" style="color: white" href="https://beian.miit.gov.cn" target="_blank">京ICP备17012778号-1</a>
        </span>
        <p class="tip-website">
          为获得最佳浏览体验，建议使用IE11、FireFox50.5、Chrome51.0及以上版本的浏览器
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      logoUrl: require('@/assets/images/common/lelefans.png')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl';

.footer-wrapper {
  margin-top: 20px;
  display: flex;

  .copy-right-wrapper {
    width: 100%;
    color: $BorderLight;
    background: linear-gradient(to right, $Primary, #92fd86);
    padding: 16px 0 16px 5vw;
    font-size: 14px;
    color: $BorderLight;
    display: flex;
    align-items: center;s

    .logo {
      width: 240px;
      display: block;
    }

    .split {
      margin: 0 8px;
    }

    .link {
      &:hover {
        text-decoration: underline;
      }
    }

    .tip-website {
      padding-top: 8px;
    }
  }

  .join-us {
    background: linear-gradient(to right, $Placeholder, $Info);
    width: 35%;
    padding: 16px 5vw 16px 40px;
    color: #fff;

    .join-list {
      margin-top: 16px;
      display: flex;

      .join-item {
        .iconfont {
          margin-right: 16px;
          font-size: 30px;
          cursor: pointer;
        }

        .qq {
          &:hover {
            color: $Primary;
          }
        }

        .wechat {
          &:hover {
            color: $Success;
          }
        }

        .gitee {
          &:hover {
            color: $giteeColor;
          }
        }
      }
    }
  }
}
</style>
