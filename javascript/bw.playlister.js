/*
bw.playlister.js
Christopher Biggs & Samuel Wells

Automatically scripts individual playlist~ objects and loads soundfiles.
All functions of playlist~ are available. 
*/
inlets = 1;//the number of inlets
outlets = 0;//the number of outlets
autowatch = 1;//update the js file when saved in an external editor

//global variables
var play_num = Number(jsarguments[2]); //assigns number of soundfiles to "play_num"
if (jsarguments[3] != "0") { //if not provided, 4th argument of js object will appear as "0"
	var out_num = jsarguments[3]; //assigns number of audio channels to "out_num"
} else {
	var out_num = 2; //if 4th argument not provided defaults to stereo audio
}

var pl = new Array(); //new array to store playlist~ objects
var g = new Array(); //new array to store arrays of gain objects for each channel
for (var c = 0; c < out_num; c++) {
	g[c] = new Array(); //new array to store gain~ objects for each channel
}	
var out = new Array(); //new array to store outlet objects

//strings employed to generate playlist~ and outlet varnames, aka scripting names
//this allows for deletion of previous playlist~ and outlet objects from previous uses
//this is good practice because the patcher itself could be saved accidentally with objects created
//and then the new objects would be created in addition to those objects
var playlist_varbase = "pl"; 
var g_varbase = "g";
var out_varbase = "ch";

//REMOVAL EXTRANEOUS OUTLET OBJECTS
for (var i = (play_num - 1); i<= out.length; i++) { 
		if (out[i]){  //outlet objects that will not be needed
			if (Number(out[i].varname.substring(2)) > out_num) {
				this.patcher.remove(out[i]);
			}
		}
	}
//CREATE OUTLET OBJECTS
if (out.length < play_num){ 
    for(var c = 0; c < out_num; c++) {
        if (!(out[c])){
               //creates a new outlet object for each channel of audio, and stores the object id in the array out[]
            out[c] = this.patcher.newdefault(10+((c)*35), ((play_num+1)*60 + 10), "outlet");
        }
    }
}

//CREATE PLAYLIST~, GAIN~, AND CONNECT PLAYLIST~ TO GAIN~ TO OUTLET
function loadbang() {
	remove(playlist_varbase); //searches for and removes any previously existing playlist~ objects
	remove(g_varbase); //searches for and removes any previously existing gain~ objects
	for(var a = 0; a < play_num; a++) {	
		for(var a = 0; a < play_num; a++) {
			//set xy patching position of playlist~
			if(a%2 == 0) {
				x = 10;
				y = (a)*60 + 10;
			} else {
				x = 170;
				y = (a-1)*60 + 10;
			}
			//creates a new playlist!~ object and stores the object id in the array p[]
			pl[a] = this.patcher.newdefault(x, y, "playlist~",
					"@varname", playlist_varbase + String(a), 
					"@clipheight", 30,
					"@channelcount", out_num);
			//change size of playlist~
			pl[a].sendbox("size", 150, 30);
			//load soundfile into of playlist~
			pl[a].message("append" , String(a+1)+String(jsarguments[1]), 1);
			//creates the correct number of gain~ objects for each playlist~
			for(var c = 0; c < out_num; c++) {
			    //set the xy patching position coordinates for each gain object
				var nx = (x+(c * ((130/out_num) + (20/(out_num-1))))); 
				var ny = (y+50);
				//create individual gain~ objects and save them in an array for each group, which is added the parent array g[]
				g[c][a] = this.patcher.newdefault(nx, ny, "gain~",
						"@varname", (g_varbase + String(a)+"-"+String(n)),
						"@patching_rect", [nx,ny,(130/out_num), 30.0 ]);
				//set gain to 127
                g[c][a].message("float", 127.0);
	
			}
            //connect objects
			for(c = 0; c < out_num; c++) {
				for(var n = 0; n < out_num; n++){
				    //connect playlist~ channels to appropriate gain~ object
					this.patcher.connect(pl[a], String(c), g[c][a], "0"); 
					//connect gain~ object to appropriate outlet object
					this.patcher.hiddenconnect(g[c][a],"0", out[c], "0");	
				}
			}
		}
	}
}

/*
play(p) takes an integer and sends a 1 to the associated(p-1) playlist~ object to start 
        playback of the soundfile
*/
function play(p) {
    try { 
        pl[(p-1)].message(1);
    }
    catch(err) {
        post("bw.playlister: play() requires a postive integer between 1 and " + String(play_num) + "\n");
    } 
}

/*
bang() sends a 0 to the all playlist~ objects to stop 
        playback of the soundfiles
*/
function bang() {
	for(a = 0; a < play_num; a++){
		pl[a].message(0);
	}
}

//msg_int(i) takes an integer and either calls bang() or play(i)
function msg_int(i) {
	if(i == 0) { //if msg_int receives a 0 it will trigger bang() function to stop all playback
		bang();
	} else { //if msg_int receives any non-zero integer it will call the play() function
		play(i);
	}
}
/*
stop() sends a 0 to the all playlist~ objects to stop 
        playback of the soundfiles
*/
function stop() {
 	try { 
 	    pl[(arguments[0]-1)].message(0);
 	    }
    catch(err) {
        post("bw.playlister: stop() requires a postive integer between 1 and " + String(play_num) + "\n");
    }
}

