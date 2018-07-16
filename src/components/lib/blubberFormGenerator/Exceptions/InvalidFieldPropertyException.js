import BaseException from '../../Exceptions/BaseException';

export default class InvalidFieldPropertyException extends BaseException {
	constructor( Message ) {
		super( 'InvalidFieldPropertyException', Message );
	}
}
