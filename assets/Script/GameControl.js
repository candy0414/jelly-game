import Player from "./Player";
cc.Class({
    extends: Player,
    properties: {
       field: {
        type: cc.Node,
        default: null
       },
       item_ingredients: {
        type: [cc.SpriteFrame],
        default: []
       },
       item_block: {
        type: [cc.SpriteFrame],
        default: []
       },
       g_banner: {
        type: cc.Node,
        default: null
       },
       g_cloud: {
        type: cc.Node,
        default: null
       },
       g_targetdsc: {
        type: cc.Node,
        default: null
       },
       circleSprites: {//added new
        type: cc.SpriteFrame,
        default: null
       },
       tileSprites: {
        type: [cc.SpriteFrame],
        default: []
       },
       lightLayRound: {
        type: cc.SpriteFrame,
        default: null
       },
       lightNode: {
        type: cc.SpriteFrame,
        default: null
       },
       itemInfo: [],
       tileArr: [],
       tileBeforeSpitemExploidArray: [],
       tileBeforeArr: [],
       ice_nodes: [],
       wood_nodes: [],
       choco_nodes: [],
       rowCnt: 0,
       columnCnt: 0,
       colorLimit: 0,
       limit: 0,
       chocoCnt:0,
       mode: 0,
       item1Cnt:0,
       item2Cnt:0,
       target1Idx:0,
       target2Idx:0,
       startTileIdx: -1,
       startPos: null,
       ocupied: false,
       constNode: cc.Node,
       const: null,
       currentScore: 0,
       redCandyParticles: {
        type: [cc.SpriteFrame],
        default: []
       },
       orangeCandyParticles: {
        type: [cc.SpriteFrame],
        default: []
       },
       darkpinkCandyParticles: {
        type: [cc.SpriteFrame],
        default: []
       },
       blueCandyParticles: {
        type: [cc.SpriteFrame],
        default: []
       },
       greenCandyParticles: {
        type: [cc.SpriteFrame],
        default: []
       },
       yellowCandyParticles: {
        type: [cc.SpriteFrame],
        default: []
       },
       star: {
        type: cc.SpriteFrame,
        default: null
       },
       strip: {
        type: cc.SpriteFrame,
        default: null
       },
       msgNodes:{type: [cc.Sprite] , default: []},
       comboCount: 0,
       //lbLevel : { type : cc.Node, default : null },
       //lbMoveLimit : { type : cc.Node, default : null },
       //targetScore : { type : cc.Node, default : null },
       //playScore : { type : cc.Node, default : null },
       boardBoosterShop : { type : cc.Node, default : null },
       boardComplete : { type : cc.Node, default : null },
       boardFail : { type : cc.Node, default : null },
       boardPause : { type : cc.Node, default : null },
       //btnPause : { type : cc.Node, default : null },
       //btnMove : { type : cc.Node, default : null },
       //btnHand : { type : cc.Node, default : null },
       //btnRandomColor : { type : cc.Node, default : null },
       //btnBomb : { type : cc.Node, default : null },
       maskStarBar : { type : cc.Node, default : null },
       //starsBar : { type : cc.Node, default : null },
       levelInfo : { type : Object, default : null },
       
       bottomPanel : { type : cc.Node, default : null },
       topPanel : { type : cc.Node, default : null },

       usingHand : 0,
       usingRandomColor : 0,
       usingBomb : 0
       
    },

    swapCandy(idx1,idx2,data) {
        if(this.tileArr[parseInt(idx2 / 9)][idx2 % 9] == this.const.NONE_TILE) {
            this.ocupied = false
            return
        }
        var item1 = this.field.children[idx1].getChildByName('Item')
        var childidx1,childidx2
        for(var i = 0;i < item1.children.length;i++) {
            if(item1.children[i].active == true) {
                item1.children[i].active = false
                childidx1 = i
                break
            }
        }
        var item2 = this.field.children[idx2].getChildByName('Item')
        for(var i = 0;i < item2.children.length;i++) {
            if(item2.children[i].active == true) {
                item2.children[i].active = false
                childidx2 = i
                break
            }
        }

        var node1 = new cc.Node('Sprite')
        var sp = node1.addComponent(cc.Sprite)
        if(childidx1==null) {
            this.hideTile(parseInt(idx2 / 9),idx2 % 9)
            sp.spriteFrame = this.item_ingredients[this.tileArr[parseInt(idx2 / 9)][idx2 % 9] - 32]
        }
        else
            sp.spriteFrame = this.tileSprites[childidx1]
        var node2 = new cc.Node('Sprite')
        sp = node2.addComponent(cc.Sprite)
        if(childidx2!=null)
            sp.spriteFrame = this.tileSprites[childidx2]
        else {
            sp.spriteFrame = this.item_ingredients[this.tileArr[parseInt(idx1 / 9)][idx1 % 9] -32]
            this.hideTile(parseInt(idx1 / 9),idx1 % 9)
        }
        this.hideTile(parseInt(idx2 / 9),idx2 % 9)
        this.hideTile(parseInt(idx1 / 9),idx1 % 9)
        node1.parent = this.field
        node2.parent = this.field
        node1.width = 45
        node2.width = 45
        node1.height = 45
        node2.height = 45
        node1.position = cc.v2(this.field.children[idx1].position.x,this.field.children[idx1].position.y)
        node2.position = cc.v2(this.field.children[idx2].position.x,this.field.children[idx2].position.y)
        var _loading = false
        var me = this
        function _callback() {
            if(_loading)
                return
            _loading = true
            if(childidx2!=null) {
                item1.children[childidx2].active = true
            }
            else {
                me.showTile(parseInt(idx1 / 9),idx1 % 9,me.tileArr[parseInt(idx1 / 9)][idx1 % 9])
            }
            if(childidx1!=null) {
                item2.children[childidx1].active = true
            } else {
                me.showTile(parseInt(idx2 / 9),idx2 % 9,me.tileArr[parseInt(idx2 / 9)][idx2 % 9])
            }

            node1.removeFromParent(true)
            node2.removeFromParent(true)
            if(data != null) {
                var bombs = [me.const.TILE_ITEM_RED_EXT,me.const.TILE_ITEM_ORANGE_EXT,me.const.TILE_ITEM_DARK_PINK_EXT,me.const.TILE_ITEM_BLUE_EXT,me.const.TILE_ITEM_GREEN_EXT,me.const.TILE_ITEM_YELLOW_EXT]
                var horizs = [me.const.TILE_ITEM_RED_HORIZ,me.const.TILE_ITEM_ORANGE_HORIZ,me.const.TILE_ITEM_DARK_PINK_HORIZ,me.const.TILE_ITEM_BLUE_HORIZ,me.const.TILE_ITEM_GREEN_HORIZ,me.const.TILE_ITEM_YELLOW_HORIZ]
                var verts = [me.const.TILE_ITEM_RED_VERT,me.const.TILE_ITEM_ORANGE_VERT,me.const.TILE_ITEM_DARK_PINK_VERT,me.const.TILE_ITEM_BLUE_VERT,me.const.TILE_ITEM_GREEN_VERT,me.const.TILE_ITEM_YELLOW_VERT]
                var eff_idx1 = -1
                var eff_idx2 = -1
                for(var i = 0; i < bombs.length;i++) {
                    if(me.tileArr[parseInt(idx1 / 9)][idx1 % 9] == bombs[i]) {
                        eff_idx1 = 1
                        break
                    }
                }
                for(var i = 0; i < bombs.length;i++) {
                    if(me.tileArr[parseInt(idx2 / 9)][idx2 % 9] == bombs[i]) {
                        eff_idx2 = 1
                        break
                    }
                }
                for(var i = 0; i < horizs.length;i++) {
                    if(me.tileArr[parseInt(idx1 / 9)][idx1 % 9] == horizs[i]) {
                        eff_idx1 = 2
                        break
                    }
                }
                for(var i = 0; i < horizs.length;i++) {
                    if(me.tileArr[parseInt(idx2 / 9)][idx2 % 9] == horizs[i]) {
                        eff_idx2 = 2
                        break
                    }
                }
                for(var i = 0; i < verts.length;i++) {
                    if(me.tileArr[parseInt(idx1 / 9)][idx1 % 9] == verts[i]) {
                        eff_idx1 = 3
                        break
                    }
                }
                for(var i = 0; i < verts.length;i++) {
                    if(me.tileArr[parseInt(idx2 / 9)][idx2 % 9] == verts[i]) {
                        eff_idx2 = 3
                        break
                    }
                }
                if(me.tileArr[parseInt(idx1 / 9)][idx1 % 9] == me.const.TILE_CHOCO) {
                    eff_idx1 = 4
                }
                if(me.tileArr[parseInt(idx2 / 9)][idx2 % 9] == me.const.TILE_CHOCO) {
                    eff_idx2 = 4
                }
                if(eff_idx1 != -1 && eff_idx2 != -1) {
                    if(eff_idx1 != 4 && eff_idx2 != 4) {
                        var ex_data = []
                        if(eff_idx1 != 1 && eff_idx2 != 1) {
                            var lx = parseInt(idx1 / 9),ly = idx1 % 9,rx = parseInt(idx2 / 9),ry = idx2 % 9
                            if(lx > parseInt(idx2 / 9)) {
                                lx = parseInt(idx2 / 9)
                                rx = parseInt(idx1 / 9)
                            }
                            if(ly > ry) {
                                ly = idx2 % 9
                                ry = idx1 % 9
                            }
                            var matrix = []
                            for(var i = 0; i < rx - lx + 1;i++) {
                                matrix[i] = []
                                for(var j = 0;j < ry - ly + 1;j++) {
                                    matrix[i][j] = -1
                                }
                            }
                            for(var i = 0; i < rx - lx + 1;i++) {
                                for(var j = 0;j < ry - ly + 1;j++) {
                                    if(me.tileArr[lx + i][ly + j] != me.const.NONE_TILE && me.tileArr[lx + i][ly + j] != me.const.TILE_CHOCO && me.tileArr[lx + i][ly + j] != me.const.TILE_INGREDIENT1 && me.tileArr[lx + i][ly + j] != me.const.TILE_INGREDIENT2)
                                        matrix[i][j] = 1
                                }
                            }
                            ex_data.push({'x': lx,'y': ly,'rowCnt': rx - lx + 1,'colCnt': ry - ly + 1,'matrix': matrix})
                            me.ocupied = true
                            me.exploidTiles(ex_data, function() {
                                me.fillTiles(ex_data,null,function() {
                                    me.backupGameBoard()
                                })
                            })
                        }
                        else if((eff_idx1 != 1 && eff_idx2 == 1) || (eff_idx1 == 1 && eff_idx2 != 1)) {
                            var matrix = []
                            var left,right,top,bottom
                            var pos_x,pos_y
                            if(eff_idx1 != 1) {
                                pos_x = parseInt(idx1 / 9)
                                pos_y = idx1 % 9
                            } else {
                                pos_x = parseInt(idx2 / 9)
                                pos_y = idx2 % 9
                            }
                            left = pos_x - 1
                            top = pos_y - 1
                            right = pos_x + 1
                            bottom = pos_y + 1
                            if(left < 0) left = 0;
                            if(top < 0) top = 0;
                            if(right >= me.colCnt) right = me.colCnt - 1;
                            if(bottom >= me.rowCnt) bottom = me.rowCnt - 1;
                            for(var i = 0;i < bottom - top + 1;i++) {
                                matrix[i] = []
                                for(var j = 0;j < right - left + 1;j++) {
                                    matrix[i][j] = -1
                                }
                            }
                            var switch_flag = true
                            for(var i = 0;i < bottom - top + 1;i++) {
                                for(var j = 0;j < right - left + 1;j++) {
                                    if(me.tileArr[i + left][top + j] != me.const.NONE_TILE && me.tileArr[i + left][top + j] != me.const.TILE_CHOCO && me.tileArr[left + i][top + j] != me.const.TILE_INGREDIENT1 && me.tileArr[left + i][top + j] != me.const.TILE_INGREDIENT2) {
                                        matrix[i][j] = 1
                                        if(switch_flag == true) {
                                            me.tileArr[i + left][top + j] = me.const.TILE_ITEM_RED_HORIZ
                                        }
                                        else {
                                            me.tileArr[i + left][top + j] = me.const.TILE_ITEM_RED_VERT
                                        }
                                    }
                                    switch_flag = !switch_flag
                                }
                            }
                            ex_data.push({'x': left,'y': top,'rowCnt': bottom - top + 1,'colCnt': right - left + 1,'matrix': matrix})
                            me.ocupied = true
                            me.exploidTiles(ex_data, function() {
                                me.fillTiles(ex_data,null,function() {
                                    me.backupGameBoard()
                                })
                            })
                        }
                        else {//both are bomb
                            var matrix = []
                            var pos_x = parseInt(idx2 / 9),pos_y = idx2 % 9
                            var left = pos_x - 2,right = pos_x + 2,top = pos_y - 2,bottom = pos_y + 2
                            if(left < 0)
                                left = 0
                            if(top < 0)
                                top = 0
                            if(right >= me.rowCnt) right = me.rowCnt - 1;
                            if(bottom >= me.colCnt) bottom = me.colCnt - 1;
                            for(var i = 0;i < right - left + 1;i++) {
                                matrix[i] = []
                                for(var j = 0;j < bottom - top + 1;j++) {
                                    matrix[i][j] = -1
                                }
                            }
                            for(var i = 0;i < right - left + 1;i++) {
                                for(var j = 0;j < bottom - top + 1;j++) {
                                    if(me.tileArr[i + left][top + j] != me.const.NONE_TILE && me.tileArr[i + left][top + j] != me.const.TILE_CHOCO && me.tileArr[left + i][top + j] != me.const.TILE_INGREDIENT1 && me.tileArr[left + i][top + j] != me.const.TILE_INGREDIENT2) {
                                        matrix[i][j] = 1
                                    }
                                }
                            }
                            ex_data.push({'x': left,'y': top,'rowCnt': bottom - top + 1,'colCnt': right - left + 1,'matrix': matrix})
                            me.ocupied = true
                            me.exploidTiles(ex_data, function() {
                                me.fillTiles(ex_data,null,function() {
                                    me.backupGameBoard()
                                })
                            })
                        }
                    }
                    else if(eff_idx1 == 4 && eff_idx2 == 4) {
                        var ret = []
                        var matrix = []
                        for(var i = 0;i < me.rowCnt;i ++) {
                            matrix[i] = []
                            for(var j = 0;j < me.colCnt;j++)
                                matrix[i][j] = -1
                        }
                        for(var i = 0;i < me.rowCnt;i++) {
                            for(var j = 0;j < me.colCnt;j++) {
                                if(!((i == idx1 / 9 && j == idx1 % 9) || (i == idx2 / 9 && j==idx2 % 9)) && me.tileArr[i][j] != me.const.EMPTY_TILE && me.tileArr[i][j] != me.const.NONE_TILE && me.tileArr[i][j] != me.const.TILE_CHOCO && me.tileArr[i][j] != me.const.TILE_INGREDIENT1 && me.tileArr[i][j] != me.const.TILE_INGREDIENT2) {
                                    matrix[i][j] = 1
                                }
                            }
                        }
                        me.tileArr[parseInt(idx1 / 9)][idx1 % 9] = me.const.EMPTY_TILE
                        me.hideTile(parseInt(idx1 / 9),idx1 % 9)
                        me.tileArr[parseInt(idx2 / 9)][idx2 % 9] = me.const.EMPTY_TILE
                        me.hideTile(parseInt(idx2 / 9),idx2 % 9)
                        ret.push({'x': 0,'y': 0,'rowCnt': me.rowCnt,'colCnt': me.colCnt,'matrix': matrix})
                        me.ocupied = true
                        me.exploidTiles(ret,function() {
                            me.fillTiles(ret,null,null,function() {
                                me.backupGameBoard()
                            })
                        })
                    }
                    else if(eff_idx1 == 4) {
                        var secondTile = me.tileArr[parseInt(idx2 / 9)][idx2 % 9]
                            for(var i = 0;i < me.rowCnt;i++) {
                                for(var j = 0;j < me.colCnt;j++) {
                                    if(me.compareTiles(me.tileArr[i][j],secondTile) == true) {
                                        me.tileArr[i][j] = secondTile
                                    }
                                }
                            }
                            me.ocupied = true
                            me.tileArr[parseInt(idx1 / 9)][idx1 % 9] = me.const.EMPTY_TILE
                            me.hideTile(parseInt(idx1 / 9),idx1 % 9)
                            me.refreshBoard()
                            setTimeout(function() { 
                                me.fillTiles([],null,null,function() { me.backupGameBoard() })
                            },0.3)
                    }
                    else {
                        var secondTile = me.tileArr[parseInt(idx1 / 9)][idx1 % 9]
                            for(var i = 0;i < me.rowCnt;i++) {
                                for(var j = 0;j < me.colCnt;j++) {
                                    if(me.compareTiles(me.tileArr[i][j],secondTile) == true) {
                                        me.tileArr[i][j] = secondTile
                                    }
                                }
                            }
                            me.ocupied = true
                            me.tileArr[parseInt(idx2 / 9)][idx2 % 9] = me.const.EMPTY_TILE
                            me.hideTile(parseInt(idx2 / 9),idx2 % 9)
                            me.refreshBoard()
                            setTimeout(function() { 
                                me.fillTiles([],null,null,function() { me.backupGameBoard() })
                            },0.3)
                    }
                    me.limit--
                    return
                } else if(eff_idx1 == 4 || eff_idx2 == 4) {//choco
                    if(me.tileArr[parseInt(idx2 / 9)][idx2 % 9] == me.const.TILE_INGREDIENT1 || me.tileArr[parseInt(idx2 / 9)][idx2 % 9] == me.const.TILE_INGREDIENT2 ||
                        me.tileArr[parseInt(idx1 / 9)][idx1 % 9] == me.const.TILE_INGREDIENT1 || me.tileArr[parseInt(idx1 / 9)][idx1 % 9] == me.const.TILE_INGREDIENT2) {
                        var tmp = me.tileArr[parseInt(idx1 / 9)][idx1 % 9]
                        me.tileArr[parseInt(idx1 / 9)][idx1 % 9] = me.tileArr[parseInt(idx2 / 9)][idx2 % 9]
                        me.tileArr[parseInt(idx2 / 9)][idx2 % 9] = tmp
                        me.swapCandy(idx1,idx2)
                    }
                    else {
                        var ret = []
                        var matrix = []
                        for(var i = 0;i < me.rowCnt;i ++) {
                            matrix[i] = []
                            for(var j = 0;j < me.colCnt;j++)
                                matrix[i][j] = -1
                        }
                        if(eff_idx1 == 4) {
                            var secondTile = me.tileArr[parseInt(idx2 / 9)][idx2 % 9]
                            for(var i = 0;i < me.rowCnt;i++) {
                                for(var j = 0;j < me.colCnt;j++) {
                                    if(me.compareTiles(me.tileArr[i][j],secondTile) == true) {
                                        matrix[i][j] = 1
                                    }
                                }
                            }
                            me.tileArr[parseInt(idx1 / 9)][idx1 % 9] = me.const.EMPTY_TILE
                            me.hideTile(parseInt(idx1 / 9),idx1 % 9)
                        } else {
                            var secondTile = me.tileArr[parseInt(idx1 / 9)][idx1 % 9]
                            for(var i = 0;i < me.rowCnt;i++) {
                                for(var j = 0;j < me.colCnt;j++) {
                                    if(me.compareTiles(me.tileArr[i][j],secondTile) == true) {
                                        matrix[i][j] = 1
                                    }
                                }
                            }
                            me.tileArr[parseInt(idx2 / 9)][idx2 % 9] = me.const.EMPTY_TILE
                            me.hideTile(parseInt(idx2 / 9),idx2 % 9)
                        }
                        ret.push({'x': 0,'y': 0,'rowCnt': me.rowCnt,'colCnt': me.colCnt,'matrix': matrix})
                        me.ocupied = true
                        me.exploidTiles(ret,function() {
                            me.fillTiles(ret,null,null,function() {
                                me.backupGameBoard()
                            })
                        })
                        me.limit--
                    }
                    return
                } else if(data.length != 0) {
                    me.limit--
                    me.ocupied = true
                    me.exploidTiles(data, function() {
                        me.genEffectTiles(data,function(gened_pos,gened_item) {
                            me.fillTiles(data,gened_pos,gened_item,function() {
                                me.backupGameBoard()
                            })
                        })
                    })
                }
                else {
                  if(me.usingHand == 0) {
                    var tmp = me.tileArr[parseInt(idx1 / 9)][idx1 % 9]
                    me.tileArr[parseInt(idx1 / 9)][idx1 % 9] = me.tileArr[parseInt(idx2 / 9)][idx2 % 9]
                    me.tileArr[parseInt(idx2 / 9)][idx2 % 9] = tmp
                    me.swapCandy(idx1,idx2)
                  } else {
                    me.limit--
                    me.usingHand = 0
                    me.playerInfo.hand--
                    me.savePlayerInfo()

                    me.refreshBoosterItem(5)

                    me.setBoosterItemLock(5,false)
                    me.ocupied = false;
                    me.checkGameStatus()
                  }
                }
            }
            else if(data == null) {
                me.ocupied = false
            }
        }
        var _callfunc = cc.callFunc(()=>{
            _callback()
        })
        if(idx1 < idx2 && idx2 - idx1 == 1) {
            var moveBy1 = cc.moveBy(0.3, cc.v2(55 , 0))
            var moveBy2 = cc.moveBy(0.3, cc.v2(-55 , 0))
            node1.runAction(cc.sequence(moveBy1,_callfunc))
            node2.runAction(cc.sequence(moveBy2,_callfunc))
        }
        if(idx1 < idx2 && idx2 - idx1 == 9) {
            var moveBy1 = cc.moveBy(0.3, cc.v2(0 , -55))
            var moveBy2 = cc.moveBy(0.3, cc.v2(0 , 55))
            node1.runAction(cc.sequence(moveBy1,_callfunc))
            node2.runAction(cc.sequence(moveBy2,_callfunc))
        }
        if(idx1 > idx2 && idx2 - idx1 == -1) {
            var moveBy1 = cc.moveBy(0.3, cc.v2(-55 , 0))
            var moveBy2 = cc.moveBy(0.3, cc.v2(55 , 0))
            node1.runAction(cc.sequence(moveBy1,_callfunc))
            node2.runAction(cc.sequence(moveBy2,_callfunc))
        }
        if(idx1 > idx2 && idx2 - idx1 == -9) {
            var moveBy1 = cc.moveBy(0.3, cc.v2(0 , 55))
            var moveBy2 = cc.moveBy(0.3, cc.v2(0 , -55))
            node1.runAction(cc.sequence(moveBy1,_callfunc))
            node2.runAction(cc.sequence(moveBy2,_callfunc))
        }
    },

    touchStartListener(event) {
        if(this.ocupied)
            return
        var pos = event.touch._point
        var squareArray = this.field.children
        for(var i = 0; i < this.rowCnt * 9;i++) {

            var rt = cc.rect(squareArray[i].position.x - 55 / 2 - 10,squareArray[i].position.y - 55 / 2,55,55)
            if(rt.contains(cc.v2(pos.x - (325 - (this.colCnt - 9) * 55 / 2),pos.y - (600 + (this.rowCnt - 11) * 55/2)) )) {
                if(this.tileArr[parseInt(i / 9)][i % 9] == this.const.TILE_WOOD) {
                    break
                }
                if(this.tileArr[parseInt(i / 9)][i % 9] == this.const.TILE_CHOCOBLOCK_ITEM) {
                    break
                }
                if(this.tileArr[parseInt(i / 9)][i % 9] == this.const.EMPTY_TILE) {
                    break
                }
                
                var m_block
                for(var j = 0;j < this.ice_nodes.length;j++) {
                  if(this.ice_nodes[j].x == parseInt(i / 9) && this.ice_nodes[j].y==i % 9) {
                    m_block = this.ice_nodes[j].ice
                    break
                  }
                }
                if(m_block) {
                    break
                }
                this.startTileIdx = i
                this.startPos = {x:pos.x, y:pos.y}
                break
            }
        }
        if(this.usingRandomColor != 0) {
          if(this.startTileIdx == -1) return;
          var me = this
          me.usingRandomColor = 0
          me.playerInfo.randomColor--
          me.savePlayerInfo()
          me.refreshBoosterItem(6)
          me.setBoosterItemLock(6,false)

          me.ocupied = false;
          me.checkGameStatus()
          
          var pos = this.startTileIdx
          var circle_node = new cc.Node('Circle')
          var spri = circle_node.addComponent(cc.Sprite)
          spri.spriteFrame = me.circleSprites;
          circle_node.parent = me.field
          circle_node.position = me.field.children[parseInt(pos/9) * 9 + pos%9].position
          circle_node.scale = 0.3
          circle_node.active = false
          cc.loader.loadRes("JellyGarden/Textures/menu/boosts_items/random_color_item", function (err, data) {
            if (err) {
                return;
            }
            function playCircle() {
              circle_node.runAction(cc.sequence(cc.scaleTo(0.15,1),cc.callFunc(()=>{
                circle_node.removeFromParent(true)
              })))
            }
            var _callfunc = cc.callFunc(()=>{
              me.playBombParticle(parseInt(pos/9),pos%9 , 50)
            })
            var _callCirclefunc = cc.callFunc(()=>{
              circle_node.active = true
              playCircle()
              for(var i = -1;i <= 1;i++) {
                for(var j = -1; j <= 1;j++) {
                  var px = parseInt(pos/9) + i,py = (pos % 9) + j
                  if(px>=0 && px < me.rowCnt && py < me.colCnt && py>=0) {
                    var normalItems = [5,9,13,17,1,24]
                    var flag=false
                    for(var k=0;k<6;k++) {
                      if(normalItems[k] == me.tileArr[px][py]) {
                        flag = true
                        break
                      }
                    }
                    if(flag == true) {
                      me.tileArr[px][py] = normalItems[parseInt(Math.random() * 100) % 6]
                    }
                  }
                }
              }
              var result = me.checkBoard()
              me.refreshBoard()
              if(result.success == true) {
                  me.ocupied = true
                  me.exploidTiles(result.data, function() {
                      me.genEffectTiles(result.data,function(gened_pos,gened_item) {
                          me.fillTiles(result.data,gened_pos,gened_item,function() {
                              me.backupGameBoard()
                          })
                      })
                  })
              }
            })
            var block_node = new cc.Node('RANDOM_COLOR')
            var sp = block_node.addComponent(cc.Sprite)
            sp.spriteFrame = new cc.SpriteFrame();
            sp.spriteFrame._refreshTexture(data);
            block_node.parent = me.field
            block_node.scale = 0.8
            block_node.position = me.field.children[parseInt(pos/9) * 9 + pos%9].position
            block_node.runAction(cc.spawn(cc.sequence(cc.scaleTo(0.3,0.5), cc.scaleTo(0.2,0)),cc.sequence(cc.delayTime(0.25),_callfunc,cc.delayTime(0.2),_callCirclefunc)))
          });
          me.startTileIdx = me.const.NONE_TILE
        } else if(this.usingBomb != 0) {

          if(this.startTileIdx == -1) return;
           var me = this
           var pos = this.startTileIdx
           if(me.tileArr[parseInt(pos/9)][pos%9] == me.const.TILE_INGREDIENT2 || me.tileArr[parseInt(pos/9)][pos%9] == me.const.TILE_INGREDIENT1 || 
            me.tileArr[parseInt(pos/9)][pos%9] == me.const.TILE_CHOCOBLOCK_ITEM || me.tileArr[parseInt(pos/9)][pos%9] == me.const.TILE_WOOD)
            return;
          me.usingBomb = 0
          me.playerInfo.bomb--
          me.savePlayerInfo()
          me.refreshBoosterItem(7)
          me.setBoosterItemLock(7,false)
          cc.loader.loadRes("JellyGarden/Textures/menu/boosts_items/bomb_02", function (err, data) {
            if (err) {
                return;
            }
            var tile_color
            switch(me.tileArr[parseInt(pos/9)][pos%9]) {
                case me.const.TILE_ITEM_RED:
                case me.const.TILE_ITEM_RED_EXT:
                case me.const.TILE_ITEM_RED_HORIZ:
                case me.const.TILE_ITEM_RED_VERT:
                    tile_color = me.const.COLOR_RED
                break
                case me.const.TILE_ITEM_ORANGE:
                case me.const.TILE_ITEM_ORANGE_EXT:
                case me.const.TILE_ITEM_ORANGE_HORIZ:
                case me.const.TILE_ITEM_ORANGE_VERT:
                    tile_color = me.const.COLOR_ORANGE
                break
                case me.const.TILE_ITEM_DARK_PINK:
                case me.const.TILE_ITEM_DARK_PINK_EXT:
                case me.const.TILE_ITEM_DARK_PINK_HORIZ:
                case me.const.TILE_ITEM_DARK_PINK_VERT:
                    tile_color = me.const.COLOR_DARKPINK
                break
                case me.const.TILE_ITEM_BLUE:
                case me.const.TILE_ITEM_BLUE_EXT:
                case me.const.TILE_ITEM_BLUE_HORIZ:
                case me.const.TILE_ITEM_BLUE_VERT:
                    tile_color = me.const.COLOR_BLUE
                break
                case me.const.TILE_ITEM_GREEN:
                case me.const.TILE_ITEM_GREEN_EXT:
                case me.const.TILE_ITEM_GREEN_HORIZ:
                case me.const.TILE_ITEM_GREEN_VERT:
                    tile_color = me.const.COLOR_GREEN
                break
                case me.const.TILE_ITEM_YELLOW:
                case me.const.TILE_ITEM_YELLOW_EXT:
                case me.const.TILE_ITEM_YELLOW_HORIZ:
                case me.const.TILE_ITEM_YELLOW_VERT:
                    tile_color = me.const.COLOR_YELLOW
                break
            }
            
            var _callfunc = cc.callFunc(()=>{
              me.playBombParticle(parseInt(pos/9),pos%9 , 50,tile_color)
              var ret = [],matrix=[]
              matrix[0]=[];matrix[0][0] = 1
              ret.push({'x': parseInt(pos/9),'y': pos%9,'rowCnt': 1,'colCnt': 1,'matrix': matrix})
              me.ocupied = true
              me.exploidTiles(ret, function() {
                  me.genEffectTiles(ret,function(gened_pos,gened_item) {
                      me.fillTiles(ret,gened_pos,gened_item,function() {
                          me.backupGameBoard()
                      })
                  })
              })
            })
            
            var block_node = new cc.Node('BOMB')
            var sp = block_node.addComponent(cc.Sprite)
            sp.spriteFrame = new cc.SpriteFrame();
            sp.spriteFrame._refreshTexture(data);
            block_node.parent = me.field
            block_node.position = me.field.children[parseInt(pos/9) * 9 + pos%9].position
            var scale2zero = cc.sequence(cc.scaleTo(0.3,0.5),_callfunc,cc.scaleTo(0.2,0))
            block_node.runAction(scale2zero)
          });
          me.startTileIdx = me.const.NONE_TILE
        }
    },

    checkNormalTile(x,y,tile) {
      var normalItems = [5,9,13,17,1,24]
      var flag=false
      for(var i=0;i<6;i++) {
        if(normalItems[i] == tile)
          flag = true
      }
      if(flag == true) {
        for(var i = 0;i < this.ice_nodes.length;i++) {
          if(this.ice_nodes[i].x == x && this.ice_nodes[i].y==y) {
            return false
          }
        }
        var m_block1; 
        if(this.field.children.length > x*9+y)
            m_block1 = this.field.children[x * 9 + y].getChildByName('Block1')
        var m_block2; 
        if(this.field.children.length > x*9+y)
            m_block2 = this.field.children[x * 9 + y].getChildByName('Block2')
        if(m_block1 != null || m_block2 != null) {
          return false
        }
        return true
      }
      return false
    },

    makeChocoTile : function() {
      var makeFlag = false
      if(this.chocoCnt > this.choco_nodes.length) {
        this.chocoCnt = this.choco_nodes.length
        return null
      }
      for(var i = 0;i < this.rowCnt;i++) {
        for(var j = 0; j < this.colCnt;j++) {
          if(this.tileArr[i][j] == this.const.TILE_CHOCOBLOCK_ITEM) {
            if(i-1 >= 0 && this.checkNormalTile(i-1,j,this.tileArr[i-1][j])) {
              return {'x': i - 1,'y':j}
            }
            if(i+1 < this.rowCnt && this.checkNormalTile(i+1,j,this.tileArr[i+1][j])) {
              return {'x': i + 1,'y':j}
            }
          }
        }
      }
      for(var i = 0;i < this.colCnt;i++) {
        for(var j = 0; j < this.rowCnt;j++) {
          if(this.tileArr[j][i] == this.const.TILE_CHOCOBLOCK_ITEM) {
            if(j-1 >= 0 && this.checkNormalTile(j-1,i,this.tileArr[j-1][i])) {
              return {'x': j - 1,'y':i}
            }
            if(j+1 < this.rowCnt && this.checkNormalTile(j+1,i,this.tileArr[j+1][i])) {
              return {'x': j+1,'y':i}
            }
          }
        }
      }
      return null
    },

    showSpecialTile(x,y,type) {
      if(type == this.const.ITEM_CHOCO) {
        this.tileArr[x][y] = this.const.TILE_CHOCOBLOCK_ITEM
        var block_node = new cc.Node('CHOCO_BLOCK')
        var sp = block_node.addComponent(cc.Sprite)
        sp.spriteFrame = this.item_block[4]
        block_node.parent = this.field
        block_node.width = 55
        block_node.height = 55
        block_node.scale = 0.2
        block_node.position = cc.v2(this.field.children[x * 9 + y].position.x,this.field.children[x * 9 + y].position.y)
        block_node.runAction(cc.scaleTo(0.3,1))
        this.choco_nodes.push({'x': x,'y':y,'choco':block_node})
        this.chocoCnt++
        this.hideTile(x,y)
      }
    },

    getRandomTime : function () {
        var t = Math.random() * 2;
        while (t < 1 || t > 1.5) {
            t = Math.random() * 2;
        }

        return t;
    },

    playAnim : function (block,isfall,isfirst) {
        var moveList = [];
        var rotateList = [];
        var animCount = 6;
        var targetPos
        var me = this
        var _callfunc = cc.callFunc(()=>{block.removeFromParent(true);
            if(!isfall) {
                if(isfirst == true) {
                 me.item1Cnt--; 
                 if(me.item1Cnt < 0)
                    me.item1Cnt = 0
                }
                 else {
                 me.item2Cnt--;
                 if(me.item2Cnt < 0)
                    me.item2Cnt = 0
                 }
                me.showTargetLabelString(me.item1Cnt,me.item2Cnt)
            }
        })
        if(!isfall) {
            var targetNode
            if(block.name == "Block1") {
                targetNode = this.field.getChildByName("block")
                me.item1Cnt = me.item1Cnt - 1
                if(me.item1Cnt < 0)
                    me.item1Cnt = 0
            }
            else {
                if(isfirst) {
                    targetNode = this.field.getChildByName("ingredient_01")
                }
                else {
                    targetNode = this.field.getChildByName("ingredient_02")
                }
            }
            targetPos = cc.v2(targetNode.position.x + (this.colCnt - 9) * 55 / 2, targetNode.position.y + (this.rowCnt - 11) * 55/2 - 8)
            var t = this.getRandomTime();
            var a = targetPos.y - block.y;
            var b = (a * Math.pow(t, 2) - a) / t;// * 15;
            moveList = [];
            rotateList = [];
            for (var j = 1; j <= animCount; j++) {
                var stepX = (targetPos.x - block.x) / animCount * j;
                var stepY = a * Math.pow(t / animCount * j, 2) - b * (t / animCount * j);
                moveList.push(cc.moveTo(t / animCount, cc.v2(block.x + stepX, block.y + stepY)));
                if (j % 3 == 0) {
                    rotateList.push(cc.rotateBy(t / animCount * 3, 360));
                }
            }
            block.runAction(cc.sequence(cc.spawn(cc.sequence(moveList), cc.sequence(rotateList)),_callfunc));
        } else {
            block.zIndex = 2
            var t = this.getRandomTime();
            targetPos = cc.v2(block.x + 50, -700);
            var a = targetPos.y - block.y;
            var b = (a * Math.pow(t, 2) - a) / t;// * 15;
            moveList = [];
            rotateList = [];
            for (var j = 1; j <= animCount; j++) {
                var stepX = (targetPos.x - block.x) / animCount * j;
                var stepY = a * Math.pow(t / animCount * j, 2) - b * (t / animCount * j);
                moveList.push(cc.moveTo(t / animCount, cc.v2(block.x + stepX, block.y + stepY)));
                if (j % 3 == 0) {
                    rotateList.push(cc.rotateBy(t / animCount * 3, 360));
                }
            }

            block.runAction(cc.sequence(cc.spawn(cc.sequence(moveList), cc.sequence(rotateList)),_callfunc));
        }
        
    },

    touchEndListener(event) {
        this.startTileIdx = this.const.NONE_TILE
    },

     touchMovedListener(event) {
        if(this.ocupied)
            return
        var endPos = event.touch._point
        var endTileIdx
        if(this.startTileIdx != this.const.NONE_TILE) {
            if(endPos.x - this.startPos.x > 15) {
                if((this.startTileIdx + 1) % 9 != this.colCnt % 9 && this.tileArr[parseInt((this.startTileIdx + 1) / 9)][(this.startTileIdx + 1) % 9] != -1) {
                    if(this.tileArr[parseInt((this.startTileIdx + 1) / 9)][(this.startTileIdx + 1) % 9] == this.const.TILE_WOOD || 
                        this.tileArr[parseInt((this.startTileIdx + 1) / 9)][(this.startTileIdx + 1) % 9] == this.const.EMPTY_TILE || 
                        this.tileArr[parseInt((this.startTileIdx + 1) / 9)][(this.startTileIdx + 1) % 9] == this.const.TILE_CHOCOBLOCK_ITEM) {
                        this.startTileIdx = this.const.NONE_TILE
                        return
                    }
                    var m_block
                    for(var i = 0;i < this.ice_nodes.length;i++) {
                      if(this.ice_nodes[i].x == parseInt((this.startTileIdx + 1) / 9) && this.ice_nodes[i].y==(this.startTileIdx + 1) % 9) {
                        m_block = this.ice_nodes[i].ice
                        break
                      }
                    }
                    if(m_block) {
                        this.startTileIdx = this.const.NONE_TILE
                        return
                    }
                    this.ocupied = true
                    this.backupGameBoard()
                    var tmp = this.tileArr[parseInt(this.startTileIdx / 9)][this.startTileIdx % 9]
                    this.tileArr[parseInt(this.startTileIdx / 9)][this.startTileIdx % 9] = this.tileArr[parseInt((this.startTileIdx + 1) / 9)][(this.startTileIdx + 1) % 9]
                    this.tileArr[parseInt((this.startTileIdx + 1) / 9)][(this.startTileIdx + 1) % 9] = tmp
                    var result = this.checkBoard()
                    this.swapCandy(this.startTileIdx,this.startTileIdx + 1,result.data)
                }
                this.startTileIdx = this.const.NONE_TILE
            }
            else if(endPos.x - this.startPos.x < -15) {
                if(this.startTileIdx - 1 >= 0 && (this.startTileIdx) % 9 != 0 && this.tileArr[parseInt((this.startTileIdx - 1) / 9)][(this.startTileIdx - 1) % 9] != -1) {
                    if(this.tileArr[parseInt((this.startTileIdx - 1) / 9)][(this.startTileIdx - 1) % 9] == this.const.TILE_WOOD || 
                        this.tileArr[parseInt((this.startTileIdx - 1) / 9)][(this.startTileIdx - 1) % 9] == this.const.EMPTY_TILE || 
                        this.tileArr[parseInt((this.startTileIdx - 1) / 9)][(this.startTileIdx - 1) % 9] == this.const.TILE_CHOCOBLOCK_ITEM) {
                        this.startTileIdx = this.const.NONE_TILE
                        return
                    }
                    var m_block
                    for(var i = 0;i < this.ice_nodes.length;i++) {
                      if(this.ice_nodes[i].x == parseInt((this.startTileIdx - 1) / 9) && this.ice_nodes[i].y==(this.startTileIdx - 1) % 9) {
                        m_block = this.ice_nodes[i].ice
                        break
                      }
                    }
                    if(m_block) {
                        this.startTileIdx = this.const.NONE_TILE
                        return
                    }
                    this.ocupied = true
                    this.backupGameBoard()
                    var tmp = this.tileArr[parseInt(this.startTileIdx / 9)][this.startTileIdx % 9]
                    this.tileArr[parseInt(this.startTileIdx / 9)][this.startTileIdx % 9] = this.tileArr[parseInt((this.startTileIdx - 1) / 9)][(this.startTileIdx - 1) % 9]
                    this.tileArr[parseInt((this.startTileIdx - 1) / 9)][(this.startTileIdx - 1) % 9] = tmp
                    var result = this.checkBoard()
                    this.swapCandy(this.startTileIdx,this.startTileIdx - 1,result.data)
                }
                this.startTileIdx = this.const.NONE_TILE
            }
            else
            if(endPos.y - this.startPos.y > 15) {
                if(this.startTileIdx - 9 >= 0 && this.tileArr[parseInt((this.startTileIdx - 9) / 9)][(this.startTileIdx - 9) % 9] != -1) {
                    if(this.tileArr[parseInt((this.startTileIdx - 9) / 9)][(this.startTileIdx - 9) % 9] == this.const.TILE_WOOD || 
                        this.tileArr[parseInt((this.startTileIdx - 9) / 9)][(this.startTileIdx - 9) % 9] == this.const.EMPTY_TILE || 
                        this.tileArr[parseInt((this.startTileIdx - 9) / 9)][(this.startTileIdx - 9) % 9] == this.const.TILE_CHOCOBLOCK_ITEM) {
                        this.startTileIdx = this.const.NONE_TILE
                        return
                    }
                    var m_block
                    for(var i = 0;i < this.ice_nodes.length;i++) {
                      if(this.ice_nodes[i].x == parseInt((this.startTileIdx - 9) / 9) && this.ice_nodes[i].y==(this.startTileIdx - 9) % 9) {
                        m_block = this.ice_nodes[i].ice
                        break
                      }
                    }
                    if(m_block) {
                        this.startTileIdx = this.const.NONE_TILE
                        return
                    }
                    this.ocupied = true
                    this.backupGameBoard()
                    var tmp = this.tileArr[parseInt(this.startTileIdx / 9)][this.startTileIdx % 9]
                    this.tileArr[parseInt(this.startTileIdx / 9)][this.startTileIdx % 9] = this.tileArr[parseInt((this.startTileIdx - 9) / 9)][(this.startTileIdx - 9) % 9]
                    this.tileArr[parseInt((this.startTileIdx - 9) / 9)][(this.startTileIdx - 9) % 9] = tmp
                    var result = this.checkBoard()
                    this.swapCandy(this.startTileIdx,this.startTileIdx - 9,result.data)
                }
                this.startTileIdx = this.const.NONE_TILE
            }
            else if(endPos.y - this.startPos.y < -15) {
                if(this.startTileIdx + 9 < this.rowCnt * 9 && this.tileArr[parseInt((this.startTileIdx + 9) / 9)][(this.startTileIdx + 9) % 9] != -1){
                    if(this.tileArr[parseInt((this.startTileIdx + 9) / 9)][(this.startTileIdx + 9) % 9] == this.const.TILE_WOOD || 
                        this.tileArr[parseInt((this.startTileIdx + 9) / 9)][(this.startTileIdx + 9) % 9] == this.const.EMPTY_TILE || 
                        this.tileArr[parseInt((this.startTileIdx + 9) / 9)][(this.startTileIdx + 9) % 9] == this.const.TILE_CHOCOBLOCK_ITEM) {
                        this.startTileIdx = this.const.NONE_TILE
                        return
                    }
                    var m_block
                    for(var i = 0;i < this.ice_nodes.length;i++) {
                      if(this.ice_nodes[i].x == parseInt((this.startTileIdx + 9) / 9) && this.ice_nodes[i].y==(this.startTileIdx + 9) % 9) {
                        m_block = this.ice_nodes[i].ice
                        break
                      }
                    }
                    if(m_block) {
                        this.startTileIdx = this.const.NONE_TILE
                        return
                    }
                    this.ocupied = true
                    this.backupGameBoard()
                    var tmp = this.tileArr[parseInt(this.startTileIdx / 9)][this.startTileIdx % 9]
                    this.tileArr[parseInt(this.startTileIdx / 9)][this.startTileIdx % 9] = this.tileArr[parseInt((this.startTileIdx + 9) / 9)][(this.startTileIdx + 9) % 9]
                    this.tileArr[parseInt((this.startTileIdx + 9) / 9)][(this.startTileIdx + 9) % 9] = tmp
                    var result = this.checkBoard()
                    this.swapCandy(this.startTileIdx,this.startTileIdx + 9,result.data)
                }
                this.startTileIdx = this.const.NONE_TILE
            }
        }
    },

    initField(mode,target1,target2) {
        var rndIdxs = [1,5,9,13,17,24]
        //this.loadLevel(0)
        var squareArray = this.field.children
        var ingredientCnt1 = 0,ingredientCnt2 = 0
        for(var l = 0; l < this.rowCnt * this.colCnt;l++) {
            var squre = squareArray[parseInt(l / this.colCnt) * 9 + l % this.colCnt]
            var j = l % this.colCnt
            var i = parseInt(l / this.colCnt)
            var item = squre.getChildByName('Item')
            for(var k = 0;k < item.children.length;k++) {
                item.children[k].width = 45
                item.children[k].height = 45
                item.children[k].position = cc.v2(-2 , 0)
                item.children[k].active = false
            }
            if(this.itemInfo[i][j] == this.const.ITEM_WOOD || this.itemInfo[i][j] == this.const.ITEM_CHOCO || this.itemInfo[i][j] == this.const.ITEM_NORMAL || this.itemInfo[i][j] == this.const.ITEM_ICE_BLOCK1 || this.itemInfo[i][j] == this.const.ITEM_ICE || this.itemInfo[i][j] == this.const.ITEM_BLOCK2 || this.itemInfo[i][j] == this.const.ITEM_BLOCK1) {
                if(this.itemInfo[i][j] == this.const.ITEM_WOOD) {
                    this.tileArr[i][j] = this.const.TILE_WOOD
                    var block_node = new cc.Node('WOOD')
                    var sp = block_node.addComponent(cc.Sprite)
                    sp.spriteFrame = this.item_block[3]
                    block_node.parent = this.field
                    block_node.width = 55
                    block_node.height = 55
                    block_node.position = cc.v2(this.field.children[i * 9 + j].position.x,this.field.children[i * 9 + j].position.y)
                    this.wood_nodes.push({'x': i,'y':j,'wood':block_node})
                    this.hideTile(i,j)
                    continue
                }
                if(this.itemInfo[i][j] == this.const.ITEM_CHOCO) {
                    this.tileArr[i][j] = this.const.TILE_CHOCOBLOCK_ITEM
                    var block_node = new cc.Node('CHOCO_BLOCK')
                    var sp = block_node.addComponent(cc.Sprite)
                    sp.spriteFrame = this.item_block[4]
                    block_node.parent = this.field
                    block_node.width = 55
                    block_node.height = 55
                    block_node.position = cc.v2(this.field.children[i * 9 + j].position.x,this.field.children[i * 9 + j].position.y)
                    this.choco_nodes.push({'x': i,'y':j,'choco':block_node})
                    this.hideTile(i,j)
                    this.chocoCnt++
                    continue
                }
                if(this.itemInfo[i][j] == this.const.ITEM_ICE) {
                    var block_node = new cc.Node('ICE')
                    var sp = block_node.addComponent(cc.Sprite)
                    sp.spriteFrame = this.item_block[2]
                    block_node.parent = this.field
                    block_node.width = 55
                    block_node.height = 55
                    block_node.position = cc.v2(this.field.children[i * 9 + j].position.x,this.field.children[i * 9 + j].position.y)
                    block_node.zIndex = 2
                    //item.zIndex = 1
                    this.ice_nodes.push({'x': i,'y':j,'ice':block_node})
                }
                if(this.itemInfo[i][j] == this.const.ITEM_BLOCK2) {
                    var block_node = new cc.Node('Block1')
                    var sp = block_node.addComponent(cc.Sprite)
                    sp.spriteFrame = this.item_block[0]
                    block_node.parent = squre
                    block_node.width = 55
                    block_node.height = 55
                    block_node.position = cc.v2(0 , 0)

                    var block_node = new cc.Node('Block2')
                    var sp = block_node.addComponent(cc.Sprite)
                    sp.spriteFrame = this.item_block[1]
                    block_node.parent = squre
                    block_node.width = 55
                    block_node.height = 55
                    block_node.position = cc.v2(0 , 0)
                    item.zIndex = 1
                }
                if(this.itemInfo[i][j] == this.const.ITEM_BLOCK1) {
                    var block_node = new cc.Node('Block1')
                    var sp = block_node.addComponent(cc.Sprite)
                    sp.spriteFrame = this.item_block[0]
                    block_node.parent = squre
                    block_node.width = 55
                    block_node.height = 55
                    block_node.position = cc.v2(0 , 0)
                    block_node.zIndex = 1
                    item.zIndex = 2
                }
                if(this.itemInfo[i][j] == this.const.ITEM_ICE_BLOCK1) {
                    var ice_node = new cc.Node('Block1')
                    var sp = ice_node.addComponent(cc.Sprite)
                    sp.spriteFrame = this.item_block[0]
                    ice_node.parent = squre
                    ice_node.width = 55
                    ice_node.height = 55
                    ice_node.position = cc.v2(0 , 0)

                    var block_node = new cc.Node('ICE')
                    var sp = block_node.addComponent(cc.Sprite)
                    sp.spriteFrame = this.item_block[2]
                    block_node.parent = this.field
                    block_node.width = 55
                    block_node.height = 55
                    block_node.position = cc.v2(this.field.children[i * 9 + j].position.x,this.field.children[i * 9 + j].position.y)
                    block_node.zIndex = 2
                    //item.zIndex = 1
                    this.ice_nodes.push({'x': i,'y':j,'ice':block_node})
                }

                var randIdx = parseInt(Math.random() * 5)
                if(j >= 2) {
                    if(this.tileArr[i][j - 2] == this.tileArr[i][j - 1] && this.tileArr[i][j - 1] == rndIdxs[randIdx]) {
                        randIdx = (randIdx + 1) % 6
                    }
                }
                if(i >= 2) {
                    if(this.tileArr[i - 2][j] == this.tileArr[i - 1][j] && this.tileArr[i - 1][j] == rndIdxs[randIdx]) {
                        randIdx = (randIdx + 1) % 6
                    }
                }
                if(mode == 2) {
                    var ingredient = parseInt(Math.random() * 100) % 10
                    if(ingredient == 0 && ingredientCnt1 < target1.count) {
                        ingredientCnt1++
                        var ingre_node = new cc.Node('ingredient1')
                        var sp = ingre_node.addComponent(cc.Sprite)
                        sp.spriteFrame = this.item_ingredients[0]
                        ingre_node.parent = squre
                        ingre_node.width = 45
                        ingre_node.height = 45
                        ingre_node.position = cc.v2(0 , 0)
                        this.tileArr[i][j] = this.const.TILE_INGREDIENT1
                    } else if(ingredient == 1 && ingredientCnt2 < target2.count) {
                        ingredientCnt2++
                        var ingre_node = new cc.Node('ingredient2')
                        var sp = ingre_node.addComponent(cc.Sprite)
                        sp.spriteFrame = this.item_ingredients[1]
                        ingre_node.parent = squre
                        ingre_node.width = 45
                        ingre_node.height = 45
                        ingre_node.position = cc.v2(0 , 0)
                        this.tileArr[i][j] = this.const.TILE_INGREDIENT2
                    }
                    else {
                        item.children[rndIdxs[randIdx]].active = true
                        this.tileArr[i][j] = rndIdxs[randIdx]
                    }
                } else {
                    item.children[rndIdxs[randIdx]].active = true
                    this.tileArr[i][j] = rndIdxs[randIdx]
                }
                squre.active = true
            }
            else if(this.itemInfo[i][j] == 0) {
                squre.active = false
                this.tileArr[i][j] = this.const.NONE_TILE
            }
        }
        
        for(var i = 0; i < this.rowCnt;i++) {
            for(var j = 0; j < 9 - this.colCnt;j++) {
                var squre = squareArray[i * 9 + j + this.colCnt]
                squre.active = false
            }
        }
        for(var i = this.rowCnt * 9; i < squareArray.length;i++) {
            if(i > 99)
                break
            var squre = squareArray[i]
            squre.active = false
        }
        for(var l = 0; l < this.rowCnt * this.colCnt;l++) {
            var squre = squareArray[parseInt(l / this.colCnt) * 9 + l % this.colCnt]
            var j = l % this.colCnt
            var i = parseInt(l / this.colCnt)
            if(this.itemInfo[i][j] != 0) {
                if(!squre._touchListener) {
                    squre.on(cc.Node.EventType.TOUCH_START,this.touchStartListener,this);
                    squre.on(cc.Node.EventType.TOUCH_MOVE,this.touchMovedListener,this);
                    squre.on(cc.Node.EventType.TOUCH_END,this.touchEndListener,this);
                }
            }
        }
    },
/*
    comment
*/
    showTile(x,y,tile_type,act,callback) {
        if(tile_type == this.const.NONE_TILE)
            return
        var squareArray = this.field.children
        if(squareArray[x * 9 + y].children == null) {
            return
        }
        var items = squareArray[x * 9 + y].getChildByName('Item').children
        for(var i = 0;i < items.length;i++) {
            items[i].active = false
        }
        if(tile_type == this.const.TILE_WOOD || tile_type == this.const.TILE_CHOCOBLOCK_ITEM)
            return
        if(tile_type == this.const.TILE_INGREDIENT1 || tile_type == this.const.TILE_INGREDIENT2) {
            if(tile_type == this.const.TILE_INGREDIENT1) {
                var ing = squareArray[x * 9 + y].getChildByName('ingredient1')
                if(ing) ing.active = true
                else {
                    var ingre_node = new cc.Node('ingredient1')
                    var sp = ingre_node.addComponent(cc.Sprite)
                    sp.spriteFrame = this.item_ingredients[0]
                    ingre_node.parent = squareArray[x * 9 + y]
                    ingre_node.width = 45
                    ingre_node.height = 45
                    ingre_node.position = cc.v2(0 , 0)
                }
            }
            else {
                var ing = squareArray[x * 9 + y].getChildByName('ingredient2')
                if(ing) ing.active = true
                else {
                    var ingre_node = new cc.Node('ingredient2')
                    var sp = ingre_node.addComponent(cc.Sprite)
                    sp.spriteFrame = this.item_ingredients[1]
                    ingre_node.parent = squareArray[x * 9 + y]
                    ingre_node.width = 45
                    ingre_node.height = 45
                    ingre_node.position = cc.v2(0 , 0)
                }
            }
            return
        }
        items[tile_type].active = true
        items[tile_type].width = 45
        items[tile_type].height = 45
        items[tile_type].position = cc.v2(-2,0)
        this.tileArr[x][y] = tile_type
        if(act) {//show animation if there is effect tile
            var squashAction = cc.scaleTo(0.15, 0.1, 0.1);
            var scale2sBigAction = cc.scaleTo(0.15, 0.9, 0.9);
            var scaleWithXY1 = cc.scaleTo(0.15, 1.1, 0.75);
            var scaleWithXY2 = cc.scaleTo(0.15, 0.75, 1.1);
            var scaleBackAction = cc.scaleTo(0.15, 0.9, 0.9);
            var _callfunc = cc.callFunc(()=>{
                if(callback) callback({'x':x,'y':y})
            })
            items[tile_type].runAction(cc.sequence(squashAction,scale2sBigAction,_callfunc,scaleWithXY1,scaleBackAction))
        }
    },

    refreshBoard() {
        for(var i = 0;i < this.rowCnt;i++) {
            for(var j = 0;j < this.colCnt;j++) {
                if(this.tileArr[i][j] != this.const.NONE_TILE && this.tileArr[i][j] != this.const.EMPTY_TILE)
                this.showTile(i,j,this.tileArr[i][j])
            }
        }
    },

    hideTile(x,y) {
        if(this.tileArr[x][y] == this.const.NONE_TILE)
            return
        var squareArray = this.field.children

        var items = squareArray[x * 9 + y].getChildByName('Item').children
        for(var i = 0;i < items.length;i++) {
            items[i].active = false
        }
        var ing1 = squareArray[x * 9 + y].getChildByName('ingredient1')
        var ing2 = squareArray[x * 9 + y].getChildByName('ingredient2')
        if(ing1)
            ing1.removeFromParent(true)
        if(ing2)
            ing2.removeFromParent(true)
    },

    backupGameBoard() {
        for(var i = 0;i < this.const.STATIC_ROW_COUNT;i++) {
            for(var j = 0;j < this.const.STATIC_COL_COUNT;j++) {
                this.tileBeforeArr[i][j] = this.tileArr[i][j]
            }
        }
    },

    backupGameBoardBeforeSpecialItemExploid() {
        for(var i = 0;i < this.const.STATIC_ROW_COUNT;i++) {
            for(var j = 0;j < this.const.STATIC_COL_COUNT;j++) {
                this.tileBeforeSpitemExploidArray[i][j] = this.tileArr[i][j]
            }
        }
    },

    showMsg(msg_type) {
        this.ocupied = true
    	this.msgNodes[msg_type].node.active = true
    	this.msgNodes[msg_type].node.scale = 0.1
    	var scaleAc = cc.scaleTo(0.8, 1)
    	var _callfunc = cc.callFunc(()=>{
    		this.msgNodes[msg_type].node.active = false
            this.ocupied = false
    	})
    	this.msgNodes[msg_type].node.runAction(cc.sequence(scaleAc,cc.delayTime(0.2),_callfunc))
    },

    fillTilesUnderBlock(from,to) {
        var temp_nodes = []
        this.tileArr[to.x][to.y] = this.tileArr[from.x][from.y]
        this.tileArr[from.x][from.y] = this.const.EMPTY_TILE
        this.hideTile(from.x,from.y)
        this.hideTile(to.x,to.y)
        var node = new cc.Node('Sprite')
        var sp = node.addComponent(cc.Sprite)
        if(this.tileArr[to.x][to.y] != this.const.TILE_INGREDIENT1 && this.tileArr[to.x][to.y] != this.const.TILE_INGREDIENT2)
            sp.spriteFrame = this.tileSprites[this.tileArr[to.x][to.y]]
        else sp.spriteFrame = this.item_ingredients[this.tileArr[to.x][to.y] - 32]
        node.parent = this.field
        node.width = 45
        node.height = 45
        node.anchorY = 0
        node.zIndex = 1
        temp_nodes.push(node)
        node.position = cc.v2(this.field.children[from.x * 9 + from.y].position.x,this.field.children[from.x * 9 + from.y].position.y - 45 / 2)
        var targetpos = cc.v2(this.field.children[to.x * 9 + to.y].position.x, this.field.children[to.x * 9 + to.y].position.y - 45 / 2)
        var fallAc = cc.moveTo(0.2,targetpos)
        var squashAction = cc.scaleTo(0.2, 1.1, 0.9);
        var scaleBackAction = cc.scaleTo(0.1, 1, 1);
        var _this = this
        var fallCnt = 0
        var _calldiaFallfunc=cc.callFunc(()=>{
            for(var n = 0;n < temp_nodes.length;n++) {
                temp_nodes[n].removeFromParent(true)
            }
            _this.refreshBoard()
                
            for(var i = 0;i < _this.colCnt;i++) {
                var j = this.rowCnt - 1
                while(j >= 0) {
                    if(this.tileArr[j][i] != this.const.NONE_TILE && this.tileArr[j][i] == this.const.EMPTY_TILE) {
                        for(var k = j;k >= 0;k --) {
                            if(this.tileArr[k][i] == this.const.TILE_WOOD || this.tileArr[k][i] == this.const.TILE_CHOCOBLOCK_ITEM) {
                                j = k
                                break
                            }
                            else if(this.tileArr[k][i] != this.const.NONE_TILE && this.tileArr[k][i] != this.const.EMPTY_TILE) {
                                fallCnt++
                                break
                            }
                        }
                    }
                    j--
                }
                var block_Idx = this.rowCnt - 1
                for(j = this.rowCnt - 1;j >= 0;j--) {
                    if(this.tileArr[j][i] == this.const.TILE_WOOD||this.tileArr[j][i] == this.const.TILE_CHOCOBLOCK_ITEM) {
                        block_Idx = j
                    }
                }
                for(j = block_Idx;j >= 0;j--) {
                    if(this.tileArr[j][i] != this.const.NONE_TILE && this.tileArr[j][i] == this.const.EMPTY_TILE) {
                        fallCnt++
                    }
                }
            }
            if(fallCnt != 0) {
                this.fillTiles([])
            } else {
                
                var ret = _this.canFallDiagonics()
                if(ret.result == true) {
                    _this.fillTilesUnderBlock(ret.from,ret.to)
                }
                else {
                    var result = _this.checkBoard()
                    if(result.success == true) {
                        _this.comboCount++
                        _this.ocupied = true
                        _this.exploidTiles(result.data, function() {
                            _this.genEffectTiles(result.data,function(gened_pos,gened_item) {
                                _this.fillTiles(result.data,gened_pos,gened_item,function() {
                                    _this.backupGameBoard()
                                })
                            })
                        })
                    }
                    else {
                        var newChoco = _this.makeChocoTile()
                        if(newChoco != null) {
                          _this.showSpecialTile(newChoco.x,newChoco.y,_this.const.ITEM_CHOCO)
                        }
                        if(_this.limit <= 0) {
                            _this.doRemainsTiles(0,0,function() {
                                if(_this.currentScore < _this.levelInfo.stars.step1) {
                                    _this.levelFailure();
                                }
                                else {
                                    _this.levelSuccess();
                                }
                            })
                            return
                        }
                        if(_this.comboCount == 2) {
                            _this.showMsg(_this.const.MSG_GOOD)
                        } else
                        if(_this.comboCount >= 3 && _this.comboCount <= 4) {
                            _this.showMsg(_this.const.MSG_GREATE)
                        } else
                        if(_this.comboCount >= 5) {
                            _this.showMsg(_this.const.MSG_FANTASTIC)
                        } else
                            _this.ocupied = false
                        _this.comboCount = 0
                    }
                }
            }
        })
        node.runAction(cc.sequence(fallAc,squashAction,scaleBackAction,_calldiaFallfunc))  
    },

    canFallDiagonics() {
        for(var i = this.rowCnt-1;i>=0;i--) {
            for(var j = 0;j<this.colCnt;j++) {
                if(this.tileArr[i][j] == this.const.EMPTY_TILE) {
                    var checkFlag = false
                    for(var k = i - 1;k >= 0;k--) {
                        if(this.tileArr[k][j] == this.const.TILE_WOOD || this.tileArr[k][j] == this.const.TILE_CHOCOBLOCK_ITEM) {
                            checkFlag = true
                            break
                        }
                    }
                    if(checkFlag == true) {
                        if(i - 1>=0 && j - 1>=0) {
                            if(this.tileArr[i-1][j-1]!=this.const.EMPTY_TILE && this.tileArr[i-1][j-1]!=this.const.NONE_TILE && this.tileArr[i-1][j-1]!=this.const.TILE_WOOD &&this.tileArr[i-1][j-1]!=this.const.TILE_CHOCOBLOCK_ITEM) {
                                return {'result':true,'from':{'x': i-1,'y':j-1},'to': {'x': i,'y':j}}
                            }
                        }
                        if(i - 1>=0 && j + 1<=this.colCnt - 1) {
                            if(this.tileArr[i-1][j+1]!=this.const.EMPTY_TILE && this.tileArr[i-1][j+1]!=this.const.NONE_TILE && this.tileArr[i-1][j+1]!=this.const.TILE_WOOD &&this.tileArr[i-1][j+1]!=this.const.TILE_CHOCOBLOCK_ITEM) {
                                return {'result':true,'from':{'x': i-1,'y':j+1},'to': {'x': i,'y':j}}
                            }
                        }
                    }
                }
            }
        }
        return {'result':false}
    },

    fillTiles(data,genedpos,gened_item,callback) {
        this.ocupied = true
        var temp_nodes = []
            for(var i = 0;i < data.length;i++) {
                var x = data[i].x,y = data[i].y
                for(var j = 0;j < data[i].rowCnt;j++) {
                    for(var k = 0;k < data[i].colCnt;k++) {
                        var posX = x + j,posY = y + k
                        if(data[i].matrix[j][k] == 1) {
                            if(!genedpos) {
                                this.hideTile(posX,posY)
                                this.tileArr[posX][posY] = this.const.EMPTY_TILE
                            }
                            else {
                                    var gflag = false
                                    for(var m = 0;m < genedpos.length;m++) {
                                        if(posX == genedpos[m].x && posY == genedpos[m].y) {
                                            gflag = true
                                            break
                                         }
                                    }
                                    if(gflag == false) {
                                        this.hideTile(posX,posY)
                                        this.tileArr[posX][posY] = this.const.EMPTY_TILE
                                    }
                            }
                        }
                    }
                }
            }
            var filledCnt = 0,calledFilledCallback = 0
            var _this=this
            var fallCnt = 0,fallCallbackIdx = 0
            var _callFallfunc = cc.callFunc(()=>{
                fallCallbackIdx++
                if(fallCallbackIdx == fallCnt) {
                    _this.refreshBoard()
                    for(var n = 0;n < temp_nodes.length;n++) {
                        temp_nodes[n].removeFromParent(true)
                    }
                    var ret = _this.canFallDiagonics()
                    if(ret.result == true) {
                        _this.fillTilesUnderBlock(ret.from,ret.to)
                    } else {
                        var result = _this.checkBoard()
                        if(result.success == true) {
                            _this.comboCount++
                            _this.ocupied = true
                            _this.exploidTiles(result.data, function() {
                                _this.genEffectTiles(result.data,function(gened_pos,gened_item) {
                                    _this.fillTiles(result.data,gened_pos,gened_item,function() {
                                        _this.backupGameBoard()
                                    })
                                })
                            })
                        }
                        else {
                          var newChoco = _this.makeChocoTile()
                          if(newChoco != null) {
                            _this.showSpecialTile(newChoco.x,newChoco.y,_this.const.ITEM_CHOCO)
                          }
                            if(_this.limit <= 0) {
                                _this.doRemainsTiles(0,0,function() {
                                    if(_this.currentScore < _this.levelInfo.stars.step1) {
                                        _this.levelFailure();
                                    }
                                    else {
                                        _this.levelSuccess();
                                    }
                                })
                                return
                            }
                            if(_this.comboCount == 2) {
                                _this.showMsg(_this.const.MSG_GOOD)
                            } else
                            if(_this.comboCount >= 3 && _this.comboCount <= 4) {
                                _this.showMsg(_this.const.MSG_GREATE)
                            } else
                            if(_this.comboCount >= 5) {
                                _this.showMsg(_this.const.MSG_FANTASTIC)
                            } else
                                _this.ocupied = false
                            _this.comboCount = 0
                            if(callback) { // topstar_comment
                                callback()
                            }
                        }
                    }
                }
            })

            for(var i = 0;i < this.colCnt;i++) {
                var j = this.rowCnt - 1
                while(j >= 0) {
                    if(this.tileArr[j][i] != this.const.NONE_TILE && this.tileArr[j][i] == this.const.EMPTY_TILE) {
                        for(var k = j;k >= 0;k --) {
                            if(this.tileArr[k][i] == this.const.TILE_WOOD || this.tileArr[k][i] == this.const.TILE_CHOCOBLOCK_ITEM) {
                                j = k
                                break
                            }
                            else if(this.tileArr[k][i] != this.const.NONE_TILE && this.tileArr[k][i] != this.const.EMPTY_TILE) {
                                fallCnt++
                                this.tileArr[j][i] = this.tileArr[k][i]
                                this.tileArr[k][i] = this.const.EMPTY_TILE
                                var node = new cc.Node('Sprite')
                                var sp = node.addComponent(cc.Sprite)
                                if(this.tileArr[j][i] != this.const.TILE_INGREDIENT1 && this.tileArr[j][i] != this.const.TILE_INGREDIENT2)
                                    sp.spriteFrame = this.tileSprites[this.tileArr[j][i]]
                                else sp.spriteFrame = this.item_ingredients[this.tileArr[j][i] - 32]
                                node.parent = this.field
                                node.width = 45
                                node.height = 45
                                node.anchorY = 0
                                node.zIndex = 1
                                node.position = cc.v2(this.field.children[k * 9 + i].position.x,this.field.children[k * 9 + i].position.y - 45 / 2)
                                temp_nodes.push(node)

                                this.hideTile(k,i)
                                var targetpos = cc.v2(this.field.children[j * 9 + i].position.x, this.field.children[j * 9 + i].position.y - 45 / 2)
                                var fallAc = cc.moveTo(0.2,targetpos)
                                var squashAction = cc.scaleTo(0.2, 1.1, 0.9);
                                var scaleBackAction = cc.scaleTo(0.1, 1, 1);
                                node.runAction(cc.sequence(fallAc,squashAction,scaleBackAction,_callFallfunc))
                                break
                            }
                        }
                    }
                    j--
                }

                var block_Idx = this.rowCnt - 1
                for(j = this.rowCnt - 1;j >= 0;j--) {
                    if(this.tileArr[j][i] == this.const.TILE_WOOD||this.tileArr[j][i] == this.const.TILE_CHOCOBLOCK_ITEM) {
                        block_Idx = j
                    }
                }
                var filledCount = 0
                for(j = block_Idx;j >= 0;j--) {
                    if(this.tileArr[j][i] != this.const.NONE_TILE && this.tileArr[j][i] == this.const.EMPTY_TILE) {
                        filledCount++
                    }
                }
                if(filledCount != 0) {
                    for(j = block_Idx;j >= 0;j--) {
                        if(this.tileArr[j][i] != this.const.NONE_TILE && this.tileArr[j][i] == this.const.EMPTY_TILE) {
                            for(k = j;k >= 0;k --) {
                                if(this.tileArr[k][i] != this.const.NONE_TILE) {
                                    var rndIdxs = [1,5,9,13,17,24]
                                    var randIdx = parseInt(Math.random() * 5)
                                    this.tileArr[k][i] = rndIdxs[randIdx]
                                    var node = new cc.Node('Sprite')
                                    var sp = node.addComponent(cc.Sprite)
                                    if(this.tileArr[k][i] != this.const.TILE_INGREDIENT1 && this.tileArr[k][i] != this.const.TILE_INGREDIENT2)
                                        sp.spriteFrame = this.tileSprites[this.tileArr[k][i]]
                                    else sp.spriteFrame = this.item_ingredients[this.tileArr[k][i] - 32]
                                    node.parent = this.field
                                    node.width = 45
                                    node.height = 45
                                    node.anchorY = 0
                                    node.zIndex = 1
                                    node.position = cc.v2(this.field.children[k * 9 + i].position.x,this.field.children[k * 9 + i].position.y + 55 * filledCount - 45 / 2 + 300)
                                    temp_nodes.push(node)
                                    filledCnt++
                                    fallCnt++
                                    var _callfunc = cc.callFunc(()=>{
                                        calledFilledCallback++
                                        if(filledCnt == calledFilledCallback) {
                                            _this.refreshBoard()
                                            for(var n = 0;n < temp_nodes.length;n++) {
                                                temp_nodes[n].removeFromParent(true)
                                            }
                                            var ret = _this.canFallDiagonics()
                                            if(ret.result == true) {
                                                _this.fillTilesUnderBlock(ret.from,ret.to)
                                            } else {
                                                var result = _this.checkBoard()
                                                if(result.success == true) {
                                                    _this.comboCount++
                                                    _this.ocupied = true
                                                    _this.exploidTiles(result.data, function() {
                                                        _this.genEffectTiles(result.data,function(gened_pos,gened_item) {
                                                            _this.fillTiles(result.data,gened_pos,gened_item,function() {
                                                                _this.backupGameBoard()
                                                            })
                                                        })
                                                    })
                                                }
                                                else {
                                                  var newChoco = _this.makeChocoTile()
                                                  if(newChoco != null) {
                                                    _this.showSpecialTile(newChoco.x,newChoco.y,_this.const.ITEM_CHOCO)
                                                  }
                                                    if(_this.limit <= 0) {
                                                        _this.doRemainsTiles(0,0,function() {
                                                            if(_this.currentScore < _this.levelInfo.stars.step1) {
                                                                _this.levelFailure();
                                                            }
                                                            else {
                                                                _this.levelSuccess();
                                                            }
                                                        })
                                                        return
                                                    }
                                                    if(_this.comboCount == 2) {
                                                        _this.showMsg(_this.const.MSG_GOOD)
                                                    } else
                                                    if(_this.comboCount >= 3 && _this.comboCount <= 4) {
                                                        _this.showMsg(_this.const.MSG_GREATE)
                                                    } else
                                                    if(_this.comboCount >= 5) {
                                                        _this.showMsg(_this.const.MSG_FANTASTIC)
                                                    } else
                                                        _this.ocupied = false
                                                    _this.comboCount = 0
                                                    if(callback) { // topstar_comment
                                                        callback()
                                                    }
                                                }
                                            }
                                        }
                                    })
                                    var targetpos = cc.v2(this.field.children[k*9+i].position.x,this.field.children[k*9+i].position.y - 45 / 2)
                                    var squashAction = cc.scaleTo(0.2, 1.1, 0.9);
                                    var scaleBackAction = cc.scaleTo(0.1, 1, 1);
                                    var fallAc = cc.moveTo(0.2,targetpos)
                                    node.runAction(cc.sequence(fallAc,squashAction,scaleBackAction,_callfunc))  
                                }
                            }
                        }
                    }
                }
            }
            if(fallCnt == 0) {
                var ret = _this.canFallDiagonics()
                if(ret.result == true) {
                    _this.fillTilesUnderBlock(ret.from,ret.to)
                } else {
                    _this.refreshBoard()
                    for(var n = 0;n < temp_nodes.length;n++) {
                        temp_nodes[n].removeFromParent(true)
                    }
                
                    var result = _this.checkBoard()
                    if(result.success == true) {
                        _this.comboCount++
                        _this.ocupied = true
                        _this.exploidTiles(result.data, function() {
                            _this.genEffectTiles(result.data,function(gened_pos,gened_item) {
                                _this.fillTiles(result.data,gened_pos,gened_item,function() {
                                    _this.backupGameBoard()
                                })
                            })
                        })
                    }
                    else {
                        var newChoco = _this.makeChocoTile()
                        if(newChoco != null) {
                          _this.showSpecialTile(newChoco.x,newChoco.y,_this.const.ITEM_CHOCO)
                        }
                        if(_this.limit <= 0) {
                            _this.doRemainsTiles(0,0,function() {
                                if(_this.currentScore < _this.levelInfo.stars.step1) {
                                    _this.levelFailure();
                                }
                                else {
                                    _this.levelSuccess();
                                }
                            })
                            return
                        }
                        if(_this.comboCount == 2) {
                            _this.showMsg(_this.const.MSG_GOOD)
                        } else
                        if(_this.comboCount >= 3 && _this.comboCount <= 4) {
                            _this.showMsg(_this.const.MSG_GREATE)
                        } else
                        if(_this.comboCount >= 5) {
                            _this.showMsg(_this.const.MSG_FANTASTIC)
                        } else
                            _this.ocupied = false
                        _this.comboCount = 0
                        if(callback) {
                            callback()
                        }
                    }
                }
            }
    },

    genEffectTiles(data,callback) {
        var dataCount = 0
        var gPosArr = []
        for(var i = 0; i < data.length;i++) {
            var x = data[i].x,y = data[i].y
            var genedpos = {'x':-1,'y':-1}
            var neibourItem = -1
            for(var j = 0;j < data[i].rowCnt;j++) {
                for(var k = 0;k < data[i].colCnt;k++) {
                    var posX = x + j,posY = y + k
                    if(data[i].matrix[j][k] == 1) {
                        neibourItem = this.tileBeforeSpitemExploidArray[posX][posY]
                        if(this.tileBeforeSpitemExploidArray[posX][posY] != this.tileBeforeArr[posX][posY]) {
                            genedpos.x = posX
                            genedpos.y = posY
                            break
                        }
                    }
                }
                if(genedpos.x != -1 || genedpos.y != -1)
                    break
            }
            var reds=[this.const.TILE_ITEM_RED,this.const.TILE_ITEM_RED_EXT,this.const.TILE_ITEM_RED_HORIZ,this.const.TILE_ITEM_RED_VERT]
            var oranges=[this.const.TILE_ITEM_ORANGE,this.const.TILE_ITEM_ORANGE_EXT,this.const.TILE_ITEM_ORANGE_HORIZ,this.const.TILE_ITEM_ORANGE_VERT]
            var dark_pinks=[this.const.TILE_ITEM_DARK_PINK,this.const.TILE_ITEM_RDARK_PINK_EXT,this.const.TILE_ITEM_DARK_PINK_HORIZ,this.const.TILE_ITEM_DARK_PINK_VERT]
            var blues=[this.const.TILE_ITEM_BLUE,this.const.TILE_ITEM_BLUE_EXT,this.const.TILE_ITEM_BLUE_HORIZ,this.const.TILE_ITEM_BLUE_VERT]
            var greens=[this.const.TILE_ITEM_GREEN,this.const.TILE_ITEM_GREEN_EXT,this.const.TILE_ITEM_GREEN_HORIZ,this.const.TILE_ITEM_GREEN_VERT]
            var yellows=[this.const.TILE_ITEM_YELLOW,this.const.TILE_ITEM_YELLOW_EXT,this.const.TILE_ITEM_YELLOW_HORIZ,this.const.TILE_ITEM_YELLOW_VERT]
            var itemType = -1
            for(var j = 0;j < 4;j++) {
                if(reds[j] == neibourItem) {
                    itemType = this.const.COLOR_RED
                    break
                }
            }
            for(var j = 0;j < 4;j++) {
                if(oranges[j] == neibourItem) {
                    itemType = this.const.COLOR_ORANGE
                    break
                }
            }
            for(var j = 0;j < 4;j++) {
                if(dark_pinks[j] == neibourItem) {
                    itemType = this.const.COLOR_DARKPINK
                    break
                }
            }
            for(var j = 0;j < 4;j++) {
                if(blues[j] == neibourItem) {
                    itemType = this.const.COLOR_BLUE
                    break
                }
            }
            for(var j = 0;j < 4;j++) {
                if(greens[j] == neibourItem) {
                    itemType = this.const.COLOR_GREEN
                    break
                }
            }
            for(var j = 0;j < 4;j++) {
                if(yellows[j] == neibourItem) {
                    itemType = this.const.COLOR_YELLOW
                    break
                }
            }
            if(!(genedpos.x != -1 || genedpos.y != -1)) {
                for(var j = 0;j < data[i].rowCnt;j++) {
                    for(var k = 0;k < data[i].colCnt;k++) {
                        var posX = x + j,posY = y + k
                        if(data[i].matrix[j][k] == 1) {
                            genedpos.x = posX
                            genedpos.y = posY
                            break
                        }
                    }
                    break
                }
            }
            var _this = this
            if(data[i].rowCnt == this.rowCnt || data[i].colCnt == this.colCnt) {
                dataCount++
                if(dataCount == data.length)
                    if(callback) callback()
                continue
            }
            if(data[i].rowCnt + data[i].colCnt - 1 == 4) {
                gPosArr.push(genedpos)
                if(data[i].rowCnt == 1) {
                    if (itemType == this.const.COLOR_RED) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_RED_VERT,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_RED_VERT)})
                    } else if (itemType == this.const.COLOR_ORANGE) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_ORANGE_VERT,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_ORANGE_VERT)})
                    } else if (itemType == this.const.COLOR_DARKPINK) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_DARK_PINK_VERT,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_DARK_PINK_VERT)})
                    } else if (itemType == this.const.COLOR_BLUE) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_BLUE_VERT,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_BLUE_VERT)})
                    } else if (itemType == this.const.COLOR_GREEN) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_GREEN_VERT,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_GREEN_VERT)})
                    } else if (itemType == this.const.COLOR_YELLOW) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_YELLOW_VERT,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_YELLOW_VERT)})
                    }
                }
                else {
                    if (itemType == this.const.COLOR_RED) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_RED_HORIZ,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_RED_HORIZ)})
                    } else if (itemType == this.const.COLOR_ORANGE) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_ORANGE_HORIZ,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_ORANGE_HORIZ)})
                    } else if (itemType == this.const.COLOR_DARKPINK) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_DARK_PINK_HORIZ,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_DARK_PINK_HORIZ)})
                    } else if (itemType == this.const.COLOR_BLUE) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_BLUE_HORIZ,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_BLUE_HORIZ)})
                    } else if (itemType == this.const.COLOR_GREEN) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_GREEN_HORIZ,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_GREEN_HORIZ)})
                    } else if (itemType == this.const.COLOR_YELLOW) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_YELLOW_HORIZ,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_YELLOW_HORIZ)})
                    }
                }
            } else
            if(data[i].rowCnt + data[i].colCnt - 1 == 5) {
                gPosArr.push(genedpos)
                if(data[i].rowCnt == 1 || data[i].colCnt == 1) {
                    this.showTile(genedpos.x,genedpos.y,this.const.TILE_CHOCO,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_CHOCO)})
                }
                else {
                    if (itemType == this.const.COLOR_RED) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_RED_EXT,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_RED_EXT)})
                    } else if (itemType == this.const.COLOR_ORANGE) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_ORANGE_EXT,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_ORANGE_EXT)})
                    } else if (itemType == this.const.COLOR_DARKPINK) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_DARK_PINK_EXT,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_DARK_PINK_EXT)})
                    } else if (itemType == this.const.COLOR_BLUE) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_BLUE_EXT,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_BLUE_EXT)})
                    } else if (itemType == this.const.COLOR_GREEN) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_GREEN_EXT,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_GREEN_EXT)})
                    } else if (itemType == this.const.COLOR_YELLOW) {
                        this.showTile(genedpos.x,genedpos.y,this.const.TILE_ITEM_YELLOW_EXT,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_ITEM_YELLOW_EXT)})
                    }
                }
            }
            else if(data[i].rowCnt + data[i].colCnt - 1 >= 6) {
                gPosArr.push(genedpos)
                this.showTile(genedpos.x,genedpos.y,this.const.TILE_CHOCO,true,function() {dataCount++; if(dataCount == data.length) if(callback) callback(gPosArr,_this.const.TILE_CHOCO)})
            }
            else {
                    dataCount++
                    if(dataCount == data.length)
                        if(callback) callback()
            }
        }
    },

    //bomb-particle
    playBombParticle (x, y,starCnt,color,callback) {
        var nodeBomb = new cc.Node('Sprite');
        nodeBomb.parent = this.field;
        nodeBomb.width = 55; nodeBomb.height = 55;
        nodeBomb.x = this.field.children[x * 9 + y].position.x; nodeBomb.y = this.field.children[x * 9 + y].position.y;
        var me = this;
        var count = starCnt;
        for (var i = 0; i < count; i++) {
            var child = new cc.Node('Sprite');
            child.parent = nodeBomb;
            var comp = child.addComponent(cc.Sprite);
            comp.spriteFrame = new cc.SpriteFrame();
            if(color == this.const.COLOR_DARKPINK)
            	child.color = new cc.Color(233, 36, 244);
            if(color == this.const.COLOR_RED)
            	child.color = new cc.Color(230, 0, 26);
            if(color == this.const.COLOR_YELLOW)
            	child.color = new cc.Color(255, 255, 31);
            if(color == this.const.COLOR_BLUE)
            	child.color = new cc.Color(10, 182, 247);
            if(color == this.const.COLOR_GREEN)
            	child.color = new cc.Color(93, 214, 25);
            if(color == this.const.COLOR_ORANGE)
            	child.color = new cc.Color(254, 207, 1);
            child.x = -25 + this.getRandomValue(0, 50); child.y = -25 + this.getRandomValue(0, 50);
        }

        
        var calledfuncCnt = 0
        cc.loader.loadRes("JellyGarden/Textures/Boosts/star", function (err, data) {
            if (err) {
                return;
            }
            var _callfunc = cc.callFunc(()=>{
                calledfuncCnt++
                if(calledfuncCnt == count)
                    if(callback) callback()
            })

            for (var i = 0; i < count; i++) {
                var comp = nodeBomb.children[i].getComponent(cc.Sprite);                
                comp.spriteFrame._refreshTexture(data);
                nodeBomb.children[i].width = 15; 
                nodeBomb.children[i].height = 15;
            }
            for (var i = 0; i < count; i++) {
                var moveX = Math.pow(-1, parseInt(Math.random() * 200)) * me.getRandomValue(60, 55 * 2); 
                var moveY = Math.pow(-1, parseInt(Math.random() * 200)) * me.getRandomValue(60, 55 * 2);
                var moveBy = cc.moveBy(0.5, cc.v2(moveX , moveY));
                var fadeOut = cc.fadeOut(0.5);
                var rotate = cc.rotateTo(0.5, 240, 240);
                var child = nodeBomb.children[i];
                child.runAction(cc.sequence(cc.spawn(moveBy, rotate, fadeOut),_callfunc));
            }
        });
    },

    getRandomValue(start, raito) {
        var pos = parseInt(Math.random() * raito);
        if (pos < raito)
            return pos;
        return this.getRandomValue();
    },
    //bomb-particle-end
    excuteChocoTile(x,y,callback) {
        if(this.tileArr[x][y] == this.const.NONE_TILE || this.tileArr[x][y] == this.const.EMPTY_TILE || this.tileArr[x][y] != this.const.TILE_CHOCO) {
            if(callback) callback()
            return
        }
        var exPosX = x,exPosY = y + 1
        if(exPosY >= this.colCnt) {
            exPosY = y - 1
        }
        var me = this
        var bombs = [me.const.TILE_ITEM_RED_EXT,me.const.TILE_ITEM_ORANGE_EXT,me.const.TILE_ITEM_DARK_PINK_EXT,me.const.TILE_ITEM_BLUE_EXT,me.const.TILE_ITEM_GREEN_EXT,me.const.TILE_ITEM_YELLOW_EXT]
        var horizs = [me.const.TILE_ITEM_RED_HORIZ,me.const.TILE_ITEM_ORANGE_HORIZ,me.const.TILE_ITEM_DARK_PINK_HORIZ,me.const.TILE_ITEM_BLUE_HORIZ,me.const.TILE_ITEM_GREEN_HORIZ,me.const.TILE_ITEM_YELLOW_HORIZ]
        var verts = [me.const.TILE_ITEM_RED_VERT,me.const.TILE_ITEM_ORANGE_VERT,me.const.TILE_ITEM_DARK_PINK_VERT,me.const.TILE_ITEM_BLUE_VERT,me.const.TILE_ITEM_GREEN_VERT,me.const.TILE_ITEM_YELLOW_VERT]
        var itemType = -1
       
        for(var i = 0; i < bombs.length;i++) {
            if(me.tileArr[exPosX][exPosY] == bombs[i]) {
                itemType = 1
                break
            }
        }
        for(var i = 0; i < horizs.length;i++) {
            if(me.tileArr[exPosX][exPosY] == horizs[i]) {
                itemType = 2
                break
            }
        }
        for(var i = 0; i < verts.length;i++) {
            if(me.tileArr[exPosX][exPosY] == verts[i]) {
                itemType = 3
                break
            }
        }
        if(me.tileArr[exPosX][exPosY] == me.const.TILE_CHOCO) {
            itemType = 4
        }
        if(itemType != -1) {
            if(itemType != 4) {
                var secondTile = me.tileArr[exPosX][exPosY]
                if(secondTile==me.const.TILE_INGREDIENT1 || secondTile==me.const.TILE_INGREDIENT2) {
                    var rtiles = [me.const.TILE_ITEM_RED,me.const.TILE_ITEM_ORANGE,me.const.TILE_ITEM_DARK_PINK,me.const.TILE_ITEM_BLUE,me.const.TILE_ITEM_GREEN,me.const.TILE_ITEM_YELLOW]
                    secondTile = rtiles[parseInt(Math.random() * 100) % 6]
                }
                for(var i = 0;i < me.rowCnt;i++) {
                    for(var j = 0;j < me.colCnt;j++) {
                        if(me.compareTiles(me.tileArr[i][j],secondTile) == true) {
                            me.tileArr[i][j] = secondTile
                        }
                    }
                }
                me.ocupied = true
                me.tileArr[x][y] = me.const.EMPTY_TILE
                me.hideTile(x,y)
                me.refreshBoard()
                setTimeout(function() { 
                    me.fillTiles([],null,null,function() { 
                        me.backupGameBoard();
                        if(callback) callback()
                    })
                },0.3)
            }
            else {
                var ret = []
                var matrix = []
                for(var i = 0;i < me.rowCnt;i ++) {
                    matrix[i] = []
                    for(var j = 0;j < me.colCnt;j++)
                        matrix[i][j] = -1
                }
                for(var i = 0;i < me.rowCnt;i++) {
                    for(var j = 0;j < me.colCnt;j++) {
                        if(!(x == i && y == j) && me.tileArr[i][j] != me.const.EMPTY_TILE && me.tileArr[i][j] != me.const.NONE_TILE && me.tileArr[i][j] != me.const.TILE_CHOCO && me.tileArr[i][j] != me.const.TILE_INGREDIENT1 && me.tileArr[i][j] != me.const.TILE_INGREDIENT2) {
                            matrix[i][j] = 1
                        }
                    }
                }
                me.tileArr[x][y] = me.const.EMPTY_TILE
                me.hideTile(x,y)
                me.tileArr[exPosX][exPosY] = me.const.EMPTY_TILE
                me.hideTile(exPosX,exPosY)
                ret.push({'x': 0,'y': 0,'rowCnt': me.rowCnt,'colCnt': me.colCnt,'matrix': matrix})
                me.ocupied = true
                me.exploidTiles(ret,function() {
                    me.fillTiles(ret,null,null,function() {
                        me.backupGameBoard()
                        if(callback) callback()
                    })
                })
            }
        } else {
            var ret = []
            var matrix = []
            for(var i = 0;i < me.rowCnt;i ++) {
                matrix[i] = []
                for(var j = 0;j < me.colCnt;j++)
                    matrix[i][j] = -1
            }
            var secondTile = me.tileArr[exPosX][exPosY]
            if(secondTile==me.const.TILE_INGREDIENT1 || secondTile==me.const.TILE_INGREDIENT2) {
                var rtiles = [me.const.TILE_ITEM_RED,me.const.TILE_ITEM_ORANGE,me.const.TILE_ITEM_DARK_PINK,me.const.TILE_ITEM_BLUE,me.const.TILE_ITEM_GREEN,me.const.TILE_ITEM_YELLOW]
                secondTile = rtiles[parseInt(Math.random() * 100) % 6]
            }
            for(var i = 0;i < me.rowCnt;i++) {
                for(var j = 0;j < me.colCnt;j++) {
                    if(me.compareTiles(me.tileArr[i][j],secondTile) == true) {
                        matrix[i][j] = 1
                    }
                }
            }
            me.tileArr[x][y] = me.const.EMPTY_TILE
            me.hideTile(x,y)

            ret.push({'x': 0,'y': 0,'rowCnt': me.rowCnt,'colCnt': me.colCnt,'matrix': matrix})
            me.ocupied = true
            me.exploidTiles(ret,function() {
                me.fillTiles(ret,null,null,function() {
                    me.backupGameBoard()
                    if(callback) callback()
                })
            })
        }
    },

    excuteTile(x,y,choco,callback) {
        if(this.tileArr[x][y] == this.const.EMPTY_TILE || this.tileArr[x][y] == this.const.NONE_TILE || this.tileArr[x][y] == this.const.TILE_CHOCO) {
            if(callback)
                callback()
            return
        }
        var wood_block
        for(var i = 0; i < this.wood_nodes.length;i++) {
          if(this.wood_nodes[i].x == x && this.wood_nodes[i].y == y) {
            wood_block = this.wood_nodes[i].wood
            break
          }
        }
        if(wood_block) {
            //wood_block.removeFromParent(true)// topstar
            this.playAnim(wood_block,true)
            this.tileArr[x][y] = this.const.EMPTY_TILE
            if(callback) callback()
            return
        }
        
        var choco_block
        for(var i = 0; i < this.choco_nodes.length;i++) {
          if(this.choco_nodes[i].x == x && this.choco_nodes[i].y == y) {
            choco_block = this.choco_nodes[i].choco
            break
          }
        }
        if(choco_block!=null) {
            this.playAnim(choco_block,true)
            this.tileArr[x][y] = this.const.EMPTY_TILE
            if(callback) callback()
            return
        }
        
        var tileIdx = x * 9 + y
        var squareArray = this.field.children
        var items = squareArray[tileIdx].getChildByName('Item')
        //var item = items.children[this.tileArr[x][y]]
        
        var delayAc = cc.delayTime(0.3)

        var bombs = [this.const.TILE_ITEM_RED_EXT,this.const.TILE_ITEM_ORANGE_EXT,this.const.TILE_ITEM_DARK_PINK_EXT,this.const.TILE_ITEM_BLUE_EXT,this.const.TILE_ITEM_GREEN_EXT,this.const.TILE_ITEM_YELLOW_EXT]
        var horizs = [this.const.TILE_ITEM_RED_HORIZ,this.const.TILE_ITEM_ORANGE_HORIZ,this.const.TILE_ITEM_DARK_PINK_HORIZ,this.const.TILE_ITEM_BLUE_HORIZ,this.const.TILE_ITEM_GREEN_HORIZ,this.const.TILE_ITEM_YELLOW_HORIZ]
        var verts = [this.const.TILE_ITEM_RED_VERT,this.const.TILE_ITEM_ORANGE_VERT,this.const.TILE_ITEM_DARK_PINK_VERT,this.const.TILE_ITEM_BLUE_VERT,this.const.TILE_ITEM_GREEN_VERT,this.const.TILE_ITEM_YELLOW_VERT]
        var eff_tile = []
        var eff_idx = -1
        for(var i = 0; i < bombs.length;i++) {
            if(this.tileArr[x][y] == bombs[i]) {
                eff_idx = 1
                break
            }
        }
        for(var i = 0; i < horizs.length;i++) {
            if(this.tileArr[x][y] == horizs[i]) {
                eff_idx = 2
                break
            }
        }
        for(var i = 0; i < verts.length;i++) {
            if(this.tileArr[x][y] == verts[i]) {
                eff_idx = 3
                break
            }
        }

        if(eff_idx == 1) {
            var left = y - 1,top = x - 1,right = y + 1,bottom = x + 1
            if(left < 0) left = 0
            if(top < 0) top = 0
            if(right >= this.const.colCnt) right = this.const.colCnt - 1
            if(bottom >= this.rowCnt) bottom = this.rowCnt - 1
            var matrix = []
            var rowCnt = bottom - top + 1,colCnt = right - left + 1
            for(var i = 0;i < rowCnt;i++) {
                matrix[i] = []
                for(var j = 0;j < colCnt;j++)
                    matrix[i][j] = -1
            }
            for(var i = 0;i < rowCnt;i++) {
                for(var j = 0;j < colCnt;j++) {
                    if(this.tileArr[left + i][top + j] != this.const.TILE_INGREDIENT1 && this.tileArr[left + i][top + j] != this.const.TILE_INGREDIENT2 && 
                        this.tileArr[left + i][top + j] != this.const.NONE_TILE && this.tileArr[left + i][top + j] != this.const.EMPTY_TILE && this.tileArr[left + i][top + j] != this.const.TILE_CHOCO) {
                        matrix[i][j] = 1
                    }
                }
            }
            eff_tile.push({'x': top,'y': left,'rowCnt': rowCnt,'colCnt': colCnt,'matrix': matrix})
        }
        else
        if(eff_idx == 2) {
            var left = x,top = 0
            if(bottom >= this.rowCnt) bottom = this.rowCnt - 1
            var matrix = []
            var rowCnt = 1,colCnt = this.colCnt
            for(var i = 0;i < rowCnt;i++) {
                matrix[i] = []
                for(var j = 0;j < colCnt;j++)
                    matrix[i][j] = -1
            }
            for(var i = 0;i < rowCnt;i++) {
                for(var j = 0;j < colCnt;j++) {
                    if(this.tileArr[left + i][top + j] != this.const.NONE_TILE && this.tileArr[left + i][top + j] != this.const.EMPTY_TILE && this.tileArr[left + i][top + j] != this.const.TILE_CHOCO && this.tileArr[left + i][top + j] != this.const.TILE_INGREDIENT1 && this.tileArr[left + i][top + j] != this.const.TILE_INGREDIENT2) {
                        matrix[i][j] = 1
                    }
                }
            }
            eff_tile.push({'x': left,'y': top,'rowCnt': rowCnt,'colCnt': colCnt,'matrix': matrix})
        }else
        if(eff_idx == 3) {

            var left = 0, top = y
            var matrix = []
            var rowCnt = this.rowCnt,colCnt = 1
            for(var i = 0;i < rowCnt;i++) {
                matrix[i] = []
                for(var j = 0;j < colCnt;j++)
                    matrix[i][j] = -1
            }
            for(var i = 0;i < rowCnt;i++) {
                for(var j = 0;j < colCnt;j++) {
                    if(this.tileArr[left + i][top + j] != this.const.NONE_TILE && this.tileArr[left + i][top + j] != this.const.EMPTY_TILE && this.tileArr[left + i][top + j] != this.const.TILE_CHOCO && this.tileArr[left + i][top + j] != this.const.TILE_INGREDIENT1 && this.tileArr[left + i][top + j] != this.const.TILE_INGREDIENT2){
                        matrix[i][j] = 1
                    }
                }
            }
            eff_tile.push({'x': left,'y': top,'rowCnt': rowCnt,'colCnt': colCnt,'matrix': matrix})
        }
        var tile_color
        switch(this.tileArr[x][y]) {
            case this.const.TILE_ITEM_RED:
            case this.const.TILE_ITEM_RED_EXT:
            case this.const.TILE_ITEM_RED_HORIZ:
            case this.const.TILE_ITEM_RED_VERT:
                tile_color = this.const.COLOR_RED
            break
            case this.const.TILE_ITEM_ORANGE:
            case this.const.TILE_ITEM_ORANGE_EXT:
            case this.const.TILE_ITEM_ORANGE_HORIZ:
            case this.const.TILE_ITEM_ORANGE_VERT:
                tile_color = this.const.COLOR_ORANGE
            break
            case this.const.TILE_ITEM_DARK_PINK:
            case this.const.TILE_ITEM_DARK_PINK_EXT:
            case this.const.TILE_ITEM_DARK_PINK_HORIZ:
            case this.const.TILE_ITEM_DARK_PINK_VERT:
                tile_color = this.const.COLOR_DARKPINK
            break
            case this.const.TILE_ITEM_BLUE:
            case this.const.TILE_ITEM_BLUE_EXT:
            case this.const.TILE_ITEM_BLUE_HORIZ:
            case this.const.TILE_ITEM_BLUE_VERT:
                tile_color = this.const.COLOR_BLUE
            break
            case this.const.TILE_ITEM_GREEN:
            case this.const.TILE_ITEM_GREEN_EXT:
            case this.const.TILE_ITEM_GREEN_HORIZ:
            case this.const.TILE_ITEM_GREEN_VERT:
                tile_color = this.const.COLOR_GREEN
            break
            case this.const.TILE_ITEM_YELLOW:
            case this.const.TILE_ITEM_YELLOW_EXT:
            case this.const.TILE_ITEM_YELLOW_HORIZ:
            case this.const.TILE_ITEM_YELLOW_VERT:
                tile_color = this.const.COLOR_YELLOW
            break
        }
        
        if(eff_idx == -1) {
            var me = this
            cc.loader.loadRes("JellyGarden/Fonts/BorisBlackBloxx",function(err,data) {
                var particle_nodes = []
                
                for(var i = 0;i < 4;i++) {
                    var particle_node = new cc.Node('Sprite')
                    var sp = particle_node.addComponent(cc.Sprite)
                    switch(tile_color) {
                        case me.const.COLOR_RED:
                            sp.spriteFrame = me.redCandyParticles[i]
                        break;
                        case me.const.COLOR_ORANGE:
                            sp.spriteFrame = me.orangeCandyParticles[i]
                        break;
                        case me.const.COLOR_DARKPINK:
                            sp.spriteFrame = me.darkpinkCandyParticles[i]
                        break;
                        case me.const.COLOR_BLUE:
                            sp.spriteFrame = me.blueCandyParticles[i]
                        break;
                        case me.const.COLOR_GREEN:
                            sp.spriteFrame = me.greenCandyParticles[i]
                        break;
                        case me.const.COLOR_YELLOW:
                            sp.spriteFrame = me.yellowCandyParticles[i]
                        break;
                    }
                    particle_node.parent = me.field
                    particle_node.width = 55
                    particle_node.height = 55
                    particle_node.position = cc.v2(me.field.children[x * 9 + y].position.x,me.field.children[x * 9 + y].position.y)
                    particle_nodes.push(particle_node)
                }
                function playTileParticles(x,y,idx) {
                    if(idx >= 4) {
                        for(var i = 0;i < 4; i++) {
                            if(particle_nodes[i]) {
                                particle_nodes[i].removeFromParent(true)
                            }
                        }
                        
                        var m_IceBlock;
                        for(var i = 0;i < me.ice_nodes.length;i++) {
                          if(me.ice_nodes[i].x == x && me.ice_nodes[i].y==y) {
                            m_IceBlock = me.ice_nodes[i].ice
                            me.ice_nodes.splice(i,1)
                            break
                          }
                        }
                        var m_block1; 
                        if(me.field.children.length > x*9+y)
                            m_block1 = me.field.children[x * 9 + y].getChildByName('Block1')
                        var m_block2; 
                        if(me.field.children.length > x*9+y)
                            m_block2 = me.field.children[x * 9 + y].getChildByName('Block2')
                        if(m_IceBlock!=null && m_block1 != null) {
                            me.playAnim(m_IceBlock,true)
                        } else if(m_IceBlock==null && m_block1 != null && m_block2==null){
                            if(m_block1) {
                                m_block1.removeFromParent(true)// topstar
                                var block_node = new cc.Node('Block1')
                                var sp = block_node.addComponent(cc.Sprite)
                                sp.spriteFrame = me.item_block[0]
                                block_node.parent = me.field
                                block_node.width = 55
                                block_node.height = 55
                                block_node.position = cc.v2(me.field.children[x * 9 + y].position.x,me.field.children[x * 9 + y].position.y)
                                block_node.zIndex = 2
                                me.playAnim(block_node,false)
                            }
                        } else if(m_block2!=null && m_block1 != null) {
                            me.playAnim(m_block2,true)
                        } else if(m_block2==null && m_block1 != null){
                            if(m_block1) {
                                m_block1.removeFromParent(true)// topstar
                                var block_node = new cc.Node('Block1')
                                var sp = block_node.addComponent(cc.Sprite)
                                sp.spriteFrame = me.item_block[0]
                                block_node.parent = me.field
                                block_node.width = 55
                                block_node.height = 55
                                block_node.position = cc.v2(me.field.children[x * 9 + y].position.x,me.field.children[x * 9 + y].position.y)
                                block_node.zIndex = 2
                                me.playAnim(block_node,false)
                            }
                        } else if(m_IceBlock != null) {
                            me.playAnim(m_IceBlock,true)
                        }
                        
                        var wood_block
                        var choco_block
                        var chocoFlag = false
                        if(x+1<9) {
                            for(var i = 0; i < me.wood_nodes.length;i++) {
                              if(me.wood_nodes[i].x == x+1 && me.wood_nodes[i].y == y) {
                                wood_block = me.wood_nodes[i].wood
                                me.wood_nodes.splice(i,1)
                                break
                              }
                            }
                            if(wood_block) {
                                me.playAnim(wood_block,true)
                                me.tileArr[x + 1][y] = me.const.EMPTY_TILE
                                chocoFlag = true
                            }
                            
                            for(var i = 0; i < me.choco_nodes.length;i++) {
                              if(me.choco_nodes[i].x == x+1 && me.choco_nodes[i].y == y) {
                                choco_block = me.choco_nodes[i].choco
                                me.choco_nodes.splice(i,1)
                                break
                              }
                            }
                            if(choco_block != null) {
                                me.playAnim(choco_block,true)
                                me.tileArr[x + 1][y] = me.const.EMPTY_TILE
                                chocoFlag = true
                            }
                        }
                        if(x-1>= 0 && chocoFlag==false) {
                            for(var i = 0; i < me.wood_nodes.length;i++) {
                              if(me.wood_nodes[i].x == x-1 && me.wood_nodes[i].y == y) {
                                wood_block = me.wood_nodes[i].wood
                                me.wood_nodes.splice(i,1)
                                break
                              }
                            }
                            if(wood_block) {
                                me.playAnim(wood_block,true)
                                me.tileArr[x - 1][y] = me.const.EMPTY_TILE
                                chocoFlag = true
                            }
                            for(var i = 0; i < me.choco_nodes.length;i++) {
                              if(me.choco_nodes[i].x == x-1 && me.choco_nodes[i].y == y) {
                                choco_block = me.choco_nodes[i].choco
                                me.choco_nodes.splice(i,1)
                                break
                              }
                            }
                            if(choco_block != null) {
                                me.playAnim(choco_block,true)
                                me.tileArr[x - 1][y] = me.const.EMPTY_TILE
                                chocoFlag = true
                            }
                        }
                        if(y+1<9 && chocoFlag==false) {
                            for(var i = 0; i < me.wood_nodes.length;i++) {
                              if(me.wood_nodes[i].x == x && me.wood_nodes[i].y == y+1) {
                                wood_block = me.wood_nodes[i].wood
                                me.wood_nodes.splice(i,1)
                                break
                              }
                            }
                            if(wood_block) {
                                me.playAnim(wood_block,true)
                                me.tileArr[x][y+1] = me.const.EMPTY_TILE
                                chocoFlag = true
                            }
                            for(var i = 0; i < me.choco_nodes.length;i++) {
                              if(me.choco_nodes[i].x == x && me.choco_nodes[i].y == y+1) {
                                choco_block = me.choco_nodes[i].choco
                                me.choco_nodes.splice(i,1)
                                break
                              }
                            }
                            if(choco_block != null) {
                                me.playAnim(choco_block,true)
                                me.tileArr[x][y + 1] = me.const.EMPTY_TILE
                                chocoFlag = true
                            }
                        }
                        if(y-1>=0 && chocoFlag==false) {
                            for(var i = 0; i < me.wood_nodes.length;i++) {
                              if(me.wood_nodes[i].x == x && me.wood_nodes[i].y == y-1) {
                                wood_block = me.wood_nodes[i].wood
                                me.wood_nodes.splice(i,1)
                                break
                              }
                            }
                            if(wood_block) {
                                me.playAnim(wood_block,true)
                                me.tileArr[x][y-1] = me.const.EMPTY_TILE
                                chocoFlag = true
                            }
                            for(var i = 0; i < me.choco_nodes.length;i++) {
                              if(me.choco_nodes[i].x == x && me.choco_nodes[i].y == y-1) {
                                choco_block = me.choco_nodes[i].choco
                                me.choco_nodes.splice(i,1)
                                break
                              }
                            }
                            if(choco_block != null) {
                                me.playAnim(choco_block,true)
                                me.tileArr[x][y - 1] = me.const.EMPTY_TILE
                                chocoFlag = true
                            }
                        }
                        if(callback) callback()
                        return
                    }
                    for(var i = 0;i < 4; i++) {
                        if(particle_nodes[i]) {
                            particle_nodes[i].active = false
                        }
                    }
                    particle_nodes[idx].active = true
                    setTimeout(function() {
                        playTileParticles(x,y,idx + 1)
                    }, (1000 * 5 / 10) / 4) // time -> 0.5
                }
                if(me.tileArr[x][y] != me.const.TILE_INGREDIENT2 && me.tileArr[x][y] != me.const.TILE_INGREDIENT1) {
                    playTileParticles(x,y,0)
                }
                if(me.mode == 1) {
                    if(tile_color == me.target1Idx) {
                        var block_node = new cc.Node('Tile')
                        var sp = block_node.addComponent(cc.Sprite)
                        switch(tile_color) {
                            case me.const.COLOR_RED:
                                sp.spriteFrame = me.tileSprites[me.const.TILE_ITEM_RED]
                            break;
                            case me.const.COLOR_ORANGE:
                                sp.spriteFrame = me.tileSprites[me.const.TILE_ITEM_ORANGE]
                            break;
                            case me.const.COLOR_DARKPINK:
                                sp.spriteFrame = me.tileSprites[me.const.TILE_ITEM_DARK_PINK]
                            break;
                            case me.const.COLOR_BLUE:
                                sp.spriteFrame = me.tileSprites[me.const.TILE_ITEM_BLUE]
                            break;
                            case me.const.COLOR_GREEN:
                                sp.spriteFrame = me.tileSprites[me.const.TILE_ITEM_GREEN]
                            break;
                            case me.const.COLOR_YELLOW:
                                sp.spriteFrame = me.tileSprites[me.const.TILE_ITEM_YELLOW]
                            break;
                        }
                        block_node.parent = me.field
                        block_node.width = 45
                        block_node.height = 45
                        block_node.position = cc.v2(me.field.children[x * 9 + y].position.x,me.field.children[x * 9 + y].position.y)
                        block_node.zIndex = 2
                        me.playAnim(block_node,false,true)
                    }
                    if(tile_color == me.target2Idx) {
                        var block_node = new cc.Node('Tile')
                        var sp = block_node.addComponent(cc.Sprite)
                        switch(tile_color) {
                            case me.const.COLOR_RED:
                                sp.spriteFrame = me.tileSprites[me.const.TILE_ITEM_RED]
                            break;
                            case me.const.COLOR_ORANGE:
                                sp.spriteFrame = me.tileSprites[me.const.TILE_ITEM_ORANGE]
                            break;
                            case me.const.COLOR_DARKPINK:
                                sp.spriteFrame = me.tileSprites[me.const.TILE_ITEM_DARK_PINK]
                            break;
                            case me.const.COLOR_BLUE:
                                sp.spriteFrame = me.tileSprites[me.const.TILE_ITEM_BLUE]
                            break;
                            case me.const.COLOR_GREEN:
                                sp.spriteFrame = me.tileSprites[me.const.TILE_ITEM_GREEN]
                            break;
                            case me.const.COLOR_YELLOW:
                                sp.spriteFrame = me.tileSprites[me.const.TILE_ITEM_YELLOW]
                            break;
                        }
                        block_node.parent = me.field
                        block_node.width = 45
                        block_node.height = 45
                        block_node.position = cc.v2(me.field.children[x * 9 + y].position.x,me.field.children[x * 9 + y].position.y)
                        block_node.zIndex = 2
                        me.playAnim(block_node,false)
                    }
                }

                me.hideTile(x,y)
                if(me.tileArr[x][y] != me.const.TILE_INGREDIENT2 && me.tileArr[x][y] != me.const.TILE_INGREDIENT1) {
                    var node = new cc.Node('Sprite')
                    var sp = node.addComponent(cc.Sprite)
                    sp.spriteFrame = me.tileSprites[me.tileArr[x][y]]
                    node.parent = me.field
                    node.width = 45
                    node.height = 45
                    node.position = cc.v2(me.field.children[x * 9 + y].position.x,me.field.children[x * 9 + y].position.y)
                    var _callfunc = cc.callFunc(()=>{
                        node.removeFromParent(true)
                    })
                    var scale2zero = cc.scaleTo(0.3, 0) // time -> 0.5
                    var moveup = cc.moveBy(0.3,cc.v2(0, 10)) // time -> 0.5
                    node.runAction(cc.sequence(cc.spawn(scale2zero,moveup),_callfunc))
                }

                //choco animation (light lay)
                //.....
                //

                var node_lab = new cc.Node('RichText')
                var lb = node_lab.addComponent(cc.RichText)
                if(tile_color == me.const.COLOR_RED)
                    lb.string = "<outline color=#890302><color=#EA4401>10</c></outline>"
                else if(tile_color == me.const.COLOR_ORANGE)
                    lb.string = "<outline color=#B94E01><color=#FDBD15>10</c></outline>"
                else if(tile_color == me.const.COLOR_DARKPINK)
                    lb.string = "<outline color=#9A0399><color=#EB0DE7>10</c></outline>"
                else if(tile_color == me.const.COLOR_BLUE)
                    lb.string = "<outline color=#890302><color=#289CFE>10</c></outline>"
                else if(tile_color == me.const.COLOR_GREEN)
                    lb.string = "<outline color=#AA6B00><color=#FCFA25>10</c></outline>"
                else if(tile_color == me.const.COLOR_YELLOW)
                    lb.string = "<outline color=#147300><color=#24D300>10</c></outline>"
                else lb.string = "<outline color=white><color=#2289E0>10</c></outline>"
                lb.font = data
                lb.fontSize = 30
                node_lab.parent = me.field
                node_lab.color = cc.color(234,68,1)
                node_lab.position = cc.v2(me.field.children[x * 9 + y].position.x,me.field.children[x * 9 + y].position.y)
                var moveLabUp = cc.moveBy(0.3,cc.v2(0, 10)) // time -> 0.3
                node_lab.runAction(cc.sequence(moveLabUp,cc.callFunc(()=>{
                    node_lab.removeFromParent(true)
                    if(me.tileArr[x][y] == me.const.TILE_INGREDIENT2 || me.tileArr[x][y] == me.const.TILE_INGREDIENT1) {
                        if(callback) callback()
                    }
                })))
                //ingredient animation
                if(me.tileArr[x][y] == me.const.TILE_INGREDIENT2 || me.tileArr[x][y] == me.const.TILE_INGREDIENT1) {
                    var ingredientNode = new cc.Node('Ingredient')
                    var sp = ingredientNode.addComponent(cc.Sprite)
                    sp.spriteFrame = me.item_ingredients[me.tileArr[x][y]-32]
                    ingredientNode.parent = me.field
                    ingredientNode.width = 55
                    ingredientNode.height = 55
                    ingredientNode.position = cc.v2(me.field.children[x * 9 + y].position.x,me.field.children[x * 9 + y].position.y)
                    ingredientNode.zIndex = 2
                    if(me.tileArr[x][y] == me.const.TILE_INGREDIENT2) {
                        me.playAnim(ingredientNode,false)
                    } else if(me.tileArr[x][y] == me.const.TILE_INGREDIENT1) {
                        me.playAnim(ingredientNode,false,true)
                    }
                }

                me.currentScore += 10
                me.checkGameStatus()
            })
            
            return
        }

        var strip_nodes = []
        var strip_cnt = 0
        var excutefncCount = 0
        var _callStripfunc = cc.callFunc(()=>{
            strip_cnt++
            if(strip_cnt == 2) {
                for(var j = 0;j < 2;j++)
                    strip_nodes[j].removeFromParent(true)
            }
        })
        var _callExcuteFunc = cc.callFunc(()=>{
            excutefncCount++
            if(excutefncCount > 1)
                return
            this.ocupied = true
            var me = this
            this.exploidTiles(eff_tile, function() {
                // me.genEffectTiles(eff_tile,function(gened_pos) {
                //     me.fillTiles(eff_tile,gened_pos,function() {
                //         me.ocupied = false
                //         me.backupGameBoard()
                //     })
                // })
                for(var m = 0;m < eff_tile.length;m++)
                    for(var j = 0;j < eff_tile[m].rowCnt;j++)
                        for(var k = 0; k < eff_tile[m].colCnt;k++)
                            if(me.tileArr[eff_tile[m].x + j][eff_tile[m].y + k] != me.const.NONE_TILE &&
                             me.tileArr[eff_tile[m].x + j][eff_tile[m].y + k] != me.const.TILE_CHOCO &&
                             me.tileArr[eff_tile[m].x + j][eff_tile[m].y + k] != me.const.TILE_INGREDIENT1 && 
                             me.tileArr[eff_tile[m].x + j][eff_tile[m].y + k] != me.const.TILE_INGREDIENT2)
                                me.tileArr[eff_tile[m].x + j][eff_tile[m].y + k] = me.const.EMPTY_TILE
                if(callback) callback()
            })
        })
        switch(tile_color) {
            case this.const.COLOR_RED:
                this.tileArr[x][y] = this.const.TILE_ITEM_RED
            break;
            case this.const.COLOR_ORANGE:
                this.tileArr[x][y] = this.const.TILE_ITEM_ORANGE
            break;
            case this.const.COLOR_DARKPINK:
                this.tileArr[x][y] = this.const.TILE_ITEM_DARK_PINK
            break;
            case this.const.COLOR_BLUE:
                this.tileArr[x][y] = this.const.TILE_ITEM_BLUE
            break;
            case this.const.COLOR_GREEN:
                this.tileArr[x][y] = this.const.TILE_ITEM_GREEN
            break;
            case this.const.COLOR_YELLOW:
                this.tileArr[x][y] = this.const.TILE_ITEM_YELLOW
            break;
        }
        var node = new cc.Node('Sprite')
        var sp = node.addComponent(cc.Sprite)
        sp.spriteFrame = this.tileSprites[this.tileArr[x][y]]
        node.parent = this.field
        node.width = 45
        node.height = 45
        node.position = cc.v2(this.field.children[x * 9 + y].position.x,this.field.children[x * 9 + y].position.y)
        var _callfunc = cc.callFunc(()=>{
            node.removeFromParent(true)
        })
        var scale2zero = cc.scaleTo(0.3, 0)
        var moveup = cc.moveBy(0.3,cc.v2(0, 10))
        node.runAction(cc.sequence(cc.spawn(scale2zero,moveup),_callfunc))
        //star
        if(eff_idx == 1) {
            var _me = this
            this.playBombParticle(x,y,200,tile_color)
            this.ocupied = true
            this.exploidTiles(eff_tile, function() {
                // me.genEffectTiles(eff_tile,function(gened_pos) {
                //     me.fillTiles(eff_tile,gened_pos,function() {
                //         me.ocupied = false
                //         me.backupGameBoard()
                //     })
                // })
                for(var m = 0;m < eff_tile.length;m++)
                    for(var j = 0;j < eff_tile[m].rowCnt;j++)
                        for(var k = 0; k < eff_tile[m].colCnt;k++)
                            if(_me.tileArr[eff_tile[m].x + j][eff_tile[m].y + k] != _me.const.NONE_TILE && _me.tileArr[eff_tile[m].x + j][eff_tile[m].y + k] != _me.const.TILE_CHOCO &&
                                _me.tileArr[eff_tile[m].x + j][eff_tile[m].y + k] != _me.const.TILE_INGREDIENT1 && _me.tileArr[eff_tile[m].x + j][eff_tile[m].y + k] != _me.const.TILE_INGREDIENT2)
                                _me.tileArr[eff_tile[m].x + j][eff_tile[m].y + k] = _me.const.EMPTY_TILE
                if(callback) callback()
            })
        }
        else        
        if(eff_idx == 2 || eff_idx == 3) {
            for(var i = 0;i < 2; i++) {
                var strip_node = new cc.Node('Sprite')
                var strip_sp = strip_node.addComponent(cc.Sprite)
                strip_sp.spriteFrame = this.strip
                strip_node.parent = this.field
                if(eff_idx == 2) {
                    strip_sp.angle = 0
                    strip_node.width = 55 * 3
                    strip_node.height = 55
                }
                else {
                    strip_sp.angle = 90
                    strip_node.width = 55
                    strip_node.height = 55 * 3
                }
                strip_node.position = cc.v2(this.field.children[x * 9 + y].position.x,this.field.children[x * 9 + y].position.y)
                strip_nodes.push(strip_node)
                var scaleby
                if(eff_idx == 2) {
                    scaleby = cc.scaleBy(0.3, 6, 1)
                }
                else
                    scaleby = cc.scaleBy(0.3, 1, 6)
                var movel
                var mover
                if(eff_idx == 2) {
                    movel = cc.moveBy(0.2,cc.v2(-55 * 3 * 6, 0))
                    mover = cc.moveBy(0.2,cc.v2(55 * 3 * 6, 0))
                }
                else {
                    movel = cc.moveBy(0.2,cc.v2(0, 55 * 3 * 6))
                    mover = cc.moveBy(0.2,cc.v2(0, -55 * 3 * 6))
                }
                if(i == 0)
                    strip_node.runAction(cc.spawn(_callExcuteFunc,cc.sequence(scaleby,movel,_callStripfunc)))
                if(i == 1)
                    strip_node.runAction(cc.spawn(_callExcuteFunc,cc.sequence(scaleby,mover,_callStripfunc)))
            }
        }
    },

    exploidTiles(data,callback) {
        var excuteCnt = 0,excuteIdx = 0
        for(var i = 0;i < data.length;i++) {
            for(var j = 0;j < data[i].rowCnt;j++) {
                for(var k = 0;k < data[i].colCnt;k++) {
                    if(data[i].matrix[j][k] != -1) {
                        excuteCnt++
                    }
                }
            }
        }
        this.backupGameBoardBeforeSpecialItemExploid()
        var squareArray = this.field.children
        for(var i = 0;i < data.length;i++) {
            var x = data[i].x,y = data[i].y
            for(var j = 0;j < data[i].rowCnt;j++) {
                for(var k = 0;k < data[i].colCnt;k++) {
                    var posX = x + j,posY = y + k
                    if(data[i].matrix[j][k] != -1) {
                        var me = this
                        this.excuteTile(posX,posY,null,function() {
                            excuteIdx++
                            if(excuteIdx == excuteCnt) {
                                if(callback)
                                    callback()
                            }
                        })
                    }
                }
            }
        }
    },

    compareTiles(tile1,tile2) {
        var tile1Color = -1, tile2Color = -1
        switch(tile1) {
            case this.const.TILE_ITEM_RED:
            case this.const.TILE_ITEM_RED_EXT:
            case this.const.TILE_ITEM_RED_HORIZ:
            case this.const.TILE_ITEM_RED_VERT:
                tile1Color = this.const.COLOR_RED
            break
            case this.const.TILE_ITEM_ORANGE:
            case this.const.TILE_ITEM_ORANGE_EXT:
            case this.const.TILE_ITEM_ORANGE_HORIZ:
            case this.const.TILE_ITEM_ORANGE_VERT:
                tile1Color = this.const.COLOR_ORANGE
            break
            case this.const.TILE_ITEM_DARK_PINK:
            case this.const.TILE_ITEM_DARK_PINK_EXT:
            case this.const.TILE_ITEM_DARK_PINK_HORIZ:
            case this.const.TILE_ITEM_DARK_PINK_VERT:
                tile1Color = this.const.COLOR_DARKPINK
            break
            case this.const.TILE_ITEM_BLUE:
            case this.const.TILE_ITEM_BLUE_EXT:
            case this.const.TILE_ITEM_BLUE_HORIZ:
            case this.const.TILE_ITEM_BLUE_VERT:
                tile1Color = this.const.COLOR_BLUE
            break
            case this.const.TILE_ITEM_GREEN:
            case this.const.TILE_ITEM_GREEN_EXT:
            case this.const.TILE_ITEM_GREEN_HORIZ:
            case this.const.TILE_ITEM_GREEN_VERT:
                tile1Color = this.const.COLOR_GREEN
            break
            case this.const.TILE_ITEM_YELLOW:
            case this.const.TILE_ITEM_YELLOW_EXT:
            case this.const.TILE_ITEM_YELLOW_HORIZ:
            case this.const.TILE_ITEM_YELLOW_VERT:
                tile1Color = this.const.COLOR_YELLOW
            break
        }
        switch(tile2) {
            case this.const.TILE_ITEM_RED:
            case this.const.TILE_ITEM_RED_EXT:
            case this.const.TILE_ITEM_RED_HORIZ:
            case this.const.TILE_ITEM_RED_VERT:
                tile2Color = this.const.COLOR_RED
            break
            case this.const.TILE_ITEM_ORANGE:
            case this.const.TILE_ITEM_ORANGE_EXT:
            case this.const.TILE_ITEM_ORANGE_HORIZ:
            case this.const.TILE_ITEM_ORANGE_VERT:
                tile2Color = this.const.COLOR_ORANGE
            break
            case this.const.TILE_ITEM_DARK_PINK:
            case this.const.TILE_ITEM_DARK_PINK_EXT:
            case this.const.TILE_ITEM_DARK_PINK_HORIZ:
            case this.const.TILE_ITEM_DARK_PINK_VERT:
                tile2Color = this.const.COLOR_DARKPINK
            break
            case this.const.TILE_ITEM_BLUE:
            case this.const.TILE_ITEM_BLUE_EXT:
            case this.const.TILE_ITEM_BLUE_HORIZ:
            case this.const.TILE_ITEM_BLUE_VERT:
                tile2Color = this.const.COLOR_BLUE
            break
            case this.const.TILE_ITEM_GREEN:
            case this.const.TILE_ITEM_GREEN_EXT:
            case this.const.TILE_ITEM_GREEN_HORIZ:
            case this.const.TILE_ITEM_GREEN_VERT:
                tile2Color = this.const.COLOR_GREEN
            break
            case this.const.TILE_ITEM_YELLOW:
            case this.const.TILE_ITEM_YELLOW_EXT:
            case this.const.TILE_ITEM_YELLOW_HORIZ:
            case this.const.TILE_ITEM_YELLOW_VERT:
                tile2Color = this.const.COLOR_YELLOW
            break
        }
        if(tile1Color == -1 || tile2Color == -1)
            return false
        if(tile1Color == tile2Color)
            return true
        return false
    },

    checkBoard() {
        var ret = []
        var success_flag = false
        for(var i = 0; i < this.rowCnt;i++) {
            var sameCntRow = 1
            var sameCntCol = 1
            var startColIdx = 0,endColIdx = 0
            var startIdx = 0,endIdx = 0
            for(var j = 0; j < this.colCnt;j++) {
                var before = this.tileArr[i][j]
                var k
                startIdx = j
                for(k = j;k < this.colCnt;k++) {
                    if(!this.compareTiles(before,this.tileArr[i][k]) && before != this.const.NONE_TILE && this.tileArr[i][k] != this.const.NONE_TILE) {
                        break
                    }
                    if(before == this.const.NONE_TILE || this.tileArr[i][k] == this.const.NONE_TILE)
                        break
                }
                endIdx = k
                sameCntRow = k - j
                if(sameCntRow > 2) {
                    var withColumn = false
                    var linkcolIdx = 0
                    for(k = startIdx; k < endIdx;k++) {
                        sameCntCol = 1
                        startColIdx = 0
                        endColIdx = 0
                        for(var l = 0;l < this.rowCnt;l++) {
                            var before = this.tileArr[l][k]
                            var m
                            startColIdx = l
                            linkcolIdx = k - startIdx
                            for(m = l; m < this.rowCnt;m++) {
                                if(!this.compareTiles(before,this.tileArr[m][k]) && before != this.const.NONE_TILE && this.tileArr[m][k] != this.const.NONE_TILE) {
                                    break
                                }
                                if(before == this.const.NONE_TILE || this.tileArr[m][k] == this.const.NONE_TILE)
                                    break
                            }
                            endColIdx = m
                            sameCntCol = m - l
                            if(sameCntCol > 2)
                                break
                        }
                        
                        if(startColIdx <= i && i < endColIdx && sameCntCol > 2) {
                            withColumn = true
                            break
                        }
                        else withColumn = false
                    }
                    var matrix = []
                    if(withColumn) {
                        for(k = 0;k < sameCntCol;k++) {
                            matrix[k] = []
                            for(var l = 0; l < sameCntRow;l ++) {
                                matrix[k][l] = -1
                            }
                        }
                        
                        for(var l = 0; l < sameCntRow;l ++) {
                            if(i - startColIdx < 0)
                                 matrix[0][l] = 1
                            else {
                                try{
                                    matrix[i - startColIdx][l] = 1
                                }
                                catch(exception){
                                    console.log(matrix)
                                }
                            }
                        }
                        for(k = 0;k < sameCntCol;k++) {
                            matrix[k][linkcolIdx] = 1
                        }
                        ret.push({'x': startColIdx,'y': startIdx,'rowCnt': sameCntCol,'colCnt': sameCntRow,'matrix': matrix})
                        success_flag = true
                    } else {
                        for(k = 0;k < 1;k++) {
                            matrix[k] = []
                            for(var l = 0; l < sameCntRow;l ++) {
                                matrix[k][l] = -1
                            }
                        }
                        
                        for(var l = 0; l < sameCntRow;l ++) {
                            matrix[0][l] = 1
                        }
                        success_flag = true
                        ret.push({'x': i,'y': startIdx,'rowCnt': 1,'colCnt': sameCntRow,'matrix': matrix})
                    }
                    j = endIdx
                }
            }
        }
        //column
        for(var i = 0; i < this.colCnt;i++) {
            var sameCntRow = 1
            var sameCntCol = 1
            var startColIdx = 0,endColIdx = 0
            var startIdx = 0,endIdx = 0
            for(var j = 0; j < this.rowCnt;j++) {
                var before = this.tileArr[j][i]
                var k
                startIdx = j
                for(k = j;k < this.rowCnt;k++) {
                    if(!this.compareTiles(before,this.tileArr[k][i]) && before != this.const.NONE_TILE && this.tileArr[k][i] != this.const.NONE_TILE) {
                        break
                    }
                    if(before == this.const.NONE_TILE || this.tileArr[k][i] == this.const.NONE_TILE)
                        break
                }
                endIdx = k
                sameCntRow = k - j
                if(sameCntRow > 2) {
                    var withColumn = false
                    var linkcolIdx = 0
                    for(k = startIdx; k < endIdx;k++) {
                        sameCntCol = 1
                        startColIdx = 0
                        endColIdx = 0
                        for(var l = 0;l < this.colCnt;l++) {
                            var before = this.tileArr[k][l]
                            var m
                            startColIdx = l
                            linkcolIdx = k - startIdx
                            for(m = l; m < this.colCnt;m++) {
                                if(!this.compareTiles(before,this.tileArr[k][m]) && before != this.const.NONE_TILE && this.tileArr[k][m] != this.const.NONE_TILE) {
                                    break
                                }
                                if(before == this.const.NONE_TILE || this.tileArr[k][m] == this.const.NONE_TILE)
                                    break
                            }
                            endColIdx = m
                            sameCntCol = m - l
                            if(sameCntCol > 2)
                                break
                        }
                        
                        if(startColIdx <= i && i < endColIdx && sameCntCol > 2) {
                            withColumn = true
                            break
                        }
                        else withColumn = false
                    }
                    var matrix = []
                    if(withColumn) {
                        for(k = 0;k < sameCntRow;k++) {
                            matrix[k] = []
                            for(var l = 0; l < sameCntCol;l ++) {
                                matrix[k][l] = -1
                            }
                        }
                        for(var l = 0; l < sameCntRow;l ++) {
                            try {
                                matrix[l][i - startColIdx] = 1
                            }
                            catch(exception){
                                console.log(matrix)
                            }                            
                        }
                        for(k = 0;k < sameCntCol;k++) {
                            matrix[linkcolIdx][k] = 1
                        }
                        success_flag = true
                        var multi_flag = false
                        for(var l = 0;l < ret.length;l++) {
                            if(ret[l].x == startIdx && ret[l].y == startColIdx && ret[l].rowCnt == sameCntRow && ret[l].colCnt == sameCntCol) {
                                var tmp_flag = true
                                for(var m = 0;m < ret[l].rowCnt;m++) {
                                    for(var n = 0;n < ret[l].colCnt;n++) {
                                        if(ret[l].matrix[m][n] != matrix[m][n]) {
                                            tmp_flag = false
                                            break
                                        }
                                    }
                                    if(tmp_flag == false)
                                        break
                                }
                                if(tmp_flag == true) {
                                    multi_flag = true
                                    break
                                }
                            }
                        }
                        if(multi_flag == false)
                            ret.push({'x': startIdx,'y': startColIdx,'rowCnt': sameCntRow,'colCnt': sameCntCol,'matrix': matrix})
                    } else {
                        for(k = 0;k < sameCntRow;k++) {
                            matrix[k] = []
                            for(var l = 0; l < 1;l ++) {
                                matrix[k][l] = -1
                            }
                        }
                        for(var l = 0; l < sameCntRow;l ++) {
                            matrix[l][0] = 1
                        }
                        success_flag = true
                        var multi_flag = false
                        for(var l = 0;l < ret.length;l++) {
                            if(ret[l].x == startIdx && ret[l].y == i && ret[l].rowCnt == sameCntRow && ret[l].colCnt == 1) {
                                var tmp_flag = true
                                for(var m = 0;m < ret[l].rowCnt;m++) {
                                    for(var n = 0;n < ret[l].colCnt;n++) {
                                        if(ret[l].matrix[m][n] != matrix[m][n]) {
                                            tmp_flag = false
                                            break
                                        }
                                    }
                                    if(tmp_flag == false)
                                        break
                                }
                                if(tmp_flag == true) {
                                    multi_flag = true
                                    break
                                }
                            }
                        }
                        if(multi_flag == false)
                            ret.push({'x': startIdx,'y': i,'rowCnt': sameCntRow,'colCnt': 1,'matrix': matrix})
                    }
                    j = endIdx
                }
            }
        }
        var _this = this
        var matrix = []
        var ingFlag = false
        for(var n = 0;n < _this.rowCnt;n++) {
            matrix[n] = []
            for(var m = 0;m < _this.colCnt;m++)
                matrix[n][m] = -1
        }
        for(var n = 0;n < _this.colCnt;n++) {
            for(var m = _this.rowCnt - 1;m >= 0;m-- ) {
                if(_this.tileArr[m][n] != _this.const.NONE_TILE) {
                    if(_this.tileArr[m][n] == _this.const.TILE_INGREDIENT1 || _this.tileArr[m][n] == _this.const.TILE_INGREDIENT2) {
                        matrix[m][n] = 1
                        ingFlag = true
                    }
                    break;
                }
            }
        }
        if(ingFlag == true) {
            ret.push({'x': 0,'y': 0,'rowCnt': _this.rowCnt,'colCnt': _this.colCnt,'matrix': matrix})

        }
        return {'success': success_flag, 'data': ret}
    },
