(comment) @comment

(algebraicDataTypeDeclaration 
  [ "data" ] @storage.type
  name: (identifier) @entity.name.type
  value: (algebraicDataTypeValue
    name: (identifier) @storage.type.class
  )
)

(typeAlgebraicDataType
  name: (identifier) @entity.name.type
)