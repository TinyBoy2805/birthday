class VolumeProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this._buffer = new Float32Array(128);
    }
  
    process(inputs) {
      const input = inputs[0];
      const samples = input[0];
  
      let sum = 0;
      for (let i = 0; i < samples.length; i++) {
        sum += samples[i] * samples[i];
      }
      const rms = Math.sqrt(sum / samples.length);
  
      this.port.postMessage(rms);
      return true;
    }
  }
  
  registerProcessor('volume-processor', VolumeProcessor);
  