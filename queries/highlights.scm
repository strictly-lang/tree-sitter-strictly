(comment) @comment

[
  "data"
  "type"
] @keyword

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
(variableLeftHandSideVariable
  name: (identifier) @variable
)

(parameterLeftHandSideVariable
  name: (identifier) @variable.parameter
)

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
