import BaseWarning from '../../Exceptions/BaseWarning';

export default class InvalidFieldPropertyWarning extends BaseWarning
{
	constructor( Message )
	{
		super( Message );
	}
}
