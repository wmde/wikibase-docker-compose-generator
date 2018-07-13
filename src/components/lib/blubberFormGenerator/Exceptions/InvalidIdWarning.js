import BaseWarning from '../../Exceptions/BaseWarning';

export default class InvalidIdWarning extends BaseWarning {
	constructor( Message ) {
		super( Message );
	}
}
