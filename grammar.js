const LIST_START = "[";
const LIST_STOP = "]";
const RECORD_START = "{";
const RECORD_STOP = "}";
const PARAMETER_START = "(";
const PARAMETER_STOP = ")";
const FUNCTION_HEAD_START = "\\";
const FUNCTION_HEAD_STOP = "->";
const VALUE_ASSIGNMENT = "=";
const TYPE_ASSIGNMENT = ":";
const SEPERATOR = ",";
const BASE_START = "|";
const COMMENT = "//";

module.exports = grammar({
  name: "strictly",

  rules: {
    source_file: ($) => repeat($._rootStatement),
    _rootStatement: ($) =>
      choice(
        $._newline,
        $.comment,
        $.algebraicDataTypeDeclaration,
        $.typeAliasDeclaration,
        alias($.rootValueAssignment, $.assignment),
        alias($.rootTypeAssignment, $.typeAssignment),
      ),
    algebraicDataTypeDeclaration: ($) =>
      partialSequence(
        field("keyword", "data"),
        field("name", $._typeIdentifier),
        VALUE_ASSIGNMENT,
        field("value", commaSep1($.algebraicDataTypeValue)),
      ),
    algebraicDataTypeValue: ($) =>
      seq(
        field("name", $._typeIdentifier),
        field(
          "parameter",
          optional(seq(PARAMETER_START, commaSep($._type), PARAMETER_STOP)),
        ),
      ),
    comment: ($) => seq(COMMENT, /.*/),
    typeAliasDeclaration: ($) =>
      partialSequence(
        "type",
        field("name", $._typeIdentifier),
        VALUE_ASSIGNMENT,
        field("value", commaSep1($._type)),
      ),
    _type: ($) =>
      choice($.typeAlgebraicDataType, $.typeRecord, $.typeFunction, $.typeList),
    typeAlgebraicDataType: ($) => field("name", $._typeIdentifier),
    typeRecord: ($) =>
      seq(
        RECORD_START,
        commaSep(
          seq(
            field("name", $._valueIdentifier),
            VALUE_ASSIGNMENT,
            field("value", $._type),
          ),
        ),
        RECORD_STOP,
      ),
    typeList: ($) => seq(LIST_START, field("value", $._type), LIST_STOP),
    typeFunction: ($) =>
      seq(
        FUNCTION_HEAD_START,
        field("parameter", commaSep($._type)),
        FUNCTION_HEAD_STOP,
        field("return", $._type),
      ),
    rootValueAssignment: ($) =>
      seq(
        field("leftHandSide", $.leftHandSideVariable),
        VALUE_ASSIGNMENT,
        field("value", $.expression),
      ),
    rootTypeAssignment: ($) =>
      seq(
        field("leftHandSide", $.leftHandSideVariable),
        TYPE_ASSIGNMENT,
        field("value", $._type),
      ),
    assignment: ($) =>
      seq(
        "let",
        field("leftHandSide", $._leftHandSide),
        VALUE_ASSIGNMENT,
        field("value", $.expression),
      ),
    ...leftHandSide("variable"),
    ...leftHandSide("parameter"),
    expression: ($) =>
      choice(
        $.expressionFunction,
        $.expressionRecord,
        $.expressionList,
        $.expressionVariable,
        $.expressionAlgebraicDataType,
        $.expressionHostBuiltin,
        $.expressionHostComponent,
        $.expressionString
      ),
    expressionFunction: ($) =>
      seq(
        FUNCTION_HEAD_START,
        field("parameter", commaSep($._parameterLeftHandSide)),
        FUNCTION_HEAD_STOP,
        field("body", $._statements),
      ),
    expressionRecord: ($) =>
      seq(
        RECORD_START,
        commaSep(
          seq(
            field("name", $._valueIdentifier),
            VALUE_ASSIGNMENT,
            field("value", $._statements),
          ),
        ),
        optional(seq(BASE_START, field("base", commaSep1($._statement)))),
        RECORD_STOP,
      ),
    expressionList: ($) =>
      seq(
        LIST_START,
        commaSep(field("value", $._statements)),
        optional(seq(BASE_START, field("base", commaSep1($._statement)))),
        LIST_STOP,
      ),
    expressionVariable: ($) => field("name", $._valueIdentifier),
    expressionAlgebraicDataType: ($) => field("name", $._typeIdentifier),
    expressionHostBuiltin: ($) => seq(
      "$",
      field("name", alias(/\p{Lowercase_Letter}+/, $.identifier)),
    ),
    expressionHostComponent: ($) => seq(
      "$",
      field("name", alias(/\p{Lowercase_Letter}+(-\p{Lowercase_Letter}+)+/, $.identifier)),
    ),
    expressionString: ($) => seq(
      "\"",
      repeat(
        choice(
          $.text,
          seq(
            "${",
            $.expression,
            "}"
          )
        )
      ),
      "\"",
    ),
    text: () => (
      prec.right(-1, repeat1(/([\$].)|[^\"|\${]/))
    ),
    _statements: ($) =>
      choice(
        seq(
          $._newline,
          $._indent,
          field("statements", repeat(seq($._statement, $._newline))),
          $._dedent,
        ),
        $._statement,
      ),
    _statement: ($) => choice($.expression, $.assignment),
    _valueIdentifier: ($) =>
      alias(/\p{Lowercase_Letter}\p{Letter}*/, $.identifier),
    _typeIdentifier: ($) =>
      alias(/\p{Uppercase_Letter}\p{Letter}*/, $.identifier),
  },

  externals: ($) => [$._newline, $._indent, $._dedent],
});

function leftHandSide(kind) {
  const prefix = (kind) =>
    kind === "variable" ? "leftHandSide" : `${kind}LeftHandSide`;
  const common = ["AlgebraicDataType", "Hole"];

  return {
    [`_${prefix(kind)}`]: ($) =>
      seq(
        $[`_${prefix(kind)}_single`],
        //repeat(seq("@", $[`_${prefix(kind)}_single`])),
      ),
    [`_${prefix(kind)}_single`]: ($) =>
      choice(
        $[
          `${prefix("variable")}${
            kind === "variable" ? "Variable" : "Parameter"
          }`
        ],
        ...common.map((name) =>
          kind === "variable"
            ? $[`${prefix(kind)}${name}`]
            : alias(
                $[`${prefix(kind)}${name}`],
                $[`${prefix("variable")}${name}`],
              ),
        ),
      ),
    [`${prefix("variable")}${kind === "variable" ? "Variable" : "Parameter"}`]:
      ($) => field("name", $._valueIdentifier),
    [`${prefix(kind)}AlgebraicDataType`]: ($) =>
      seq(
        field("name", $._typeIdentifier),
        optional(
          field(
          "parameter",
           seq(
              PARAMETER_START,
              commaSep($[`_${prefix(kind)}`]),
              PARAMETER_STOP,
            ),
          ),
        ),
      ),
    [`${prefix(kind)}Hole`]: () => "_"
  };
}
function partialSequence(rule, ...rules) {
  return rules.length === 0
    ? rule
    : seq(rule, optional(partialSequence(...rules)));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(SEPERATOR, rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}
