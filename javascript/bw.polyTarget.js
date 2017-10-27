/*
bw.polyTarget.js
Christopher Biggs & Samuel Wells

Creates max objects that format targeted messages for poly~ objects.
Distinct functions are called to target all instances, individual instances via individual inlets, or individual instances from a single list input. 
A dB option as converts dB input to amplitude for targeting poly~ operations related to dB.
*/

autowatch = 1; //update the js in Max when edited in an external editor
inlets = 1; //the number of inlets
outlets = 0; //the number of outlets

//type p instead of this.patcher for all object creation and connection
var p = this.patcher;
//location variables
//where will the objects be created and how far apart will they be
var x1 = 10;
var xSpacing = 100;
var y1 = 10;
var y2 = 50;
var y3 = 100;
var y4 = 150;
var y5 = 200;
var y6 = 250;
var y7 = 300;
var y8 = 350;
var y9 = 400;
var y10 = 450;
	
var mode; // the mode of operation, which will be "all", "individual", or "list"
//if the argument is not provided, set mode to "all"
if(jsarguments[1] != 0 && jsarguments[1] != null) {
	mode = jsarguments[1];
}  else {
		postln("mode, argument 1, is not valid, mode is all");
	mode = "a"
}

mode = mode.toLowerCase(); //assign the mode to lower case letters, such that upper case would be fine to enter
mode = mode.substring(0, 1); //assign the mode to only the fist letter entered, such that any mispelling, outside the first letter is not an issue
//validate the mode entered or use the default mode
if(mode != "a" && mode != "i" && mode != "l") {
	mode = "a";
	postln("mode, argument 1, is not valid, mode is all");
}

//the number of poly instances, which is 1 by default
var instanceNum = 1;
//the dBmode is off by default
var dBmode = false;
//this variable holds what the dbMode input is from the argument
var dBmodeInput;
//determine the data type of the second argument entered
//the second argument could be string to instantiate dB mode or a number to define the number of poly~ instances
var checkTypejs2 = typeof(jsarguments[2]);
//if the second argument is a number, treat it as the number of poly instances,
//else treat it as the dbMode
if(checkTypejs2 == "number") {
	instanceNum = jsarguments[2];
} else if(checkTypejs2 == "string" && checkTypejs2 != null ) {
	dBmodeInput = jsarguments[2];
	dBmodeInput = dBmodeInput.toLowerCase();
	dBmodeInput = dBmodeInput.substring(0,2);
	if(dBmodeInput == "db") {
		dBmode = true;
		} 
}

//an array to hold the horizontal positions for objects up to the number of poly~ instances we plan to target
var xPos = new Array(instanceNum);

//check the data type of argument 3 and assign it to a variable
//similarly to argument 2, this could be string or a number
var checkTypejs3 = typeof(jsarguments[3]);
//variable to hold and the default value for the minimum db
var mindB = -40;
//if the data type is a string, treat it is as a db mode
//else, treat it as the minimum db
if(checkTypejs3 == "string") {
	dBmodeInput = jsarguments[3];
	dBmodeInput = dBmodeInput.toLowerCase();
	dBmodeInput = dBmodeInput.substring(0,2);
	if(dBmodeInput == "db") {
		dBmode = true;
	}
} else if(checkTypejs3 == "number") {
	if(jsarguments[3] < 0) {
		mindB = jsarguments[3];
	}
}
//if the final, 4th argument, is defined, it will be the minimum db
if(jsarguments[4] != 0 && jsarguments[4] != null) {
	mindB = jsarguments[4];
}

//variables to hold objects that are created by the functions
var ins = new Array(instanceNum);
var dbtoas = new Array(instanceNum);
var triggers = new Array(instanceNum);
var appends = new Array(instanceNum);
var changesInt = new Array(instanceNum);
var changesFloat = new Array(instanceNum);
var unpack; 
var listfunnel;
var zl;
var route;
var routeArgs = new Array(instanceNum);
var typeroutes = new Array(instanceNum);

//create an array to fill the unpack object with arguments based on the variable type
var unpackArgs = new Array(instanceNum);
//create a variable to hold the outlet
var out;

//a variable to hold the function that will be called
var myFunction;

//select function based on arguments
	switch(mode) {
		case "a":
			if(dBmode) {
				myFunction = alldB();
				} else {
					myFunction=all();
					}
		break;
		case"i":
			if(dBmode) {
				myFunction=individualdB();
				} else {
					myFunction=indi();
					}
		break;
		case "l":
			if(dBmode) {
				myFunction=listdB();
				} else {
				myFunction=list();
			}
}	

//load the function when the patch loads
function loadbang() {
	myFunction;
}

//create one input that will target all instances with whatever enters in the inlet
function all() {
			ins[0] = p.newdefault(x1, y1, "inlet");
			triggers[0] = p.newdefault(x1, y2, "t", "l", "target");
			appends[0] = p.newdefault(x1+20, y3, "append", 0);
			out = p.newdefault(x1, y4, "outlet");
			p.connect(ins[0], 0, triggers[0], 0);
			p.connect(triggers[0], 1, appends[0], 0);
			p.connect(appends[0], 0, out, 0);
			p.connect(triggers[0], 0, out, 0);		
	}

