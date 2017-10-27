/* 
    bw.snake.js
    scripts any number of send or receive object. 
    the objects will be named using the second argument plus a number (name1, name2, name3, etc....)
*/

inlets = 0; //number of inlets
outlets = 0; //number of outlets
autowatch = 1; //update the js in Max when edited in an external editor
//GLOBAL VARIABLES
var send_or_receive = jsarguments[1]; //s for send or r for receive
//if more letters than s or r where entered, crop them off
send_or_receive = send_or_receive.substring(0, 1); 
var name_base = jsarguments[2]; //the basic name of the s or r objects
if (jsarguments[3] != "0") { //if not provided, the 4th argument of the js object default to zero
	var numChannels = jsarguments[3]; //assigns number of send or receive objects to "numChannels"
} else {
	var numChannels = 2; //if 4th argument is not provided, it defaults to 2 channel send/receive
}
var p = this.patcher; //variable to allow typing p rather than this.patcher

if (send_or_receive.toLowerCase() == "s") { //If s is indicated, create the desire number of send objects
    for (i = 0; i < numChannels; i++) {
        var input = p.newdefault(10+(i*110), 10, "inlet"); //create new inlet
        var dest = name_base + String(i+1); //format the argument for send
        var sender = p.newdefault(10+(i*110), 60,"send", dest);//create the send object
        p.connect(input, "0", sender, "0");//connect the inlet and send object
    }
} else if (send_or_receive.toLowerCase() == "r") {//If r is indicated, create the desired number of receive objects
    for (i = 0; i < numChannels; i++) {
        var orgin = name_base + String(i+1); ///format the argument for send
        var receiver = p.newdefault(10+(i*110), 10,"receive", orgin);//create new receive
        var output = p.newdefault(10+(i*110), 60, "outlet"); //create new outlet
        p.connect(receiver, "0", output, "0"); //receive and outlet
    }
} else {
    post("\n", "Please indicate 's' (send) or 'r' (receive) for first argument"); //post error message is s or r is not indicated
}
