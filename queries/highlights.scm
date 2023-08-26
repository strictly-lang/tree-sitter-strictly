(comment) @comment

[
  "data"
  "type"
] @keyword

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
  name: (identifier) @type.enum
)

(algebraicDataTypeValue
  name: (identifier) @constructor
)

(typeAliasDeclaration
  (identifier) @type.enum
)

(typeAlgebraicDataType
  name: (identifier) @type.enum
)

(typeRecord
  (identifier) @variable.other.member
)
