//global components
Vue.component('button-draw', {
  props: ['content'],
  template: '<button v-on:click="$emit(\'press\', content)">{{content}}</button>'
});

var app = new Vue ({
  el: '#app',
  data: {
    inputs: [
      {content: '1'},
      {content: '2'},
      {content: '3'},
      {content: '4'},
      {content: '5'},
      {content: '6'},
      {content: '7'},
      {content: '8'},
      {content: '9'},
      {content: '0'},
      {content: '+'},
      {content: '-'},
      {content: '*'},
      {content: '/'},
      {content: '='},
      {content: 'AC'}
    ],
    result: "0"
  }
});
