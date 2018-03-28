//global components
Vue.component('button-draw', {
  props: ['content'],
  template: '<button v-on:click="$emit(\'press\')">{{content}}</button>'
});

var appendContent = function (result, content){
  return result + content;
};

var useEval = function (result){
  const allowableChars = /^[\d\.\+\-\*\/]*$/;
  if (allowableChars.test(result)) {
    return "0";
  }
  return eval(result);
};

var clearDisplay = function (){
  return "0";
};

var app = new Vue ({
  el: '#app',
  data: {
    inputs: [
      {content: '1', processInput: appendContent},
      {content: '2', processInput: appendContent},
      {content: '3', processInput: appendContent},
      {content: '4', processInput: appendContent},
      {content: '5', processInput: appendContent},
      {content: '6', processInput: appendContent},
      {content: '7', processInput: appendContent},
      {content: '8', processInput: appendContent},
      {content: '9', processInput: appendContent},
      {content: '0', processInput: appendContent},
      {content: '.', processInput: appendContent},
      {content: '+', processInput: appendContent},
      {content: '-', processInput: appendContent},
      {content: '*', processInput: appendContent},
      {content: '/', processInput: appendContent},
      {content: '=', processInput: useEval},
      {content: 'AC', processInput: clearDisplay}
    ],
    result: "0",
  },
  methods: {
    updateDisplay: function (input){
      this.result = input.processInput(this.result, input.content);
    }
  }
});
