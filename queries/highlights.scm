(comment) @comment

(algebraicDataTypeDeclaration 
  [ "data" ] @keyword.storage.type
  name: (identifier) @type.enum
  "=" @operator
  value: (algebraicDataTypeValue
    name: (identifier) @constructor
    "(" @punctuation.bracket
    ","* @punctuation.delimiter
    ")" @punctuation.bracket
  )
  (
    "," @punctuation.delimiter
    value: (algebraicDataTypeValue
     name: (identifier) @constructor
    "(" @punctuation.bracket
    ","* @punctuation.delimiter
    ")" @punctuation.bracket
    )
  )*
)

(typeAliasDeclaration
  [ "type" ] @keyword.storage.type
  name: (identifier) @type.enum
)

(typeAlgebraicDataType
  name: (identifier) @type.enum
)