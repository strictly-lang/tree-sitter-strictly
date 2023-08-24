(comment) @comment

(algebraicDataTypeDeclaration 
  [ "data" ] @keyword.storage.type
  name: (identifier) @type.enum
  value: (algebraicDataTypeValue
    name: (identifier) @constructor
  )
)

(typeAlgebraicDataType
  name: (identifier) @type.enum
)