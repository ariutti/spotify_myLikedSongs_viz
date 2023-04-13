s.boot;

(
// READ AN ALREADY EXHISTING JSON FILE
var path = PathName("/home/nicola/Documents/progetto_spotify_API/myTracks.json").pathOnly;
// read a JSON file
var f = File( "/home/nicola/Documents/progetto_spotify_API/myTracks.json", "r");
//~dict_speakers = Dictionary.new;
~dict_myTracks = f.readAllString.parseJson; // a dictionary
);


~dict_myTracks.size;
~dict_myTracks[0].keys


~ds = FluidDataSet.new(s);
Buffer.freeAll;

(
~dict_myTracks.do({
	|element|
	//element.keys;

	var id = element["id"];
	var name = element["name"];

	var artist = element["artist"];
	var preview_url = element["preview_url"];
	var duration_ms = element["duration_ms"];
	var tempo = element["tempo"];
	var key = element["key"];
	var time_signature = element["time_signature"];
	var mode = element["mode"];
	var loudness = element["loudness"];

	var danceability = element["danceability"];
	var speechiness = element["speechiness"];
	var energy = element["energy"];
	var acousticness = element["acousticness"];
	var valence = element["valence"];
	var	liveness = element["liveness"];
	var instrumentalness = element["instrumentalness"];

	//[id, name, danceability, speechiness, energy, acousticness, valence, liveness, instrumentalness].postln;
	var values = [danceability, speechiness, energy, acousticness, valence, liveness, instrumentalness].asFloat;

	var a = Buffer.loadCollection(s, values);
	~ds.addPoint(id, a);
	a.free;
})
)

~ds.size

~reducedDs = FluidDataSet(s);
FluidUMAP(s,2,numNeighbours:15,minDist:0.1).fitTransform(~ds,~reducedDs);


FluidNormalize(s).fitTransform(~reducedDs,~reducedDs);// normalize so it's easier to plot
~tree = FluidKDTree(s).fit(~reducedDs); // use a kdtree to find the point nearest to the mouse position



(
~reducedDs.dump({
    arg dict;
    var xybuf = Buffer.alloc(s,2);
	var buttonColor = Color.new(0.0, 0.0, 0.0);
	var action = \standby; // \click, \drag, \release;
	var prevID = -999;

    defer{
        FluidPlotter(dict:dict,mouseMoveAction:{
            arg view, x, y, modifiers, buttonNumber, clickCount;
			//var button
			//[x, y, modifiers, buttonNumber, clickCount].postln;

			xybuf.setn(0,[x,y]);

			switch( clickCount,
				1, { action = \click; },
				2, { "double click".postln; },
				nil, {
					switch( buttonNumber,
						nil, {action = \drag},
						0, {action = \release}
					);
				}
			);
			//action.postln;
			/*
			if(action == \release, {
				"is a release".postln;
			}, {
				"is NOT a release".postln;
			});
			*/


			~tree.kNearest(xybuf,1,{
				arg id;
				var index = id.asInteger;
				//[id, index].postln;
				if(id != prevID, {
					//[id, prevID].postln;
					prevID = id;
					"id changed".postln;
				}, {
					//"id is the same as before".postln;
				}
				);

				defer {
					view.highlight_(id);
				};

			});



			/*
            xybuf.setn(0,[x,y]);
            ~tree.kNearest(xybuf,1,{
                arg id;
                var index = id.asInteger;
				[id, index].postln;

                defer{
                    view.highlight_(id);
					//view.pointColor_(id, Color.new(1.0, 0, 0));
                };

				/*
                {
                    var start = Index.kr(~slicePoints,index);
                    var end = Index.kr(~slicePoints,index+1);
                    var sig = PlayBuf.ar(2,~loader.buffer,BufRateScale.ir(~loader.buffer),1,start)[0];
                    var dur_sec = min((end-start) / SampleRate.ir,1);
                    var env = EnvGen.kr(Env([0,1,1,0],[0.03,dur_sec-0.06,0.03]),doneAction:2);
                    sig.dup * env;
                }.play;
				*/
            });
			*/

        });
    };
});
)


3 != 4