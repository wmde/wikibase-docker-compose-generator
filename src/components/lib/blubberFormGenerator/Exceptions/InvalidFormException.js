import BaseException from '../../Exceptions/BaseException';

export default class InvalidFormException extends BaseException {
	constructor() {
		super( 'InvalidFormException', 'The given form is invalid.' );
	}
}
