var similarity = require("compute-cosine-similarity");
var natural = require("natural");
tokenizer = new natural.AggressiveTokenizerRu();

const str1 = "Должен быть заключен договор.";
const str2 = "Необходимо заключить договор";

const Get = (str1, str2) => {
  let arr1 = tokenizer.tokenize(str1);
  arr1 = arr1.map(w => natural.PorterStemmerRu.stem(w));
  let arr2 = tokenizer.tokenize(str2);
  arr2 = arr2.map(w => natural.PorterStemmerRu.stem(w));

  words = [...new Set(arr1.concat(arr2))];
  let vec1 = new Array(words.length);
  let vec2 = new Array(words.length);

  for (let i = 0; i < vec1.length; i++) {
    let num = arr1.filter(el => el === words[i]).length;
    vec1[i] = num;
  }

  for (let i = 0; i < vec2.length; i++) {
    let num = arr2.filter(el => el === words[i]).length;
    vec2[i] = num;
  }

  var s = similarity(vec1, vec2);

  return s;
};

module.exports = Get;
