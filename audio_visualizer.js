const draw = () => {
  const musicFile = "./rollin.flac";
  const audio = document.getElementById("audio");

  audio.src = musicFile;
  audio.load();

  const context = new AudioContext();
  const src = context.createMediaElementSource(audio);
  const analyser = context.createAnalyser();

  const canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");

  src.connect(analyser);
  analyser.connect(context.destination);

  analyser.fftSize = 256;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  let barWidth = (WIDTH / 260) * 1;
  let barHeight = 0;

  let x = 0;
  let y = 0;

  const renderFrame = () => {
    requestAnimationFrame(renderFrame);

    x = 0;
    y = 0;

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 0.6;

      let r = barHeight + 25 * (i / bufferLength);
      let g = 250 * (i / bufferLength);
      let b = 50 + i;

      ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + 0.9 + ")";
      ctx.fillRect(x + WIDTH / 2 - barWidth, HEIGHT / 2 - barHeight, barWidth, barHeight);
      ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + 0.2 + ")";
      ctx.fillRect(x + WIDTH / 2 - barWidth, HEIGHT / 2, barWidth, barHeight);

      ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + 0.9 + ")";
      ctx.fillRect(y + WIDTH / 2, HEIGHT / 2 - barHeight, barWidth, barHeight);
      ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + 0.2 + ")";
      ctx.fillRect(y + WIDTH / 2, HEIGHT / 2, barWidth, barHeight);

      x -= barWidth + 1;
      y += barWidth + 1;
    }
  };

  audio.play();
  renderFrame();
};

window.onload = () => {
  draw();
};
