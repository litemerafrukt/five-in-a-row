/* global describe it expect */
import React from "react";
// import ReactDOM from "react-dom";
import { mount } from "enzyme";

import { Controlled as CodeMirror } from "react-codemirror2";
import { Editor } from "./Editor";

describe("Editor", () => {
    it("mounts without crashing", () => {
        const wrapper = mount(<Editor />);

        expect(wrapper.is(Editor)).toEqual(true);
    });

    it("contains <CodeMirror />", () => {
        const wrapper = mount(<Editor />);

        expect(wrapper.find(CodeMirror).exists()).toEqual(true);
    });
});
