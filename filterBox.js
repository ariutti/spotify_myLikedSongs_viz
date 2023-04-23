class FilterBox {

	constructor(_x, _y, _w, _h,
		_axisA, _axisB, _axisC, _axisD
		//energyMin, energyMax,
		//danceabilityMin, danceabilityMax,
		//tempoMin, tempoMax
	) {

		this.pos  = createVector(_x, _y);
		this.size = createVector(_w, _h);

		// tempo sliders ***********************************************************
		this.axisTempo = _axisA;
		this.tempoMin  = _axisA.getDataMin();
		this.tempoMax  = _axisA.getDataMax();
		this.tempoSliderMin = select('#tempoMin');
		this.tempoSliderMax = select('#tempoMax');

		// danceability sliders ****************************************************
		this.axisDance = _axisB;
		this.danceMin  = _axisB.getDataMin();
		this.danceMax  = _axisB.getDataMax();
		this.danceSliderMin = select('#danceMin');
		this.danceSliderMax = select('#danceMax');

		// energy sliders **********************************************************
		this.axisEnergy = _axisC;
		this.energyMin  = _axisC.getDataMin();
		this.energyMax  = _axisC.getDataMax();
		this.energySliderMin = select('#energyMin');
		this.energySliderMax = select('#energyMax');

		// valence sliders *********************************************************
		this.axisValence = _axisD;
		this.valenceMin  = _axisD.getDataMin();
		this.valenceMax  = _axisD.getDataMax();
		this.valenceSliderMin = select('#valenceMin');
		this.valenceSliderMax = select('#valenceMax');

		// search bar **************************************************************
		//this.searchBar = select('#searchBar');
		this.searchBar = document.getElementById("searchBar");
		this.searchBar.addEventListener("input", (event) => {
			if( !event.target.value ) {
				resetSearch();
			} else {
				search( event.target.value );
			}
		});



		//this.valenceSliderMin.ionRangeSlider = function() {
		//	print(	this.value );
		//}

		//this.searchString = "";
	}




	updateFilters() {
		// tempo update
		this.tempoMin = this.axisTempo.getDataValue( this.tempoSliderMin.value() );
		this.tempoMax = this.axisTempo.getDataValue( this.tempoSliderMax.value() );
		resetFilterTempo();
		filterByTempo( this.tempoMin, this.tempoMax );

		// dance update
		this.danceMin = this.axisDance.getDataValue( this.danceSliderMin.value() );
		this.danceMax = this.axisDance.getDataValue( this.danceSliderMax.value() );
		resetFilterDanceability();
		filterByDanceability( this.danceMin, this.danceMax );

		// energy update
		this.energyMin = this.axisEnergy.getDataValue( this.energySliderMin.value() );
		this.energyMax = this.axisEnergy.getDataValue( this.energySliderMax.value() );
		resetFilterEnergy();
		filterByEnergy( this.energyMin, this.energyMax );

		// valence update
		this.valenceMin = this.axisValence.getDataValue( this.valenceSliderMin.value() );
		this.valenceMax = this.axisValence.getDataValue( this.valenceSliderMax.value() );
		resetFilterValence();
		filterByValence(this.valenceMin, this.valenceMax );
	}

	display() {
		push();
		translate( this.pos.x, this.pos.y );
		stroke(0);
		fill(255);
		rect(0, 0, this.size.x, this.size.y);
		pop();
	}

};