/*
    comment
*/
    initSettings() {
        for(var i = 0;i < 11;i++) {
            this.tileBeforeArr[i] = []
            this.tileBeforeSpitemExploidArray[i] = []
            this.tileArr[i] = []
            for(var j = 0; j < this.const.STATIC_COL_COUNT;j++) {
                this.tileArr[i][j] = 0
                this.tileBeforeSpitemExploidArray[i][j] = 0
                this.tileBeforeArr[i][j] = 0
            }
        }
    },

    showHint() {

    },

    // onLoad () {
    //   this.schedule(function () {

    //   }, 0.03);
    // },

    //added
    start () {
        this.const = this.constNode.getComponent('GameConstants')
        this.resetGameStatus()
    },

    playGamePlayAnimation() {
        // var animationCtrl = this.field.getComponent(cc.Animation);
        // animationCtrl.play("GameField");
        this.ocupied = true
        this.field.position = cc.v2(1000,600 + (this.rowCnt - 11) * 55 / 2);
        var moveAc = cc.moveTo(1,cc.v2(325 - (this.colCnt - 9) * 55 / 2,600 + (this.rowCnt - 11) * 55/2));
        this.field.runAction(cc.sequence(cc.delayTime(2.9),moveAc,cc.callFunc(()=>{
          this.ocupied = false
        })));

        var animationCtrl_banner = this.g_banner.getComponent(cc.Animation);
        var animationCtrl_cloud = this.g_cloud.getComponent(cc.Animation);
        var animationCtrl_dsc = this.g_targetdsc.children[0].getComponent(cc.Animation);

        if (this.levelInfo.mode == 0) {
            this.g_cloud.getChildByName("ScoreTarget").active = true;
            this.g_cloud.getChildByName("Items").active = false;
            this.g_cloud.getChildByName("Ingredients").active = false;
            this.g_cloud.getChildByName("SingleTarget").active = false;

            animationCtrl_dsc.getComponent(cc.Label).string = "Collect all\ningredients";
        }
        else if (this.levelInfo.mode == 1) {
            var nodeItem1 = this.g_cloud.getChildByName("Items").getChildByName("Item1");
            var nodeItem2 = this.g_cloud.getChildByName("Items").getChildByName("Item2");
            var comp1 = nodeItem1.addComponent(cc.Sprite);
            var comp2 = nodeItem2.addComponent(cc.Sprite);
            
            switch(this.levelInfo.collectItems.item1) {
                case this.const.COLOR_RED:
                    comp1.spriteFrame = this.tileSprites[this.const.TILE_ITEM_RED]
                break;
                case this.const.COLOR_ORANGE:
                    comp1.spriteFrame = this.tileSprites[this.const.TILE_ITEM_ORANGE]
                break;
                case this.const.COLOR_DARKPINK:
                    comp1.spriteFrame = this.tileSprites[this.const.TILE_ITEM_DARK_PINK]
                break;
                case this.const.COLOR_BLUE:
                    comp1.spriteFrame = this.tileSprites[this.const.TILE_ITEM_BLUE]
                break;
                case this.const.COLOR_GREEN:
                    comp1.spriteFrame = this.tileSprites[this.const.TILE_ITEM_GREEN]
                break;
                case this.const.COLOR_YELLOW:
                    comp1.spriteFrame = this.tileSprites[this.const.TILE_ITEM_YELLOW]
                break;
            }

            switch(this.levelInfo.collectItems.item2) {
                case this.const.COLOR_RED:
                    comp2.spriteFrame = this.tileSprites[this.const.TILE_ITEM_RED]
                break;
                case this.const.COLOR_ORANGE:
                    comp2.spriteFrame = this.tileSprites[this.const.TILE_ITEM_ORANGE]
                break;
                case this.const.COLOR_DARKPINK:
                    comp2.spriteFrame = this.tileSprites[this.const.TILE_ITEM_DARK_PINK]
                break;
                case this.const.COLOR_BLUE:
                    comp2.spriteFrame = this.tileSprites[this.const.TILE_ITEM_BLUE]
                break;
                case this.const.COLOR_GREEN:
                    comp2.spriteFrame = this.tileSprites[this.const.TILE_ITEM_GREEN]
                break;
                case this.const.COLOR_YELLOW:
                    comp2.spriteFrame = this.tileSprites[this.const.TILE_ITEM_YELLOW]
                break;
            }

            nodeItem1.width = 70;
            nodeItem1.height = 70;
            nodeItem2.width = 70;
            nodeItem2.height = 70;

            this.g_cloud.getChildByName("ScoreTarget").active = false;
            this.g_cloud.getChildByName("Items").active = true;
            this.g_cloud.getChildByName("Ingredients").active = false;            
            this.g_cloud.getChildByName("SingleTarget").active = false;

            animationCtrl_dsc.getComponent(cc.Label).string = "Collect all\ningredients";
        }
        else if (this.levelInfo.mode == 2) {
            this.g_cloud.getChildByName("ScoreTarget").active = false;
            this.g_cloud.getChildByName("Items").active = false;
            this.g_cloud.getChildByName("Ingredients").active = true;
            this.g_cloud.getChildByName("SingleTarget").active = false;

            animationCtrl_dsc.getComponent(cc.Label).string = "Collect all\ningredients";
        }
        else if (this.levelInfo.mode == 3) {
            this.g_cloud.getChildByName("ScoreTarget").active = false;
            this.g_cloud.getChildByName("Items").active = false;
            this.g_cloud.getChildByName("Ingredients").active = false;
            this.g_cloud.getChildByName("SingleTarget").active = true;

            animationCtrl_dsc.getComponent(cc.Label).string = "Collect all\ningredients";
        }

        animationCtrl_banner.play("new1");

        setTimeout(function() {
            animationCtrl_cloud.play("CloudAnim");
            animationCtrl_dsc.play("TargetDescription1");
        }, 100);
    },

    resetGameStatus() {
        this.currentScore = 0;
        for(var i = 0;i < this.ice_nodes.length;i++)
          this.ice_nodes[i].ice.removeFromParent(true)
        this.ice_nodes=[]
        this.sceneType = 3;
        this.boardBoosterShop.x = 326, this.boardBoosterShop.y = 480;
        this.boardComplete.x = 326; this.boardComplete.y = 480;
        this.boardFail.x = 326; this.boardFail.y = 480;
        this.boardPause.x = 326; this.boardPause.y = 480;
        this.boardBoosterShop.active = false;
        this.boardComplete.active = false;
        this.boardFail.active = false;
        this.boardPause.active = false;

        var nodeMoveIndicator = this.bottomPanel.getChildByName("BoostExtraMoves").getChildByName("Indicator");
        var nodeHandIndicator = this.bottomPanel.getChildByName("BoostHand").getChildByName("Indicator");
        var nodeRandomColorIndicator = this.bottomPanel.getChildByName("BoostRandom_color").getChildByName("Indicator");
        var nodeBombIndicator = this.bottomPanel.getChildByName("BoostBomb").getChildByName("Indicator");
        var nodeExtraTimeIndicator = this.bottomPanel.getChildByName("BoostExtraTime").getChildByName("Indicator");

        var nodeMoveLock = this.bottomPanel.getChildByName("BoostExtraMoves").getChildByName("Lock");
        var nodeHandLock = this.bottomPanel.getChildByName("BoostHand").getChildByName("Lock");
        var nodeRandomColorLock = this.bottomPanel.getChildByName("BoostRandom_color").getChildByName("Lock");
        var nodeBombLock = this.bottomPanel.getChildByName("BoostBomb").getChildByName("Lock");
        var nodeExtraTimeLock = this.bottomPanel.getChildByName("BoostExtraTime").getChildByName("Lock");

        nodeMoveLock.active = false;
        nodeMoveIndicator.active = true;
        nodeHandLock.active = false;
        nodeHandIndicator.active = true;
        nodeRandomColorLock.active = false;
        nodeRandomColorIndicator.active = true;
        nodeBombLock.active = false;
        nodeBombIndicator.active = true;
        nodeExtraTimeLock.active = false;
        nodeExtraTimeIndicator.active = true;

        this.refreshBoosterItem(4);
        this.refreshBoosterItem(5);
        this.refreshBoosterItem(6);
        this.refreshBoosterItem(7);
        this.refreshBoosterItem(8);
        
        var nodeStar1 = this.topPanel.getChildByName("StarsBar").getChildByName("Star1");
        var nodeStar2 = this.topPanel.getChildByName("StarsBar").getChildByName("Star2");
        var nodeStar3 = this.topPanel.getChildByName("StarsBar").getChildByName("Star3");
        var starsBarWidth = this.topPanel.getChildByName("StarsBar").width;
        var me = this;
        //this.readPlayerInfo();

        this.playMusic();
        
        var lbLevel = this.bottomPanel.getChildByName("lbLevel");
        lbLevel.getComponent(cc.RichText).string = String(this.playerInfo.doingPlayLevel);
        
        this.getLevelInfo(this.playerInfo.doingPlayLevel, function (levelInfo) {
            me.initSettings()
            me.levelInfo = levelInfo;
            
            var lbMoveLimit = me.topPanel.getChildByName("lbMoveLimit");
            lbMoveLimit.getComponent(cc.Label).string = String(levelInfo.limit.item2);
            
            nodeStar1.x = starsBarWidth / levelInfo.stars.step3 * levelInfo.stars.step1;
            nodeStar2.x = starsBarWidth / levelInfo.stars.step3 * levelInfo.stars.step2;
            nodeStar3.x = starsBarWidth / levelInfo.stars.step3 * levelInfo.stars.step3;

            me.colorLimit = levelInfo.colorLimit;
            me.limit = levelInfo.limit.item2;
            me.itemInfo = levelInfo.itemInfo;
            me.rowCnt = levelInfo.rowCnt;
            me.colCnt = levelInfo.colCnt;
            me.mode = levelInfo.mode
            me.item1Cnt = levelInfo.collectCount.item1;me.item2Cnt = levelInfo.collectCount.item2;
            me.target1Idx = levelInfo.collectItems.item1
            me.target2Idx = levelInfo.collectItems.item2
            me.showTarget(levelInfo.mode,levelInfo.stars.step1,{'item':levelInfo.collectItems.item1,'count':levelInfo.collectCount.item1},{'item':levelInfo.collectItems.item2,'count':levelInfo.collectCount.item2})
            me.initField(levelInfo.mode,{'item':levelInfo.collectItems.item1,'count':levelInfo.collectCount.item1},{'item':levelInfo.collectItems.item2,'count':levelInfo.collectCount.item2});
            me.checkGameStatus();
            me.playGamePlayAnimation()

            if (levelInfo.limit.item1 == 0) {
                me.bottomPanel.getChildByName("BoostExtraMoves").active = true;
                me.bottomPanel.getChildByName("BoostExtraTime").active = false;

                if (me.playerInfo.fiveMove > 0) {
                    nodeMoveIndicator.getChildByName("BoostExtraMoves").active = true;
                    nodeMoveIndicator.getChildByName("Plus").active = false;
                }
                else {
                    nodeMoveIndicator.getChildByName("BoostExtraMoves").active = false;
                    nodeMoveIndicator.getChildByName("Plus").active = true;
                }
            }
            else {
                me.bottomPanel.getChildByName("BoostExtraMoves").active = false;
                me.bottomPanel.getChildByName("BoostExtraTime").active = true;

                if (me.playerInfo.extraTime > 0) {
                    nodeExtraTimeIndicator.getChildByName("BoostExtraTime").active = true;
                    nodeExtraTimeIndicator.getChildByName("Plus").active = false; 
                }
                else {
                    nodeExtraTimeIndicator.getChildByName("BoostExtraTime").active = false;
                    nodeExtraTimeIndicator.getChildByName("Plus").active = true; 
                }
            }
        });
    },

    showFinishGameAction(cnt,callback) {
      var rndIdxs = [this.const.TILE_ITEM_RED_HORIZ,this.const.TILE_ITEM_RED_VERT,this.const.TILE_ITEM_ORANGE_HORIZ,
        this.const.TILE_ITEM_ORANGE_VERT,this.const.TILE_ITEM_DARK_PINK_HORIZ,this.const.TILE_ITEM_DARK_PINK_VERT,
        this.const.TILE_ITEM_BLUE_HORIZ,this.const.TILE_ITEM_BLUE_VERT,this.const.TILE_ITEM_GREEN_HORIZ,this.const.TILE_ITEM_GREEN_VERT,
        this.const.TILE_ITEM_YELLOW_HORIZ,this.const.TILE_ITEM_YELLOW_VERT]

      for(var i=0;i<this.rowCnt;i++) {
        var flag = false
        for(var j=0;j<this.colCnt;j++) {
          if(this.checkNormalTile(i,j,this.tileArr[i][j]) == true) {
            var rndval = parseInt(Math.random() * 100) % 10
            if(rndval == 1) {
              var randIdx = parseInt(Math.random() * 100) % rndIdxs.length
              this.showTile(i,j,rndIdxs[randIdx],true)
              flag = true
              break
            }
          }
        }
        if(flag == true) {
          break
        }
      }
      var normalCnt = 0
      for(var i=0;i<this.rowCnt;i++) {
        for(var j=0;j<this.colCnt;j++) {
          if(this.checkNormalTile(i,j,this.tileArr[i][j]) == true) {
            normalCnt++
          }
        }
      }
      cnt--
      this.limit = cnt
      this.checkGameStatus()
      if(cnt > 0) {
        if(normalCnt != 0) {
          var me = this
          setTimeout(function() {
            me.showFinishGameAction(cnt,callback)
          },200)
        }
      }
      else {
        if(callback) callback()
      }
    },

    showTargetLabelString(val1,val2) {
        var me = this
        var _this = this
        var targetScore = me.topPanel.getChildByName("TargetScore");
        if(this.mode == 3) {
            targetScore.getChildByName("block_node").getChildByName("target_block_count")._components[0].string = "<outline color=black><color=white>" + val1 + "</c></o>"
            // if(val1 == 0) {
              
            //   this.ocupied = true
            //   this.showFinishGameAction(this.limit,function() {
            //     var matrix=[]
            //     _this.doRemainsTiles(0,0,function() {
            //         if(_this.currentScore < _this.levelInfo.stars.step1) {
            //             _this.levelFailure();
            //         }
            //         else {
            //             _this.levelSuccess();
            //         }
            //     })
            //   })
            // }
        } else
        if(this.mode == 1 || this.mode == 2) {
            targetScore.getChildByName("candy_target").getChildByName("first").getChildByName("lab").getComponent(cc.Label).string = String(val1)
            targetScore.getChildByName("candy_target").getChildByName("second").getChildByName("lab").getComponent(cc.Label).string = String(val2)
            // if(val1 == 0 && val2 == 0) {
            //   this.ocupied = true
            //     this.showFinishGameAction(this.limit,function() {
            //     var matrix=[]
            //     _this.doRemainsTiles(0,0,function() {
            //         if(_this.currentScore < _this.levelInfo.stars.step1) {
            //             _this.levelFailure();
            //         }
            //         else {
            //             _this.levelSuccess();
            //         }
            //     })
            //   })
            // }
        }
    },    

    showTarget(mode,minscore,item1,item2) {
        var me = this
        var targetScore = me.topPanel.getChildByName("TargetScore");
        if(mode == 0) {
            targetScore.getChildByName("lbTargetScore").active = true
            targetScore.getChildByName("lbTargetScore").getComponent(cc.Label).string = String(minscore);
            targetScore.getChildByName("block_node").active = false
            targetScore.getChildByName("candy_target").active = false
        } else if(mode == 3) {
            targetScore.getChildByName("lbTargetScore").active = false
            targetScore.getChildByName("block_node").active = true
            targetScore.getChildByName("candy_target").active = false
            var blockCnt = 0
            for(var i = 0;i < this.rowCnt;i++)
                for(var j = 0;j < this.colCnt;j++)
                    if(this.itemInfo[i][j] == 20 || this.itemInfo[i][j] == 50 || this.itemInfo[i][j] == 23)
                        blockCnt++
            me.item1Cnt = blockCnt
            targetScore.getChildByName("block_node").getChildByName("target_block_count")._components[0].string = "<outline color=black><color=white>" + blockCnt + "</c></o>"
        } else if(mode == 2) {
            targetScore.getChildByName("lbTargetScore").active = false
            targetScore.getChildByName("block_node").active = false
            targetScore.getChildByName("candy_target").active = true
            if(item1.count != 0) {
                var candies = targetScore.getChildByName("candy_target").getChildByName("first").getChildByName("candy")
                var lab = targetScore.getChildByName("candy_target").getChildByName("first").getChildByName("lab")
                for(var i=0;i<candies.children.length;i++) candies.children[i].active = false
                candies.children[5].active = true
                lab.getComponent(cc.Label).string = String(item1.count)
            } else {
                targetScore.getChildByName("candy_target").getChildByName("first").active = false
            }
            if(item2.count != 0) {
                var candies = targetScore.getChildByName("candy_target").getChildByName("second").getChildByName("candy")
                var lab = targetScore.getChildByName("candy_target").getChildByName("second").getChildByName("lab")
                for(var i=0;i<candies.children.length;i++) candies.children[i].active = false
                candies.children[6].active = true
                lab.getComponent(cc.Label).string = String(item2.count)
            } else {
                targetScore.getChildByName("candy_target").getChildByName("second").active = false
            }
            if(item1.count == 0 && item2.count == 0) {
                targetScore.getChildByName("lbTargetScore").active = true
                targetScore.getChildByName("lbTargetScore").getComponent(cc.Label).string = String(minscore);
                targetScore.getChildByName("block_node").active = false
                targetScore.getChildByName("candy_target").active = false
            }
        } else if(mode == 1) {
            targetScore.getChildByName("lbTargetScore").active = false
            targetScore.getChildByName("block_node").active = false
            targetScore.getChildByName("candy_target").active = true
            if(item1.count != 0) {
                var candies = targetScore.getChildByName("candy_target").getChildByName("first").getChildByName("candy")
                var lab = targetScore.getChildByName("candy_target").getChildByName("first").getChildByName("lab")
                for(var i=0;i<candies.children.length;i++) candies.children[i].active = false
                candies.children[item1.item - 1].active = true
                lab.getComponent(cc.Label).string = String(item1.count)
            } else {
                targetScore.getChildByName("candy_target").getChildByName("first").active = false
            }
            if(item2.count != 0) {
                var candies = targetScore.getChildByName("candy_target").getChildByName("second").getChildByName("candy")
                var lab = targetScore.getChildByName("candy_target").getChildByName("second").getChildByName("lab")
                for(var i=0;i<candies.children.length;i++) candies.children[i].active = false
                candies.children[item2.item - 1].active = true
                lab.getComponent(cc.Label).string = String(item2.count)
            } else {
                targetScore.getChildByName("candy_target").getChildByName("second").active = false
            }
            if(item1.count == 0 && item2.count == 0) {
                targetScore.getChildByName("lbTargetScore").active = true
                targetScore.getChildByName("lbTargetScore").getComponent(cc.Label).string = String(minscore);
                targetScore.getChildByName("block_node").active = false
                targetScore.getChildByName("candy_target").active = false
            }
        }
    },
    
    doRemainsTiles(x,y,callback) {
        var ret = []
        var matrix = []
        for(var i = 0;i < this.rowCnt;i ++) {
            matrix[i] = []
            for(var j = 0;j < this.colCnt;j++)
                matrix[i][j] = -1
        }
        var bombs = [this.const.TILE_ITEM_RED_EXT,this.const.TILE_ITEM_ORANGE_EXT,this.const.TILE_ITEM_DARK_PINK_EXT,this.const.TILE_ITEM_BLUE_EXT,this.const.TILE_ITEM_GREEN_EXT,this.const.TILE_ITEM_YELLOW_EXT]
        var horizs = [this.const.TILE_ITEM_RED_HORIZ,this.const.TILE_ITEM_ORANGE_HORIZ,this.const.TILE_ITEM_DARK_PINK_HORIZ,this.const.TILE_ITEM_BLUE_HORIZ,this.const.TILE_ITEM_GREEN_HORIZ,this.const.TILE_ITEM_YELLOW_HORIZ]
        var verts = [this.const.TILE_ITEM_RED_VERT,this.const.TILE_ITEM_ORANGE_VERT,this.const.TILE_ITEM_DARK_PINK_VERT,this.const.TILE_ITEM_BLUE_VERT,this.const.TILE_ITEM_GREEN_VERT,this.const.TILE_ITEM_YELLOW_VERT]
        var e_flag = -1
        for(var k = 0; k < bombs.length;k++) {
            if(bombs[k] == this.tileArr[x][y]) {
                e_flag = 1
                break
            }
        }
        for(var k = 0; k < horizs.length;k++) {
            if(horizs[k] == this.tileArr[x][y]) {
                e_flag = 2
                break
            }
        }
        for(var k = 0; k < verts.length;k++) {
            if(verts[k] == this.tileArr[x][y]) {
                e_flag = 3
                break
            }
        }
        if(this.tileArr[x][y] == this.const.TILE_CHOCO) {
            e_flag = 4
        }

        if(e_flag != -1) {
            if(e_flag != 4) {
                matrix[x][y] = 1
                ret.push({'x': 0,'y': 0,'rowCnt': this.rowCnt,'colCnt': this.colCnt,'matrix': matrix})
                this.ocupied = true
                var me = this
                this.exploidTiles(ret,function() {
                    me.fillTiles(ret,null,null,function() {
                        me.backupGameBoard()
                        e_flag = -1
                        var findflag = false
                        for(var i = 0;i < me.rowCnt;i++) {
                            for(var j = 0;j < me.colCnt;j++) {
                                for(var k = 0; k < bombs.length;k++) {
                                    if(bombs[k] == me.tileArr[x][y]) {
                                        e_flag = 1
                                        break
                                    }
                                }
                                for(var k = 0; k < horizs.length;k++) {
                                    if(horizs[k] == me.tileArr[x][y]) {
                                        e_flag = 2
                                        break
                                    }
                                }
                                for(var k = 0; k < verts.length;k++) {
                                    if(verts[k] == me.tileArr[x][y]) {
                                        e_flag = 3
                                        break
                                    }
                                }
                                if(me.tileArr[i][j] == me.const.TILE_CHOCO) {
                                    e_flag = 4
                                }
                                if(e_flag != -1) {
                                    // if(e_flag != 4) {

                                    // }
                                    me.doRemainsTiles(i,j)
                                    findflag = true
                                    break
                                }
                            }
                            if(findflag) {
                                break
                            }
                        }
                        if(!findflag) {
                            if(callback) callback()
                        }
                    })
                })
            }
            else {
                var me = this
                this.excuteChocoTile(x,y,function() {
                    e_flag = -1
                    var findflag = false
                    for(var i = 0;i < me.rowCnt;i++) {
                        for(var j = 0;j < me.colCnt;j++) {
                            for(var k = 0; k < bombs.length;k++) {
                                if(bombs[k] == me.tileArr[x][y]) {
                                    e_flag = 1
                                    break
                                }
                            }
                            for(var k = 0; k < horizs.length;k++) {
                                if(horizs[k] == me.tileArr[x][y]) {
                                    e_flag = 2
                                    break
                                }
                            }
                            for(var k = 0; k < verts.length;k++) {
                                if(verts[k] == me.tileArr[x][y]) {
                                    e_flag = 3
                                    break
                                }
                            }
                            if(me.tileArr[i][j] == me.const.TILE_CHOCO) {
                                e_flag = 4
                            }
                            if(e_flag != -1) {
                                me.doRemainsTiles(i,j)
                                findflag = true
                                break
                            }
                        }
                        if(findflag) {
                            break
                        }
                    }
                    if(!findflag) {
                        if(callback) callback()
                    }
                })
            }
        } else {
            e_flag = -1
            var findflag = false
            for(var i = 0;i < this.rowCnt;i++) {
                for(var j = 0;j < this.colCnt;j++) {
                    for(var k = 0; k < bombs.length;k++) {
                        if(bombs[k] == this.tileArr[i][j]) {
                            e_flag = 1
                            break
                        }
                    }
                    for(var k = 0; k < horizs.length;k++) {
                        if(horizs[k] == this.tileArr[i][j]) {
                            e_flag = 2
                            break
                        }
                    }
                    for(var k = 0; k < verts.length;k++) {
                        if(verts[k] == this.tileArr[i][j]) {
                            e_flag = 3
                            break
                        }
                    }
                    if(this.tileArr[i][j] == this.const.TILE_CHOCO) {
                        e_flag = 4
                    }
                    if(e_flag != -1) {
                        this.doRemainsTiles(i,j)
                        findflag = true
                        break
                    }
                }
                if(findflag) {
                    break
                }
            }
            if(!findflag)
                if(callback) callback()
        }
    },

    checkGameStatus() {
        var playScore = this.topPanel.getChildByName("PlayScore");
        playScore.getChildByName("lbPlayScore").getComponent(cc.Label).string = String(this.currentScore);
        
        this.maskStarBar.width = 228.6 / this.levelInfo.stars.step3 * this.currentScore;

        var lbMoveLimit = this.topPanel.getChildByName("lbMoveLimit");
        lbMoveLimit.getComponent(cc.Label).string = String(this.limit);
        if(this.limit <= 5) {
          lbMoveLimit.getComponent(cc.Label).node.color = cc.Color.RED
          lbMoveLimit.getComponent(cc.Label).getComponent(cc.LabelOutline).color = cc.Color.WHITE
        } else {
          lbMoveLimit.getComponent(cc.Label).node.color = cc.color(255,255,255)
          lbMoveLimit.getComponent(cc.Label).getComponent(cc.LabelOutline).color = cc.color(167,96,123)
        }
        
        var nodeStar1 = this.topPanel.getChildByName("StarsBar").getChildByName("Star1");
        var nodeStar2 = this.topPanel.getChildByName("StarsBar").getChildByName("Star2");
        var nodeStar3 = this.topPanel.getChildByName("StarsBar").getChildByName("Star3");
        
        if (this.currentScore >= this.levelInfo.stars.step1) {
            nodeStar1.getChildByName("star_for_bar_01").active = false;
            nodeStar1.getChildByName("star_for_bar_02").active = true;
        }
        else {
            nodeStar1.getChildByName("star_for_bar_01").active = true;
            nodeStar1.getChildByName("star_for_bar_02").active = false;
        }
        
        if (this.currentScore >= this.levelInfo.stars.step2) {
            nodeStar2.getChildByName("star_for_bar_01").active = false;
            nodeStar2.getChildByName("star_for_bar_02").active = true;
        }
        else {
            nodeStar2.getChildByName("star_for_bar_01").active = true;
            nodeStar2.getChildByName("star_for_bar_02").active = false;
        }

        if (this.currentScore >= this.levelInfo.stars.step3) {
            nodeStar3.getChildByName("star_for_bar_01").active = false;
            nodeStar3.getChildByName("star_for_bar_02").active = true;
        }
        else {
            nodeStar3.getChildByName("star_for_bar_01").active = true;
            nodeStar3.getChildByName("star_for_bar_02").active = false;
        }
    },

    levelFailure() {

    },

    levelSuccess() {
        var passedLevelInfo = this.playerInfo.levelInfos[this.playerInfo.doingPlayLevel - 1];
        passedLevelInfo.passed = 1;
        if (this.currentScore > passedLevelInfo.bestScore) {
            passedLevelInfo.bestScore = this.currentScore;
        }

        passedLevelInfo.lastScore = this.currentScore;

        if (this.currentScore >= this.levelInfo.stars.step1) {
            passedLevelInfo.star = 1;
        }

        if (this.currentScore >= this.levelInfo.stars.step2) {
            passedLevelInfo.star++;
        }

        if (this.currentScore >= this.levelInfo.stars.step3) {
            passedLevelInfo.star++;
        }

        this.playerInfo.score += this.currentScore;

        this.savePlayerInfo();
        this.playSound(this.SOUND_COMPLETE_LEVEL);
        setTimeout(this.showCompleteMenu(), 1000);
        this.showCompleteMenu();
    },

    showCompleteMenu() {
        this.playSound(this.SOUND_CHEER);
        this.boardComplete.active = true;

        var animCtrl = this.boardComplete.getChildByName("container").getComponent(cc.Animation);
        animCtrl.play("MenuAnim2");

        var nodeStarBar = this.boardComplete.getChildByName("container").getChildByName("star");
        var nodeStar1 = nodeStarBar.getChildByName("star_01");
        var nodeStar2 = nodeStarBar.getChildByName("star_02");
        var nodeStar3 = nodeStarBar.getChildByName("star_03");
        nodeStar1.active = false;
        nodeStar2.active = false;
        nodeStar3.active = false;

        var lbScore = this.boardComplete.getChildByName("container").getChildByName("lbScore");
        var lbLevel = this.boardComplete.getChildByName("container").getChildByName("lbLevel");

        lbLevel.getComponent(cc.Label).string = this.playerInfo.doingPlayLevel;
        lbScore.getComponent(cc.Label).string = this.currentScore;
        
        var anim1 = nodeStar1.getComponent(cc.Animation);
        var anim2 = nodeStar2.getComponent(cc.Animation);
        var anim3 = nodeStar3.getComponent(cc.Animation);
        var me = this;
        if (this.currentScore >= this.levelInfo.stars.step1) {
            setTimeout(function() {
                nodeStar1.active = true;
                if (anim1 == null) {
                    console.log("test");
                }
                anim1.play("StarAnim");
                me.playSound(me.SOUND_BUTTON_CLICK);
            }, 500);
        }

        if (this.currentScore >= this.levelInfo.stars.step2) {
            setTimeout(function() {
                nodeStar2.active = true;
                anim2.play("StarAnim");
                me.playSound(me.SOUND_BUTTON_CLICK);
            }, 1000);
        }

        if (this.currentScore >= this.levelInfo.stars.step3) {
            setTimeout(function() {
                nodeStar3.active = true;
                anim3.play("StarAnim");
                me.playSound(me.SOUND_BUTTON_CLICK);
            }, 1500);
        }
    },

    closeCompleteMenu(event) {
        this.playSound(this.SOUND_BUTTON_CLICK);
        this.boardComplete.active = false;
        cc.director.loadScene("Map");
    },

    nextLevelPlay(event) {
        this.playSound(this.SOUND_BUTTON_CLICK);
        this.boardComplete.active = false;

        this.playerInfo.doingPlayLevel++;
        this.ocupied = true
        var me = this
        setTimeout(function() {
            me.resetGameStatus()
            me.checkGameStatus()
            me.savePlayerInfo();
            
        },1000 * 1.75)
    },

    rePlay(event) {
        this.playSound(this.SOUND_BUTTON_CLICK);
        this.boardFail.active = false;
    },

    showFailMenu() {
        this.playSound(this.SOUND_BUTTON_CLICK);

        var lbScore = this.boardFail.getChildByName("container").getChildByName("lbScore");
        var lbLevel = this.boardFail.getChildByName("container").getChildByName("lbLevel");
        var nodeResult1 = this.boardFail.getChildByName("container").getChildByName("Result1");
        var nodeResult2 = this.boardFail.getChildByName("container").getChildByName("Result2");
        var iconComplete1 = nodeResult1.getChildByName("Icon").getChildByName("v_completed");
        var iconFail1 = nodeResult1.getChildByName("Icon").getChildByName("x_failed");
        var iconComplete2 = nodeResult2.getChildByName("Icon").getChildByName("v_completed");
        var iconFail2 = nodeResult2.getChildByName("Icon").getChildByName("x_failed");
        var lbResult1 = nodeResult1.getChildByName("lbResult1");
        var lbResult2 = nodeResult2.getChildByName("lbResult2");

        lbLevel.getComponent(cc.Label).string = this.playerInfo.doingPlayLevel;
        lbScore.getComponent(cc.Label).string = this.currentScore; 

        lbResult2.getComponent(cc.Label).string = "Get one star";
        if (this.currentScore >= this.levelInfo.stars.step1) {
             iconComplete2.active = true;
             iconFail2.active = false;   
        }
        else {
            iconComplete2.active = false;
             iconFail2.active = true;
        }

        switch (this.levelInfo.mode) {
            case 0:
                lbResult1.getComponent(cc.Label).string = "Get " + this.levelInfo.stars.step1 + " scores";
                if (this.currentScore >= this.levelInfo.stars.step1) {
                    iconComplete1.active = true;
                    iconFail1.active = false; 
                }
                else {
                    iconComplete1.active = false;
                    iconFail1.active = true;          
                }
            break;
            case 1:
                lbResult1.getComponent(cc.Label).string = "Collect the items";
                if (this.item1Cnt >= this.levelInfo.collectCount.item1
                    || this.item2Cnt >= this.levelInfo.collectCount.item2) {
                    iconComplete1.active = true;
                    iconFail1.active = false; 
                }
                else {
                    iconComplete1.active = false;
                    iconFail1.active = true;          
                }
            break;
            case 2:
                lbResult1.getComponent(cc.Label).string = "Collect all ingredients";
                if (this.item1Cnt >= this.levelInfo.collectCount.item1
                    || this.item2Cnt >= this.levelInfo.collectCount.item2) {
                    iconComplete1.active = true;
                    iconFail1.active = false; 
                }
                else {
                    iconComplete1.active = false;
                    iconFail1.active = true;          
                }
            break;
            case 3:
                lbResult1.getComponent(cc.Label).string = "Collect all blocks";
                if (this.item1Cnt == 0) {
                    iconComplete1.active = true;
                    iconFail1.active = false; 
                }
                else {
                    iconComplete1.active = false;
                    iconFail1.active = true;          
                }
            break;
        }

        this.boardFail.active = true;

        var animCtrl = this.boardFail.getChildByName("container").getComponent(cc.Animation);
        animCtrl.play("MenuAnim2");
    },

    closeFailMenu(event) {
        this.playSound(this.SOUND_BUTTON_CLICK);
        this.boardFail.active = false;
        cc.director.loadScene("Map");
    },

    showPauseMenu(event) {
        if(this.ocupied == true)
          return
        this.playSound(this.SOUND_BUTTON_CLICK);

        var animCtrl = this.boardPause.getChildByName("container").getComponent(cc.Animation);
        var btnSoundOff = this.boardPause.getChildByName("container").getChildByName("btn_sound").getChildByName("pause_sound_off_button");
        var btnSoundOn = this.boardPause.getChildByName("container").getChildByName("btn_sound").getChildByName("pause_sound_on_button");
        var btnMusicOff = this.boardPause.getChildByName("container").getChildByName("btn_music").getChildByName("pause_music_off_button");
        var btnMusicOn = this.boardPause.getChildByName("container").getChildByName("btn_music").getChildByName("pause_music_on_button");

        if (this.playerInfo.sound == 0) {
            btnSoundOn.active = false;
            btnSoundOff.active = true;
        }
        else {
            btnSoundOn.active = true;
            btnSoundOff.active = false;
        }

        if (this.playerInfo.music == 0) {
            btnMusicOn.active = false;
            btnMusicOff.active = true; 
        }
        else {
            btnMusicOn.active = true;
            btnMusicOff.active = false;      
        }

        this.setEnabledBtnFunc(false);

        this.boardPause.active = true;
        animCtrl.play("MenuAnim2");
    },

    closePauseMenu(event) {
        this.playSound(this.SOUND_BUTTON_CLICK);
        this.boardPause.active = false;
        this.setEnabledBtnFunc(true);
    },

    exitGameScene(event) {
        cc.director.loadScene("Map");
    },

    setSoundMode(event) {
        this.playSound(this.SOUND_BUTTON_CLICK);

        var btnSoundOff = this.boardPause.getChildByName("container").getChildByName("btn_sound").getChildByName("pause_sound_off_button");
        var btnSoundOn = this.boardPause.getChildByName("container").getChildByName("btn_sound").getChildByName("pause_sound_on_button");
        
        if (this.playerInfo.sound == 0) {
            this.playerInfo.sound = 1;
            btnSoundOn.active = true;
            btnSoundOff.active = false;
        }
        else {
            this.playerInfo.sound = 0;
            btnSoundOn.active = false;
            btnSoundOff.active = true;
        }

        this.savePlayerInfo();
    },

    setMusicMode(event) {
        this.playSound(this.SOUND_BUTTON_CLICK);
        var btnMusicOff = this.boardPause.getChildByName("container").getChildByName("btn_music").getChildByName("pause_music_off_button");
        var btnMusicOn = this.boardPause.getChildByName("container").getChildByName("btn_music").getChildByName("pause_music_on_button");

        if (this.playerInfo.music == 0) {
            this.playerInfo.music = 1;

            btnMusicOn.active = true;
            btnMusicOff.active = false;    

            this.playMusic();          
        }
        else {
            this.playerInfo.music = 0;

            btnMusicOn.active = false;
            btnMusicOff.active = true; 

            this.muteMusic();            
        }

        this.savePlayerInfo();
    },

    setEnabledBtnFunc(bl) {
        var btnMove = this.bottomPanel.getChildByName("BoostExtraMoves");
        var btnHand = this.bottomPanel.getChildByName("BoostHand");
        var btnRandomColor = this.bottomPanel.getChildByName("BoostRandom_color");
        var btnBomb = this.bottomPanel.getChildByName("BoostBomb");
        var btnExtraTime = this.bottomPanel.getChildByName("BoostExtraTime");
        var btnPause = this.topPanel.getChildByName("Pause");

        btnPause.getComponent(cc.Button).interactable = bl;
        btnMove.getComponent(cc.Button).interactable = bl;
        btnHand.getComponent(cc.Button).interactable = bl;
        btnRandomColor.getComponent(cc.Button).interactable = bl;
        btnBomb.getComponent(cc.Button).interactable = bl;
        btnExtraTime.getComponent(cc.Button).interactable = bl;
    }

    // update (dt) {},
});
