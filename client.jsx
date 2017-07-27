"use strict";

import $ from "jquery";
import moment from "moment";
import React from "react";
import {Component} from "react";
import ReactDom from "react-dom";
import {BrowserRouter, Switch, Route } from "react-router-dom";
import {Grid, Row, Col} from "react-bootstrap";

import AppBar from "material-ui/AppBar";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {deepOrange100, deepOrange500, deepOrange700} from "material-ui/styles/colors";
import injectTapEventPlugin from "react-tap-event-plugin";

const item1 = {
    "_id": "5977ce8bec3a42956a5dd079",
    "Category": "Breakfast",
    "Item": "Egg McMuffin",

    "Serving Size": "4.8 oz (136 g)",
    "Calories": 300,
    "Calories from Fat": 120,

    "Total Fat": 13,
    "Total Fat (% Daily Value)": 20,
    "Saturated Fat": 5,
    "Saturated Fat (% Daily Value)": 25,
    "Trans Fat": 0,

    "Cholesterol": 260,
    "Cholesterol (% Daily Value)": 87,

    "Sodium": 750,
    "Sodium (% Daily Value)": 31,

    "Carbohydrates": 31,
    "Carbohydrates (% Daily Value)": 10,
    "Dietary Fiber": 4,
    "Dietary Fiber (% Daily Value)": 17,
    "Sugars": 3,

    "Protein": 17,

    "Vitamin A (% Daily Value)": 10,
    "Vitamin C (% Daily Value)": 0,
    "Iron (% Daily Value)": 15,
    "Calcium (% Daily Value)": 25

};

const L = ({label, size, weight="normal"}) => { // left label
    return (
        <div>
          <span style={styles()}>{label}</span>
          <hr/>
        </div>
    );

    function styles() {
        return {
            fontSize: size,
            fontWeight: weight
        };
    }
};

const R = ({label, size, weight="normal"}) => { // right label

    return (
        <div>
          <div>
            <span style={left()}>&nbsp;</span>
            <span style={right()}>{label}</span>
            <span style={center()}>&nbsp;</span>
          </div>
          <hr/>
        </div>
    );

    function left() { return  {float: "left", marginRight: "10px"}; }
    function center() { return  {display: "block", overflow: "auto", position: "relative", top: "-4px"}; }
    function right() { return {fontSize: size, fontWeight: weight, float: "right", marginLeft: "10px"}; }
};

const B = ({size}) => { // bar
    return (
        <hr style={styles()}/>
    );

    function styles() {
        return (size
                ? {borderStyle: "solid", borderWidth: size}
                : {});
    }
};

const N = ({label, field, unit, bold, line, offset, slant, n}) => { // item
    if (bad()) {
        return null;
    }

    return (
        <div style={space()}>
          <div>
            <span style={left()}>
              {italic()}
              <span style={{fontWeight:bold||"normal"}}>{title()}</span>
              <span>&nbsp;</span>
              <span>{value()}</span>
            </span>
            <span style={right()}>{daily()}</span>
            <span style={center()}>&nbsp;</span>
          </div>
          <B size={line}/>
        </div>
    );

    function bad() {
        return ((!n) ||
                (Object.keys(n).length === 0) ||
                ((daily()===null) && (value() === null)));
    }

    function title() {
        const name = label || field;
        if (slant) {
            return name.replace(slant, '');
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

    function daily() {
        const percent = field + " (% Daily Value)";
        if (n[percent] === undefined) {
            return null;
        }
        return n[percent] + "%";
    }

    if ((daily===null) && (value === null)) {
        return null;
    }

    function space() { return {marginLeft: offset || "0px"}; }
    function left() { return {float: "left", marginRight: "10px"}; }
    function center() { return {display: "block", overflow: "auto", position: "relative", top: "-4px"}; }
    function right() { return {float: "right", marginLeft: "10px"}; }
};

const Nutrition = ({nutrition: n}) => {
    if (!n) {
        return null;
    }

    return (
        <div style={box()}>
          <L label="Nutrition Facts" size="2.5em" weight="bold"/>
          <N field="Serving Size" n={n} line="7px"/>
          <N field="Servings Per Container" n={n} line="7px"/>
          <L label="Amount Per Serving" size="0.8em" weight="bold"/>
          <N field="Calories" n={n} bold="900" line="3px"/>
          <R label="% Daily Value*" size="0.8em" weight="900"/>
          <N field="Total Fat" unit="g" n={n} bold="900"/>
          <N field="Saturated Fat" unit="g" n={n} offset="1em"/>
          <N field="Trans Fat" unit="g" n={n} offset="1em" slant="Trans"/>
          <N field="Cholesterol" unit="mg" n={n} bold="900"/>
          <N field="Sodium" unit="mg" n={n} bold="900"/>
          <N label="Total Carbohydrate"
             field="Carbohydrates" unit="g" n={n} bold="900"/>
          <N field="Dietary Fiber" unit="g" n={n} offset="1em"/>
          <N field="Sugars" unit="g" n={n} offset="1em"/>
          <N field="Protein" unit="g" n={n} line="7px" bold="900"/>
          <N field="Vitamin A" unit="g" n={n}/>
          <N field="Vitamin B" unit="g" n={n}/>
          <N field="Vitamin C" unit="g" n={n}/>
          <N field="Vitamin D" unit="g" n={n}/>
          <N field="Vitamin E" unit="g" n={n}/>
          <N field="Calcium" unit="g" n={n}/>
          <N field="Iron" unit="g" n={n}/>
          {note()}
        </div>
    );

    function box() {
        return {
            fontFamily: "Helvetica Neue", // , Helvetica, Arial, sans-serif",
            lineHeight: "0.4em",
            borderWidth: "1px",
            borderColor: "black",
            borderStyle: "solid",
            padding: "0.5em",
            paddingTop: "1em"
        };
    }

    function note() {
        return (
            <p style={{lineHeight: "normal", fontSize:"0.8em"}}>
              * Percent Daily Values are based on a 2,000 calorie diet.
            </p>
        );
    }
};

function app() {
    const app = (
        <MuiThemeProvider muiTheme={get_theme()}>
          <Nutrition nutrition={item1}/>
        </MuiThemeProvider>
    );
    ReactDom.render(app, root());
    injectTapEventPlugin(); // material-ui
    return;

    function root() {
        const div = document.createElement("div");
        document.body.append(div);
        return div;
    }

    function get_theme() {
        const theme_opt = {
            avatar: {
                borderColor: null
            },
            userAgent: 'all'
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

$(document).ready(app);
