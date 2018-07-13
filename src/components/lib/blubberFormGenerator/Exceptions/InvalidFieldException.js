import BaseException from '../../Exceptions/BaseException';

export default class InvalidFieldException extends BaseException
{
	constructor( Message )
	{
		super( 'InvalidFieldException', Message );
	}
}
