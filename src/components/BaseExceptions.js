export class BaseException {
	constructor( Name, Message ) {
		this.Name = Name;
		this.Message = Message;
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

export default BaseException;
