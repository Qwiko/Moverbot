module.exports = (debug) => {
    switch (typeof debug) {
        case "object":
            console.log(JSON.stringify(debug));
            break;

        default:
            console.log(JSON.stringify({ debug: debug }))
            break;
    }
};
