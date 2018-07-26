import BaseException from '../../Exceptions/BaseException';

export default class InvalidFormException extends BaseException {
	constructor( Message = '' ) {
		super( 'InvalidFormException', `The given form is invalid. ${ Message }` );
	}
}
