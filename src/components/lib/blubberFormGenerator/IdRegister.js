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

	remove( Item ) {
		const Index = this.__IdStore.indexOf( Item );
		if ( Index === -1 ) {
			return;
		}

		this.__IdStore.splice( Index, 1 );
	}

	removeItems( Items ) {
		let Index;
		for ( Index in Items ) {
			this.remove( Items[ Index ] );
		}
	}

	intersection( Items ) {
		return this.__IdStore.filter( Value => Items.indexOf( Value ) );
	}

	getStore() {
		return ObjectHelper.copyObj( this.__IdStore );
	}
}
