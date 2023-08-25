(comment) @comment

(algebraicDataTypeDeclaration 
  [ "data" ] @keyword.storage.type
  name: (identifier) @type.enum
  value: (algebraicDataTypeValue
    name: (identifier) @constructor
  )
  (
    "," @punctuation.delimiter
    value: (algebraicDataTypeValue
     name: (identifier) @constructor
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