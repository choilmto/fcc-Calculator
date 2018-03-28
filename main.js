Vue.component('button-draw', {
  props: ['content'],
  template: '<button v-on:click="$emit(\'press\')">{{content}}</button>'
});

function adjustContent (result, content) {
  const lastEntryHasDecimalPoint = /\.\d*$/;
  const operatorsAtEnd = /[\+\-\*\/]$/;
  if (operatorsAtEnd.test(content) && operatorsAtEnd.test(result[result.length - 1])) {
    return "";
  }
  if (lastEntryHasDecimalPoint.test(content) && lastEntryHasDecimalPoint.test(result)) {
    return "";
  }
  return content;
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
  return adjustResult(result, content, answer) + adjustContent(result, content);
};

function filteredResultForEval (result) {
  const allowedChars = /e\+|[\d\.\+\-\*\/]|Infinity/g;
  if (result.match(allowedChars).join("") === result) {
    return result;
  }
  return 0;
}

var useEval = function (result) {
  try {
    return {result: eval(filteredResultForEval(result)),
      answer: true};
  }
  catch(e) {
    window.alert(e);
    return "0";
  }
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
    answer: ""
  },
  methods: {
    updateDisplay: function (input) {
      var resultOfProcessInput = input.processInput(this.result, input.content, this.answer);
      if (typeof resultOfProcessInput === 'object') {
        this.answer = resultOfProcessInput.answer;
        resultOfProcessInput = resultOfProcessInput.result;
      } else {
        this.answer = "";
      }
      this.result = resultOfProcessInput;
    }
  }
});
