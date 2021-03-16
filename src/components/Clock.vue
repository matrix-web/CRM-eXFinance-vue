<template>
  <div class="card-clock">
    <canvas class="clock-canvas" ref="canvas"></canvas>
    <p class="card-clock__date">{{ dateStr }}</p>
  </div>
</template>

<script>
  export default {
    data: () => ({
      canvas: null,
      dateStr: null
    }),
    methods: {
      displayClock() {
        const ctx = this.canvas.getContext('2d')
        ctx.canvas.width = 250
        ctx.canvas.height = 280

        ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height)

        // Расчет координат центра и радиуса часов
        const radiusClock = this.canvas.width / 2 - 10
        const xCenterClock = this.canvas.width / 2
        const yCenterClock = this.canvas.height / 2

        // Очистка canvas
        ctx.fillStyle = '#fff'
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // Отрисовка контура часов
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(xCenterClock,yCenterClock,radiusClock,0,2*Math.PI, true);
        ctx.moveTo(xCenterClock,yCenterClock);
        ctx.stroke();
        ctx.closePath();

        // Отрисовка рисок часов
        const radiusNum = radiusClock - 10
        let radiusPoint = null
        for (let tm = 0; tm < 60; tm++) {
          ctx.beginPath()
          if (tm % 5 == 0) {
            radiusPoint = 5
          } else {
            radiusPoint = 2
          }
          const xPointM = xCenterClock + radiusNum * Math.cos(-6 * tm * (Math.PI / 180) + Math.PI / 2)
          const yPointM = yCenterClock + radiusNum * Math.sin(-6 * tm * (Math.PI / 180) + Math.PI / 2)
          ctx.arc(xPointM, yPointM, radiusPoint, 0, 2 * Math.PI, true)
          ctx.stroke()
          ctx.closePath()
        }

        // Отрисовка циферблата
        for(let th = 1; th <= 12; th++) {
          ctx.beginPath();
          ctx.font = 'bold 25px sans-serif';
          const xText = xCenterClock + (radiusNum - 30) * Math.cos(-30 * th * (Math.PI / 180) + Math.PI / 2);
          const yText = yCenterClock - (radiusNum - 30) * Math.sin(-30 * th * (Math.PI / 180) + Math.PI / 2);
          if(th <= 9) {
            ctx.strokeText(th,xText - 5,yText + 10);
          }
          else {
            ctx.strokeText(th,xText - 15, yText + 10);
          }
          ctx.stroke();
          ctx.closePath();
        }

        // Отрисовка стрелок часов
        const lengthSecond = radiusNum - 10
        const lengthMinutes = radiusNum - 15
        const lengthHours = lengthMinutes / 1.5
        const clock = new Date()
        const tSec = 6 * clock.getSeconds()
        const tMin = 6 * (clock.getMinutes() + (1/60) * clock.getSeconds())
        const tHour = 30 * (clock.getHours() + (1/60) * clock.getMinutes())
        const daysWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
        const dateString = `${daysWeek[clock.getDay()]} ${clock.toLocaleString()}`
        this.dateStr = dateString
        // cardClockDate.textContent = dateString

        // Рисуем секундную стрелку
        ctx.beginPath()
        ctx.strokeStyle = '#ff0000'
        ctx.moveTo(xCenterClock, yCenterClock)
        ctx.lineTo(xCenterClock + lengthSecond * Math.cos(Math.PI / 2 - tSec * (Math.PI / 180)), 
        yCenterClock - lengthSecond * Math.sin(Math.PI / 2  - tSec * (Math.PI / 180)))
        ctx.stroke()
        ctx.closePath()

        // Рисуем минутную стрелку
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.moveTo(xCenterClock,yCenterClock);
        ctx.lineTo(xCenterClock + lengthMinutes * Math.cos(Math.PI / 2 - tMin * (Math.PI / 180)),
        yCenterClock - lengthMinutes * Math.sin(Math.PI / 2 - tMin * (Math.PI / 180)));
        ctx.stroke();
        ctx.closePath();

        // Рисуем часовую стрелку
        ctx.beginPath()
        ctx.lineWidth = 5
        ctx.moveTo(xCenterClock, yCenterClock)
        ctx.lineTo(xCenterClock + lengthHours*Math.cos(Math.PI / 2 - tHour * (Math.PI / 180)),
        yCenterClock - lengthHours * Math.sin(Math.PI / 2 - tHour * (Math.PI / 180)))
        ctx.stroke()
        ctx.closePath()

        // Рисуем центр часов
        ctx.beginPath()
        ctx.strokeStyle = '#000'
        ctx.fillStyle = '#fff'
        ctx.lineWidth = 3
        ctx.arc(xCenterClock, yCenterClock, 5, 0, 2 * Math.PI, true)
        ctx.stroke()
        ctx.fill()
        ctx.closePath()

        return
      }
    },
    mounted() {
      this.canvas = this.$refs.canvas

      setInterval(this.displayClock, 1000)
    }
  }
</script>