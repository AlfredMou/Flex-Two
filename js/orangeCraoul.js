(function(){
	if ($) {
		function extend(subClass,superClass){
			var fn = function(){};
			fn.prototype=superClass.prototype;
			subClass.prototype=new fn();
		}
		var defaultArg={
			timeOut:false,
			timeOutSpeed:5000,
			selectSpeed:200,
			prevButton:"",
			nextButton:"",
			selectButtonColor:"#FC913A"
		}
		function Carousel(element,obj){
			this.primary=element;
			this.list = element.find('li').clone();
			this.usersArg=obj;
			this.listUl=null;
			this.listInclude=null;
			this.carousel=null;
			this.nextButton=null;
			this.prvButton=null;
			if(obj.prevButton){
				this.prevButtonBackGround=obj.prevButton;
			}
			if(obj.nextButton){
				this.nextButtonBackGround=obj.nextButton;
			}
			this.singleWidth=element.find('img').first().width();
			this.singeHeight = element.find('img').first().height();
			this.selectNow=0;
			this.imageNum=this.list.length;
		};
		Carousel.prototype.display=function(){
		    var carousel = $(document.createElement("div"));
			var imageListDiv=$(document.createElement("div"));
			var imageList=$(document.createElement("ul"));
			if(this.prevButtonBackGround){
				var thisPrv=$(document.createElement("div"));
				this.prvButton=thisPrv;
				thisPrv.css({
					position: "absolute",
					width: "10%",
					height: "20%",
					"background-image": "url('"+this.prevButtonBackGround+"')",
					"background-position":"center",
					"background-size":"cover",
					top:"40%",
					cursor: "pointer",
					"z-index":3
				});
			    carousel.append(thisPrv);
			}
			
			carousel.html("");
			this.listUl=imageList;
			this.listInclude=imageListDiv;
			this.carousel=carousel;

			carousel.css({
				width: this.singleWidth+'px',
				height: this.singeHeight+'px',
				position:"relative",
				overflow: "hidden",
				display:"block",
			});

			imageListDiv.css({
				width: this.singleWidth*3+'px',
				height: this.singeHeight+'px',
			});

			imageList.css({
				"list-style": "none",
				padding: "0px",
				margin: "0px",
			});
				
			this.list.css({
				"float": "left",
				"position": "relative",
				"z-index":2
			});
			imageList.append(this.list[0]);
			imageListDiv.append(imageList);
			carousel.append(thisPrv);
			carousel.append(imageListDiv);
			carousel.append(thisNext);
			if(this.nextButtonBackGround){
				var thisNext=$(document.createElement("div"));
				this.nextButton=thisNext;
				thisNext.css({
					position: "absolute",
					top:"40%",
					width: "10%",
					height: "20%",
					"background-image": "url('"+this.nextButtonBackGround+"')",
					"background-position":"center",
					"background-size":"cover",
					right: "0px",
					cursor: "pointer",
					"z-index":4
				});
			    carousel.append(thisNext);
			}
			this.primary.after(carousel);

		}
		Carousel.prototype.addEvent=function(context){
			var that=context||this;
			this.nextButton.on('click', function(event) {
				that.next();
			});
			this.prvButton.on('click', function(event) {
				that.prev();
			});
		}
		Carousel.prototype.showWidth=function(){
			console.log(this.singleWidth);
		}
		Carousel.prototype.next=function(){
			var showNow=this.selectNow+1;
			this.select(showNow);
		};
		Carousel.prototype.prev=function(){
			var showNow=this.selectNow-1;
			this.select(showNow);
		};
		Carousel.prototype.select=function(selectValue){
			if(selectValue>=this.imageNum){
				this.selectNow=0;
			}else if(selectValue<0){
				this.selectNow=this.imageNum-1;
			}else{
				this.selectNow=selectValue;
			}
			showNow=$(this.list[this.selectNow]).clone();
			this.listUl.children().first().after(showNow);
			this.listInclude.css({"margin-left": "-"+this.singleWidth+"px"});
		    this.listUl.children().first().remove();
		    this.listInclude.css("margin-left","0px");
		};


		function CarouselDecorate(Carousel){
			this.carousel=Carousel;
		}
		CarouselDecorate.prototype.display=function(){
			this.carousel.display();
		}
		CarouselDecorate.prototype.addEvent=function(){
			this.carousel.addEvent();
		}
		CarouselDecorate.prototype.showWidth=function(){
			this.carousel.showWidth();
		}
		CarouselDecorate.prototype.next=function(){
			this.carousel.next();
		};
		CarouselDecorate.prototype.prev=function(){
			this.carousel.prev();
		};
		CarouselDecorate.prototype.select=function(selectValue){
			this.carousel.select(selectValue);
		};




		function CommentCarousel(Carousel,obj,callBack){
			CarouselDecorate.call(this,Carousel);
			this.selectList=null;
			this.timeOut= obj.timeOut||defaultArg.timeOut;
			this.timeOutSpeed=obj.timeOutSpeed||defaultArg.timeOutSpeed;
			this.selectSpeed=obj.selectSpeed||defaultArg.selectSpeed;
			this.buttonColor=obj.selectButtonColor||defaultArg.selectButtonColor;
			this.selectBottonNow = null;
			this.selectTimeOut = null;
			this.callBack=callBack;
		};

		extend(CommentCarousel,CarouselDecorate);

		CommentCarousel.prototype.changeSelectBotton=function(){
			var selectBotton=this.selectList.children().eq(this.carousel.selectNow);
			
			this.selectBottonNow.css({
        		"background-color":'inherit',
        		width: "5px"
	        });
	        selectBotton.css({
        		"background-color": this.buttonColor,
        		width:"20px"
	        });
	        this.selectBottonNow=selectBotton;
		};

		CommentCarousel.prototype.select=function(selectValue,noPerson){
		    var selectBefore = this.carousel.selectNow;
		    var that = this;
		    // this.carousel.select(selectValue);
		    clearTimeout(this.selectTimeOut);
            if (this.carousel.selectNow === selectValue) {
            	if(this.timeOut&&noPerson){
					this.selectTimeOut = setTimeout(function () { that.select(selectValue + 1,true) },this.timeOutSpeed);
            	}
				return;
			}
            if (selectValue >= this.carousel.imageNum) {
                selectValue = 0;
				this.carousel.selectNow=0;
			}else if(selectValue<0){
				selectValue=this.carousel.imageNum-1;
				this.carousel.selectNow=this.carousel.imageNum-1;
			}else{
				this.carousel.selectNow=selectValue;
			}
			if(selectBefore<this.carousel.selectNow){
				this.afterSelect();
			}else{
				this.prvSelect();
			}
			if(this.timeOut&&noPerson){
				this.selectTimeOut = setTimeout(function () { that.select(selectValue + 1,true) },this.timeOutSpeed);
           	}
			// showNow=$(this.list[this.selectNow]).clone();
			// this.listUl.children().first().after(showNow);
			// this.listInclude.css({"margin-left": "-"+this.singleWidth+"px"});
		 //    this.listUl.children().first().remove();
		 //    this.listInclude.css("margin-left","0px");
			this.changeSelectBotton();
		};
	    CommentCarousel.prototype.setTimeOut=function(){
	    	var that=this;
			this.selectTimeOut=setTimeout(function () { 
				that.select(that.carousel.selectNow + 1,true); 
			},this.timeOutSpeed);
			this.carousel.carousel.on("mouseenter",function(){
				clearTimeout(that.selectTimeOut);
			})
			this.carousel.carousel.on("mouseleave",function(){
				that.selectTimeOut=setTimeout(function () { 
					that.select(that.carousel.selectNow + 1,true);
				},that.timeOutSpeed);
			})

		};
		CommentCarousel.prototype.prvSelect=function(){
			var that=this;
			this.carousel.listInclude.stop( false,true);
			showNow=$(this.carousel.list[this.carousel.selectNow]).clone();
			this.carousel.listInclude.css({"margin-left": "-"+this.carousel.singleWidth+"px"});
			this.carousel.listUl.children().first().before(showNow);
			this.carousel.listInclude.animate({"margin-left": "0px"}, this.selectSpeed,function(){
				that.carousel.listUl.children().eq(1).remove();
				if (that.callBack) {
					that.callBack(that.carousel.listUl.children().first()[0]);
				};
			});
		    
		}
		CommentCarousel.prototype.afterSelect=function(){
			var that=this;
			this.carousel.listInclude.stop( false,true);
			showNow=$(this.carousel.list[this.carousel.selectNow]).clone();
			this.carousel.listUl.children().first().after(showNow);
			this.carousel.listInclude.animate({"margin-left": "-"+this.carousel.singleWidth+"px"}, this.selectSpeed,function(){
				that.carousel.listInclude.css("margin-left","0px");
				that.carousel.listUl.children().first().remove();
				if (that.callBack) {
					that.callBack(that.carousel.listUl.children().first()[0]);
				};
			});
		    
		}
		CommentCarousel.prototype.next=function(){
			var showNow=this.carousel.selectNow+1;
			this.select(showNow);
		};
		CommentCarousel.prototype.prev=function(){
			var showNow=this.carousel.selectNow-1;
			this.select(showNow);
		};
		
	    CommentCarousel.prototype.addEvent=function(context){
	    	var that=this.carousel;
	    	this.carousel.addEvent(context||this);
	    	this.carousel.carousel.on('mouseenter', function(event) {
	    		that.prvButton.css({
	    			display: 'block',
	    		});
				that.nextButton.css({
	    			display: 'block',
	    		});
	    	});
	    	this.carousel.carousel.on('mouseleave', function(event) {
	    		that.prvButton.css({
	    			display: 'none',
	    		});
				that.nextButton.css({
	    			display: 'none',
	    		});
	    	});
	    };

	    CommentCarousel.prototype.display=function(context){
	    	var selectList=$(document.createElement("div")),
				selectListUl=$(document.createElement("ul")),
				selectButtun=$(document.createElement("li")),
				that=context||this,
				selectNum=this.carousel.imageNum,
				messageDiv=$(document.createElement("div"));
				messageDivBackGround=$(document.createElement("div"));
			this.selectList=selectListUl;
			messageDivBackGround.css({
				position: "absolute",
				bottom:" 0",
				height: "30%",
				"padding-top": "10px",
				margin:"0px",
				"background-color":"black",
				opacity: "0.5",
				color: "white",
				"text-align":"center",
				width: "100%",
				display: "block",
				"z-index":6
			})
			messageDiv.css({
				position: "absolute",
				bottom:" 0",
				height: "27%",
				"padding-top": "10px",
				margin:"0px",
				color: "white",
				"text-align":"center",
				width: "100%",
				display: "block",
				"z-index":8
			});
	    	selectList.css({
	    		position: "absolute",
				bottom: "5%",
				left: "0px",
				right: "0px",
				height:"5%",
				"text-align": "center",
				"z-index":10

	    	});
	    	selectListUl.css({
	    		"list-style": "none",
				"padding": "0px",
				margin: "0px",
				margin: "auto",
				width: (13*selectNum+20)+"px",
				height: "8px"
	    	});
	        selectButtun.css({
					float: "left",
					width: "6px",
					height: "6px",
					border: "1px solid "+this.buttonColor,
					"border-radius":"5px",
					"margin-right": "5px",
					"-webkit-transition": "width 0.5s ease-out",
					"-moz-transition": "width 0.5s ease-out",
					"-o-transition": "width 0.5s ease-out",
					"transition": "width 0.5s ease-out"
			});
	        selectButtun.on('click', function(event) {
	        	// that.selectBottonNow.css({
	        	// 	"background-color":'inherit',
	        	// 	width: "5px"
		        // });
		        // $(this).css({
	        	// 	"background-color": '#FC913A',
	        	// 	width:"20px"
		        // });
		        var imgIndex=that.selectList.children().index(this);
		        that.select(imgIndex);
		        // that.selectBottonNow=$(this);
	        });
	        for (var i = this.carousel.list.length - 1; i >= 0; i--) {
	        	var message= $(this.carousel.list[i]).find('img').nextAll();
	        	$(this.carousel.list[i]).append(messageDiv.clone().append(message.clone())).append(messageDivBackGround.clone());
	        	message.remove();
	        };
	    	for (var i = selectNum-1; i >= 0; i--) {
	    		if (i == selectNum-1) {
	    			this.selectBottonNow=selectButtun.clone(true);
	    			selectListUl.append(this.selectBottonNow.css({
	    				"background-color": this.buttonColor,
	    				width: '20px',
	    			}))
	    			continue;
	    		};
	    		selectListUl.append(selectButtun.clone(true))
	    	};
	    	selectList.append(selectListUl);

			this.carousel.display();
			this.carousel.carousel.append(selectList);
			this.carousel.nextButton.css({
				display: 'none'
			});
			this.carousel.prvButton.css({
				display: 'none'
			});
		};


		function PreviewCarousel(Carousel,obj){
			CarouselDecorate.call(this,Carousel);
			this.selectList=null;
			this.previewNum=obj.previewNum||5;
			this.selectNext=this.previewNum-1;
			this.selectBefore=0;
			this.selectPrev=0;
			this.selectBottonNow=null;
			this.previewWidth=Carousel.singleWidth/this.previewNum;
			this.previewHeight=((Carousel.singleWidth/this.previewNum)/Carousel.singleWidth)* Carousel.singeHeight;
		};

		PreviewCarousel.prototype.changeSelectBotton=function(){
			var selectBotton=this.selectList.children().eq(this.carousel.selectNow);
			var moreImage=this.carousel.selectNow%this.previewNum;
			if(this.carousel.selectNow<this.carousel.imageNum-1 && this.carousel.selectNow>0){
				if(this.carousel.selectNow===this.selectNext){
					this.nextSelectList();
					this.selectNext=this.selectNext+1;
					this.selectPrev=this.selectPrev+1;
				}
				if(this.carousel.selectNow===this.selectPrev){
					this.prvSelectList();
					this.selectNext=this.selectNext-1;
					this.selectPrev=this.selectPrev-1;
				}
			}
			if(this.carousel.selectNow===this.carousel.imageNum-1){
				this.endSelectLList();
				this.selectNext=this.carousel.imageNum-1;
				this.selectPrev=this.carousel.imageNum-this.previewNum;
			}
			if(this.carousel.selectNow===0){
				this.startSelectList();
				this.selectNext=this.previewNum-1;
				this.selectPrev=0;
			}
			
			this.selectBottonNow.css({
        		"opacity":'0.6',
	        });
	        selectBotton.css({
        		"opacity":'1'
	        });
	        this.selectBottonNow=selectBotton;
		};

		PreviewCarousel.prototype.prvSelectList=function(){
			this.selectList.stop(false,true);
			var marignNow=this.selectList.css("margin-left"),
				marginNum=parseInt(marignNow.slice(0,marignNow.length-2)) ,
				marginChange;
			marginChange=marginNum+this.previewWidth;
			this.selectList.animate({"margin-left":marginChange+"px"}, 300);
		}
		PreviewCarousel.prototype.nextSelectList=function(){
			this.selectList.stop(false,true);
			var marignNow=this.selectList.css("margin-left"),
				marginNum=parseInt(marignNow.slice(0,marignNow.length-2)) ,
				marginChange;
			marginChange=marginNum-this.previewWidth;
			this.selectList.animate({"margin-left":marginChange+"px"}, 300);
		}
		PreviewCarousel.prototype.endSelectLList=function(){
			this.selectList.stop(false,true);
			this.selectList.animate({"margin-left":"-"+this.previewWidth*(this.carousel.imageNum-this.previewNum)+"px"}, 300);
		}
		PreviewCarousel.prototype.startSelectList=function(){
			this.selectList.stop(false,true);
			this.selectList.animate({"margin-left":0+"px"}, 300);
		}
		PreviewCarousel.prototype.select = function (selectValue) {
			this.selectBefore=this.carousel.selectNow;
			// this.carousel.select(selectValue);
			if(this.carousel.selectNow===selectValue){
				return;
			}
			if(selectValue>=this.carousel.imageNum){
				this.carousel.selectNow=0;
			}else if(selectValue<0){
				this.carousel.selectNow=this.carousel.imageNum-1;
			}else{
				this.carousel.selectNow=selectValue;
			}
			if (this.selectBefore < this.carousel.selectNow) {
			    this.afterSelect();
			} else {
			    this.prvSelect();
			};
			// showNow=$(this.list[this.selectNow]).clone();
			// this.listUl.children().first().after(showNow);
			// this.listInclude.css({"margin-left": "-"+this.singleWidth+"px"});
		 //    this.listUl.children().first().remove();
		 //    this.listInclude.css("margin-left","0px");
			this.changeSelectBotton();
		};

		PreviewCarousel.prototype.prvSelect=function(){
			var that=this;
			this.carousel.listInclude.stop(false,true);
			showNow=$(this.carousel.list[this.carousel.selectNow]).clone();
			this.carousel.listInclude.css({"margin-left": "-"+this.carousel.singleWidth+"px"});
			this.carousel.listUl.children().first().before(showNow);
			this.carousel.listInclude.animate({"margin-left": "0px"}, 200,function(){
				that.carousel.listUl.children().eq(1).remove();
			});
		    
		}
		PreviewCarousel.prototype.afterSelect=function(){
			var that=this;
			this.carousel.listInclude.stop(false,true);
			showNow=$(this.carousel.list[this.carousel.selectNow]).clone();
			this.carousel.listUl.children().first().after(showNow);
			this.carousel.listInclude.animate({"margin-left": "-"+this.carousel.singleWidth+"px"}, 200,function(){
				that.carousel.listInclude.css("margin-left","0px");
				that.carousel.listUl.children().first().remove();
			});
		    
		}
		PreviewCarousel.prototype.next=function(){
			var showNow=this.carousel.selectNow+1;
			this.select(showNow);
		};
		PreviewCarousel.prototype.prev=function(){
			var showNow=this.carousel.selectNow-1;
			this.select(showNow);
		};
		
	    PreviewCarousel.prototype.addEvent=function(context){
	    	var that=this.carousel;
	    	this.carousel.addEvent(context||this);
	    	this.carousel.carousel.on('mouseenter', function(event) {
	    		that.prvButton.css({
	    			display: 'block',
	    		});
				that.nextButton.css({
	    			display: 'block',
	    		});
	    	});
	    	this.carousel.carousel.on('mouseleave', function(event) {
	    		that.prvButton.css({
	    			display: 'none',
	    		});
				that.nextButton.css({
	    			display: 'none',
	    		});
	    	});
	    };

	    PreviewCarousel.prototype.display=function(context){
	    	var selectList=$(document.createElement("div")),
				selectListUl=$(document.createElement("ul")),
				selectButtun=$(document.createElement("li")),
				that=context||this,
				selectNum=this.carousel.imageNum,
				messageDiv=$(document.createElement("div"));
				messageDivBackGround=$(document.createElement("div"));
			this.selectList=selectListUl;
			messageDivBackGround.css({
				position: "absolute",
				bottom:" 0",
				height: "7%",
				"padding-top": "10px",
				"padding-bottom": "10px",
				margin:"0px",
				"background-color":"black",
				opacity: "0.5",
				color: "white",
				"text-align":"center",
				width: "100%",
				display: "block",
				"z-index":6
			})
			messageDiv.css({
				position: "absolute",
				bottom:" 0",
				height: "7%",
				"padding-top": "10px",
				"padding-bottom": "10px",
				margin:"0px",
				color: "white",
				"text-align":"center",
				width: "100%",
				display: "block",
				"z-index":8
			});
	    	selectList.css({
	    		height:this.previewHeight+"px",
				margin: "0px",
				"padding-top": "5px",
				"padding-bottom": "5px",
				"background-color": "black"
			});
	    	selectListUl.css({
	    		margin: "0px",
				padding: "0px",
				"list-style": "none",
				width:this.previewWidth*this.carousel.imageNum
	    	});
	        selectButtun.css({
				width:this.previewWidth+"px",
				float: "left",
				margin: "0px",
				padding: "0px",
				height: "52px",
				opacity:0.6
			});
	        selectButtun.on('click', function(event) {
	        	// that.selectBottonNow.css({
	        	// 	"background-color":'inherit',
	        	// 	width: "5px"
		        // });
		        // $(this).css({
	        	// 	"background-color": '#FC913A',
	        	// 	width:"20px"
		        // });
		        var imgIndex=that.selectList.children().index(this);
		        that.select(imgIndex);
		        // that.selectBottonNow=$(this);
	        });
	        for (var i = this.carousel.list.length - 1; i >= 0; i--) {
	        	var message= $(this.carousel.list[i]).find('img').nextAll();
	        	$(this.carousel.list[i]).append(messageDiv.clone().append(message.clone())).append(messageDivBackGround.clone());
	        	message.remove();
	        };
	    	for (var i = 0,len=selectNum; i<len; i++) {
	    		var image=$(this.carousel.list[i]).find('img').clone();
	    		var buttun=selectButtun.clone(true).append(image);
	    		image.attr({
	    			width: this.carousel.singleWidth/this.previewNum,
	    			height:((this.carousel.singleWidth/this.previewNum)/this.carousel.singleWidth)* this.carousel.singeHeight
	    		});
                if (i === 0) {
                	this.selectBottonNow=buttun;
	    			buttun.css({
	    				opacity: '1',
	    			});
	    		};
	    		selectListUl.append(buttun);
	    	};
	    	selectList.append(selectListUl);

			this.carousel.display();
			this.carousel.carousel.css({
				 height: 'auto'
			});
			this.carousel.carousel.append(selectList);
			this.carousel.nextButton.css({
				display: 'none'
			});
			this.carousel.prvButton.css({
				display: 'none'
			});
		};
		function carouselManage(primary,obj){
			var carouselType = obj.carouselType||"CommentCarousel";
			var carousel=new Carousel(primary,obj);
			console.log(carouselType);
			primary.css("display","none");
			switch(carouselType){
				case "CommentCarousel":
					return new CommentCarousel(carousel,obj);
				case "PreviewCarousel":
					return new PreviewCarousel(carousel,obj);
				default:
					console.error("未知轮播器类型");
			}
		}

		$.fn.OrangeCarousel=function(obj,callBack){
			var carousel=carouselManage($(this),obj);
		
			carousel.display();
			carousel.addEvent();
			if(obj.timeOut===true){
				carousel.setTimeOut();
			}
		}
	}else{
		console.error("this Carousel need jquery,please load jquery file first");
	};

})();