//global components
Vue.component('button-draw', {
  props: ['content'],
  template: '<button v-on:click="$emit(\'press\')">{{content}}</button>'
});


function contentAcceptable (result, content) {
  const lastEntryHasDecimalPoint = /\.\d*$/;
  const operatorsAtEnd = /[\+\-\*\/]$/;
  if (operatorsAtEnd.test(content) && operatorsAtEnd.test(result)) {
    return false;
  }
  if (lastEntryHasDecimalPoint.test(content) && lastEntryHasDecimalPoint.test(result)) {
    return false;
  }
  return true;
}

function omitExtraneousZero (result) {
  const lastEntry = /[\d\.]*$/;
  if (lastEntry.exec(result)[0] === "0") {
    return result.substr(0, result.length - 1);
  }
  return result;
}

var appendContent = function (result, content) {
  if (contentAcceptable(result, content)) {
    return omitExtraneousZero(result) + content;
  }
  return result;
};

var useEval = function (result) {
  const allowableChars = /^[\d\.\+\-\*\/]*$/;
  if (allowableChars.test(result)) {
    return eval(result);
  }
  //check to see if the number-operator-number pattern is correct
    //really big numbers
    //division by 0
    //figure out eval() behaviour
    //decimal formatting?
  return "0";
};

var clearDisplay = function () {
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
    updateDisplay: function (input) {
      this.result = input.processInput(this.result, input.content);
    }
  }
});
