const operatorSet = {
  "+": "+",
  "-": "-",
  "/": "/",
  "*": "*"
};

function FloatObject (float, flags) {
  this.displayPart = float;  //should be in string form
  this.isAnswer = flags.isAnswer;
}

function OperatorObject (operator) {
  this.displayPart = operator;
}

var appendAnswer = function (tokens, answer, isWaitingForFirstInputAfterEquals) {
  if (answer === "") {
    return tokens;
  }
  if (tokens[tokens.length - 1] instanceof OperatorObject) {
    tokens.push(new FloatObject("", {isAnswer: false}));
  }
  if (isWaitingForFirstInputAfterEquals || ((tokens[tokens.length - 1].displayPart === "") || (tokens[tokens.length - 1].displayPart === "0"))){
    tokens[tokens.length - 1].displayPart = answer;
    tokens[tokens.length - 1].isAnswer = true;
  }
  return tokens;
}

var appendOperator = function (tokens, operator, isWaitingForFirstInputAfterEquals) {
  if (tokens[tokens.length - 1] instanceof FloatObject) {
    tokens.push(new OperatorObject(""));
  }
  if (tokens[tokens.length - 1] instanceof OperatorObject) {
    tokens[tokens.length - 1].displayPart = operator;
  }
  return tokens;
}

var appendContent = function (tokens, content, isWaitingForFirstInputAfterEquals) {
  if ((content === ".") && /\./.test(tokens[tokens.length - 1].displayPart) || tokens[tokens.length - 1].isAnswer) {
    return tokens;
  }
  if (isWaitingForFirstInputAfterEquals || (tokens[tokens.length - 1] instanceof OperatorObject)) {
    if (isWaitingForFirstInputAfterEquals) {
      tokens.pop();
    }
    tokens.push(new FloatObject("", {isAnswer: false}));
  }
  if ((content !== ".") && (tokens[tokens.length - 1].displayPart === "0")) {
    tokens[tokens.length - 1].displayPart = "";
  }
  tokens[tokens.length - 1].displayPart += content;
  return tokens;
};

function filteredResultForEval (tokens) {
  if (tokens.every(function (currentValue) {
    if (currentValue instanceof FloatObject) {
      return (currentValue.displayPart === "Infinity") || (Number.parseFloat(currentValue.displayPart) == currentValue.displayPart);
    }
    return (currentValue instanceof OperatorObject) && (currentValue.displayPart in operatorSet);
  })) {
    return tokens.reduce((accumulator, currentValue) => {
      if (currentValue instanceof FloatObject) {
        return accumulator + currentValue.displayPart;
      }
      if (currentValue instanceof OperatorObject) {
        return accumulator + operatorSet[currentValue.displayPart];
      }
      throw "Input(1) error.";
    }, "");
  }
  throw "Input(2) error.";
}

var useEval = function (tokens) {
  try {
    var resultFromEval = eval(filteredResultForEval(tokens)).toString();
    if (isNaN(resultFromEval)) {
      throw ("Not a number.");
    }
    return [new FloatObject(resultFromEval, {isAnswer: true})];
  }
  catch(e) {
    window.alert(e);
    return clearDisplay();
  }
};

var clearDisplay = function () {
  return [new FloatObject("0", {isAnswer: false})];
};

var inputsArray = (function () {
  var arrayButtons = [{content: 'AC', processInput: clearDisplay},
    {content: '=', processInput: useEval},
    {content: 'ANS', processInput: appendAnswer},
    {content: ".", processInput: appendContent}
  ];

  for (var i = 0; i <= 9; i++) {
    arrayButtons.push({content: i.toString(), processInput: appendContent});
  }

  for (operators in operatorSet) {
    arrayButtons.push({content: operators, processInput: appendOperator});
  }
  return arrayButtons;
})();

Vue.component('button-draw', {
  props: ['content'],
  template: '<button v-on:click="$emit(\'press\')">{{content}}</button>'
});

var app = new Vue ({
  el: '#app',
  data: {
    inputs: inputsArray,
    tokens: [new FloatObject("0", {isAnswer: false})],
    isWaitingForFirstInputAfterEquals: false,
    answer: ""
  },
  computed: {
    display: function () {
      return this.tokens.reduce((accumulator, currentValue) => accumulator + currentValue.displayPart, "");
    }
  },
  methods: {
    respondToInput: function (input) {
      if (input.content === "ANS") {
        this.tokens = input.processInput(this.tokens, this.answer, this.isWaitingForFirstInputAfterEquals);
      } else {
        this.tokens = input.processInput(this.tokens, input.content, this.isWaitingForFirstInputAfterEquals);
      }
      if ((this.tokens[this.tokens.length - 1].isAnswer) && (input.content === "=")) {
        this.tokens[this.tokens.length - 1].isAnswer = false;
        this.answer = this.tokens[this.tokens.length - 1].displayPart;
        this.isWaitingForFirstInputAfterEquals = true;
        return;
      }
      if (input.content === "AC") {
        this.answer = "";
      }
      this.isWaitingForFirstInputAfterEquals = false;
    }
  }
});
