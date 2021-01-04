import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import { Link, Route, Switch, NavLink } from 'react-router-dom';
import MathAdv from './libraries/MathAdv';
import Laboratory from './components/Labolatory/Labolatory';
import Workshop from './components/Workshop';
import Symbols from './components/Symbols/Symbols';
import SymbolView from './components/Symbols/SymbolView';
import Exchanger from './components/Exchanger/Exchanger';
import Calc from './components/Calc/Calc';
import { NewsPostPage } from './components/News/news';

class App extends Component {
  constructor(props) {
    super(props);
  }

  toggleNavbarMenu(ev) {
    let hamburger = ev.currentTarget.children[0], navbarMenu = document.getElementById("navbar-container");
    console.log(navbarMenu);
    if(navbarMenu.classList.contains("active")) { navbarMenu.classList.remove("active"); hamburger.classList.remove("cross"); } else { navbarMenu.classList.add("active"); hamburger.classList.add("cross"); } 
  }

  render() {
  return (
    <div id="container">
      <nav id="navbar">
        <div className="navbar-inside">
          <div className="menu-toggle" onClick={(ev)=>this.toggleNavbarMenu(ev)}>
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="cross">
              <span></span>
              <span></span>
            </div>
          </div>
          <span className="vl desktop"></span>
          <h4 className="desktop">MathEnv</h4>
          <span className="righty" title="Przybornik">&#x2692;</span>
        </div>
      </nav>
      <div className="container-inside">
      <div id="navbar-container" className="navbar-menu scrollableContainerThin">
          <ul>
            <div className="header-separator"><h3>Zawartość</h3></div>
            <Link to="/news">Aktualności</Link>
            <Link to="/learn">Nauka</Link>
            <Link to="/communityTasks">Zadania społeczności</Link>
            <hr/>
            <div className="header-separator"><h3>Moduły</h3></div>
            <Link to="/">Labolatorium</Link>
            <Link to="/unitsExchanger">Zmiana jednostek</Link>
            <Link to="/matrices">Macierze</Link>
            <Link to="/workshop">Wizualizator funkcji</Link>
            <Link to="/calc">MathEnv Calc (Beta)</Link>
            <hr/>
            <div className="header-separator"><h3>Narzędzia</h3></div>
            <Link to="/symbols">Symbole</Link>
            <hr/>
            <div className="header-separator"><h3>Inne</h3></div>
            <Link to="/chem">&#129514; Lab. Chemiczne</Link>
            <a>Zarządzaj modułami</a>
          </ul>
        </div>
        <div className="main-wrapper scrollableContainer">
      <Switch>
        <Route path="/" component={Laboratory} exact />
        <Route path="/news/:post?" component={NewsPostPage} />
        <Route path="/symbols/:category?/:subcategory?" exact component={Symbols} />
        <Route path="/symbols/:category/:subcategory/:id" exact component={SymbolView} />
        <Route path="/unitsExchanger" component={Exchanger} />
        <Route path="/calc" component={Calc} />
        <Route path="/workshop" component={Workshop} />
        <Route path="/formulas" component={Workshop} />
      </Switch>
      <footer id="foot">
          <section id="author">
              Grano22 Dev &copy; 2020
          </section>
      </footer>
      </div>
      </div>
    </div>
  );
  }
}

export default App;