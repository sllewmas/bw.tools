/*
bw.weightsGen.js
Christopher Biggs & Samuel Wells

Create objects to trigger events based on a weighted probability.
*/

autowatch = 1; //update the js file loaded in the js object when saved externally

var mode; //mode can be weights or events
var name; //the name will be the name of receive objects that will receive bangs

//assess the first argument entered and assign values to mode and name as appropriate
switch(jsarguments[1]) {
	case 0:
		mode = "weights";
		name = "unnamed";
		postln("mode is set to weights");
		break;
	case "weights":
		mode = "weights";
		name = "unnamed";
		break;
	case "events":
		mode = "events";
		name = "unnamed";
		break;
	default:
		mode = "weights";
		name = jsarguments[1];
} 

//if there is a second argument and name is "unnamed" change name to the second argument
if(name == "unnamed" && jsarguments[2] != 0) {
	name = jsarguments[2];
}

var p = this.patcher; //a variable to type p instead of this.patcher

//create an inlet object
var inlet = p.newdefault(10, 10, "inlet");
//create the js object and load the appropriate file and provide the addition arguments
var js = p.newdefault(10, 50, "js", "bw.weights.js", mode, name);
//an array to hold the outlet objects
var outs = new Array(2);
//create the outlets
for(var i = 0; i<2; i++) {
	outs[i] = p.newdefault(10+i*50, 100, "outlet");
	p.connect(js, i, outs[i], 0);
}
//connect the inlet to the js object
p.connect(inlet, 0, js, 0);

//function to print on a line, with some amount of arguments
function postln(a, b) {
	if(b != null) {
		post("\n" + a + " " + b);
		} else {
			post("\n" + a);
	}
}