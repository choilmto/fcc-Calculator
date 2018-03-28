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

function adjustResult (result, content, answer) {
  const lastEntry = /[\d\.]*$/;
  if (answer && Number.isInteger(parseInt(content))) {
    return "";
  }
  if ((lastEntry.exec(result)[0] === "0") && Number.isInteger(parseInt(content))){
    return result.substr(0, result.length - 1);
  }
  return result;
}

var appendContent = function (result, content, answer) {
  if (contentAcceptable(result, content)) {
    return adjustResult(result, content, answer) + content;
  }
  return result;
};

function inputAcceptable (result) {
  const allowableChars = /^[\d\.\+\-\*\/]*$/;
  const digits = /\d/;
  if (allowableChars.test(result)) {
    return true;
  }
  if (digits.test(result[result.length - 1])) {
    return true;
  }
}

var useEval = function (result) {
  if (inputAcceptable(result)) {
    return {result: eval(result), answer: true};
  }
  //check to see
    //scientific notation
    //when answer is 'infinity'
    //figure out eval() errors
    //'.' as an entry
    //handle answer behaviour
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
    answer: false
  },
  methods: {
    updateDisplay: function (input) {
      var resultOfProcessInput = input.processInput(this.result, input.content, this.answer);
      if (typeof resultOfProcessInput === 'object') {
        this.answer = resultOfProcessInput.answer;
        resultOfProcessInput = resultOfProcessInput.result;
      } else {
        this.answer = false;
      }
      this.result = resultOfProcessInput;
    }
  }
});
