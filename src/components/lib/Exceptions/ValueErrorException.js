import BaseException from './BaseException';

export default class ValueErrorException extends BaseException {
	constructor( Message ) {
		super( 'ValueErrorException', Message );
	}
}
