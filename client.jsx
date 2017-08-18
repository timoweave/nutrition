"use strict";

import $ from "jquery";
import React, {Component} from "react";
import ReactDom from "react-dom";
import {Provider, connect} from "react-redux";
import {BrowserRouter, Switch, Route, withRouter} from "react-router-dom";

import AppBar from "material-ui/AppBar";
import Drawer from "material-ui/Drawer";
import Snackbar from 'material-ui/Snackbar';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import EditorModeEdit from "material-ui/svg-icons/editor/mode-edit";
import SearchBar from 'material-ui-search-bar';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import {Card, CardActions, CardText} from "material-ui/Card";
import FloatingActionButton from 'material-ui/FloatingActionButton';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {deepOrange100, deepOrange500, deepOrange700} from "material-ui/styles/colors";
import injectTapEventPlugin from "react-tap-event-plugin";
import SearchInput from "react-search-input";

import {Data, Menu} from "./store.js";

$(document).ready(app);

export function Label({left, right, size, line="visible", padding="", weight="normal"}) {
    return (
        <div>
          <div>
            <span style={lhs()}>{left}</span>
            <span style={rhs()}>{right}</span>
            <span style={center()}>&nbsp;</span>
          </div>
          <hr style={{visibility:line, padding: padding}}/>
        </div>
    );

    function lhs() { return  {float: "left", marginRight: "0.5em", fontSize: size, fontWeight: weight}; }
    function center() { return  {display: "block", overflow: "auto", position: "relative", top: "-0.25em"}; }
    function rhs() { return {fontSize: size, fontWeight: weight, float: "right", marginLeft: "0.5em"}; }
}

export function Facts({label, field, unit, bold, line, offset, slant, n}) {
    if (bad()) { return null; }

    return (
        <div style={space()}>
          <div>
            <span style={left()}>
              {italic()}
              <span style={{fontWeight:bold||"normal"}}>{title()}</span>
              <span>&nbsp;</span>
              <span>{value()}</span>
            </span>
            <span style={right()}>{details()}</span>
            <span style={center()}>&nbsp;</span>
          </div>
          <hr style={styles(line)}/>
        </div>
    );

    function styles(line) {
        return (line
                ? {borderStyle: "solid", borderWidth: line}
                : {});
    }

    function bad() {
        return ((!n) ||
                (Object.keys(n).length === 0) ||
                ((details()===null) && (value() === null)));
    }

    function title() {
        const name = label || field;
        if (slant) {
            return name.replace(slant, "");
        }
        return name;
    }

    function italic() {
        if (slant) {
            return (<i>{slant} </i>);
        }
        return null;
    }

    function value() {
        if (n[field] !== undefined) {
            return n[field] + (unit || "");
        }
        return null;
    }

    function details(dv="(% Daily Value)", ff="from Fat") {
        const daily = field + " " + dv;
        if (n[daily] !== undefined) {
            return n[daily] + "%";
        }
        const fat = field + " " + ff;
        if (n[fat] !== undefined) {
            return fat + " " + n[fat];
        }
        return null;
    }

    function space() { return {marginLeft: offset || "0px"}; }
    function left() { return {float: "left", marginRight: "10px"}; }
    function center() { return {display: "block", overflow: "auto",
                                position: "relative", top: "-4px"}; }
    function right() { return {float: "right", marginLeft: "10px"}; }
}

