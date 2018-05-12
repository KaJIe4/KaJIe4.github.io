var background;
var gameLayer;
var scrollSpeed = 0.6;
var ship;
var gameGravity = -0.05;
var gameThrust = 0.1;
var gameScene = cc.Scene.extend({
onEnter:function () {
this._super();
gameLayer = new game();
gameLayer.init();
cc.audioEngine.playMusic("assets/1.mp3", true);
this.addChild(gameLayer);
}
});
var game = cc.Layer.extend({
init:function () {
this._super();


cc.eventManager.addListener({
event: cc.EventListener.MOUSE,
onMouseDown: function(event){
ship.engineOn = true;
},
onMouseUp: function(event){
ship.engineOn = false;
}
},this)


cc.eventManager.addListener({
event: cc.EventListener.TOUCH_ONE_BY_ONE,
onTouchBegan: function(event){
ship.engineOn = true;
},
onTouchEnded: function(event){
ship.engineOn = false;
}
},this)








background = new ScrollingBG();
this.addChild(background);
this.scheduleUpdate();
this.schedule(this.addAsteroid,1);
ship = new Ship();
this.addChild(ship);
},
update:function(dt){
background.scroll();
ship.updateY();
},


addAsteroid:function(event){
var asteroid = new Asteroid();
this.addChild(asteroid,1.2);
},

removeAsteroid:function(asteroid){
this.removeChild(asteroid);
}

});
var ScrollingBG = cc.Sprite.extend({
ctor:function() {
this._super();
this.initWithFile("assets/background.png");
},
onEnter:function() {
this.setPosition(480,160);
},
scroll:function(){
this.setPosition(this.getPosition().
x-scrollSpeed,this.getPosition().y);
if(this.getPosition().x<0){
this.setPosition(this.getPosition().x+480,this.getPosition().y);
}
}
});

var Ship = cc.Sprite.extend({
ctor:function() {
this._super();
this.initWithFile("assets/ship.png");
this.scale =0.133;
this.ySpeed = 0;
this.engineOn = false;
},
onEnter:function() {
this.setPosition(60,160);
},
updateY:function() {
  if(this.engineOn){
this.ySpeed += gameThrust;
}
this.setPosition(this.getPosition().x,this.getPosition().y+this.
ySpeed);
this.ySpeed += gameGravity;
}
});

var Asteroid = cc.Sprite.extend({
ctor:function() {
this._super();
this.initWithFile("assets/asteroid.png");
},
onEnter:function() {
this._super();
this.scale=0.09;
this.setPosition(600,Math.random()*320);
var moveAction= cc.MoveTo.create(4, new cc.Point(-100,Math.random()*320));
this.runAction(moveAction);
this.scheduleUpdate();
},
update:function(dt){
  var shipBoundingBox = ship.getBoundingBox();
var asteroidBoundingBox = this.getBoundingBox();
if(cc.rectIntersectsRect(shipBoundingBox,asteroidBoundingBox)){
gameLayer.removeAsteroid(this);
cc.audioEngine.playEffect("assets/2.mp3");



}
if(this.getPosition().x<-50){
gameLayer.removeAsteroid(this)
}
}
});

function restartGame(){
ship.ySpeed = 0;
ship.setPosition(ship.getPosition().x,160);
};
