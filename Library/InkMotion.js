var InkMotion = function(){
	
	this.page = new Page(document.width, document.height);
	
	this.listener = new Leap.Listener();
	
	var me = this;
	this.listener.onConnect = function(controller){ me._onConnect(controller); };
	
	this.controller = new Leap.Controller("ws://localhost:6437/");
	this.controller.addListener(this.listener);
	
	this.brush = PressureBrush;
};

InkMotion.prototype = {
	
	_onFrame : function(controller) {
		
		var pointables = controller.frame().pointables();
		var count = pointables.count();
		
		var lastFrame = controller.frame(1);
		
		for(var index = 0; index < count; index++){
			var pointable = pointables[index];
			
			pointable.project = this.screen.intersect(pointable, true);
			
			if(pointable.project){
				// TODO: Determine which element the pointable is interacting with and propagate interaction
				var lastPointable = lastFrame.pointable(pointable.id());
				
				if(lastPointable.isValid() && lastPointable.project) this.brush.stroke(lastPointable.project, pointable.project, this.page.activeLayer().context);
				else this.brush.start(pointable.project, this.page.activeLayer().context);
			}
		}
	},
	
	_onConnect : function(controller) {
		// TODO: Calibrate
		this.screen = new Leap.Screen([new Leap.Vector([-124.25,227.688,-171.455]), new Leap.Vector([-125.55,300.666,-179.19]), new Leap.Vector([145.139,232.987,-156.11])]);
		
		var me = this;
		this.listener.onFrame = function(controller){ me._onFrame(controller); };
	}
}