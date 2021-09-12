export function isFunction(functionToCheck) {
  return functionToCheck && [
    '[object AsyncFunction]', 
    '[object Function]'
  ].includes({}.toString.call(functionToCheck));
}