//generate as many inlets as poly instances that you have and target an instance based on the inlet in which a message is received
function indi() {
		out = p.newdefault(x1, y4, "outlet");
			for(var i = 0; i < instanceNum; i++) {
				xPos[i] = x1+i*xSpacing;
				ins[i] = p.newdefault(xPos[i], y1, "inlet");
				triggers[i] = p.newdefault(xPos[i], y2, "t", "l", "target");
				appends[i] = p.newdefault(xPos[i], y3, "append", i+1);
				p.connect(ins[i], 0, triggers[i], 0);
				p.connect(triggers[i], 1, appends[i], 0);
				p.connect(triggers[i], 0, out, 0);
				p.connect(appends[i], 0, out, 0);
			}	
	}
	
//generate targeted messages from a list for individual poly~ instances
function list() {
		out = p.newdefault(x1, y10, "outlet");
		ins[0] =p.newdefault(x1, y1, "inlet");		

		listfunnel = p.newdefault(x1, y2, "listfunnel");
		zl = p.newdefault(x1, y3, "zl", "group", "2");
		
		for(var i = 0; i < instanceNum; i++) {
			routeArgs[i] = i;
		}
		
		route = p.newdefault(x1, y4, "route", routeArgs);
		
		p.connect(ins[0], 0, listfunnel, 0);
		p.connect(listfunnel, 0, zl, 0);
		p.connect(zl, 0, route, 0);
	
			for(var i = 0; i < instanceNum; i++) {
				xPos[i] = x1+i*xSpacing;
				typeroutes[i] = p.newdefault(xPos[i], y5, "typeroute~");
				changesInt[i] = p.newdefault(xPos[i], y6, "change", "0"); 
				changesFloat[i] = p.newdefault(xPos[i], y7, "change", "0.");
				triggers[i] = p.newdefault(xPos[i], y8, "t", "l", "target");
				appends[i] = p.newdefault(xPos[i]+20, y9, "append", i+1);
				
				p.connect(route, i, typeroutes[i], 0);
				p.connect(typeroutes[i], 1, triggers[i], 0);
				p.connect(typeroutes[i], 4, triggers[i], 0);
				p.connect(typeroutes[i], 2, changesInt[i], 0);
				p.connect(typeroutes[i], 3, changesFloat[i], 0);
				p.connect(changesInt[i], 0, triggers[i], 0);
				p.connect(changesFloat[i], 0, triggers[i], 0);
				p.connect(triggers[i], 1, appends[i], 0);
				p.connect(triggers[i], 0, out, 0);
				p.connect(appends[i], 0, out, 0);		
	}
}

//create one input that targets all instances with whatever enters in the inlet and will convert the input to dB
function alldB() {
				ins[0] = p.newdefault(x1, y1, "inlet");
				dbtoas[0] = p.newdefault(x1, y2, "mindB", mindB);
				triggers[0] = p.newdefault(x1, y3, "t", "l", "target");
				appends[0] = p.newdefault(x1+20, y4, "append", 0);			
				out = p.newdefault(x1, y5, "outlet");
				p.connect(ins[0], 0, dbtoas[0], 0);
				p.connect(dbtoas[0], 0, triggers[0],0);
				p.connect(triggers[0], 1, appends[0], 0);
				p.connect(appends[0], 0, out, 0);
				p.connect(triggers[0], 0, out, 0);		
	}
	
//generate as many inlets as poly instances that you have and convert incoming float from dB to amplitude
function individualdB() {
		out = p.newdefault(x1, y5, "outlet");
		for(var i = 0; i <instanceNum; i++) {
			xPos[i] = x1+i*xSpacing;
			ins[i] = p.newdefault(xPos[i], y1, "inlet");
			dbtoas[i] = p.newdefault(xPos[i], y2, "mindB", mindB);
			triggers[i] = p.newdefault(xPos[i], y3, "t", "l", "target");
			appends[i] = p.newdefault(xPos[i], y4, "append", i+1);
			p.connect(ins[i], 0, dbtoas[i], 0);
			p.connect(dbtoas[i], 0, triggers[i], 0);
			p.connect(triggers[i], 1, appends[i], 0);
			p.connect(triggers[i], 0, out, 0);
			p.connect(appends[i], 0, out, 0);
			}
		}

//generate targeted messages based on a list of dB values and convert those values to amplitude values
function listdB() {
		out = p.newdefault(x1, y7, "outlet");
		ins[0] =p.newdefault(x1, y1, "inlet");		
			for(var i = 0; i < instanceNum; i++) {
				unpackArgs[i] = "f";		
				}		
		unpack = p.newdefault(x1, y2,  "unpack",  unpackArgs);
		p.connect(ins[0], 0, unpack, 0);
			for(var i = 0; i < ins.length; i++) {
				xPos[i] = x1+i*xSpacing;
				changesFloat[i] = p.newdefault(xPos[i], y3, "change", "0.");
				dbtoas[i] = p.newdefault(xPos[i], y4, "mindB", mindB);
				triggers[i] = p.newdefault(xPos[i], y5, "t", "f", "target");
				appends[i] = p.newdefault(xPos[i]+20, y6, "append", i+1);
				p.connect(unpack, i, changesFloat[i], 0);
				p.connect(changesFloat[i], 0, dbtoas[i], 0);
				p.connect(dbtoas[i], 0, triggers[i], 0);
				p.connect(triggers[i], 1, appends[i], 0);
				p.connect(triggers[i], 0, out, 0);
				p.connect(appends[i], 0, out, 0);		
	}
}
	
//function to print on a line, with some amount of arguments
function postln(a, b) {
	if(b != null) {
		post("\n" + a + " " + b);
		} else {
			post("\n" + a);
	}
}

