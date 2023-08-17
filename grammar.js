module.exports = grammar({
  name: 'strictly',

  rules: {
    source_file: $ => repeat($._root_statement),
    _root_statement: $ => choice($._newline, $.root_data_declaration, $.root_type_declaration, $.root_value_type_declaration, $.root_value_assignment),
    root_data_declaration: $ => seq(
      "data",
      field("name", $._typeIdentifier),
      "=",
      field("values", commaSep1($.root_data_value_declaration)),
      ";"
    ),
    root_data_value_declaration: $ => seq(
      field("name", $._typeIdentifier),
      field("parameters", optional(
        seq(
          "(",
          commaSep($._type),
          ")"
        )
      ))),
    root_type_declaration: $ => seq(
      "type",
      field("name", $._typeIdentifier),
      "=",
      field("values", commaSep1($._type)),
      ";"
    ),
    _type: $ => choice(
      $.typeAlgebraic,
      $.typeRecord,
      $.typeFunction,
      $.typeList
    ),
    typeAlgebraic: $ => field("name", $._typeIdentifier),
    typeRecord: $ => seq(
      "{",
      commaSep(
        seq(
          field("key", $._valueIdentifier),
          ":",
          field("type",$._type)
        )
      ),
      "}"
    ),
    typeList: $ => seq(
      "[",
      field("type", $._type),
      "]"
    ),
    typeFunction: $ => seq(
      "\\",
      field("parameters", commaSep($._type)),
      "->",
      field("return", $._type)
    ),
    root_value_type_declaration: $ => seq(
      field("name", $._valueIdentifier),
      ":",
      field("type", $._type),
    ),
    root_value_assignment: $ => seq(
      field("name", $._valueIdentifier),
      "=",
      field("expression", $._expression),
    ),
    _expression: $ => choice($.expressionFunction, $.expressionRecord),
    expressionFunction: $ => seq(
      "\\",
      field("parameters", commaSep($._leftHandSide)),
      "->",
      field("body", $._statements)
    ),
    expressionRecord: $ => seq(
      "{",
      commaSep(
        seq(
          field("key", $._valueIdentifier),
          "=",
          field("value",$._statements)
        )
      ),
      "}"
    ),
    _leftHandSide: $ =>
      choice($.leftHandSideVariable, $.leftHandSideAlgebraic),
    leftHandSideVariable: $ => field("name", $._valueIdentifier),
    leftHandSideAlgebraic: $ => seq(
      field("name", $._typeIdentifier),
      field("parameters", optional(
        seq(
          "(",
          commaSep($._leftHandSide),
          ")"
        )
      ))),
    _statements: $ => choice(
      seq(
        $._newline,
        $._indent,
        field("statements", repeat(seq($._statement, $._newline))),
        $._dedent
      ),
      $._statement
    ),
    _statement: $ => choice($._expression),
    _valueIdentifier: $ => /[a-z][a-zA-Z]*/,
    _typeIdentifier: $ => /[A-Z][a-zA-Z]*/,
  },

  externals: $ => [$._newline, $._indent, $._dedent],
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}