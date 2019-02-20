import Player from "./Player";
cc.Class({
    extends: Player,

    properties: {
        boardPlayMenu: { type : cc.Node, default : null },
        boardHelp: { type : cc.Node, default : null },
        boardBoosterShop: { type : cc.Node, default : null },
        boardPointsBank: { type : cc.Node, default : null },
        scrollView: { type : cc.ScrollView, default : null },
        playLevel: { type : cc.Integer, default : 1 },
        arrowPoint: { type : cc.Node, default : null },
        mapList: { type : [cc.Texture2D], default : [] },
        font : { type : cc.Font, default : null}
    },

    start: function() {
        // this.playMusic();

        this.sceneType = 2;
        this.boardPlayMenu.x = 0;
        this.boardPlayMenu.y = 0;
        this.boardHelp.x = 0;
        this.boardHelp.y = 0;
        this.boardBoosterShop.x = 0;
        this.boardBoosterShop.y = 0;
        this.boardPlayMenu.active = false;
        this.boardHelp.active = false;
        this.boardBoosterShop.active = false;

        var nodeLevels = this.scrollView.node.getChildByName("view").getChildByName("content").getChildByName("Levels");
        var arrNode = nodeLevels.children;
        var lbPlayerScore = this.boardPointsBank.getChildByName("playerScore").getComponent(cc.Label);
        lbPlayerScore.string = this.playerInfo.score;

        this.playLevel = this.getPlayLevel();
        this.playLevel=100
        
        for (var i = 0; i < arrNode.length; i++) {
            var node = arrNode[i];
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this;
            eventHandler.component = "Map";
            eventHandler.handler = "showPlayMenu";
            eventHandler.customEventData = i + 1;

            var component = node.addComponent(cc.Button);
            component.name = "Level" + (i + 1);
            component.target = node;
            component.transition = cc.Button.Transition.SCALE;

            component.clickEvents = [eventHandler];

            var nodeLock = node.getChildByName("Lock");
            var nodeStars = node.getChildByName("Stars");
            var nodePathPivot = node.getChildByName("PathPivot");
            var nodeNumber = node.getChildByName("Number");
            var nodeTarget = node.getChildByName("Target");
            
            if ((i + 1) > this.playLevel) {//
                nodeNumber.active = false;
                nodeTarget.active = false;
                nodeLock.active = true;
            } else {
                nodeLock.active = true;
                nodeLock.active = false;
                nodeTarget.active = false;
                nodeNumber.active = false;

                if ((i + 1) != this.playLevel) {
                    var nodeSeparated = nodeStars.getChildByName("Separated");
                    nodeSeparated.active = true;
                    var passedInfo = this.playerInfo.levelInfos[i];
                    var arrPoint = [{ x: -25.9, y: -12.3, r: 0 }, { x: 0, y: 0, r: 0 }, { x: 28.2, y: -9.7, r: 0 }]
                    for (var j = 0; j < 3; j++) {
                        nodeSeparated.children[j].width = 25;
                        nodeSeparated.children[j].height = 26;
                        nodeSeparated.children[j].x = arrPoint[j].x;
                        nodeSeparated.children[j].y = arrPoint[j].y;
                        nodeSeparated.children[j].angle = arrPoint[j].r;
                    }

                    switch (passedInfo.star) {
                        case 3:
                            nodeSeparated.children[2].active = true;
                        case 2:
                            nodeSeparated.children[1].active = true;
                        case 1:
                            nodeSeparated.children[0].active = true;
                            break;
                    }
                }

                nodeNumber.removeAllChildren();

                var txtNumber = nodeNumber.addComponent(cc.Label);
                var color = cc.Color.BLACK;
                nodeNumber.y = -14;
                //txtNumber.string = "<outline color=#66280d><color=#FED891>" + (i + 1) + "</color></outline>";
                txtNumber.string = i + 1;
                txtNumber.fontSize = 16;
                
                var txtNumberOutline = nodeNumber.addComponent(cc.LabelOutline);
                txtNumberOutline.width = 2;
                txtNumberOutline.color = color.fromHEX("#66280d");
                
                nodeNumber.color = color.fromHEX("#FED891");
                txtNumber.font = this.font;
                nodeNumber.active = true;

                /*var me = this;*/ 
                this.getLevelInfo(i + 1, function(levelInfo) {
                    var node1 = arrNode[levelInfo.level - 1];
                    var nodeTarget1 = node1.getChildByName("Target");
                    var targetComponent = nodeTarget1.getComponent(cc.Sprite);
                    var mode = 0;
                    if (levelInfo.mode == 0) {
                        if (levelInfo.limit.item1 == 0) {
                            nodeTarget1.width = 40;
                        }
                        else {
                            nodeTarget1.width = 30;
                        }
                    }
                    else if (levelInfo.mode == 1) {
                        if (levelInfo.limit.item1 == 0) {
                            nodeTarget1.width = 30;
                        }
                        else {
                            nodeTarget1.width = 30;
                        }
                    }
                    else if (levelInfo.mode == 2) {
                        nodeTarget1.width = 30;
                    }
                    else if (levelInfo.mode == 3) {
                        nodeTarget1.width = 40;
                    }
                    nodeTarget1.active = true;
                    //targetComponent.spriteFrame._refreshTexture(me.mapList[mode]);            
                });

                var arrPoint = [
                    { x: 110, y: -4704, r: -152 }, { x: 221, y: -4540, r: -152 }, { x: 93, y: -4518, r: -140 }, { x: 2, y: -4525, r: -140 }, { x: -199, y: -4634, r: 53 },
                    { x: -259, y: -4556, r: 47 }, { x: -252, y: -4381, r: -39 }, { x: -159, y: -4339, r: -39 }, { x: 80, y: -4432, r: 135 }, { x: -82, y: -4265, r: -40 }, 
                    { x : 146, y : -4334, r : 142 }, { x : 219, y : -4268, r : 142 }, { x : 111, y : -4149, r : 221 }, { x : -126, y : -4273, r : 56 }, { x : -233, y : -4106, r : -37 },
                    { x : -112, y : -4095, r : -37 }, { x : 25, y : -4070, r : 155 }, { x : 81, y : -4049, r : 155 }, { x : 152, y : -3930, r : 209 }, { x : 76, y : -3862, r :  209},
                    { x : -89, y : -3723, r : 323 }, { x : 55, y : -3634, r : 323 }, { x : 222, y : -3490, r : 224 }, {x : 147, y : -3463, r : 224 }, { x : 36, y : -3467, r : 224 },
                    { x : -57, y : -3467, r : 224 }, { x : -124, y : -3438, r : 224 }, { x : -263, y : -3460, r : 37 }, {x : -201, y : -3282, r : -53 }, { x : -108, y : -3271, r : -53 },
                    { x : 54, y : -3320, r : 137 }, { x : 135, y : -3285, r : 137 }, { x : 201, y : -3125, r : 220 }, {x : 88, y : -3098, r : 220 }, { x : -133, y : -3221, r : 41 },
                    { x : -236, y : -3162, r : 41 }, { x : -126, y : -3038, r : -42 }, { x : 90, y : -3076, r : 145 }, {x : -150, y : -2925, r : -35 }, { x : 7, y : -2892, r : -35 },
                    { x : 45, y : -2787, r : -35 }, { x : 264, y : -2781, r : 134 }, { x : 156, y : -2627, r : 226 }, {x : 26, y : -2621, r : 226 }, { x : -90, y : -2605, r : 226 },
                    { x : -267, y : -2677, r : 57 }, { x : -86, y : -2608, r : 132 }, { x : 19, y : -2568, r : 132 }, {x : 106, y : -2495, r : 132 }, { x : 193, y : -2466, r : 132 },
                    { x : 236, y : -2396, r : 132 }, { x : 6, y : -2386, r : 46 }, { x : -97, y : -2346, r : 46 }, {x : -196, y : -2284, r : 46 }, { x : -248, y : -2226, r : 46 },
                    { x : -162, y : -2075, r : -40 }, { x : -38, y : -2072, r : -40 }, { x : 83, y : -2055, r : -40 }, {x : 202, y : -1971, r : -127 }, { x : 11, y : -1921, r : -31 },
                    { x : 119, y : -1827, r : -31 }, { x : 199, y : -1681, r : -138 }, { x : 92, y : -1671, r : -138 }, {x : -5, y : -1798, r : 137 }, { x : -118, y : -1796, r : 120 },
                    { x : -241, y : -1718, r : 53 }, { x : -117, y : -1627, r : -160 }, { x : -26, y : -1599, r : 145 }, { x : 77, y : -1586, r : 145 }, { x : -95, y : -1479, r : 24 },
                    { x : 156, y : -1486, r : 145 }, { x : 191, y : -1414, r : 145 }, {x : 80, y : -1308, r : 217 }, { x : -133, y : -1441, r : 55 }, { x : -220, y : -1387, r : 55 },
                    { x : -118, y : -1249, r : -36 }, { x : -108, y : -1166, r : -36 }, { x : -24, y : -1135, r : -36 }, { x : 149, y : -1141, r : 162 }, { x : 78, y : -1015, r : 217 },
                    { x : 214, y : -861, r : 217 }, { x : 199, y : -717, r : 217 }, { x : 101, y : -697, r : 217 }, { x : -6, y : -708, r : 228 }, { x : -107, y : -705, r : 228 },
                    { x : -114, y : -706, r : 160 }, { x : -102, y : -656, r : 147 }, { x : -136, y : -519, r : -45 }, { x : 73, y : -616, r : 143 }, { x : -93, y : -514, r : 31 },
                    { x : 134, y : -532, r : 135 }, { x : 166, y : -343, r : 219 }, { x : 45, y : -335, r : 219 }, { x : -157, y : -454, r : 53 }, { x : -244, y : -308, r : -33 },
                    { x : -129, y : -289, r : -33 }, { x : -133, y : -202, r : -33 }, { x : -81, y : -145, r : -33 }, { x : 123, y : -91, r : -134 }, { x : -69, y : -63, r : -28 }
                ];

                this.arrowPoint.x = arrPoint[this.playLevel - 1].x;
                this.arrowPoint.y = arrPoint[this.playLevel - 1].y;
                this.arrowPoint.angle = arrPoint[this.playLevel - 1].r;

            }
        }
        
    },

    showPlayMenu: function(event, level) {

        level = parseInt(level, 10);
        if (level > this.playLevel) {
            return;
        }

        this.playSound(this.SOUND_BUTTON_CLICK);

        cc.sys.localStorage.setItem("using_colorful_bomb", 0);
        cc.sys.localStorage.setItem("using_five_stripes_jelly", 0);
        cc.sys.localStorage.setItem("using_five_pakage", 0);

        var passedLevelInfo = this.playerInfo.levelInfos[level - 1];
        var lbLevelName = this.boardPlayMenu.getChildByName("container").getChildByName("lb_level_name");
        var lbBestScore = this.boardPlayMenu.getChildByName("container").getChildByName("lb_best_score");
        var lbLevelDescription = this.boardPlayMenu.getChildByName("container").getChildByName("lb_level_description");
        var btnPlay = this.boardPlayMenu.getChildByName("container").getChildByName("play_button");

        btnPlay.getComponent(cc.Button).clickEvents[0].customEventData = level;
        lbLevelName.getComponent(cc.Label).string = level;

        this.getLevelInfo(level, function (levelInfo) {
            switch (levelInfo.mode) {
                case 0:
                    lbLevelDescription.getComponent(cc.Label).string = "Get " + levelInfo.stars.step1 + " scores\n" + "Get one star";
                break;
                case 1:
                    lbLevelDescription.getComponent(cc.Label).string = "Collect the items\n" + "Get one star";
                break;
                case 2:
                    lbLevelDescription.getComponent(cc.Label).string = "Collect all ingredients\n" + "Get one star";
                break;
                case 3:
                    lbLevelDescription.getComponent(cc.Label).string = "Collect all blocks\n" + "Get one star";
                break;
            }
            
        });

        this.boardPlayMenu.active = true;
        this.scrollView.enabled = false;

        var nodeStarBar = this.boardPlayMenu.getChildByName("container").getChildByName("star");
        var nodeStar1 = nodeStarBar.getChildByName("star_01");
        var nodeStar2 = nodeStarBar.getChildByName("star_02");
        var nodeStar3 = nodeStarBar.getChildByName("star_03");
        nodeStar1.active = false;
        nodeStar2.active = false;
        nodeStar3.active = false;

        if (passedLevelInfo.passed == 1) {
            lbBestScore.getComponent(cc.Label).string = "Best score : " + passedLevelInfo.bestScore;

            var anim1 = nodeStar1.getComponent(cc.Animation);
            var anim2 = nodeStar2.getComponent(cc.Animation);
            var anim3 = nodeStar3.getComponent(cc.Animation);

            if (passedLevelInfo.star >= 1) {
                setTimeout(function() {
                    nodeStar1.active = true;
                    //anim1.play("StarAnim");
                }, 500);
            }

            if (passedLevelInfo.star >= 2) {
                setTimeout(function() {
                    nodeStar2.active = true;
                    //anim2.play("StarAnim");
                }, 1000);
            }

            if (passedLevelInfo.star >= 3) {
                setTimeout(function() {
                    nodeStar3.active = true;
                    //anim3.play("StarAnim");
                }, 1500);
            }
        }

        var nodeNumber1 = this.boardPlayMenu.getChildByName("container").getChildByName("booster_01").getChildByName("number");
        var nodeNumber2 = this.boardPlayMenu.getChildByName("container").getChildByName("booster_02").getChildByName("number");
        var nodeNumber3 = this.boardPlayMenu.getChildByName("container").getChildByName("booster_03").getChildByName("number");

        nodeNumber1.active = false;
        nodeNumber2.active = false;
        nodeNumber3.active = false;

        this.playerInfo.score = 100000;

        if (this.playerInfo.colorfulBomb > 0) {
            nodeNumber1.getChildByName("check").active = false;
            nodeNumber1.getChildByName("lbCount").active = true;
            nodeNumber1.getChildByName("lbCount").getComponent(cc.Label).string = this.playerInfo.colorfulBomb;
            nodeNumber1.active = true;
        }

        if (this.playerInfo.fiveStripesJelly > 0) {
            nodeNumber2.getChildByName("check").active = false;
            nodeNumber2.getChildByName("lbCount").active = true;
            nodeNumber2.getChildByName("lbCount").getComponent(cc.Label).string = this.playerInfo.fiveStripesJelly;
            nodeNumber2.active = true;
        }

        if (this.playerInfo.fivePakage > 0) {
            nodeNumber3.getChildByName("check").active = false;
            nodeNumber3.getChildByName("lbCount").active = true;
            nodeNumber3.getChildByName("lbCount").getComponent(cc.Label).string = this.playerInfo.fivePakage;
            nodeNumber3.active = true;
        }
    },

    closePlayMenu: function(event) {
        this.playSound(this.SOUND_CLOSE_MENU);
        this.boardPlayMenu.active = false;
        this.scrollView.enabled = true;
    },

    playGame: function(event, level) {
        this.playSound(this.SOUND_BUTTON_CLICK);
        this.boardPlayMenu.active = false;
        this.playerInfo.doingPlayLevel = parseInt(level, 10);
        this.savePlayerInfo();
        this.loadScene("GameField");
    }

});