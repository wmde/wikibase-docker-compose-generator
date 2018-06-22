export {
    data: function()
    {
        return { Field: null };
    },
    methods: {
        _lookForPropertyAtVueObject: ƒ ( IsTypeOrFunction, Self ) 
        {
            let Index;
            const Chunks = IsTypeOrFunction.split( '.' );
            for ( Index in Chunks )
            {
                if ( Chunks[ Index ] in Self )
                {
                    Self = Self[ Chunks[ Index ] ];
                }
                else
                {
                    Self = null;
                    break;
                }
            }
            
            return Self;
        },
        
        _executeFuncionOrGetAnyhing( TypeOrFunction, Type, FieldName, ReturnFunctionOnly = false)
        {
            let Self;
            
            if( 'function' === typeof TypeOrFunction )
            {
                if( true === ReturnFunctionOnly )
                {
                    return TypeOrFunction;
                }

                TypeOrFunction = TypeOrFunction( FieldName );
            }

            if( 'string' === typeof TypeOrFunction )
            {
                Self = this
                if( true === TypeOrFunction.include( '.' ) )
                {
                    Self = this._lookForPropertyAtVueObject( TypeOrFunction, this );
                }

                if( TypeOrFunction in Self && 'function' === typeof Self[ TypeOrFunction ] )
                {
                    if( true === ReturnFunctionOnly )
                    {
                        return Self[ TypeOrFunction ]
                    }
                    else
                    {
                        throw new InvalidFieldPropertyException(
                            StringHelper.format(
                                ErrorMessages.UNKNOWN_METHOD,
                                IsTypeOrFunction,
                                FieldName
                            )
                        );
                    }

                    TypeOrFunction = Self[ TypeOrFunction ]( FieldName );
                }
                else if( 'function' === typeof Self )
                {
                    if( true === ReturnFunctionOnly )
                    {
                        return Self[ TypeOrFunction ]
                    }
                    else
                    {
                        throw new InvalidFieldPropertyException(
                            StringHelper.format(
                                ErrorMessages.UNKNOWN_METHOD,
                                IsTypeOrFunction,
                                FieldName
                            )
                        );
                    }
                    
                    TypeOrFunction = Self( FieldName );

                }
                else
                {
                    if( true === ReturnFunctionOnly )
                    {
                        throw new InvalidFieldPropertyException(
                            StringHelper.format(
                                ErrorMessages.UNKNOWN_METHOD,    
                                IsTypeOrFunction,
                                FieldName
                            )
                        );
                    }

                   
                    TypeOrFunction = Self[ TypeOrFunction ];
                }
            }

            if ( typeof TypeOrFunction === Type || 'any' === Type )
            {
                return TypeOrFunction;
            }
            
            throw new InvalidFieldException(
                StringHelper.format(
                    ErrorMessages.UNSUPPORTED_TYPE,
                    typeof IsTypeOrFunction,
                    FieldName,
                    '',
                    Type 
                )
            );
        },


        _executeFunctionOrGetString: function (
            TypeOrFunction,
            FieldName,
            ReturnPureFunction = false
        )
        {
            return this.__genericExecuteFuncionOrGetSomething(
                TypeOrFunction,
                'string',
                FieldName,
                ReturnPureFunction
            );
        }

}
