export default class IdRegister {
	__IdStore = [];

	containsId( Id ) {
		return this.__IdStore.indexOf( Id ) !== -1;
	}

	addId( Id ) {
		if ( this.containsId( Id ) === false ) {
			this.__IdStore.push( Id );
			return true;
		} else {
			return false;
		}
	}
}
