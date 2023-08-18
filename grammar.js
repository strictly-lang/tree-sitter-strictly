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
const STATEMENT_STOP = ";";
const BASE_START = "|";

module.exports = grammar({
  name: "strictly",

  rules: {
    source_file: ($) => repeat($._root_statement),
    _root_statement: ($) =>
      choice(
        $._newline,
        $.root_data_declaration,
        $.root_type_declaration,
        $.root_value_type_declaration,
        $.root_value_assignment,
      ),
    root_data_declaration: ($) =>
      seq(
        "data",
        field("name", $._typeIdentifier),
        VALUE_ASSIGNMENT,
        field("value", commaSep1($.root_data_value_declaration)),
        STATEMENT_STOP,
      ),
    root_data_value_declaration: ($) =>
      seq(
        field("name", $._typeIdentifier),
        field(
          "parameter",
          optional(seq(PARAMETER_START, commaSep($._type), PARAMETER_STOP)),
        ),
      ),
    root_type_declaration: ($) =>
      seq(
        "type",
        field("name", $._typeIdentifier),
        VALUE_ASSIGNMENT,
        field("value", commaSep1($._type)),
        STATEMENT_STOP,
      ),
    _type: ($) =>
      choice($.typeAlgebraic, $.typeRecord, $.typeFunction, $.typeList),
    typeAlgebraic: ($) => field("name", $._typeIdentifier),
    typeRecord: ($) =>
      seq(
        RECORD_START,
        commaSep(
          seq(
            field("key", $._valueIdentifier),
            TYPE_ASSIGNMENT,
            field("type", $._type),
          ),
        ),
        RECORD_STOP,
      ),
    typeList: ($) => seq(LIST_START, field("type", $._type), LIST_STOP),
    typeFunction: ($) =>
      seq(
        FUNCTION_HEAD_START,
        field("parameter", commaSep($._type)),
        FUNCTION_HEAD_STOP,
        field("return", $._type),
      ),
    root_value_type_declaration: ($) =>
      seq(
        field("name", $._valueIdentifier),
        TYPE_ASSIGNMENT,
        field("type", $._type),
      ),
    root_value_assignment: ($) =>
      seq(
        field("name", $._valueIdentifier),
        VALUE_ASSIGNMENT,
        field("expression", $._expression),
      ),
    _expression: ($) =>
      choice($.expressionFunction, $.expressionRecord, $.expressionVariable),
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
            field("key", $._valueIdentifier),
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
    expressionVariable: ($) => seq($._valueIdentifier),
    _leftHandSide: ($) =>
      choice($.leftHandSideVariable, $.leftHandSideAlgebraic),
    leftHandSideVariable: ($) => $._valueIdentifier,
    leftHandSideAlgebraic: ($) =>
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
    _statement: ($) => choice($._expression),
    _valueIdentifier: ($) => /[a-z][a-zA-Z]*/,
    _typeIdentifier: ($) => /[A-Z][a-zA-Z]*/,
  },

  externals: ($) => [$._newline, $._indent, $._dedent],
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(SEPERATOR, rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}
