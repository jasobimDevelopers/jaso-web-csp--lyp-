<template>
  <div>
    <breadcrumb>
    </breadcrumb>
    <div>
      <div id="model-id"  :style="{width: `${winWidth}px`, height: `${winHeight}px`}"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Bim2',
  data() {
    return {
      viewToken: '',
      buildingData: {},
      winWidth: 360,
      winHeight: 640,
    };
  },
  mounted() {
    this.innerHeightAndWidth();
    this.viewToken = this.$route.query.viewToken;
    // this.viewToken = this.getQueryString('viewToken');
    this.initBimface();
    window.onresize = () => (() => {
      this.innerHeightAndWidth();
    })();
  },
  methods: {
    initBimface() {
      const options = new BimfaceSDKLoaderConfig();
      options.configuration = 'Debug';
      options.viewToken = this.viewToken;
      BimfaceSDKLoader.load(options, this.onSDKLoadSucceeded, this.onSDKLoadFailed);
    },
    onSDKLoadSucceeded(viewMetaData) {
      const view = document.getElementById('model-id');
      view.style.height = `${this.winHeight}px`;
      view.style.width = `${this.winWidth}px`;
      const WebAppConfig = new Glodon.Bimface.Application.WebApplication3DConfig();
      WebAppConfig.domElement = view;

      const appEvents = Glodon.Bimface.Application.WebApplication3DEvent;
      const app = new Glodon.Bimface.Application.WebApplication3D(WebAppConfig);
      this.viewer = app.getViewer();
      this.app = app;
      app.addView(viewMetaData.viewToken);

      app.addEventListener(appEvents.ViewAdded, this.onAdded);
    },
    onSDKLoadFailed() {},
    onAdded() {
      this.app.render();
    },
    innerHeightAndWidth() {
      if (window.innerWidth) {
        this.winWidth = window.innerWidth;
      } else if ((document.body) && (document.body.clientWidth)) {
        this.winWidth = document.body.clientWidth;
      }
      if (window.innerHeight) {
        this.winHeight = window.innerHeight;
      } else if ((document.body) && (document.body.clientHeight)) {
        this.winHeight = document.body.clientHeight;
      }
      if (document.documentElement
        && document.documentElement.clientHeight
        && document.documentElement.clientWidth) {
        this.winWidth = document.documentElement.clientWidth;
        this.winHeight = document.documentElement.clientHeight;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
