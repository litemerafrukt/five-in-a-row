/* global describe it expect */
import React from "react";
import ReactDOM from "react-dom";
// import ReactDOM from "react-dom";
import { mount } from "enzyme";

import { App } from "./App";

describe("App", () => {
    it("Render h1 with text dojo", () => {
        const wrapper = mount(<App />);

        expect(wrapper.find("h2").text()).toContain("dojon");
    });

    it("mounts without crashing", () => {
        const div = document.createElement("div");

        ReactDOM.render(<App />, div);
    });
});
