global.requestAnimationFrame = _ => {
    setTimeout(_, 0);
};

global.document.createRange = () => {
    return {
        setEnd: () => {},
        setStart: () => {},
        getBoundingClientRect: () => {}
    };
};
