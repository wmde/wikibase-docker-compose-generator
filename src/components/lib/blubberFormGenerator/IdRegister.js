import ObjectHelper from '../ObjectHelper';

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

	removeId( Id ) {
		const Index = this.__IdStore.indexOf( Id );
		if ( Index === -1 ) {
			return;
		}

		this.__IdStore.splice( Index, 1 );
	}

	removeIds( Ids ) {
		let Index;
		for ( Index in Ids ) {
			this.removeId( Ids[ Index ] );
		}
	}

	intersection( Items ) {
		return this.__IdStore.filter( Value => Items.indexOf( Value ) );
	}

	getStore() {
		return ObjectHelper.copyObj( this.__IdStore );
	}
}
