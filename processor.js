class VolumeProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this._buffer = new Float32Array(128);
        this.lastRMS = 0; // Lưu trữ RMS trước đó để so sánh
    }

    process(inputs) {
        const input = inputs[0];

        // Kiểm tra xem có đầu vào âm thanh không
        if (!input || input.length === 0) {
            return true; // Không có âm thanh, trả về true để tiếp tục
        }

        const samples = input[0];

        // Kiểm tra xem có mẫu âm thanh không
        if (!samples || samples.length === 0) {
            return true; // Không có mẫu, trả về true để tiếp tục
        }

        let sum = 0;
        for (let i = 0; i < samples.length; i++) {
            sum += samples[i] * samples[i];
        }
        const rms = Math.sqrt(sum / samples.length);

        // Chỉ gửi thông điệp nếu RMS thay đổi đáng kể
        if (Math.abs(rms - this.lastRMS) > 0.01) {
            this.port.postMessage(rms);
            this.lastRMS = rms; // Cập nhật giá trị RMS trước đó
        }

        return true; // Trả về true để tiếp tục xử lý âm thanh
    }
}

registerProcessor('volume-processor', VolumeProcessor);
