/*
bw.countEventsGen.js
Christopher Biggs & Samuel Wells

Generates the objects and makes the connections for bw.countEvents, which counts
the occurrences of any number of events
*/

autowatch = 1; //update the code in the js object when the file is saved externally
inlets = 0; //the number of inlets
outlets = 0; //the number of outlets

//the first argument is the number of events to count
var length = jsarguments[1];
//assess the data type of the length variable and store it as a variable
var lengthType = typeof(length);
//if the length variable is zero or if the data type of length is not a number
//then assign the length variable to 1
if(length == 0 || lengthType != "number") {
	length = 1;
	}
	
//a variable to type p instead of this.patcher
//since the text this.patcher will be required repeatedly
var p = this.patcher;

//create an inlet object
var inlet = p.newdefault(10, 10, "inlet");
//an array to hold the outlet objects
var outs = new Array(length+1);
//create the outlet objects
for(var i = 0; i < outs.length; i++) {
	outs[i] = p.newdefault(10+i*30, 100, "outlet");
}

//create the js object and load the appropriate file and provide the length variable 
//as an argument
var js = p.newdefault(10, 50, "js", "bw.countEvents.js", length);

//connect the inlet to the js object
p.connect(inlet, 0, js, 0);

for (var i = 0; i < outs.length; i++) {
	p.connect(js, i, outs[i], 0);
}


