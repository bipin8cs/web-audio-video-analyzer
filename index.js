const input = document.querySelector('input');
const audioElement = document.querySelector('audio');
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//Web audio api-->own aduio 
input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    console.log('file', file)//it will comes as array  you can upload multiple by using this multiple props
    audioElement.src = URL.createObjectURL(file);//url format
    audioElement.play();

    //Audio Processing
    //1.Create an audio context
    //2.Create an audio source
    //3.Create an audio effects(in ourcase we will anlayze the audio)
    //4.Create an audio destination

    //audioContext is the main object that manages the audio processing graph or simple modular route
    const audioContext = new AudioContext();
    //creating audio  source node
    const audioSource = audioContext.createMediaElementSource(audioElement);

    //analyzer node
    const analyzer = audioContext.createAnalyser();
    audioSource.connect(analyzer);
    //destination node
    analyzer.connect(audioContext.destination);

    analyzer.fftSize = 512;//size of the fft count of sound bar 
    const bufferDataLength = analyzer.frequencyBinCount;//how many frequency bins/actual soundbar are there//no.of bar

    const bufferDataArr = new Uint8Array(bufferDataLength);//create a buffer to hold the data //byte length
    const barWidth = canvas.width / bufferDataLength;//width of each bar
    let x = 0;
    console.log('bufferDataLength', bufferDataLength)//256 

    // setInterval(() => {
    //     analyzer.getByteFrequencyData(bufferDataArr);//get the data from the analyzer
    // }, 2000)

    function drawAndAnimateSoundBar() {
        x = 0;
        context.fillRect(0, 0, canvas.width, canvas.height);//clear the canvas
        analyzer.getByteFrequencyData(bufferDataArr);//get the data from the analyzer
        bufferDataArr.forEach((dataValue) => {
            const barHeight = dataValue;
            const red = (barHeight * 2) % 150;
            const green = (barHeight * 5) % 200;
            const blue = (barHeight * 7) % 120;

            context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            //context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x+= barWidth + 1;
        })
       if(!audioElement.ended) requestAnimationFrame(drawAndAnimateSoundBar);
    }
    drawAndAnimateSoundBar()
   
})