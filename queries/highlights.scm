(comment) @comment

[
  "data"
  "type"
] @keyword

[
  "="
  ":"
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

; Algebraic Data Type Declaration
(algebraicDataTypeDeclaration 
  name: (identifier) @type.enum
)

(algebraicDataTypeValue
  name: (identifier) @constructor
)

; Types
(typeAliasDeclaration
  (identifier) @type.enum
)

(typeAlgebraicDataType
  name: (identifier) @type.enum
)

(typeRecord
  (identifier) @variable.other.member
)

(typeFunction
  "\\" @function
)

(typeFunction
  "->" @function
)

; Left Hand Side
(leftHandSideVariable
  name: (identifier) @variable
)

(leftHandSideParameter
  name: (identifier) @variable.parameter
)

(leftHandSideAlgebraicDataType
  name: (identifier) @constructor
)

(leftHandSideHole) @variable.builtin

; Expression
(expressionAlgebraicDataType
  name: (identifier) @constructor
)

(expressionRecord
  name: (identifier) @variable.other.member
)

(expressionFunction
  "\\" @function
)

(expressionFunction
  "->" @function
)

(expressionVariable
  name: (identifier) @variable
)