/*
pause() sends sends the "pause" command to the indicated playlist~ object
*/
function pause() {
    try {
	    pl[(arguments[0]-1)].message("pause");
	 }
    catch(err) {
        post("bw.playlister: pause() requires a postive integer between 1 and " + String(play_num) + "\n");
    } 
}

/*
resume() sends sends the "resume" command to the indicated playlist~ object
*/
function resume() {
    try {
	    pl[(arguments[0]-1)].message("resume");
	 }
    catch(err) {
        post("bw.playlister: resume() requires a postive integer between 1 and " + String(play_num) + "\n");
    }
}
/*
time() toggles the timesretch functionality for all or individual playlist~ object
    time all followed by a 0 to 1 toggles all playlist~ objects' time stretching off or on
    time, file number, and 0 or 1 toggles an individual playlist~ object time stretching off or on
*/
function time() {
	if(arguments[0] == "all") { 
        for(i = 0; i < play_num; i++){
            pl[i].message("timestretch", arguments[1]);
        }
	} else if (typeof arguments[0] == "number"){ 
		pl[(arguments[0]-1)].message("timestretch", arguments[1]);
	}
}
/*
speed() changes the playback speed for all or individual playlist~ objects
    speed all followed by a value impacts the speed of all playlist~ objects
    speed, file number, and a value impacts an individual playlist~ object
*/
function speed() {
	if(arguments[0] == "all") {
		for(i = 0; i < play_num; i++){
			pl[i].message("speed", arguments[1]);
		}	
	} else if (typeof arguments[0] == "number") {
		pl[(arguments[0]-1)].message("speed", arguments[1]);
	}
}

/* 
pitch() changes the pitch of a playlist~ object based on playback speed or in cents
	pitch all followed by a value impacts all playlist~ objects
	pitch all cent followed by a value impacts all playlist~ objects
	pitch, file number, and a value impacts individual playlist~ objects  
	pitch cent, file number, and a value impacts individual playlist~ objects
*/
function pitch() {
	if(arguments[0] == "all") {
		if(arguments[1] == "cent") {
			for(i = 0; i < play_num; i++){
				pl[i].message("pitchshiftcent", arguments[2]);
			}
		} else {
			for(i = 0; i < play_num; i++){
				pl[i].message("pitchshift", arguments[1]);
			}
		}
	} else { 
		if(arguments[0] == "cent") {
			pl[(arguments[1]-1)].message("pitchshiftcent", arguments[2]);
		} else {
			pl[(arguments[0]-1)].message("pitchshift", arguments[1]);
		}		
	}
}

/*
selection() changes the playback range of all or individual playlist~ objects
	the file length loaded into each playlist~ object is normalized to 0 - 1
	selection all followed by two values between 0 and 1 selects that range for all playlist~ objects
	selection, file number, followed by two value between 0 and 1 selects that range for a playlist~ object
*/
function selection() {
	if(arguments[0] == "all") {
			for(i = 0; i < play_num; i++){
				pl[i].message("selection", 1, arguments[1], arguments[2]);
				}
	} else { 
		pl[(arguments[0]-1)].message("selection", 1, arguments[1], arguments[2]);
	}
}

/*
clearSelection() eliminates and selection from all or individual playlist~ objects
	clearSelection all clear the selection for all playlist~ objects
	clearSelection followed by the file number clear the selection for a playlist~ object
*/
function clearSelection() {
	if(arguments[0] == "all") {
			for(i = 0; i < play_num; i++){
				pl[i].message("selection", 1);
				}
	} else { 
		pl[(arguments[0]-1)].message("selection");
	}
}

/*
loop() turns looping on or off for all or individual playlist~ objects
	loop all followed by a 0 or 1 turns looping off or on for all playlist~ objects
	loop, file number, followed a 0 or 1 turns looping off or on for an individual playlist~ object
*/
function loop() {
	if(arguments[0] == "all") {
		for(i = 0; i < play_num; i++){
			pl[i].message("loop", arguments[1]);
		} 
	} else if (typeof arguments[0] === "number") {
		pl[(arguments[0]-1)].message(["loop", arguments[1]]);
	}
}

/*
volume() changes the volume for all or individual playlist~ objects
	vol all followed by a dB value changes the volume for all gain~ objects
	vol, file number, followed a dB value changes the volume for an individual gain~ object
*/
function vol() {
	if(arguments[0] == "all") {
		if (arguments.length > 2) {
			for(a = 0; a < play_num; a++){
                for(c = 0; c < out_num; c++){
                    g[c][a].message("interp", arguments[2]);
                    g[c][a].message("float", (arguments[1]+128));
                }   
			}
		} else {
			for(a = 0; a < play_num; a++){
                for(c = 0; c < out_num; c++){
                    g[c][a].message("float", (arguments[1]+128));
					
                }   
			}
		}
	} else {
		if (arguments.length > 2) {
            for(c = 0; c < out_num; c++){
			 g[c][(arguments[0]-1)].message("interp", arguments[2]);
            }
		}
        for(c = 0; c < out_num; c++){
			//biggs changed *127 to + 128
            g[c][(arguments[0]-1)].message("float", arguments[1]+128);
        }	
	}
}

//search through all max objects using var name
function remove(id){ 
    tempobj=0; 
    tempname=id;
    this.patcher.applydeepif (rem,scan);
    delete tempname;
    return(tempobj);
}
function rem(obj){
    this.patcher.remove(obj);
}
function scan(obj){
    if(obj.varname.search(tempname) != -1){
        return(true);
    }else{
        return(false);
    }
}

//constrain a value to a minimum and maximum value
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}