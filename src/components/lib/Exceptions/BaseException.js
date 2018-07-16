export default class BaseException extends Error {
	constructor( Name, Message ) {
		super( Message );
		this.Name = Name;
        console.trace();// eslint-disable-line
	}
}
