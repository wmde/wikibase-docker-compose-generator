export class BaseException extends Error {
	constructor( Name, Message ) {
		super( Message );
		this.Name = Name;
        console.trace();// eslint-disable-line
	}
}

export class RuntimeErrorException extends BaseException {
	constructor( Message ) {
		super( 'RuntimeErrorException', Message );
	}
}

export class ValueErrorException extends BaseException {
	constructor( Message ) {
		super( 'ValueErrorException', Message );
	}
}

export class TypeErrorException extends BaseException {
	constructor( Message ) {
		super( 'ValueErrorException', Message );
	}
}

export class AssertionErrorException extends BaseException {
	constructor( Message ) {
		super( 'AssertionErrorException', Message );
	}
}

export class NotImplementedException extends BaseException {
	constructor( What ) {
		super( 'NotImplementedException', `${What} is not implemented (yet).` );
	}
}

export default BaseException;
