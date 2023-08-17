module.exports = grammar({
  name: 'strictly',

  rules: {
    source_file: $ => repeat($._root_statement),
    _root_statement: $ => choice($.data_declaration),
    data_declaration: $ => seq(
      "data",
      field("declaration_name", $.typeIdentifier),
      "=",
      field("declaration_types", repeat($.type)),
      ";"
    ),
    typeIdentifier: $ => /[A-Z][a-zA-Z]*/,
    type: $ => seq(
      field("name", $.typeIdentifier),
      field("parameters", optional(
        seq(
          "(",
          repeat($.type),
          ")"
        )
      )))
  },

  externals: $ => [$._newline, $._indent, $._dedent],
});
