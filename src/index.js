import Jumper from 'jumper';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route } from 'react-router-dom';

console.log(Jumper);
Jumper.Console.init(true, {
    ignoreTypes:["warn"]
});
console.log(Jumper.Console.byLabel("jumper"), "Welcome to jumper!");
console.log(Jumper.Console);

const Routing = (<Router>
  <Route path="/*" component={App}/>
</Router>);

//React.StrictMode
var targetContainer = document.getElementById('root');
if(targetContainer!=null) {
  ReactDOM.render(
      Routing,
      targetContainer
  );
} else console.error("React runtime error, lack of root container");

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
