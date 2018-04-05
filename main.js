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
  if (isWaitingForFirstInputAfterEquals) {
    tokens.pop();
  }
  if (isWaitingForFirstInputAfterEquals || (tokens[tokens.length - 1] instanceof OperatorObject)) {
    tokens.push(new FloatObject("", {isAnswer: true}));
  }
  if ((tokens[tokens.length - 1] instanceof FloatObject) && ((tokens[tokens.length - 1].displayPart === "") || (token[tokens.length - 1].displayPart === "0"))){
    tokens[tokens.length - 1].display = answer;
  }
  return tokens;
}

var appendOperator = function (tokens, operator, isWaitingForFirstInputAfterEquals) {
  if (isWaitingForFirstInputAfterEquals || tokens[tokens.length - 1] instanceof FloatObject) {
    tokens.push(new OperatorObject(""));
  }
  if (tokens[tokens.length - 1] instanceof OperatorObject) {
    tokens[tokens.length - 1].displayPart = operator;
  }
  return tokens;
}

var appendContent = function (tokens, content, isWaitingForFirstInputAfterEquals) {
  if (isWaitingForFirstInputAfterEquals) {
    tokens.pop();
  }
  if (isWaitingForFirstInputAfterEquals || (tokens[tokens.length - 1] instanceof OperatorObject)) {
    tokens.push(new FloatObject("", {isAnswer: false}));
  }
  if ((content === ".") && /\./.test(tokens[tokens.length - 1].displayPart)) {
    return tokens;
  }
  if ((content !== ".") && (tokens[tokens.length - 1].displayPart === "0")) {
    tokens[tokens.length - 1].displayPart = "";
  }
  if ((!tokens[tokens.length - 1].isAnswer) && (tokens[tokens.length - 1] instanceof FloatObject)) {
    tokens[tokens.length - 1].displayPart += content;
  }
  return tokens;
};

function filteredResultForEval (tokens) {
  if (tokens.every(function (currentValue) {
    if (currentValue instanceof FloatObject) {
      return (currentValue.displayPart === "Infinity") || (Number.parseFloat(currentValue.displayPart).toString() == currentValue.displayPart);
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
      throw "Array.reduce() error";
    }, "");
  }
  throw "Array.every() error";
}

var useEval = function (tokens) {
  try {
    return [new FloatObject(eval(filteredResultForEval(tokens)).toString(), {isAnswer: true})];
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
        input.content = this.answer;
      }
      this.tokens = input.processInput(this.tokens, input.content, this.isWaitingForFirstInputAfterEquals);
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
