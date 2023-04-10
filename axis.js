class Axis {

  constructor(_label, _data_min, _data_max, _axis_min, _axis_max) {
    this.label = _label;
    this.data_min = _data_min;
    this.data_max = _data_max;
    this.axis_min = _axis_min;
    this.axis_max = _axis_max;
    this.data_range = this.data_max - this.data_min;
    this.axis_range = this.axis_max - this.axis_min;

    print("axis '",this.label,"' data[",this.data_min,",",this.data_max,", range:", this.data_range,"];");

  }

  getConverted( _data_value ) {
    let converted;
    converted = (_data_value - this.data_min ) / this.data_range;
    converted = (converted * this.axis_range) + this.axis_min;
    return converted;
  }

};
