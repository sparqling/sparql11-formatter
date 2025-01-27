let currentIndent = '';
let indentUnit = '    ';

export function turtle(syntaxTree) {
  let out = '';
  out += '@prefix : <https://purl.org/sparql-formatter/ontology#> .\n\n';
  out += '[]\n' + formatObj(syntaxTree) + ' .' + '\n';
  return out;
};  

function formatObj(obj) {
  let arr = [];
  increaseIndent();
  Object.keys(obj).forEach((key) => {
    if (key === 'type') {
      arr.push(currentIndent + `a :${obj[key]}`);
    } else if (key === 'location' || key === '@context') {
      return;
    } else if (typeof obj[key] === 'object') {
      arr.push(formatProps(key, obj[key]));
    } else {
      arr.push(currentIndent + `:${key} "${obj[key]}"`);
    }
  });
  decreaseIndent();
  return arr.join(' ;\n');
}

function formatProps(key, obj) {
  if (Array.isArray(obj)) {
    const arr = obj.map(o => formatObj(o) + '\n');
    return currentIndent + `:${key} [\n` +
      arr.join(currentIndent + '], [\n') +
      currentIndent + `]`;
  } else {
    return currentIndent + `:${key} [\n` +
      formatObj(obj) + '\n' +
      currentIndent + `]`;
  }
}

const increaseIndent = (depth = 1) => {
  currentIndent += indentUnit.repeat(depth);
};

const decreaseIndent = (depth = 1) => {
  currentIndent = currentIndent.substr(0, currentIndent.length - indentUnit.length * depth);
};
