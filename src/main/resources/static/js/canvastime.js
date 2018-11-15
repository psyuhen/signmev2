(function () {
    var canvas = document.getElementById("canvastime");
    var ctx = canvas.getContext("2d");

    var height = canvas.height;
    var width = canvas.width;
    var halfWidth = width / 2;
    var halfHeight = height / 2;
    var proportion=5;
    var fontsize = height / 20;

    ctx.strokeStyle = '#0275d8';
    ctx.lineWidth = width*17/500;
    ctx.shadowBlur= width*3/100;
    ctx.shadowColor = '#0275d8';

    function degToRad(degree){
        var factor = Math.PI/180;
        return degree*factor;
    }

    function renderTime(){
        var now = new Date();
        var today = now.toDateString();
        var time = now.toLocaleTimeString();
        var hrs = now.getHours();
        var min = now.getMinutes();
        var sec = now.getSeconds();
        var mil = now.getMilliseconds();
        var smoothsec = sec+(mil/1000);
        var smoothmin = min+(smoothsec/60);

        //Background
        gradient = ctx.createRadialGradient(halfWidth, halfHeight, halfWidth/150, halfWidth, halfHeight, halfHeight*0.9);
        gradient.addColorStop(0, "#03303a");
        gradient.addColorStop(1, "white");
        ctx.fillStyle = gradient;
        //ctx.fillStyle = 'rgba(00 ,00 , 00, 1)';
        ctx.fillRect(0, 0, width, height);
        //Hours
        ctx.beginPath();
        var r = width / proportion * 2;
        ctx.arc(halfWidth, halfHeight, r, degToRad(270), degToRad((hrs*30)-90));
        ctx.stroke();
        //Minutes
        ctx.beginPath();
        ctx.arc(halfWidth, halfHeight, r * 17 / 20, degToRad(270), degToRad((smoothmin*6)-90));
        ctx.stroke();
        //Seconds
        ctx.beginPath();
        ctx.arc(halfWidth, halfHeight, r * 14 / 20, degToRad(270), degToRad((smoothsec*6)-90));
        ctx.stroke();
        //Date

        ctx.font = fontsize + "px Helvetica";
        ctx.fillStyle = 'rgba(00, 255, 255, 1)';
        ctx.fillText(today, halfWidth*0.6, halfHeight);
        //Time
        ctx.font = fontsize + "px Helvetica Bold";
        ctx.fillStyle = 'rgba(00, 255, 255, 1)';
        ctx.fillText(time+":"+mil, halfWidth*0.6, halfHeight * 1.3);

    }
    setInterval(renderTime, 40);
})(window)
