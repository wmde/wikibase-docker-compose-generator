import BaseException from './BaseException';

export default class TypeErrorException extends BaseException {
	constructor( Message ) {
		super( 'ValueErrorException', Message );
	}
}
