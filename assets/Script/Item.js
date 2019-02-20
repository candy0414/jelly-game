var MSG_CHECK_PATTERN = "MSG_CHECK_PATTERN";
var MSG_SWAP_PATTERN = "MSG_SWAP_PATTERN";

var eSwapDirection = {"Up":0,"Down":1,"Left":2,"Right":3};
var ePatternExtraAttr = {"Normal":0,"Bomb":1,"Freeze":2,"Stone":3};
var ePatternStatus = {"Normal":0,"Move":1,"Destroy":2,"Explode":3};

cc.Class({
   
    extends: cc.Component,

    properties: {
        Sprite: {
            default: null,
            type: cc.SpriteFrame,
            m_ePatternType:-1,
            m_eExtraAttr:ePatternExtraAttr.Normal,
            m_eSwapDirection:eSwapDirection.Up,
            m_nRowIndex:0,
            m_nColIndex:0,
            g_pSwapPattern:null,
            g_nRemoveBatchIndex:0,
            g_nMoveBatchIndex:0,
            g_bIsRecover:false,
            g_ePatternStatus:ePatternStatus.Normal,
            m_extraTypeSpr:null,
            m_checkSpr:null,
            m_bSwapEnable:true,
        },
    },

    onLoad: function () {
        // this.init();
    },

    start: function () {
        // console.log("This is start");
        var node = new cc.Node('Sprite');   
   

        var sp = node.addComponent(cc.Sprite);
        node.setPosition(0, 0);
        node.setContentSize(55,55);
       

        // console.log("here");
        // console.log(node.getContentSize());     

        //this.sprite.setRect(cc.rect(0,0,128,128));


       //this.sprite.setRect(cc.rect(0, 0, 128, 128));
       this.node.scaleX = 55/128;
       this.node.scaleY = 55/128;
       
        sp.spriteFrame = this.Sprite;
        node.parent = this.node;
        // console.log(sp.spriteFrame);
    },
    update: function (dt) 
    {
        // console.log(dt);
    },
});