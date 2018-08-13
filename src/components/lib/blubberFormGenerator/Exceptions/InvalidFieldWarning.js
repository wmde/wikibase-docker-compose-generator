import BaseWarning from '../../Exceptions/BaseWarning';

export default class InvalidFieldWarning extends BaseWarning {
	constructor( Message ) {
		super( Message );
	}
}