export function Note(props) {
    return (
        <div>
          <p style={{lineHeight: "normal", fontSize:"0.6em"}}>
            * Percent Daily Values are based on a 2,000 calorie diet.
            Your Daily Values may be higher or lower depending on your calorie needs:
          </p>

          <table style={table()}>
            <thead>
              <tr>{th()}{th("Calories")}{th("2,000")}{th("2,500")}</tr>
            </thead>
            <tbody>
              <tr>{td("Total Fat")}{td("Less Than")}{td("65g")}{td("80g")}</tr>
              <tr>{td_space("Sat Fat")}{td("Less Than")}{td("20g")}{td("25g")}</tr>
              <tr>{td("Cholesterol")}{td("Less Than")}{td("300mg")}{td("300mg")}</tr>
              <tr>{td("Sodium")}{td("Less Than")}{td("2,400mg")}{td("2,400mg")}</tr>
              <tr>{td("Total Carbohydrate")}{td("")}{td("300g")}{td("375g")}</tr>
              <tr>{td_space("Dietary Fiber")}{td("")}{td("25g")}{td("30g")}</tr>
            </tbody>
          </table>
        </div>
    );

    function th(h) { return (<th style={{borderBottom: "1pt solid black",
                                         textAlign: "left", fontWeight: "normal"}}>{h}</th>); }
    function td(h) { return (<td>{h}</td>); }
    function td_space(h) { return (<td><span style={{marginLeft:"1em"}}> </span> {h}</td>); }
    function table() { return {
        lineHeight: "normal", fontWeight:"normal", fontSize:"0.6em",
        width:"100%", borderCollapse: "collapse"
    }; }
}

export function Nutrition({nutrition: n}) {
    if (!n) { return null; }

    return (
        <div style={font()}>
          <h1>{n.Item}</h1>
          <div style={box()}>
            <Label left="Nutrition Facts" size="2.2em" weight="900" line="hidden" padding="0.2em"/>
            <Facts field="Serving Size" n={n} line="7px"/>
            <Facts field="Servings Per Container" n={n} line="7px"/>
            <Label left="Amount Per Serving" size="0.6em" weight="900"/>
            <Facts field="Calories" n={n} bold="900" line="3px"/>
            <Label right="% Daily Value*" size="0.6em" weight="900"/>
            <Facts field="Total Fat" unit="g" n={n} bold="900"/>
            <Facts field="Saturated Fat" unit="g" n={n} offset="1em"/>
            <Facts field="Trans Fat" unit="g" n={n} offset="1em" slant="Trans"/>
            <Facts field="Cholesterol" unit="mg" n={n} bold="900"/>
            <Facts field="Sodium" unit="mg" n={n} bold="900"/>
            <Facts label="Total Carbohydrate"
                   field="Carbohydrates" unit="g" n={n} bold="900"/>
            <Facts field="Dietary Fiber" unit="g" n={n} offset="1em"/>
            <Facts field="Sugars" unit="g" n={n} offset="1em"/>
            <Facts field="Protein" unit="g" n={n} line="7px" bold="900"/>
            <Facts field="Vitamin A" unit="g" n={n}/>
            <Facts field="Vitamin B" unit="g" n={n}/>
            <Facts field="Vitamin C" unit="g" n={n}/>
            <Facts field="Vitamin D" unit="g" n={n}/>
            <Facts field="Vitamin E" unit="g" n={n}/>
            <Facts field="Calcium" unit="g" n={n}/>
            <Facts field="Iron" unit="g" n={n}/>
            <Facts field="Potassium" unit="g" n={n}/>
            <Note/>
          </div>
        </div>
    );

    function font() {
        return { fontFamily: "Helvetica, Helvetica Nue, Arial, sans-serif" };
    }

    function box() {
        return {
            lineHeight: "0.4em",
            borderWidth: "1px",
            borderColor: "black",
            borderStyle: "solid",
            padding: "0.5em",
            paddingTop: "1em"
        };
    }
}

export function DrawerMenuItems({menu, open, width, onRequestChange}) {
    if (!menu) { return null; }
    return (
        <Drawer open={open} onRequestChange={onRequestChange} width={width}
                docked={false} zDepth={2} openSecondary={true} docked={true}>
          <AppBar title="Menu" onLeftIconButtonTouchTap={onRequestChange}/>
            <MenuItem style={style().search}>
              <TextField hintText="Search Text" fullWidth={true}/><br />
            </MenuItem>
            {menu.items.map((item,index) => (
                <Route key={item._id} render={({history}) => (
                    <MenuItem onTouchTap={goto(item, history)} style={style().menu}>
                      <span style={style().index}>{index + 1 + "."}</span>
                      {item.Item}
                    </MenuItem>)}>
                    </Route>
            ))}
        </Drawer>
    );

    function style() { return {
        search: {
            margin:"0",
            padding: "0"
        },
        menu : {
            // color: "white", backgroundColor: "#b0bec5"
        },
        index : {
            marginRight: "0.8em"
        }
    }; }

    function goto(item, history) {
        return () => {
            history.push('/'+item._id);
        };
    }
};

