[ "data" ] @keyword.control

(comment) @comment

(algebraicDataTypeDeclaration 
  name: (identifier) @entity.name.type
  value: (algebraicDataTypeValue
    name: (identifier) @storage.type.class
  )
)

(typeAlgebraicDataType
  name: (identifier) @entity.name.type
)