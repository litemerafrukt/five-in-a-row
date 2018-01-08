/* global describe it expect */
import React from "react";
import ReactDOM from "react-dom";
// import ReactDOM from "react-dom";
import { mount } from "enzyme";

import App from "./App";

describe.skip("App", () => {
    it("Render with text 'Välkommen'", () => {
        const wrapper = mount(<App store={{ nick: { name: "" } }} />);

        expect(wrapper.find("h2").text()).toContain("Välkommen");
    });

    it("mounts without crashing", () => {
        const div = document.createElement("div");

        ReactDOM.render(<App />, div);
    });
});
