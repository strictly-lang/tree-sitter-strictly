(comment) @comment

(algebraicDataTypeDeclaration 
  [ "data" ] @keyword.control
  name: (identifier) @entity.name.type
  value: (algebraicDataTypeValue
    name: (identifier) @storage.type.class
  )
)

(typeAlgebraicDataType
  name: (identifier) @entity.name.type
)