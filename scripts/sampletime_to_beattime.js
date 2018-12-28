// small helper to convert unstretched time into stretched time

// takes a dictionary of timemarkers and a float in the range of 0..1 (unstretched time)
// outputs a float in the range of 0..1 (stretched time)

var bufferlength_unstretched = 0;
var bufferlength_stretched = 0;

var current_markers = new Array();

function dictionary(name) {
	var markers = new Dict(name);
	
	var markernames = markers.getkeys();
	current_markers = [];
		
	if (markernames.length > 0) {
		
		for (var i = 0; i < markernames.length; i++) {
			var thismarkername = "marker" + i;
			var stime = markers.get(thismarkername+"::sourcetime");			
			var dtime = markers.get(thismarkername+"::desttime");
			var thismarker = {srctime:stime, desttime:dtime};
			current_markers[i] = thismarker;
		}
		
		bufferlength_unstretched = current_markers[markernames.length - 1].srctime;
		bufferlength_stretched = current_markers[markernames.length - 1].desttime;
	}
}

function msg_float(f) {
	var current_unstrechted_pos = bufferlength_unstretched * f;

	for (var i = 0; i < current_markers.length - 1; i++) {
		if (current_unstrechted_pos > current_markers[i].srctime && current_unstrechted_pos <= current_markers[i + 1].srctime) {
			var thismarker = current_markers[i];
			var nextmarker = current_markers[i + 1];
			
			var in_this_span = (current_unstrechted_pos - thismarker.srctime) / (nextmarker.srctime - thismarker.srctime);
			var translated_span = (nextmarker.desttime - thismarker.desttime) * in_this_span;
			var current_stretched_pos = translated_span + thismarker.desttime;
			
			outlet(0, current_stretched_pos / bufferlength_stretched);	
			break;
		}
	}
}
