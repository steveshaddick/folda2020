import '../scss/app.scss';

import randomColor from 'randomcolor';
import { cubicInOut, sineIn } from 'eases-jsnext';

import rawData from '../../data/data.json';

let canvasWidth = 1500;
let canvasHeight = 600;
let aspectRatio = canvasWidth / canvasHeight;

let halfCanvasWidth = canvasWidth / 2;
let halfCanvasHeight = canvasHeight / 2;

let last = 0;
let runningTime = 0;
let data = [];

let earliestStart = 24;
let longestDistance = 0;

function tick(timestamp) {
  const elapsed = timestamp - last;
  if (elapsed < 16) {
    window.requestAnimationFrame(tick);
    return;
  }
  last = timestamp;
  const elapsedAdjust = (elapsed > 24) ? elapsed / 16 : 1;

  runningTime += elapsed * 400;
  if ((runningTime > 11425000) && (runningTime < 18500000)) {
    runningTime = 18500000;
  }
  if (runningTime > 86400000) {
    runningTime = 0;
    for (var i=0, len=data.length; i<len; i++) {
      data[i].isDone = false;
    }
  }
  const twentyFourTime = runningTime / 3600000;
  const twelveHourTime = twentyFourTime >= 12 ? twentyFourTime - 12 : twentyFourTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //console.log(twelveHourTime, runningTime);
  
  for (var i=0, len=data.length; i<len; i++) {
    let currentData = data[i];
    const { 
      start,
      distance,
      distancePerc,
      currentDistance,
      size,
      pace,
      colour,
      colour2,
      skewDistance,
      currentSkew,
      opacity,
      isMoving,
      isFade,
      isDone,
      point1,
      point2,
      point3,
      point4
    } = currentData;
    const twelveStartTime = start >= 12 ? start - 12 : start;

    let distanceProgress = currentDistance / distance;

    let _point1 = point1;
    let _point2 = point2;
    let _point3 = point3;
    let _point4 = point4;
    let _needDraw = !isDone && (isMoving || isFade);
    let _opacity = opacity;

    if (!isMoving && !isDone) {
      if (twentyFourTime >= start) {
        currentData.isMoving = true;
        _needDraw = true;
      }
    }

    if (isFade) {
      _opacity = opacity - (0.0002 * elapsedAdjust);
      currentData.opacity = _opacity;
      if (_opacity <= 0) {
        currentData.opacity = 1;
        currentData.isFade = false;
        currentData.isMoving = false;
        currentData.currentDistance = 0;
        currentData.isDone = true;

        _needDraw = false;
      }
    }

    if (_needDraw) {
      let width = 0;
      let height = 0;
      currentData.isMoving = true;

      currentDistance += (1 / (pace * 24)) * elapsedAdjust; 
      
      if (currentDistance >= distance) {
        currentDistance = distance;
        currentData.isMoving = false;
        currentData.isFade = true;
      }
      currentData.currentDistance = currentDistance;
      distanceProgress = currentDistance / distance;

      let _skew = skewDistance - (skewDistance * sineIn(distanceProgress));
      let timePercBlock;
      let timeSpot;
      let halfWidth;
      let halfHeight;
      let gradient;

      if (twelveStartTime < 2) {
        width = size;
        halfWidth = width / 2;
        height = cubicInOut(distanceProgress) * (distancePerc * canvasHeight);

        timePercBlock = twelveStartTime / 2;
        timeSpot = halfCanvasWidth + (timePercBlock * halfCanvasWidth);

        gradient = ctx.createLinearGradient(timeSpot + halfWidth, height, timeSpot + halfWidth, 0);

        _point1 = { x: timeSpot + halfWidth, y: height };
        _point2 = { x: timeSpot - halfWidth, y: height - _skew };
        _point3 = { x: timeSpot - halfWidth, y: 0 };
        _point4 = { x: timeSpot + halfWidth, y: 0 };

      } else if (twelveStartTime < 4) {
        height = size;
        halfHeight = height / 2;
        width = cubicInOut(distanceProgress) * (distancePerc * canvasWidth);

        timePercBlock = (twelveStartTime - 2) / 2;
        timeSpot = (timePercBlock * canvasHeight);

        gradient = ctx.createLinearGradient(canvasWidth - width, timeSpot + halfHeight, canvasWidth, timeSpot + halfHeight);

        _point1 = { x: canvasWidth - width, y: timeSpot + halfHeight };
        _point2 = { x: canvasWidth - width + _skew, y: timeSpot - halfHeight };
        _point3 = { x: canvasWidth, y: timeSpot - halfHeight };
        _point4 = { x: canvasWidth, y: timeSpot + halfHeight };
      
      } else if (twelveStartTime < 8) {
        width = size;
        halfWidth = width / 2;
        height = cubicInOut(distanceProgress) * (distancePerc * canvasHeight);

        timePercBlock = (twelveStartTime - 4) / 4;
        timeSpot = canvasWidth - (timePercBlock * canvasWidth);

        gradient = ctx.createLinearGradient(timeSpot - halfWidth, canvasHeight - height, timeSpot - halfWidth, canvasHeight);

        _point1 = { x: timeSpot - halfWidth, y: canvasHeight - height };
        _point2 = { x: timeSpot + halfWidth, y: canvasHeight - height + _skew };
        _point3 = { x: timeSpot + halfWidth, y: canvasHeight };
        _point4 = { x: timeSpot - halfWidth, y: canvasHeight };
      
      } else if (twelveStartTime < 10) {
        height = size;
        halfHeight = height / 2;
        width = cubicInOut(distanceProgress) * (distancePerc * canvasWidth);

        timePercBlock = (twelveStartTime - 8) / 2;
        timeSpot = canvasHeight - (timePercBlock * canvasHeight);

        gradient = ctx.createLinearGradient(width, timeSpot - halfHeight, 0, timeSpot - halfHeight);

        _point1 = { x: width, y: timeSpot - halfHeight };
        _point2 = { x: width - _skew, y: timeSpot + halfHeight };
        _point3 = { x: 0, y: timeSpot + halfHeight };
        _point4 = { x: 0, y: timeSpot - halfHeight };
      
      } else {
        width = size;
        halfWidth = width / 2;
        height = cubicInOut(distanceProgress) * (distancePerc * canvasHeight);

        timePercBlock = (twelveStartTime - 10) / 2;
        timeSpot = (timePercBlock * halfCanvasWidth);

        gradient = ctx.createLinearGradient(timeSpot + halfWidth, height, timeSpot + halfWidth, 0);

        _point1 = { x: timeSpot + halfWidth, y: height };
        _point2 = { x: timeSpot - halfWidth, y: height - _skew };
        _point3 = { x: timeSpot - halfWidth, y: 0 };
        _point4 = { x: timeSpot + halfWidth, y: 0 };
      }

      let gradColour = colour.replace(')', `,${_opacity})`);
      gradient.addColorStop(0, gradColour);
      gradient.addColorStop(1, colour2);
      
      ctx.beginPath();
      ctx.moveTo(_point1.x, _point1.y);
      ctx.lineTo(_point2.x, _point2.y);
      ctx.lineTo(_point3.x, _point3.y);
      ctx.lineTo(_point4.x, _point4.y);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }

  }
  
  window.requestAnimationFrame(tick);

}

