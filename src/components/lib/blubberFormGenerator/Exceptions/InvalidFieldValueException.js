import BaseException from '../../Exceptions/BaseException';

export default class InvalidFieldValueException extends BaseException
{
	constructor( Message )
	{
		super( 'InvalidFieldValueException', Message );
	}
}
