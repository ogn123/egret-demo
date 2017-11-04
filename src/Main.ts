//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {
                console.log('hello,world')
            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }


        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        //针对CONFIG_COMPLETE事件的侦听，然后执行加载
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        //移除了对CONFIG_COMPLETE事件的侦听，这是一个推荐做法，因为我们不再需要加载配置文件，该侦听也就没有作用了
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);  

        //对资源组事件的监听
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("heroes");  //加载资源组，资源组名为heroes
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "heroes") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;
    


    //  用户编写
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {

        //添加背景色
        //我们首先建立一个egret.Shape对象bg，这是由于egret.Shape对象有图形绘制功能。我们要绘制的背景的工作就用这个对象来完成。
        var bg:egret.Shape = new egret.Shape; 
        //开始绘制，Shape对象中有graphic属性，用来专门负责图形绘制的工作
        bg.graphics.beginFill( 0x336699 );  //绘图前填充颜色
        bg.graphics.drawRect( 0, 0, this.stage.stageWidth, this.stage.stageHeight );  //绘制矩形 起点坐标,终点坐标
        bg.graphics.endFill();  //结束绘制工作
        this.addChild( bg ); 


        //添加文字
        var tx:egret.TextField = new egret.TextField;
        tx.text = "I'm Jack, I will use Egret create a fantasy mobile game!"; 
        tx.size = 32; 
        tx.x = 20; tx.y = 20; 
        tx.width = this.stage.stageWidth - 40;
        this.addChild( tx );

        tx.touchEnabled = true; 
        tx.addEventListener( egret.TouchEvent.TOUCH_TAP, this.touchHandler, this );

        //添加2张图片
        var batman:egret.Bitmap = new egret.Bitmap( RES.getRes("bg_jpg") );
            batman.x = 80;
            batman.y = 60;
            this.addChild( batman );
        var logo:egret.Bitmap = new egret.Bitmap( RES.getRes("egret_icon_png") );
            logo.x = 40;
            logo.y = 100;
            this.addChild( logo );
        

        console.log( "未修改前的显示深度", this.getChildIndex( bg ),this.getChildIndex( tx ), this.getChildIndex( batman ),  this.getChildIndex( logo ) );

        //修改显示深度《显示深度总是从零开始连续的，当某个深度位置的显示对象被设置为其他深度时，原来的深度会自动被紧邻的比其深度值大1位置的显示对象占据，后续深度位置的显示对象会依次往前排。》
        this.setChildIndex(tx,this.getChildIndex(batman));
        // this.swapChildren(bg,logo);  //深度互换
        //this.setChildIndex( captain, 20 ); 设置深度如果超过最大值，不会报错，将会以最大值显示
        console.log( "修改后的显示深度", this.getChildIndex( bg ),this.getChildIndex( tx ), this.getChildIndex( batman ),  this.getChildIndex( logo ) );
        

        
        



       /*
        Tween:基本用法
        Tween.get内传入需要对其进行动画控制的对象，并返回一个Tween对象。然后可以设置Tween对象的动画，即调用to方法。 to方法包含三个参数。 首先是动画目标属性组，这个参数可以对目标对象本身的各项属性进行设定，就是动画结束时的状态，可以设定一个或多个属性。 第二个参数是动画时间，以毫秒计。 第三个参数是补间方程，即对动画区间内每个时间点的属性值设定分布。在egret.Ease已经提供了丰富的补间方程，可以根据自己的喜好选择。
       */
        // tween点击动画
        logo.anchorOffsetX = .5;
        logo.anchorOffsetX = 1;
        logo.x = logo.x + logo.width / 2; 
        logo.y = logo.y + logo.height;
        this.times = -1;
        var self = this;
        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, function(){
             switch ( ++ self.times % 3 ) {
                  case 0:
                    //图片位移
                    egret.Tween.get( tx ).to( { x:logo.x }, 300, egret.Ease.circIn );
                    egret.Tween.get( logo ).to( { x:tx.x }, 300, egret.Ease.circIn );
                    break;
                  case 1:
                    //设置透明度
                    egret.Tween.get( batman ).to( { alpha:.3 }, 300, egret.Ease.circIn ).to( { alpha:1 }, 300, egret.Ease.circIn );
                    //加入声音
                    var sound:egret.Sound = RES.getRes( "bonus_mp3" ); sound.play();
                    break; 
                  case 2:
                    //图片缩放
                    egret.Tween.get( logo ).to( { scaleX:.4, scaleY:.4 }, 500, egret.Ease.circIn ).to( { scaleX:1, scaleY:1 }, 500, egret.Ease.circIn );

                    var urlreq:egret.URLRequest = new egret.URLRequest( "http://httpbin.org/user-agent" );
                    var urlloader:egret.URLLoader = new egret.URLLoader;
                    urlloader.addEventListener( egret.Event.COMPLETE, function( evt:egret.Event ):void{
                        console.log(evt.target.data);
                    }, this );
                    urlloader.load( urlreq );
                   break; 
            } 
        
        }, this );

        

    }
    
    private times:number;

    //添加点击事件
    private touchHandler( evt:egret.TouchEvent ):void{
        var tx:egret.TextField = evt.currentTarget;
        tx.textColor = 0x00ff00; 



    }
 
}