function convertToDecimalTime(str) {
  const timeParts = str.split(':');
  return parseInt(timeParts[0]) + (parseInt(timeParts[1]) / 60);
}

const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext('2d');
const main = (function() {

  // initial data processing
  for (var i=0, len=rawData.length; i<len; i++) {
    const rawDataItem = rawData[i];

    const start = convertToDecimalTime(rawDataItem['Time of Upload in 24 hour clock']);
    const pace = convertToDecimalTime(rawDataItem['Ave Pace']);
    const colour = randomColor({format: 'rgb'});
    const colour2 = colour.replace(')', ',0)');

    let dataItem = {
      start: start,
      distance: rawDataItem['Distance in KM'],
      distancePerc: 1,
      currentDistance: 0,
      pace: pace,
      size: rawDataItem['Distance in KM'] * pace * 2,
      colour: colour,
      colour2: colour2,
      skewDistance: parseInt(rawDataItem['Elevation']) * 2,
      currentSkew: 0,
      opacity: 1,
      isFade: false,
      isMoving: false,
      isDone: false,
      point1: null,
      point2: null,
      point3: null,
      point4: null
    }

    if (dataItem.distance > longestDistance) {
      longestDistance = dataItem.distance;
    }
    if (dataItem.start < earliestStart) {
      earliestStart = dataItem.start;
    }

    data.push(dataItem);
  }

  // secondary data processing
  for (var i=0, len=data.length; i<len; i++) {
    data[i].distancePerc = data[i].distance / longestDistance;
  }

  runningTime = (earliestStart * 60 * 60 * 1000) - 10000;

  // run!
  window.requestAnimationFrame(tick);

})();
