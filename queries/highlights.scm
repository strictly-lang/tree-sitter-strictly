(comment) @comment

[
  "\\"
  "->"
] @function

[
  "="
] @operator

[
  "("
  ")"
  "{"
  "}"
  "["
  "]"
] @punctuation.bracket

"," @punctuation.delimiter

(algebraicDataTypeDeclaration
  "data" @keyword
)

(algebraicDataTypeDeclaration
  name: (identifier) @type.enum
)

(algebraicDataTypeDeclaration
  (algebraicDataTypeValue
    name: (identifier) @constructor
  )
)

(typeAliasDeclaration
  "type" @keyword
  (identifier)? @type.enum
)

(typeAlgebraicDataType
  name: (identifier) @type.enum
)

(typeRecord
  (identifier) @variable.other.member
)
