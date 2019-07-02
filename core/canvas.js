// create a wrapper around native canvas element (with id="c")
var canvasElement = document.getElementById('greetingCanvas');

canvasElement.width = "500";
canvasElement.height = "600";
canvasElement.style.boxShadow = "black 0px 0px 3px -1px";
canvasElement.style.margin = "80px 80px";

var canvas = new fabric.Canvas('greetingCanvas');
var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 20,
    height: 20
});