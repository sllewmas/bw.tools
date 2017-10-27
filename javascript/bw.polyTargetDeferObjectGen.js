/*
bw.polyTargetDeferObjectGen.js
Christopher Biggs & Samuel Wells

Creates max js objects that format targeted messages for poly~ objects.
Distinct functions are called to target all instances, individual instances via individual inlets, or individual instances from a single list input. 
A dB option as converts dB input to amplitude for targeting poly~ operations related to dB.
*/

autowatch = 1; //update the js in Max when edited in an external editor
inlets = 1; //the number of inlets
outlets = 1; //the number of outlets


var p = this.patcher; //variable to type p instead of this.patcher
//variables for default positions
var x1 = 10;
var y1 = 10;
var y2 = 50;
var y3 = 100;

//the mode, this should be "all", "individual," or "list"
var mode = jsarguments[1];
//in case any letters are upper case, make them lower case
mode = mode.toLowerCase();
//take just the first three elements of the string
//this way, if anything is spelled incorrectly after the first three letters, it will work anyway
mode = mode.substring(0, 3);

//the number of poly~ instances you want to target
var instanceNum = 1;
//by default dBmode is false
var dBmode = false;
//a variable to hold the an argument related to dBmode
var dBmodeInput = "off";
//check the data type for the second arguments and store it in a variable
var checkTypejs2 = typeof(jsarguments[2]);
//if the second argument is a number, treat it as the instance number,
//else treat it as the dbMode and update the dBmode to true
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

//check the data type of argument 3 and set it to a variable
var checkTypejs3 = typeof(jsarguments[3]);
//variable to hold and default for the minimum db
var mindB = -40;
//if the data type is the string dB, treat it as setting the dBmode to true
//else, treat it as the minimum db value
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

//load objects, the core of which are js files, based on the arguments provided
//and make connections as needed
if(mode == "all" && !dBmode) {
	var ptAll = p.newdefault(x1, y2, "js", "bw.polyTargetAll");	
	var input = p.newdefault(x1, y1, "inlet");
	var output = p.newdefault(x1, y3, "outlet");
	p.connect(input, 0, ptAll, 0);
	p.connect(ptAll, 0, output, 0);	
}

if(mode == "all" && dBmode) {
	var ptAlldB = p.newdefault(x1, y2, "js", "bw.polyTargetAlldB", mindB);
	var input = p.newdefault(x1, y1, "inlet");
	var output = p.newdefault(x1, y3, "outlet");
	p.connect(input, 0, ptAlldB, 0);
	p.connect(ptAlldB, 0, output, 0);	
}

if(mode == "ind" && !dBmode) {
	var ptInd = p.newdefault(x1, y2, "js", "bw.polyTargetInd", instanceNum);
	var inputs = new Array(instanceNum);
	for(var i = 0; i < instanceNum; i++) {
		inputs[i] = p.newdefault(x1 + 50*i, y1, "inlet");
		p.connect(inputs[i], 0, ptInd, i);
	}
	var output = p.newdefault(x1, y3, "outlet");
	p.connect(ptInd, 0, output, 0);	
}

if(mode == "ind" && dBmode) {
	var ptInddB = p.newdefault(x1, y2, "js", "bw.polyTargetInddB", instanceNum, mindB);
	var inputs = new Array(instanceNum);
	for(var i = 0; i < instanceNum; i++) {
		inputs[i] = p.newdefault(x1 + 50*i, y1, "inlet");
		p.connect(inputs[i], 0, ptInddB, i);
	}
	var output = p.newdefault(x1, y3, "outlet");
	p.connect(ptInddB, 0, output, 0);	
}

if(mode == "lis" && !dBmode) {
	var ptLis = p.newdefault(x1, y2, "js", "bw.polyTargetLis");
	var input = p.newdefault(x1, y1, "inlet");
	var output = p.newdefault(x1, y3, "outlet");
	p.connect(input, 0, ptLis, 0);
	p.connect(ptLis, 0, output, 0);
}

if(mode == "lis" && dBmode) {
	var ptLisdB = p.newdefault(x1, y2, "js", "bw.polyTargetLisdB", mindB);
	var input = p.newdefault(x1, y1, "inlet");
	var output = p.newdefault(x1, y3, "outlet");
	p.connect(input, 0, ptLisdB, 0);
	p.connect(ptLisdB, 0, output, 0);
}

//function to print on a line, with some amount of arguments
function postln(a, b) {
	if(b != null) {
		post("\n" + a + " " + b);
		} else {
			post("\n" + a);
	}
}