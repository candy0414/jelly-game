import Player from "./Player";
cc.Class({
    extends: Player,

    properties: {
        loadingPanel : { type : cc.Node, default : null},
        btnPlay : { type : cc.Node, default : null }
    },

    // onLoad () {},

    start : function () {
        this.sceneType = 1;
        var animCtrl = this.btnPlay.getComponent(cc.Animation);
        animCtrl.play("MainPlayButton");
        setTimeout(function () {
            animCtrl.play("ScaleAnim1");
        }, 1100);
    },

    // update (dt) {},

    loadingData : function (event) {
        this.playSound(this.SOUND_BUTTON_CLICK);
        
        this.loadingPanel.active = true;
        setTimeout(this.goMap(), 1000);
    }, 

    goMap : function () {
        this.loadScene("Map");
    }
});
