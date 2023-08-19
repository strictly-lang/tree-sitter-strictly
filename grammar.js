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
        $.algebraic_data_type_declaration,
        $.type_alias_declaration,
        $.root_value_type_declaration,
        $.root_value_assignment,
      ),
    algebraic_data_type_declaration: ($) =>
      seq(
        "data",
        field("name", $.typeIdentifier),
        VALUE_ASSIGNMENT,
        field("value", commaSep1($.algebraic_data_type_value)),
        STATEMENT_STOP,
      ),
    algebraic_data_type_value: ($) =>
      seq(
        field("name", $.typeIdentifier),
        field(
          "parameter",
          optional(seq(PARAMETER_START, commaSep($._type), PARAMETER_STOP)),
        ),
      ),
    type_alias_declaration: ($) =>
      seq(
        "type",
        field("name", $.typeIdentifier),
        VALUE_ASSIGNMENT,
        field("value", commaSep1($._type)),
        STATEMENT_STOP,
      ),
    _type: ($) =>
      choice($.typeAlgebraicDataType, $.typeRecord, $.typeFunction, $.typeList),
    typeAlgebraicDataType: ($) => field("name", $.typeIdentifier),
    typeRecord: ($) =>
      seq(
        RECORD_START,
        commaSep(
          seq(
            field("name", $.valueIdentifier),
            TYPE_ASSIGNMENT,
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
    root_value_type_declaration: ($) =>
      seq(
        field("name", $.valueIdentifier),
        TYPE_ASSIGNMENT,
        field("type", $._type),
      ),
    root_value_assignment: ($) =>
      seq(
        field("name", $.valueIdentifier),
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
            field("key", $.valueIdentifier),
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
    expressionVariable: ($) => seq($.valueIdentifier),
    _leftHandSide: ($) =>
      choice($.leftHandSideVariable, $.leftHandSideAlgebraic),
    leftHandSideVariable: ($) => $.valueIdentifier,
    leftHandSideAlgebraic: ($) =>
      seq(
        field("name", $.typeIdentifier),
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
    valueIdentifier: ($) => /[a-z][a-zA-Z]*/,
    typeIdentifier: ($) => /[A-Z][a-zA-Z]*/,
  },

  externals: ($) => [$._newline, $._indent, $._dedent],
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(SEPERATOR, rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}