export function ConnectedDrawerMenuItems(props) {
    const BindedDrawer = connect(states(props), dispatches)(DrawerMenuItems);
    return (<BindedDrawer/>);

    function states(props) {
        return (state) => ({
            ...props, // TBD
            menu: state.menu
        });
    }

    function dispatches(dispatch) { return {
        // onRequestChange : () => {dispatch(Menu.action.toggle_drawer());}
    }; }

}

export function ConnectedNutrition(props) {
    const BindedNutrition = connect(states(props), dispatches)(Nutrition);
    return (<BindedNutrition/>);

    function states(props) {
        return (state) => {
            const _id = props.match.params._id || props._id;
            let data = state.menu.views[_id];
            if (!data) {
                data = state.menu.items[0];
            }
            return {
                nutrition: data
            };
        };
    }

    function dispatches(dispatch) { return {
        hello : (msg="hello there") => { dispatch({type: "", payload: msg});}
    }; }
}

export class Top extends Component {
    render() {
        return (
            <div>
              <ConnectedDrawerMenuItems open={this.state.drawer_shown}
                                        width={this.state.drawer_width}
                                        onRequestChange={this.toggle_drawer}/>
              <div style={this.style().drawer_content}>
                <Card expanded={true} initiallyExpanded={true} style={this.style().card}>
                  <CardActions>
                    <FloatingActionButton label="Menu" onTouchTap={this.toggle_drawer}
                                          style={this.style().drawer_button}>
                      <NavigationClose style={{color: "white"}}/>
                    </FloatingActionButton>

                    <FloatingActionButton label="Menu" onTouchTap={this.toggle_drawer}
                                          style={this.style().drawer_button}>
                      <ContentAdd style={{color: "white"}}/>
                    </FloatingActionButton>

                    <FloatingActionButton label="Menu" onTouchTap={this.toggle_drawer}
                                          style={this.style().drawer_button}>
                      <EditorModeEdit style={{color: "white"}}/>
                    </FloatingActionButton>
                  </CardActions>
                  <CardText expandable={true}>
                    {/* content */}
                    {this.props.children}
                  </CardText>
                </Card>
              </div>
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            drawer_width : "50%",
            drawer_shown : true
        };
        this.toggle_drawer = this.toggle_drawer.bind(this);
        this.style = this.style.bind(this);
        this.render = this.render.bind(this);
    }

    toggle_drawer(){
        this.setState({
            drawer_shown : !this.state.drawer_shown
        });
    }

    style() {
        return {
            drawer_content : {
                position: "fixed",
                left: "0px",
                right: (this.state.drawer_shown) ? this.state.drawer_width : "0px"
            },
            drawer_button : {
                marginTop: "-4px",
                float : "right"
            },
            card : {
                boxShadow: "none"
            }
        };
    }
}

export function SPA() {
    return (
        <Provider store={storage()}>
          <MuiThemeProvider muiTheme={get_theme()}>
            <BrowserRouter>
              <Top>
                <Switch>
                  <Route exact path="/" component={ConnectedNutrition}/>
                  <Route path="/:_id" component={ConnectedNutrition}/>
                </Switch>
              </Top>
            </BrowserRouter>
          </MuiThemeProvider>
        </Provider>
    );

    function storage() {
        const data = new Data();
        window.data = data;
        window.store = data.store;
        return data.store;
    }

    function get_theme() {
        const theme_opt = {
            avatar: {
                borderColor: null
            },
            userAgent: "all"
        };

        const theme = getMuiTheme({
            palette: {
                primary1Color: deepOrange500,
                primary2Color: deepOrange700,
                primary3Color: deepOrange100
            }
        }, theme_opt);
        return theme;
    }
}

export default function app() {
    injectTapEventPlugin(); // NOTE: for material-ui, before ReactDom.render
    ReactDom.render(<SPA/>, root());
    return null;

    function root() {
        const div = document.createElement("div");
        document.body.append(div);
        document.body.style.margin = "0px";
        return div;
    }

}
