/**
 * Output results to console
 * @param {string} text - Result message
 */
export function logResult(text = 'Finish.') {
  console.log(`${text} ` + now());
}

/**
 * Returns the current time as a string
 * @return {string} - Current time string 
 */
function now() {
  const toDoubleDigits = function(num) {
    num += "";
    if (num.length === 1) {
      num = "0" + num;
    }
    return num;     
  };

  const now = new Date();
  const year = now.getFullYear();
  const month = toDoubleDigits(now.getMonth()+1);
  const date = toDoubleDigits(now.getDate());
  const hour = toDoubleDigits(now.getHours());
  const min = toDoubleDigits(now.getMinutes());
  return `${year}-${month}-${date} ${hour}:${min}`;
}
