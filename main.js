//global components
Vue.component('button-draw', {
  props: ['content'],
  template: '<button v-on:click="$emit(\'press\')">{{content}}</button>'
});

var updateDisplay = function (){};
var useEval = function (){};
var clearDisplay = function (){};

var app = new Vue ({
  el: '#app',
  data: {
    inputs: [
      {content: '1', processInput: updateDisplay},
      {content: '2', processInput: updateDisplay},
      {content: '3', processInput: updateDisplay},
      {content: '4', processInput: updateDisplay},
      {content: '5', processInput: updateDisplay},
      {content: '6', processInput: updateDisplay},
      {content: '7', processInput: updateDisplay},
      {content: '8', processInput: updateDisplay},
      {content: '9', processInput: updateDisplay},
      {content: '0', processInput: updateDisplay},
      {content: '.', processInput: updateDisplay},
      {content: '+', processInput: updateDisplay},
      {content: '-', processInput: updateDisplay},
      {content: '*', processInput: updateDisplay},
      {content: '/', processInput: updateDisplay},
      {content: '=', processInput: useEval},
      {content: 'AC', processInput: clearDisplay}
    ],
    result: "0",
  }
});
