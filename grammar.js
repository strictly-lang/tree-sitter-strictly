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
    comment: ($) =>
      seq(
        COMMENT,
        /.*/
      ),
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
        field("value", $._expression),
      ),
    assignment: ($) =>
      seq(
        "let",
        field("leftHandSide", $._leftHandSide),
        VALUE_ASSIGNMENT,
        field("value", $._expression),
      ),
    _expression: ($) =>
      choice(
        $.expressionFunction,
        $.expressionRecord,
        $.expressionList,
        $.expressionVariable,
        $.expressionAlgebraicDataType,
      ),
    expressionFunction: ($) =>
      seq(
        FUNCTION_HEAD_START,
        field("parameter", commaSep($._leftHandSide)),
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
    _leftHandSide: ($) =>
      choice($.leftHandSideVariable, $.leftHandSideAlgebraicDataType),
    leftHandSideVariable: ($) => field("name", $._valueIdentifier),
    leftHandSideAlgebraicDataType: ($) =>
      seq(
        field("name", $._typeIdentifier),
        field(
          "parameter",
          optional(
            seq(PARAMETER_START, commaSep($._leftHandSide), PARAMETER_STOP),
          ),
        ),
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
    _statement: ($) => choice($._expression, $.assignment),
    _valueIdentifier: ($) => alias(/[a-z][a-zA-Z]*/, $.identifier),
    _typeIdentifier: ($) => alias(/[A-Z][a-zA-Z]*/, $.identifier),
  },

  externals: ($) => [$._newline, $._indent, $._dedent],
});

function partialSequence(rule, ...rules) {
  return rules.length === 0 ?
    rule
  : seq(rule, optional(partialSequence(...rules)));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(SEPERATOR, rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}

