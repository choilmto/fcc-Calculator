/*To extend the operators available in the calculator,
  add a key-pair value in operatorSet.
  eg. "log": Math.log()
*/
const operatorSet = {
  "+": "+",
  "-": "-",
  "/": "/",
  "\u00D7": "*"
};

class FloatObject {
  constructor (float, flags) {
    this.displayPart = float;  //should be in string form
    this.isAnswer = flags.isAnswer;
  }
}

class OperatorObject {
  constructor (operator) {
    this.displayPart = operator;
  }
}
/*In the future, I might want to implement an ErrorClass instead of using
  a FloatObject.
*/

const appendAnswer = (tokens, answer, isWaitingForFirstInputAfterEquals) => {
  if (answer === "") {
    return tokens;
  }
  let lastToken = tokens[tokens.length - 1];
  if (lastToken instanceof OperatorObject) {
    return tokens.concat([new FloatObject(answer, {isAnswer: true})]);
  }
  if (isWaitingForFirstInputAfterEquals || ((lastToken.displayPart === "") || (lastToken.displayPart === "0"))){
    lastToken = new FloatObject(answer, {isAnswer:true});
  }
  return tokens.slice(0, tokens.length - 1).concat([lastToken]);
}

const appendOperator = (tokens, operator, isWaitingForFirstInputAfterEquals) => {
  if (tokens[tokens.length - 1] instanceof FloatObject) {
    return tokens.concat(new OperatorObject(operator));
  }
  if (tokens[tokens.length - 1] instanceof OperatorObject) {
    return tokens.slice(0, tokens.length - 1).concat([new OperatorObject(operator)]);
  }
}

const appendContent = (tokens, content, isWaitingForFirstInputAfterEquals) => {
  let lastToken = tokens[tokens.length - 1];
  if (((content === ".") && /\./.test(lastToken.displayPart)) || lastToken.isAnswer) {
    return tokens;
  }
  if (lastToken instanceof OperatorObject) {
    return tokens.concat([new FloatObject(content, {isAnswer: false})]);
  }
  if (isWaitingForFirstInputAfterEquals || ((content !== ".") && (lastToken.displayPart === "0"))) {
    lastToken = new FloatObject("", {isAnswer: false});
  }
  lastToken.displayPart += content;
  return tokens.slice(0, tokens.length - 1).concat([lastToken]);
};

const filterResultForEval = (tokens) => {
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

const useEval = (tokens) => {
  try {
    let resultFromEval = eval(filterResultForEval(tokens)).toString();
    if (isNaN(resultFromEval)) {
      throw ("Not a number.");
    }
    return [new FloatObject(resultFromEval, {isAnswer: true})];
  }
  catch(e) {
    console.log(e);
    return [new FloatObject("ERROR", {isAnswer:true})];
  }
};

const clearDisplay = () => [new FloatObject("0", {isAnswer: false})];

const inputsArray = (() => {
  let arrayButtons = [{content: 'AC', processInput: clearDisplay},
    {content: 'ANS', processInput: appendAnswer}
  ];

  for (let operators in operatorSet) {
    arrayButtons.push({content: operators, processInput: appendOperator});
  }

  [7, 8, 9, 4, 5, 6, 1, 2, 3, 0].forEach((element) => arrayButtons.push({content: element.toString(), processInput: appendContent}));

  arrayButtons.push({content: ".", processInput: appendContent});
  arrayButtons.push({content: '=', processInput: useEval});

  return arrayButtons;
})();

Vue.component('button-draw', {
  props: ['content'],
  template: '<button v-on:click="$emit(\'press\')" class="calculator-buttons">{{content}}</button>'
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
      const {tokens, answer, isWaitingForFirstInputAfterEquals} = this;
      if (input.content === "ANS") {
        this.tokens = input.processInput(tokens, answer, isWaitingForFirstInputAfterEquals);
      } else {
        this.tokens = input.processInput(tokens, input.content, isWaitingForFirstInputAfterEquals);
      }
      let lastToken = this.tokens[this.tokens.length - 1];
      if ((lastToken.isAnswer) && (input.content === "=")) {
        lastToken.isAnswer = false;
        this.answer = lastToken.displayPart === "ERROR" ? "" : lastToken.displayPart;
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
