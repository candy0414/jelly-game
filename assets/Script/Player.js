cc.Class({
    extends: cc.Component,

    properties: {
        playerInfo : { type : Object, default : null },
        sceneType : { type : cc.Integer, default : 1 },
        musicCtrl : { type : cc.AudioSource, default : null },
        soundCtrlList : { type : [cc.AudioSource], default : [] },
        soundChanelCount : 5,

        SOUND_BUTTON_CLICK : "Button",
        SOUND_CLOSE_MENU : "Jelly_destroy_02",
        SOUND_COMPLETE_LEVEL : "Level_complete",
        SOUND_CHEER : "Cheers"
    },

    
    onLoad () {
        this.readPlayerInfo();

        this.musicCtrl = this.addComponent(cc.AudioSource);
        this.musicCtrl.loop = true;

        this.soundCtrlList = [];
        for (var i = 0; i < this.soundChanelCount; i++) {
            this.soundCtrlList[i] = this.addComponent(cc.AudioSource);
        }
    },

    loadScene : function (name) {
        cc.director.loadScene(name);

        this.musicCtrl = new cc.AudioSource();
        this.soundCtrl = new cc.AudioSource();
    },

    initPlayerInfo : function () {
        this.playerInfo = {
                levelInfos : [

                ],
                score : 0,
                doingPlayLevel : 0,
                sound : 1,
                music : 1,
                colorfulBomb : 0,
                fivePakage : 0,
                fiveStripesJelly : 0,
                fiveMove : 0,
                extraTime : 0,
                bomb : 0,
                hand : 0,
                randomColor : 0
            };

            for (var i = 0; i < 100; i++) {
                this.playerInfo.levelInfos.push({
                    level : i + 1,
                    bestScore : 0,
                    lastScore : 0,
                    star : 0,
                    passed : 0
                })
            } 
    },

    readPlayerInfo : function () {
        var data = cc.sys.localStorage.getItem("playerInfo");
        if (data == "" || data == null) {
            this.initPlayerInfo();
            this.savePlayerInfo();
        }
        else {
            this.playerInfo = eval("(" + data + ")");
        }   
    },

    savePlayerInfo : function () {
        var data = "{";
        for (var key1 in this.playerInfo) {
            if (key1 == "levelInfos") {
                data += key1 + ":[";

                var levelInfos = this.playerInfo[key1];
                for (var i = 0; i < levelInfos.length; i++) {
                    var one = levelInfos[i];
                    data += "{";
                    for (var key2 in one) {
                        data += key2 + ":";
                        data += one[key2];
                        if (key2 != "passed")
                            data += ",";
                    }
                    data += "}";

                    if (i < levelInfos.length - 1)
                        data += ",";
                }

                data += "],";
            }
            else {
                data += key1 + ":";
                data += this.playerInfo[key1];
                if (key1 != "randomColor") {
                    data += ",";
                }
            }
        }
        data += "}";

        cc.sys.localStorage.setItem("playerInfo", data);
    },

    getLevelInfo(level, callback) {
        cc.loader.loadRes('Levels/' + level, function (err, data) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            var spInfo = data.text.split("\n");

            var arrLimit = spInfo[2].split(' ')[1].split('/');
            var arrStar = spInfo[4].split(' ')[1].split('/');
            var arrCollectCount = spInfo[5].split(' ')[2].split('/');
            var arrCollectItems = spInfo[6].split(' ')[2].split('/');

            var levelInfo = {
                level : level,
                mode : parseInt(spInfo[0].split(' ')[1], 10),
                limit : {
                    item1 : parseInt(arrLimit[0], 10),
                    item2 : parseInt(arrLimit[1], 10)
                },
                colorLimit : parseInt(spInfo[3].split(' ')[2], 10),
                stars : {
                    step1 : parseInt(arrStar[0], 10), 
                    step2 : parseInt(arrStar[1], 10), 
                    step3 : parseInt(arrStar[2], 10)
                },
                collectCount : {
                    item1 : parseInt(arrCollectCount[0], 10), 
                    item2 : parseInt(arrCollectCount[1], 10)
                },
                collectItems : {
                    item1 : parseInt(arrCollectItems[0], 10), 
                    item2 : parseInt(arrCollectItems[1], 10)
                },
                itemInfo : [],
                rowCnt : 0,
                colCnt : parseInt(spInfo[1].split(' ')[1].split('/')[0], 10)
            };
            
            for(var i = 7;i < spInfo.length;i ++) {
                levelInfo.rowCnt++;
                levelInfo.itemInfo.push([]);
                var line = spInfo[i].split(' ');
                for(var j = 0;j < line.length;j++) {
                    levelInfo.itemInfo[i - 7][j] = parseInt(line[j]);
                }
            }

            callback(levelInfo);
        });        
    },

    getLastPassedLevel() {
        if (this.playerInfo == null) {
            this.readPlayerInfo();
        }

        for (var i = 0; i < this.playerInfo.levelInfos.length; i++) {
            if (this.playerInfo.levelInfos[i].passed == 1)
                return this.playerInfo.levelInfos[i].level;
        }

        return 0;
    },

    getPlayLevel() {
        if (this.playerInfo == null) {
            this.readPlayerInfo();
        }

        for (var i = 0; i < this.playerInfo.levelInfos.length; i++) {
            if (this.playerInfo.levelInfos[i].passed == 0)
                return this.playerInfo.levelInfos[i].level;
        }

        return 1;
    },

    showBoosterShopMenu: function(event, type) {
        if(this.ocupied == true)
            return;
        type = parseInt(type, 10);

        if (this.sceneType == 2) {
            if (type == 1 && this.playerInfo.colorfulBomb > 0) {
                var nodeNumber = this.boardPlayMenu.getChildByName("container").getChildByName("booster_01").getChildByName("number");
                var nodeCheck = nodeNumber.getChildByName("check");
                var nodeLbCount = nodeNumber.getChildByName("lbCount");
                var usingColorfulBomb = cc.sys.localStorage.getItem("using_colorful_bomb");
                if (usingColorfulBomb == null || usingColorfulBomb == "0") {
                    nodeCheck.active = true;
                    nodeLbCount.active = false;
                    cc.sys.localStorage.setItem("using_colorful_bomb", 1);
                }
                else {
                    nodeCheck.active = false;
                    nodeLbCount.active = true;
                    cc.sys.localStorage.setItem("using_colorful_bomb", 0);
                }
                
                return;
            }

            if (type == 2 && this.playerInfo.fiveStripesJelly > 0) {
                var nodeNumber = this.boardPlayMenu.getChildByName("container").getChildByName("booster_02").getChildByName("number");
                var nodeCheck = nodeNumber.getChildByName("check");
                var nodeLbCount = nodeNumber.getChildByName("lbCount");
                var usingFiveStripesJelly = cc.sys.localStorage.getItem("using_five_stripes_jelly");
                if (usingFiveStripesJelly == null || usingFiveStripesJelly == "0") {
                    nodeCheck.active = true;
                    nodeLbCount.active = false;
                    cc.sys.localStorage.setItem("using_five_stripes_jelly", 1);
                }
                else {
                    nodeCheck.active = false;
                    nodeLbCount.active = true;
                    cc.sys.localStorage.setItem("using_five_stripes_jelly", 0);
                }
                return;
            }

            if (type == 3 && this.playerInfo.fivePakage > 0) {
                var nodeNumber = this.boardPlayMenu.getChildByName("container").getChildByName("booster_03").getChildByName("number");
                var nodeCheck = nodeNumber.getChildByName("check");
                var nodeLbCount = nodeNumber.getChildByName("lbCount");
                var usingFivePakage = cc.sys.localStorage.getItem("using_five_pakage");
                if (usingFivePakage == null || usingFivePakage == "0") {
                    nodeCheck.active = true;
                    nodeLbCount.active = false;
                    cc.sys.localStorage.setItem("using_five_pakage", 1);
                }
                else {
                    nodeCheck.active = false;
                    nodeLbCount.active = true;
                    cc.sys.localStorage.setItem("using_five_pakage", 0);
                }
                return;
            }
        }
        else if (this.sceneType == 3) {
            var btnMove = this.bottomPanel.getChildByName("BoostExtraMoves");
            var btnHand = this.bottomPanel.getChildByName("BoostHand");
            var btnRandomColor = this.bottomPanel.getChildByName("BoostRandom_color");
            var btnBomb = this.bottomPanel.getChildByName("BoostBomb");
            var btnExtraTime = this.bottomPanel.getChildByName("BoostExtraTime");

            var nodeMoveIndicator = btnMove.getChildByName("Indicator");
            var nodeHandIndicator = btnHand.getChildByName("Indicator");
            var nodeRandomColorIndicator = btnRandomColor.getChildByName("Indicator");
            var nodeBombIndicator = btnBomb.getChildByName("Indicator");
            var nodeExtraTimeIndicator = btnExtraTime.getChildByName("Indicator");

            var nodeMoveLock = btnMove.getChildByName("Lock");
            var nodeHandLock = btnHand.getChildByName("Lock");
            var nodeRandomColorLock = btnRandomColor.getChildByName("Lock");
            var nodeBombLock = btnBomb.getChildByName("Lock");
            var nodeExtraTimeLock = btnExtraTime.getChildByName("Lock");

            if (type == 4 && this.playerInfo.fiveMove > 0) {
                var nodeBoostExtraMove = nodeMoveIndicator.getChildByName("BoostExtraMoves");
                var nodePlus = nodeMoveIndicator.getChildByName("Plus");
                this.playerInfo.fiveMove--
                nodeBoostExtraMove.getChildByName("lbCount").getComponent(cc.Label).string = this.playerInfo.fiveMove;

                if (this.playerInfo.fiveMove == 0) {
                    nodeBoostExtraMove.active = false;
                    nodePlus.active = true;
                }

                this.limit += 5;
                var lbMoveLimit = this.topPanel.getChildByName("lbMoveLimit");
                lbMoveLimit.getComponent(cc.Label).string = this.limit;
                this.savePlayerInfo();
                return;
            }

            if (type == 5 && this.playerInfo.hand > 0) {

                if (this.usingHand == 0) {
                    this.setBoosterItemLock(5, true); 
                    this.usingHand = 1;
                }
                else {
                    this.setBoosterItemLock(5, false);
                    this.usingHand = 0;
                }
                return;
            }

            if (type == 6 && this.playerInfo.randomColor > 0) {
                var nodeIndicator = btnRandomColor.getChildByName("Indicator");
                var nodeLock = btnRandomColor.getChildByName("Lock");
                if (this.usingRandomColor == 0) { 
                    this.setBoosterItemLock(6, true); 
                    this.usingRandomColor = 1;
                }
                else {
                    this.setBoosterItemLock(6, false); 
                    this.usingRandomColor = 0;
                }
                return;
            }

            if (type == 7 && this.playerInfo.bomb > 0) {
                var nodeIndicator = btnBomb.getChildByName("Indicator");
                var nodeLock = btnBomb.getChildByName("Lock");
                if (this.usingBomb == 0) { 
                    this.setBoosterItemLock(7, true); 
                    this.usingBomb = 1;
                }
                else {
                    this.setBoosterItemLock(7, false); 
                    this.usingBomb = 0;
                }
                return;
            }

            if (type == 8 && this.playerInfo.extraTime > 0) {
                var nodeBoostExtraTime = nodeExtraTimeIndicator.getChildByName("BoostExtraTime");
                var nodePlus = nodeExtraTimeIndicator.getChildByName("Plus");
                this.playerInfo.extraTime--
                nodeBoostExtraTime.getChildByName("lbCount").getComponent(cc.Label).string = this.playerInfo.extraTime;

                if (this.playerInfo.extraTime == 0) {
                    nodeBoostExtraTime.active = false;
                    nodePlus.active = true;
                }
                this.savePlayerInfo();
                return;
            }
        }

        this.playSound(this.SOUND_BUTTON_CLICK);

        var nodeIcon = this.boardBoosterShop.getChildByName("container").getChildByName("icon");
        var iconColorfulBomb = nodeIcon.getChildByName("booster_colorful_bomb");
        var icon5pakages = nodeIcon.getChildByName("booster_5_pakages");
        var icon5StripesJelly = nodeIcon.getChildByName("booster_5_stripes_jelly");
        var icon5Moves = nodeIcon.getChildByName("booster_5_moves_icon");
        var iconBomb = nodeIcon.getChildByName("booster_bomb");
        var iconHand = nodeIcon.getChildByName("booster_hand");
        var iconRandomeColor = nodeIcon.getChildByName("booster_randome_color");
        var iconExtraTime = nodeIcon.getChildByName("booster_30_times_icon");
        var btnBuy1 = this.boardBoosterShop.getChildByName("container").getChildByName("booster_shop1").getChildByName("btn_booster_shop_1");
        var btnBuy2 = this.boardBoosterShop.getChildByName("container").getChildByName("booster_shop2").getChildByName("btn_booster_shop_2");
        var btnBuy3 = this.boardBoosterShop.getChildByName("container").getChildByName("booster_shop3").getChildByName("btn_booster_shop_3");
        var lbPlayerScore = this.boardBoosterShop.getChildByName("container").getChildByName("playerScore");

        lbPlayerScore.getComponent(cc.Label).string = this.playerInfo.score;
        btnBuy1.getComponent(cc.Button).clickEvents[0].customEventData = type + "-1";
        btnBuy2.getComponent(cc.Button).clickEvents[0].customEventData = type + "-2";
        btnBuy3.getComponent(cc.Button).clickEvents[0].customEventData = type + "-3";


        iconColorfulBomb.active = false;
        icon5pakages.active = false;
        icon5StripesJelly.active = false;
        icon5Moves.active = false;
        iconBomb.active = false;
        iconHand.active = false;
        iconRandomeColor.active = false;
        iconExtraTime.active = false;

        var animName = "MenuAnim2";
        switch (type) {
            case 1:
            //colorful_bomb
            iconColorfulBomb.active = true;
            break;
            case 2:
            //five_stripes_jelly
            icon5StripesJelly.active = true;
            break;
            case 3:
            //five_pakage
            icon5pakages.active = true;
            break;
            case 4:
            //five_moves
            icon5Moves.active = true;
            break;
            case 5:
            //hand
            iconHand.active = true;
            break;
            case 6:
            //randome_color
            iconRandomeColor.active = true;
            break;
            case 7:
            //bomb
            iconBomb.active = true;
            break;
            case 8:
            //extra time
            iconExtraTime.active = true;
            break;
            
        }   

        var animCtrl = this.boardBoosterShop.getChildByName("container").getComponent(cc.Animation);
        this.boardBoosterShop.active = true;

        if (this.sceneType == 2) {
            this.boardPlayMenu.getChildByName("container").getChildByName("x_button").getComponent(cc.Button).interactable = false;
            this.boardPlayMenu.getChildByName("container").getChildByName("booster_01").getComponent(cc.Button).interactable = false;
            this.boardPlayMenu.getChildByName("container").getChildByName("booster_02").getComponent(cc.Button).interactable = false;
            this.boardPlayMenu.getChildByName("container").getChildByName("booster_03").getComponent(cc.Button).interactable = false;
            this.boardPlayMenu.getChildByName("container").getChildByName("play_button").getComponent(cc.Button).interactable = false;
        }
        else if (this.sceneType == 3) {
            this.setEnabledBtnFunc(false);
        }

        animCtrl.play(animName);
    },

    closeBoosterShopMenu: function(event) {
        this.playSound(this.SOUND_CLOSE_MENU);

        this.boardBoosterShop.active = false;

        if (this.sceneType == 2) {
            this.boardPlayMenu.getChildByName("container").getChildByName("x_button").getComponent(cc.Button).interactable = true;
            this.boardPlayMenu.getChildByName("container").getChildByName("booster_01").getComponent(cc.Button).interactable = true;
            this.boardPlayMenu.getChildByName("container").getChildByName("booster_02").getComponent(cc.Button).interactable = true;
            this.boardPlayMenu.getChildByName("container").getChildByName("booster_03").getComponent(cc.Button).interactable = true;
            this.boardPlayMenu.getChildByName("container").getChildByName("play_button").getComponent(cc.Button).interactable = true;

        }
        else if (this.sceneType == 3) {
            this.setEnabledBtnFunc(true);
        }
    },

    refreshBoosterItem : function (type) {
        switch (type) {            
            case 4:
                var nodeMoveIndicator = this.bottomPanel.getChildByName("BoostExtraMoves").getChildByName("Indicator");
                if (this.playerInfo.fiveMove > 0) {
                    nodeMoveIndicator.getChildByName("BoostExtraMoves").active = true;
                    nodeMoveIndicator.getChildByName("Plus").active = false;
                }
                else {
                    nodeMoveIndicator.getChildByName("BoostExtraMoves").active = false;
                    nodeMoveIndicator.getChildByName("Plus").active = true;
                }
                nodeMoveIndicator.getChildByName("BoostExtraMoves").getChildByName("lbCount").getComponent(cc.Label).string = this.playerInfo.fiveMove;
            break;
            case 5:
                var nodeHandIndicator = this.bottomPanel.getChildByName("BoostHand").getChildByName("Indicator");
                if (this.playerInfo.hand > 0) {
                    nodeHandIndicator.getChildByName("BoostHand").active = true;
                    nodeHandIndicator.getChildByName("Plus").active = false;
                }
                else {
                    nodeHandIndicator.getChildByName("BoostHand").active = false;
                    nodeHandIndicator.getChildByName("Plus").active = true;
                }
                nodeHandIndicator.getChildByName("BoostHand").getChildByName("lbCount").getComponent(cc.Label).string = this.playerInfo.hand;
            break;
            case 6:
                var nodeRandomColorIndicator = this.bottomPanel.getChildByName("BoostRandom_color").getChildByName("Indicator");
                if (this.playerInfo.randomColor > 0) {
                    nodeRandomColorIndicator.getChildByName("BoostRandom_color").active = true;
                    nodeRandomColorIndicator.getChildByName("Plus").active = false;
                }
                else {
                    nodeRandomColorIndicator.getChildByName("BoostRandom_color").active = false;
                    nodeRandomColorIndicator.getChildByName("Plus").active = true;
                }
                nodeRandomColorIndicator.getChildByName("BoostRandom_color").getChildByName("lbCount").getComponent(cc.Label).string = this.playerInfo.randomColor;
            break
            case 7:
                var nodeBombIndicator = this.bottomPanel.getChildByName("BoostBomb").getChildByName("Indicator");
                if (this.playerInfo.bomb > 0) {
                    nodeBombIndicator.getChildByName("BoostBomb").active = true;
                    nodeBombIndicator.getChildByName("Plus").active = false;
                }
                else {
                    nodeBombIndicator.getChildByName("BoostBomb").active = false;
                    nodeBombIndicator.getChildByName("Plus").active = true;
                }
                nodeBombIndicator.getChildByName("BoostBomb").getChildByName("lbCount").getComponent(cc.Label).string = this.playerInfo.bomb;
            break;
            case 8:
                var nodeExtraTimeIndicator = this.bottomPanel.getChildByName("BoostExtraTime").getChildByName("Indicator");
                if (this.playerInfo.extraTime > 0) {
                    nodeExtraTimeIndicator.getChildByName("BoostExtraTime").active = true;
                    nodeExtraTimeIndicator.getChildByName("Plus").active = false;
                }
                else {
                    nodeExtraTimeIndicator.getChildByName("BoostExtraTime").active = false;
                    nodeExtraTimeIndicator.getChildByName("Plus").active = true;                
                }
                // nodeExtraTimeIndicator.getChildByName("BoostExtraTime").getChildByName("lbCount").getComponent(cc.Label).string = this.playerInfo.extraTime; 
            break;

        } 
    },

    setBoosterItemLock : function (type, bl) {
        var btnMove = this.bottomPanel.getChildByName("BoostExtraMoves");
        var btnHand = this.bottomPanel.getChildByName("BoostHand");
        var btnRandomColor = this.bottomPanel.getChildByName("BoostRandom_color");
        var btnBomb = this.bottomPanel.getChildByName("BoostBomb");
        var btnExtraTime = this.bottomPanel.getChildByName("BoostExtraTime");

        var nodeMoveIndicator = btnMove.getChildByName("Indicator");
        var nodeHandIndicator = btnHand.getChildByName("Indicator");
        var nodeRandomColorIndicator = btnRandomColor.getChildByName("Indicator");
        var nodeBombIndicator = btnBomb.getChildByName("Indicator");
        var nodeExtraTimeIndicator = btnExtraTime.getChildByName("Indicator");

        var nodeMoveLock = btnMove.getChildByName("Lock");
        var nodeHandLock = btnHand.getChildByName("Lock");
        var nodeRandomColorLock = btnRandomColor.getChildByName("Lock");
        var nodeBombLock = btnBomb.getChildByName("Lock");
        var nodeExtraTimeLock = btnExtraTime.getChildByName("Lock");

        if (type != 4 && this.levelInfo.limit.item1 == 0) {
            //five moves
            nodeMoveIndicator.active = !bl;
            nodeMoveLock.active = bl;
            btnMove.getComponent(cc.Button).interactable = !bl;
        }

        if (type != 5) {
            //hand
            nodeHandIndicator.active = !bl;
            nodeHandLock.active = bl;
            btnHand.getComponent(cc.Button).interactable = !bl;
        }

        if (type != 6) {
            //random color
            nodeRandomColorIndicator.active = !bl;
            nodeRandomColorLock.active = bl;
            btnRandomColor.getComponent(cc.Button).interactable = !bl;
        }

        if (type != 7) {
            //bomb
            nodeBombIndicator.active = !bl;
            nodeBombLock.active = bl;
            btnBomb.getComponent(cc.Button).interactable = !bl;
        }

        if (type != 8 && this.levelInfo.limit.item1 > 0) {
            //extra time
            nodeExtraTimeIndicator.active = !bl;
            nodeExtraTimeLock.active = bl;
            btnExtraTime.getComponent(cc.Button).interactable = !bl;
        }
    },

    buyItem : function (event, param) {
        this.playSound(this.SOUND_BUTTON_CLICK);

        var arr = param.split("-");
        var buyType = parseInt(arr[0], 10), amountType = parseInt(arr[1], 10);

        switch (amountType) {
            case 1:
            //2500
            if (this.playerInfo.score < 2500) {
                return;
            }

            //this.playerInfo.score -= 2500;
            this.updateItemCount(buyType, 3, 2500);

            break;
            case 2:
            //5000
            if (this.playerInfo.score < 5000) {
                return;
            }

            //this.playerInfo.score -= 5000;
            this.updateItemCount(buyType, 5, 5000);
            
            break;
            case 3:
            //11000
            if (this.playerInfo.score < 11000) {
                return;
            }

            //this.playerInfo.score -= 11000;
            this.updateItemCount(buyType, 10, 11000);
            
            break;
        } 
    },

    updateItemCount : function (buyType, count, cost) {
        switch (buyType) {
            case 1:
            //colorful_bomb
            if (this.playerInfo.colorfulBomb == 0) {
                this.playerInfo.colorfulBomb = count;
                this.playerInfo.score -= cost;

                if (this.sceneType == 2) {
                    var booster1 = this.boardPlayMenu.getChildByName("container").getChildByName("booster_01");
                    var nodeNumber = booster1.getChildByName("number");
                    nodeNumber.getChildByName("lbCount").getComponent(cc.Label).string = count;
                    nodeNumber.active = true;
                }
            }
            break;
            case 2:
            //five_stripes_jelly
            if (this.playerInfo.fiveStripesJelly == 0) {
                this.playerInfo.fiveStripesJelly = count;
                this.playerInfo.score -= cost;

                if (this.sceneType == 2) {
                    var booster2 = this.boardPlayMenu.getChildByName("container").getChildByName("booster_02");
                    var nodeNumber = booster2.getChildByName("number");
                    nodeNumber.getChildByName("lbCount").getComponent(cc.Label).string = count;
                    nodeNumber.active = true;
                }
            }
            break;
            case 3:
            //five_pakage
            if (this.playerInfo.fivePakage == 0) {
                this.playerInfo.fivePakage = count;
                this.playerInfo.score -= cost;

                if (this.sceneType == 2) {
                    var booster3 = this.boardPlayMenu.getChildByName("container").getChildByName("booster_03");
                    var nodeNumber = booster3.getChildByName("number");
                    nodeNumber.getChildByName("lbCount").getComponent(cc.Label).string = count;
                    nodeNumber.active = true;
                }
            }
            break;            
            case 4: //five_moves
            if (this.playerInfo.fiveMove == 0) {
                this.playerInfo.fiveMove = count;
                this.playerInfo.score -= cost;

                if (this.sceneType == 3) {
                    this.refreshBoosterItem(4)     
                }
            }
            break;
            case 5: //hand
            if (this.playerInfo.hand == 0) {
                this.playerInfo.hand = count;
                this.playerInfo.score -= cost;

                if (this.sceneType == 3) {
                    this.refreshBoosterItem(5)     
                }
            }
            break;
            case 6: //randome_color
            if (this.playerInfo.randomColor == 0) {
                this.playerInfo.randomColor = count;
                this.playerInfo.score -= cost;

                if (this.sceneType == 3) {
                    this.refreshBoosterItem(6)     
                }
            }
            break;
            case 7: //bomb
            if (this.playerInfo.bomb == 0) {
                this.playerInfo.bomb = count;
                this.playerInfo.score -= cost;

                if (this.sceneType == 3) {
                    this.refreshBoosterItem(7)     
                }
            }
            break;
            case 8: //extra time
            if (this.playerInfo.extraTime == 0) {
                this.playerInfo.extraTime = count;
                this.playerInfo.score -= cost;

                if (this.sceneType == 3) {
                    this.refreshBoosterItem(8)     
                }                
            }
            break;            
        } 

        this.savePlayerInfo();

        var lbPlayerScore = this.boardBoosterShop.getChildByName("container").getChildByName("playerScore");
        lbPlayerScore.getComponent(cc.Label).string = this.playerInfo.score;
    },

    showHelpMenu: function(event) {
        this.playSound(this.SOUND_BUTTON_CLICK);

        this.boardHelp.active = true;
        var animationCtrl = this.boardHelp.getChildByName("container").getComponent(cc.Animation);
        animationCtrl.play("MenuAnim2");

        if (this.boardPlayMenu != null) {
            this.boardPlayMenu.getChildByName("container").getChildByName("x_button").getComponent(cc.Button).interactable = false;
            this.boardPlayMenu.getChildByName("container").getChildByName("booster_01").getComponent(cc.Button).interactable = false;
            this.boardPlayMenu.getChildByName("container").getChildByName("booster_02").getComponent(cc.Button).interactable = false;
            this.boardPlayMenu.getChildByName("container").getChildByName("booster_03").getComponent(cc.Button).interactable = false;
            this.boardPlayMenu.getChildByName("container").getChildByName("play_button").getComponent(cc.Button).interactable = false;
        }
    },

    closeHelpMenu: function(event) {
        this.playSound(this.SOUND_CLOSE_MENU);

        this.boardHelp.active = false;

        if (this.boardPlayMenu != null) {
            this.boardPlayMenu.getChildByName("container").getChildByName("x_button").getComponent(cc.Button).interactable = true;
            this.boardPlayMenu.getChildByName("container").getChildByName("booster_01").getComponent(cc.Button).interactable = true;
            this.boardPlayMenu.getChildByName("container").getChildByName("booster_02").getComponent(cc.Button).interactable = true;
            this.boardPlayMenu.getChildByName("container").getChildByName("booster_03").getComponent(cc.Button).interactable = true;
            this.boardPlayMenu.getChildByName("container").getChildByName("play_button").getComponent(cc.Button).interactable = true;
        }
    },

    playMusic : function () {
        if (this.playerInfo.music == 0)
            return;

        if (this.musicCtrl.isPlaying) {
            this.musicCtrl.volume = 1;
            return;
        }

        if (this.musicCtrl.clip != null) {
            this.musicCtrl.play();
        }
        else {
            var me = this;
            cc.loader.loadRes('JellyGarden/Audio/game_music', function (err, clip) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }

                me.musicCtrl.clip = clip;
                me.musicCtrl.play();
            });
        }
    },

    stopMusic : function () {
        this.musicCtrl.stop();
    },

    muteMusic : function () {
        this.musicCtrl.volume = 0;
    },

    getEmptySoundCtrlIdx : function () {
        var idx = -1;
        for (var i = 0; i < this.soundChanelCount; i++) {
            var soundCtrl = this.soundCtrlList[i];
            if (soundCtrl.isPlaying)
                continue;
            return i;
        }

        return getEmptySoundCtrlIdx();
        
    },

    playSound : function (name) {
        if (this.playerInfo.sound == 0)
            return;
        
        var chanelId = this.getEmptySoundCtrlIdx();

        var me = this;
        cc.loader.loadRes('JellyGarden/Audio/' + name, function (err, clip) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            me.soundCtrlList[chanelId].clip = clip;
            me.soundCtrlList[chanelId].play();
        });
    }

});
