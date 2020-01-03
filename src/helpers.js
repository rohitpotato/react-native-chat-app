export const debounce = (func, delay) => {
    let clearTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(clearTimer);
        clearTimer = setTimeout(() => func.apply(context, args), delay);
    }
}